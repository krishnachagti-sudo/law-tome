import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateCorpus } from '../build/validate.mjs';
const cats = { economics: 'Economics', media: 'Media' };
const ok = { no:'001', slug:'a-law', name:'A Law', statement:'x', meaning:'y', example:'z', origin:'o',
  category:'economics', reliability:'Heuristic', provenance:'canon',
  sources:[{text:'S', type:'primary'}], related:[], confusedWith:[] };
test('well-formed canon entry passes', () => assert.deepEqual(validateCorpus([ok], cats), []));
test('canon entry with no sources fails', () => assert.ok(validateCorpus([{...ok, sources:[]}], cats).some(e=>/source/i.test(e))));
test('off-vocabulary category fails', () => assert.ok(validateCorpus([{...ok, category:'vibes'}], cats).some(e=>/category/i.test(e))));
test('bad reliability enum fails', () => assert.ok(validateCorpus([{...ok, reliability:'True'}], cats).some(e=>/reliability/i.test(e))));
test('duplicate slug fails', () => assert.ok(validateCorpus([ok, {...ok, name:'B'}], cats).some(e=>/duplicate/i.test(e))));
test('dangling related reference fails', () => assert.ok(validateCorpus([{...ok, related:[{slug:'ghost', kind:'kindred'}]}], cats).some(e=>/ghost/.test(e))));
test('coined entry with real-person namedAfter fails', () => assert.ok(validateCorpus([{...ok, provenance:'coined', namedAfter:'Jane Doe'}], cats).some(e=>/coined/i.test(e)&&/namedAfter/i.test(e))));

// --- Extension: mechanical enforcement of ALL SEVEN documented "fail the build"
// rules from docs/CORPUS-SCHEMA.md. The baseline above covers four (closure,
// category vocab, enums, canon-source). These add the remaining three.
// (Import declarations are hoisted, so keeping them below the verbatim baseline
// block leaves the seven contract tests byte-for-byte intact.)
import { SOURCE_FILE, validateCorpus as validate } from '../build/validate.mjs';
import { loadCorpus } from '../build/corpus.mjs';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Rule 6 — `no` must be unique across the corpus. Distinct slugs, shared `no`.
test('duplicate no fails', () =>
  assert.ok(validateCorpus([ok, {...ok, slug:'b-law', name:'B'}], cats).some(e=>/duplicate/i.test(e) && /\bno\b/.test(e))));

// Rule 3 — statementAccent, when present, MUST be a verbatim substring of
// statement (exact bytes: curly vs straight apostrophes, en-dash vs hyphen).
// A missing accent must still pass — covered by 'well-formed canon entry passes'
// (the `ok` fixture carries none), so it is not re-asserted here.
test('statementAccent that is a verbatim substring passes', () =>
  assert.deepEqual(validate([{...ok, statement:'When a measure becomes a target', statementAccent:'measure becomes a target'}], cats), []));
test('statementAccent that is not a verbatim substring fails', () =>
  assert.ok(validate([{...ok, statement:'When a measure becomes a target', statementAccent:'a target becomes a measure'}], cats).some(e=>/accent/i.test(e))));

// Rule 1 — filename stem must equal slug. loadCorpus records the stem under a
// non-enumerable Symbol; validateCorpus enforces it only when that info is
// present (in-memory fixtures above omit it, so they keep passing).
const withFile = (law, stem) => {
  const o = { ...law };
  Object.defineProperty(o, SOURCE_FILE, { value: stem, enumerable: false });
  return o;
};
test('filename that does not match slug fails', () =>
  assert.ok(validateCorpus([withFile(ok, 'wrong-name')], cats).some(e=>/filename/i.test(e))));
test('filename that matches slug passes', () =>
  assert.deepEqual(validateCorpus([withFile(ok, 'a-law')], cats), []));

// loadCorpus must attach the filename stem AND keep it out of serialized output
// (search index, graph data, home's inline featured JSON all JSON.stringify laws).
test('loadCorpus attaches source filename non-enumerably without leaking into JSON', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lt-corpus-'));
  await writeFile(join(dir, 'unique-file-marker-xyz.json'), JSON.stringify(ok));
  try {
    const [law] = await loadCorpus(dir);
    assert.equal(law[SOURCE_FILE], 'unique-file-marker-xyz');            // attach works
    assert.equal(law.propertyIsEnumerable(SOURCE_FILE), false);         // non-enumerable
    assert.ok(!JSON.stringify(law).includes('unique-file-marker-xyz')); // does NOT leak downstream
  } finally {
    await rm(dir, { recursive:true, force:true });
  }
});
