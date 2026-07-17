// Task 15 integration gate. Crawls the emitted site and verifies that every
// internal (root-relative, base-prefixed) link points at a file that was
// actually written. A template that emits a link to an un-built page — a stale
// nav item, a footer link, a related-law card, a breadcrumb — is a broken build
// even when every individual template test passes, so this is the whole-site
// backstop.
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

// Recursively list every file under `dir`, returned as absolute paths.
async function walk(dir) {
  const out = [];
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...await walk(p));
    else out.push(p);
  }
  return out;
}

// Map a base-prefixed link (already stripped of #fragment/?query) to the file it
// should resolve to under `outDir`, or null if it isn't an internal static link.
// - `${base}`                -> index.html            (home root)
// - `${base}browse/`         -> browse/index.html     (directory URL: trailing /)
// - `${base}assets/x.css`    -> assets/x.css          (a file)
// - `${base}og/x.png`        -> og/x.png
// Links NOT starting with `base` (external http(s)://, mailto:, bare #anchors)
// are not internal static links and return null (the caller filters them out
// before calling, but the guard keeps this function total).
function linkToFile(link, base) {
  if (!link.startsWith(base)) return null;
  // Strip the base prefix to get a path relative to the site root.
  let rel = link.slice(base.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html'; // dir URL (incl. home root)
  return rel;
}

// Extract every href="..."/src="..." value from an HTML string. Deliberately
// ignores the value of `action` attributes: a form action like
// action="${base}api/submit" is a RUNTIME POST endpoint, not a static file that
// the build emits, so it must not be treated as a dangling link. (We also defend
// against any `api/` path slipping through in an href by skipping it below.)
function extractLinks(html) {
  const links = [];
  // Match single- OR double-quoted values, so a future template emitting
  // href='...' can never silently drop out of the gate (a latent false negative).
  const re = /\b(?:href|src)\s*=\s*["']([^"']*)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) links.push(m[1]);
  return links;
}

/**
 * Crawl every .html file under `outDir`, resolve every base-prefixed internal
 * href/src to an expected emitted file, and return human-readable error strings
 * for the ones that don't exist. Empty array = every internal link resolves.
 *
 * Exclusions (NOT flagged): external http(s):// links, protocol-relative //,
 * mailto:, tel:, in-page #anchors, and `api/` runtime endpoints (POST targets,
 * not static files). `action` attributes are never parsed as links at all.
 *
 * @param {string} outDir  built site root (e.g. a temp dir from buildSite)
 * @param {string} base    base path every internal link starts with (e.g. '/lawtome/')
 * @returns {Promise<string[]>}
 */
export async function internalLinkErrors(outDir, base) {
  const all = await walk(outDir);                       // one crawl, reused below
  const files = all.filter(f => f.endsWith('.html'));
  // Set of every emitted file, as site-root-relative POSIX paths, for O(1) lookup.
  const emitted = new Set(
    all.map(f => relative(outDir, f).split(/[\\/]/).join('/')),
  );
  const errors = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    const source = relative(outDir, file).split(/[\\/]/).join('/');
    for (const raw of extractLinks(html)) {
      // Strip fragment / query before any decision.
      const link = raw.split('#')[0].split('?')[0];
      if (link === '') continue;                          // pure #anchor / empty
      if (!link.startsWith(base)) continue;               // external / mailto / relative
      const rel = linkToFile(link, base);
      if (rel === null) continue;
      if (rel.startsWith('api/')) continue;               // runtime endpoint, not a file
      if (!emitted.has(rel)) {
        errors.push(`${source} -> ${link} (no such file)`);
      }
    }
  }
  return errors;
}

/**
 * Opt-in, NON-blocking external-link backstop: HEAD-check each law's source.url
 * and return a warning string for every URL that is unreachable or errors. This
 * hits the network, so it is NEVER run by the build or the test gate — it is a
 * manual tool a maintainer can invoke to spot link-rot in the corpus.
 *
 * @param {Array} laws  the loaded corpus
 * @returns {Promise<string[]>}
 */
export async function externalLinkWarnings(laws) {
  const warnings = [];
  for (const law of laws) {
    for (const src of law.sources || []) {
      const url = src && src.url;
      if (!url || !/^https?:\/\//.test(url)) continue;
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        if (!res.ok) warnings.push(`${law.slug}: ${url} -> HTTP ${res.status}`);
      } catch (e) {
        warnings.push(`${law.slug}: ${url} -> ${e.message}`);
      }
    }
  }
  return warnings;
}
