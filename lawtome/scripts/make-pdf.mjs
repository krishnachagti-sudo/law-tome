// Render dist/print/index.html to a PDF with headless Chromium.
//
// The print page is self-contained — inline CSS, no images, no scripts — so it
// loads over file:// with nothing missing, and no server is needed.
//
// Playwright is a developer dependency and is NOT part of the site build: CI
// builds and deploys without ever running this. That is deliberate. The book is
// an artefact you make when you want one, and a deploy that waits on Chromium
// to lay out four hundred pages is a deploy that fails for a reason nobody
// wants to debug.
//
//   node build/build.mjs --base=/ --origin=https://example.com
//   node scripts/make-pdf.mjs [out.pdf]
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const src = resolve('dist/print/index.html');
const out = resolve(process.argv[2] || 'dist/the-law-tome.pdf');

if (!existsSync(src)) {
  console.error(`no ${src} — run the build first`);
  process.exit(1);
}

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('playwright is not installed. `npm i -D playwright` (the site build does not need it).');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(src).href, { waitUntil: 'load', timeout: 180000 });
await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  margin: { top: '20mm', bottom: '22mm', left: '18mm', right: '18mm' },
  headerTemplate: '<span></span>',
  // The running foot is the one thing the page itself cannot draw: CSS has no
  // portable page counter that Chromium honours in headers.
  footerTemplate: '<div style="width:100%;font:8pt Georgia,serif;color:#77736a;padding:0 18mm;display:flex;justify-content:space-between">'
    + '<span>The Law Tome</span><span class="pageNumber"></span></div>',
});
await browser.close();
console.log(`wrote ${out}`);
