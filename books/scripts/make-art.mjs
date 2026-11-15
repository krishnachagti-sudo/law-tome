// Generates a book's cartoons with Google's Gemini image model (Nano Banana Pro).
//
//   GEMINI_API_KEY=... node books/scripts/make-art.mjs books/true-or-folklore [--only slug,slug] [--force]
//
// Reads art/scenes.json and art/STYLE.md's prompt frame, passes the approved
// style references from art/refs/, and writes art/raw/<slug>.png plus a
// provenance line per image in art/manifest.json (KDP needs every AI image
// disclosed; the manifest is the record of what made each one).
// Then run books/scripts/finish-art.py to make the print-ready art/final/.
//
// The model name moves between releases; set GEMINI_IMAGE_MODEL to whatever
// Google AI Studio lists for Nano Banana Pro if the default is refused.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const dir = process.argv[2];
const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : undefined; };
const only = arg('--only')?.split(',');
const force = process.argv.includes('--force');
const KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';
if (!KEY) { console.error('Set GEMINI_API_KEY first (Google AI Studio → API keys).'); process.exit(1); }

const FRAME = 'Bold modern cartoon with thick even black outlines, big round shapes and exaggerated expressions, flat fills in black and one light grey only, playful children\'s-book energy, plain white background, no color, no text, no letters, no numbers. Match the line weight, faces and fills of the style reference images. Scene: ';
const scenes = JSON.parse(readFileSync(join(dir, 'art', 'scenes.json'), 'utf8'));
const refsDir = join(dir, 'art', 'refs');
const refs = existsSync(refsDir)
  ? readdirSync(refsDir).filter((f) => /\.(png|jpe?g)$/i.test(f)).slice(0, 3).map((f) => ({
      inline_data: { mime_type: extname(f).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg', data: readFileSync(join(refsDir, f)).toString('base64') },
    }))
  : [];
const rawDir = join(dir, 'art', 'raw');
mkdirSync(rawDir, { recursive: true });
const manifestPath = join(dir, 'art', 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};

async function generate(s) {
  const body = {
    contents: [{ role: 'user', parts: [...refs, { text: FRAME + s.scene }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:3', imageSize: '2K' } },
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': KEY }, body: JSON.stringify(body) });
    if (r.ok) {
      const json = await r.json();
      const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data);
      const data = (part?.inlineData || part?.inline_data)?.data;
      if (!data) throw new Error(`no image returned for ${s.slug}: ${JSON.stringify(json).slice(0, 300)}`);
      return Buffer.from(data, 'base64');
    }
    if (r.status === 429 || r.status >= 500) { await new Promise((res) => setTimeout(res, 5000 * 2 ** attempt)); continue; }
    throw new Error(`${r.status} for ${s.slug}: ${(await r.text()).slice(0, 300)}`);
  }
  throw new Error(`gave up on ${s.slug}`);
}

let made = 0;
for (const s of scenes) {
  if (only && !only.includes(s.slug)) continue;
  const out = join(rawDir, `${s.slug}.png`);
  if (existsSync(out) && !force) continue;
  try {
    writeFileSync(out, await generate(s));
    manifest[s.slug] = { model: MODEL, date: new Date().toISOString(), prompt: FRAME + s.scene, refs: refs.length, aiGenerated: true };
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`${++made}  ${s.slug}`);
  } catch (e) {
    console.error(e.message);
  }
}
console.log(`${made} images made. Next: python3 books/scripts/finish-art.py ${dir}`);
