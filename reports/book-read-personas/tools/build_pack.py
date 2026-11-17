# Build the reading pack: every printed page's text, relabelled P001.., with two decoy entries inserted.
import json, sys
from pypdf import PdfReader
book = sys.argv[1]; out = sys.argv[2]
r = PdfReader(book)
pages = [(i + 1, (p.extract_text() or '').strip()) for i, p in enumerate(r.pages)]

D1Q = """DISCOVERY STORIES
ROUND 4 · № 31
Did Benjamin Franklin fly a kite in a thunderstorm?
YOUR CALL
  TRUE   FOLKLORE   DISPUTED
 SURE  GUESSING
ANSWER OVERLEAF →"""
D1A = """TRUE OR FOLKLORE?
№ 31 · DID BENJAMIN FRANKLIN FLY A KITE IN A THUNDERSTORM?
 TRUE
The kite flight in a storm is a later embellishment. No record from 1752 shows Franklin doing it.
The popular version has Franklin in a field with a kite and a key, lightning striking the string, and a jolt proving that lightning is electricity.
The record is thinner. The scene is best known from later retellings, and no witness account of a strike survives. A direct strike would very likely have killed him. The idea of drawing electricity from a storm cloud is real; the dramatic scene around it is not on the record.
The story spread because it gives an experiment a picture: a kite, a key and a flash.
TELL SOMEONE
Franklin never flew a kite in a thunderstorm; the scene was invented later.
Sources: "Benjamin Franklin," Wikipedia."""
D2Q = """NAMES THAT MISLEAD
ROUND 8 · № 71
Do goldfish have a three-second memory?
YOUR CALL
  TRUE   FOLKLORE   DISPUTED
 SURE  GUESSING
ANSWER OVERLEAF →"""
D2A = """TRUE OR FOLKLORE?
№ 71 · DO GOLDFISH HAVE A THREE-SECOND MEMORY?
 FOLKLORE
Under appetitive operant-conditioning paradigms, Carassius auratus exhibits retention intervals that are orders of magnitude beyond the putative three-second window.
The popular version posits a mnemonic span of approximately three seconds, a figure without identifiable provenance in the ichthyological literature.
The record is consistent with long-term consolidation in teleost pallial homologues of the mammalian hippocampal formation. Discriminative-stimulus protocols employing temporally contingent reinforcement schedules indicate that acquired stimulus-response associations persist across retention intervals measured in weeks to months, with extinction curves conforming to standard associative-learning parameters.
The claim's diffusion is attributable to heuristic anthropomorphic attribution, whereby the perceived behavioural stereotypy of a confined organism is reinterpreted as a mnemonic deficit.
TELL SOMEONE
Goldfish memory, under operant paradigms, persists across retention intervals far exceeding three seconds.
Sources: various laboratory studies."""

def find_after(n):
    # first answer page (has the "TRUE OR FOLKLORE?" running head) at or after real page n
    for p, t in pages:
        if p >= n and t.startswith('TRUE OR FOLKLORE?') and 'ROUND SCORE' not in t:
            return p
seq = []
ins = {find_after(80): [('D1-Q', D1Q), ('D1-A', D1A)], find_after(170): [('D2-Q', D2Q), ('D2-A', D2A)]}
for p, t in pages:
    seq.append((p, t))
    for d in ins.get(p, []):
        seq.append(d)
m = {}
with open(f'{out}/book-pack.txt', 'w') as f:
    for i, (src, t) in enumerate(seq, 1):
        lab = f'P{i:03d}'; m[lab] = src
        # drop the printed folio (last line if it is a bare number) so labels are the only page numbers
        lines = t.splitlines()
        if lines and lines[-1].strip().isdigit(): lines = lines[:-1]
        f.write(f'\n========== [{lab}] ==========\n' + ('\n'.join(lines) if lines else '(blank page)') + '\n')
json.dump(m, open(f'{out}/map.json', 'w'), indent=0)
print(len(seq), 'pack pages; decoys after real pages', list(ins))
