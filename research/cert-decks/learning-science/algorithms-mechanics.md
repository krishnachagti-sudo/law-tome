# Scheduling algorithms and app mechanics: what a deck author controls

Research date: 2026-09-24. Raw texts and code excerpts are in `scratchpad/learning/raw-algo/`, and `SOURCES.txt` there maps each file to its URL.

Labels: **[D]** documentation (Anki manual, FAQs, changelogs, app help pages) · **[C]** source code (ankitects/anki `main`, genanki `main`, as fetched today) · **[E]** peer-reviewed paper or benchmark · **[P]** practitioner/community. "Not verified" means I did not see it in a fetched document.

Code paths are relative to `rslib/src/` in ankitects/anki unless stated otherwise.

---

## 1. Algorithms at the level a deck author needs

### 1.1 SM-2 (original SuperMemo) and Anki's variant

**Original SM-2** [D, SuperMemo blog "Application of a computer to improve the results obtained in working with the SuperMemo method", `raw-algo/sm2.txt`]
- Intervals: I(1)=1, I(2)=6, and for n>2, I(n)=I(n-1)*EF.
- Every item starts with EF=2.5.
- After each repetition, EF' = EF + (0.1 − (5−q)·(0.08 + (5−q)·0.02)) on a 0–5 grade scale, with a floor of 1.3.
- If q<3, repetitions restart from I(1) and EF is left unchanged.
- The author (Wozniak) reports 10,255 items memorized in the first year at 41 min/day, with overall retention of 89.3% (92% after excluding intervals under 3 weeks).

**Anki's SM-2 variant** [D, faqs.ankiweb.net "What spaced repetition algorithm does Anki use?"]
- It has 4 answer buttons with a single fail button.
- Learning steps are user-defined in place of 1d/6d.
- Failures during learning do not reduce ease.
- On review cards:
  - Again: ease −20 points, interval × "new interval".
  - Hard: ease −15 points, interval × hard interval (default 1.2).
  - Good: interval × ease.
  - Easy: interval × ease × easy bonus, and ease +15.
  - All of these are also multiplied by the interval modifier.
- Ease never falls below 130%.
- New intervals (except Again) are always at least 1 day longer than the previous interval.

Code defaults [C, `deckconfig/mod.rs` `DEFAULT_DECK_CONFIG_INNER`]: `initial_ease: 2.5`, `easy_multiplier: 1.3`, `hard_multiplier: 1.2`, `lapse_multiplier: 0.0`, `interval_multiplier: 1.0`, `maximum_review_interval: 36_500`, `graduating_interval_good: 1`, `graduating_interval_easy: 4`. `Default` sets `learn_steps: [1.0, 10.0]` (minutes) and `relearn_steps: [10.0]`.

### 1.2 FSRS and the DSR model

**The three variables** [D, Anki FAQ]. FSRS is based on the "Three Component Model of Memory":
- **Retrievability (R)** is the probability of recall at a given moment.
- **Stability (S)** is the time in days for R to fall from 100% to 90%.
- **Difficulty (D)** is how hard it is to increase stability.

R changes daily. D and S change only after a review. The parameters are fitted to the user's own review history by machine learning, and "users should not tweak the parameters manually."

**Formulas** [D, awesome-fsrs wiki "The-Algorithm", `raw-algo/fsrs_wiki_algorithm.md`]
- FSRS-6 uses 21 parameters.
- Its forgetting curve is R(t,S) = (1 + factor·t/S)^(−w20), with factor = 0.9^(−1/w20) − 1 so that R(S,S)=90%. The decay w20 is trainable, so the curve's shape differs per user.
- Same-day reviews: S' = S·e^(w17·(G−3+w18))·S^(−w19).
- D ∈ [1,10]. Grades are 1 again, 2 hard, 3 good, 4 easy.
- For FSRS-4.5, the interval for a requested retention r is I(r,S) = S/FACTOR·(r^(1/DECAY) − 1), which equals S when r=0.9.

**Lineage** [D, same wiki]. FSRS "originates in the DHP model from MaiMemo, which is a variant of the DSR ... model."

**The SSP-MMC paper** [E, citation metadata only]. The maimemo/SSP-MMC README cites Junyao Ye, Jingyong Su, Yilong Cao (2022), "A Stochastic Shortest Path Algorithm for Optimizing Spaced Repetition Scheduling", KDD '22, pp. 4381–4390, doi 10.1145/3534678.3539081. It describes a public dataset of "220 million MaiMemo student memory behavior logs." The ACM page returned 403, so **the paper's abstract and results are not verified**.

**Half-life regression** [E, Settles & Meeder, ACL 2016, `raw-algo/hlr.txt`]. The model predicts p = 2^(−Δ/h). The authors report that HLR reduced "error by 45%+ compared to several baselines" and "improve[d] Duolingo daily student engagement by 12% in an operational user study."

**Where FSRS is available** [D, deck-options manual]
- FSRS is available in Anki 23.10, AnkiMobile 23.10 and AnkiWeb, and in AnkiDroid 2.17+.
- It "can only be enabled globally."
- "Parameters and desired retention are preset-specific."

Also:
- FSRS was integrated in 23.10 [D, changes.ankiweb.net 23.10].
- The FSRS on/off switch is a collection-level key (`BoolKey::Fsrs`) [C, `config/bool.rs`]. It is **not** part of a deck preset, so an .apkg cannot turn FSRS on.

### 1.3 Desired retention and workload [D, deck-options manual]

- The default is 90%: "Higher retention leads to shorter intervals and more reviews per day ... Above 90% the workload increases very quickly, and above 97% the workload can be overwhelming." The manual recommends staying below 97%.
- The code default is `desired_retention: 0.9` [C].
- "In the latest version of Anki, you can set different values of desired retention for different decks within the same preset."
- Compute Minimum Recommended Retention was **removed as of 25.07**. It was replaced by "Help Me Decide" (a workload simulator) [D].
- The manual advises that FSRS learning steps be shorter than 1 day, and says the FSRS parameters should not be copied from someone else [D].
- FSRS treats "Hard" as a pass [D]. Learners should be told this.

### 1.4 srs-benchmark (open-spaced-repetition/srs-benchmark README, fetched today) [E/benchmark]

**Dataset and method**
- About 727 million reviews from 10 thousand Anki users (dataset anki-revlogs-10k).
- Evaluation uses a time-series split.
- Metrics: Log Loss (lower is better), RMSE(bins) (lower is better) and AUC (higher is better).

**Results without same-day reviews** (9,999 collections; 349,923,850 reviews evaluated). Rows are quoted exactly:

| Algorithm | Params | Log Loss↓ | RMSE(bins)↓ | AUC↑ |
|---|---|---|---|---|
| RWKV-Instant | 2762884 | 0.2773±0.0036 | 0.02502±0.00038 | 0.8329±0.0018 |
| GRU | 503 | 0.3328±0.0041 | 0.0549±0.0010 | 0.7324±0.0021 |
| FSRS-7 recency | 34 | 0.3370±0.0042 | 0.0593±0.0010 | 0.7220±0.0021 |
| FSRS-7 | 34 | 0.3401±0.0043 | 0.0634±0.0011 | 0.7167±0.0022 |
| FSRS-rs | 21 | 0.3443±0.0042 | 0.0635±0.0010 | 0.7074±0.0022 |
| FSRS-6 | 21 | 0.3460±0.0042 | 0.0653±0.0011 | 0.7034±0.0023 |
| FSRS-5 | 19 | 0.3561±0.0044 | 0.0742±0.0012 | 0.7010±0.0023 |
| FSRS-4.5 | 17 | 0.3625±0.0045 | 0.0764±0.0013 | 0.6891±0.0023 |
| FSRS v4 | 17 | 0.3726±0.0048 | 0.0838±0.0014 | 0.6853±0.0023 |
| AVG (baseline) | 0 | 0.3945±0.0051 | 0.1034±0.0016 | 0.4997±0.0025 |
| HLR | 3 | 0.4694±0.0074 | 0.1275±0.0019 | 0.6369±0.0026 |
| Ebisu v2 | 0 | 0.4989±0.0078 | 0.1627±0.0022 | 0.6051±0.0025 |

The "with same-day reviews" table (10,000 collections; 519,296,315 reviews) is in `raw-algo/bench_README.md`. Examples: FSRS-6 0.3842 / 0.0985 / 0.6830, and HLR 0.705 / 0.1715 / 0.6104.

**Two caveats**
- The current README table has **no SM-2 row**. SM2 appears only in a command-line example. I therefore cannot quote a published SM-2 vs FSRS figure from this fetch (**not verified**).
- The benchmark measures prediction accuracy, not learning outcomes.

The Anki FAQ says "Preliminary tests seem to indicate FSRS is roughly on par with SM-17" [D]. That is Anki's own claim, and I did not fetch any benchmark numbers behind it.

**What this means for a deck author:** the scheduler personalizes to each learner's own review history. The deck author cannot and should not ship parameters. The manual says not to copy them, and exports made without scheduling strip them (see §3).

---

## 2. Deck options that matter for learning (defaults and versions)

Defaults come from code [C, `deckconfig/mod.rs`]. Behaviour descriptions come from the deck-options manual [D].

| Option | Default (code) | Notes | Version introduced |
|---|---|---|---|
| New cards/day | 20 | Studying 20/day → "roughly about 200 cards/day" reviews [D] | Long-standing; version not verified |
| Maximum reviews/day | 200 | Interday learning cards count toward the review limit [D] | Not verified |
| Per-deck limits ("This deck"/"Today only") | — | Stored on the deck, not the preset | **2.1.55** [D changelog] |
| New cards ignore review limit | off | By default, the review limit also caps new cards [D] | Not verified (GitHub release notes not raw-fetched) |
| Limits start from top | off | Parent limits apply when a subdeck is selected | Not verified |
| Learning steps | 1m 10m | Keep them under 1d with FSRS [D] | — |
| Relearning steps | 10m | — | — |
| Insertion order | Sequential (`NewCardInsertOrder::Due`) | Random assigns a random position at add time [C `notetype/cardgen.rs`]. The manual advises leaving it Sequential | — |
| New card gather order | **Deck** | Subdecks are taken alphabetically from the top, and within each subdeck by "ascending position" [D]. Other choices: Deck then random notes, Ascending/Descending position, Random notes, Random cards | Reworked in **2.1.50**; "Deck, then random notes" added in **23.10** [D changelog] |
| New card sort order | **Card type, then order gathered** (`Template`) | Other choices: Order gathered, Card type then random, Random note then card type, Random | Reworked in 2.1.50 [D] |
| New/review order; interday learning order | Mix with reviews | — | — |
| Review sort order | Due date, then random | With FSRS, "Relative overdueness" is replaced by "Ascending retrievability" [D]. 24.11 added descending retrievability [D-via WebFetch] | — |
| Bury new / review / interday-learning siblings | **all off** | See §4 | V3 scheduler 2.1.45; separate interday option in **2.1.50** [D] |
| Leech threshold | 8 lapses | Warnings repeat at half the threshold [D] | — |
| Leech action | Code default **Tag Only** (`LeechAction::TagOnly`, schema11 `#[default] TagOnly`) | The manual's leech page says Anki "tags the note as a leech and suspends the card". That text **conflicts** with the code default, so check in the app | — |
| Easy Days | Code default `[1.0; 7]` (all Normal) | Preset-level (`easy_days_percentages`). Works with FSRS and SM-2 [D] | **24.11** [D: AnkiDroid 2.20.0 changelog "Includes Anki 24.11 ... Easy days"; GitHub 24.11 notes via WebFetch] |
| Load balancing | On (`BoolKey::LoadBalancerEnabled` defaults to true) | Collection-level, not preset-level [C `config/bool.rs`]. "within your fuzz range, Anki will now try to pick days that have fewer reviews waiting" | **24.11** [D, same sources] |
| FSRS / desired retention | FSRS off; DR 0.9 | FSRS is global; DR is per preset, and newer versions allow it per deck [D] | **23.10** [D] |
| Auto Advance | — | — | 23.12 [D manual] |
| Image Occlusion (built-in) | — | — | Anki **23.10** [D]; AnkiDroid **2.17.0** [D changelog] |

The V3 scheduler has been the only option since Anki/AnkiMobile 23.10 and AnkiDroid 2.17 [D, FAQ]. Import requires at least V2, and returns `SchedulerUpgradeRequired` on a V1 collection [C `import/cards.rs`].

---

## 3. What survives import: the crucial part

### 3.1 Two switches are exported, and two are chosen at import

**Export side** [D manual "Exporting"; C `import_export/gather.rs`]
- "Include scheduling information": if false, all scheduling is removed, "including marked and leech tags."
- "Include deck presets": if true, the presets are included.
- If a preset is exported without scheduling, its FSRS parameters are stripped (`config.clear_fsrs_params()` when `!with_scheduling`) [C]. A test confirms this: `should_strip_fsrs_params_when_exporting_without_scheduling` [C].

**Import side (desktop, 23.10+)** [D ftl `importing.ftl`; C `import/mod.rs`, `import_export/service.rs`]
- The dialog shows "Import any learning progress" (`with_scheduling`) and "Import any deck presets" (`with_deck_configs`).
- Help text: "If enabled, any deck options that the deck sharer included will also be imported. **Otherwise, all decks will be assigned the default preset.**"
- **Both default to false** in a new collection. The test `get_import_anki_package_presets_returns_collection_defaults` asserts `!presets.with_scheduling` and `!presets.with_deck_configs`.
- The learner's last choice is saved (`col.set_config(BoolKey::WithDeckConfigs, ...)`) and becomes the preset next time.

### 3.2 What the importer does with deck presets [C `import/decks.rs`, `gather.rs`, `storage/deckconfig/add_if_unique.sql`]

If "Import any deck presets" is **off** (the default):
- `reset_decks(reset_config_ids=true, ...)` sets every imported normal deck's `config_id = 1` (the learner's "Default" preset).
- The author's preset is discarded.

If it is **on**:
- Presets are inserted with `INSERT OR IGNORE INTO deck_config (id, ...)`, so a preset whose id already exists in the learner's collection is **not** overwritten. Id 1, "Default", always keeps the learner's own version.
- If the learner already has a deck with the same name, `update_normal_with_other` switches that deck to the incoming `config_id` only when it is not 1. It also overwrites the description if the incoming one is non-empty.

In both cases:
- Per-deck limit overrides on the deck (`new_limit`, `review_limit`, `*_today`) are **cleared unless "Import any learning progress" is on** (`reset_study_info`).
- FSRS on/off and load balancing are collection-level keys and are never imported [C `config/bool.rs`].

**Bottom line:** a deck author can *ship* a preset (limits, steps, gather/sort order, burying, leech settings, Easy Days, desired retention). It is applied **only if the learner ticks "Import any deck presets"**, and even then it never overrides the learner's Default preset or an existing preset with the same id. It can never enable FSRS.

**Mobile apps:** I did not verify whether AnkiMobile or AnkiDroid show the same import checkboxes. AnkiDroid bundles the Anki backend ("Includes Anki 24.11 ...", "Includes Anki 25.07.4") [D changelog]. The AnkiDroid 2.17 changelog says 'Exporting: "Include deck configs" option is enabled' [D], but it says nothing about import.

### 3.3 Does intended teaching order survive? Yes, via the card `due` position, with caveats

1. **New-card order is set by the card's `due` field (its "position").**
   - The gather SQL for ascending position is `"due ASC, ord ASC"` [C `storage/card/mod.rs`, `NewCardSorting::LowestPosition`].
   - With the default "Deck" gather order, cards in each subdeck are gathered "in ascending position" [D].
   - Note id and creation time do **not** order new cards directly. Only `due` does, with `ord` (template number) as the tie-break.

2. **Import without learning progress (the default) keeps the file's positions.**
   - `reset_cards` calls `card.schedule_as_new(position, reset_counts=true, restore_position=true)` [C `gather.rs`].
   - With `restore_position=true`, `last_position()` returns the card's current `due` for a new card, or `original_position` for a previously studied card [C `scheduler/new.rs`]. A test asserts `Card::new(..., 42).last_position() == Some(42)`.
   - A fresh position (the learner's `get_next_card_position()`) is used only for cards that have no last position.
   - So **new cards keep the author's `due` numbers** after import.
   - The 2.1.50 changelog [D] confirms the export half: "When new cards are answered, Anki now records their original position. When you later export a shared deck without scheduling, the original positions will be restored."

3. **Positions are absolute and are not renumbered into the learner's sequence.**
   - Imported cards keep numbers such as 1..N. Those may interleave with other new cards in the learner's collection that have similar numbers.
   - This does not matter under the default "Deck" gather order, which orders within each deck.
   - It does matter under "Ascending position" gathering across several decks, or if the learner studies a parent deck that mixes decks.

4. **Sibling cards share a position.** When cards are generated for a note, an existing `due` is reused ("use existing due number if provided") [C `notetype/cardgen.rs`]. Siblings from one note are then ordered by `ord`. The default sort "Card type, then order gathered" shows all Card 1s of the day's batch before the Card 2s [D].

5. **Ties are unsafe.**
   - genanki's `Note(..., due=0)` defaults every card to due 0 [C genanki `note.py`/`card.py`]. On import, those zeros are kept (point 2), and the order within equal `due` values is left to SQLite.
   - The card list for the reset is read with `where id in (select cid from search_cids)`, which has no ORDER BY [C]. **Order among cards with tied `due` values is therefore not guaranteed**, although in practice it is probably card-id order (**not verified**).
   - **Authors must write explicit, unique, increasing `due` values** (1, 2, 3, ... per note).

6. **Note/card ids and "order added"**
   - IDs are kept unless they collide, in which case `+999` is added until unique [C `import/notes.rs`, `import/cards.rs`].
   - IDs more than one day in the future are rewritten by `maybe_fix_invalid_ids` before import [C `dbcheck.rs`]. An export with such IDs errors out (`check_ids`) [C `gather.rs`].
   - Encoding order in far-future IDs is therefore unsafe. Use `due`.
   - "Order added" in the browser uses the note/card id (creation timestamp), so it is a display order and not the study order. I did not open the browser sort-column SQL, so this point is **not verified**.

7. **Learner overrides.** Any learner can reorder with Browse → Reposition [D]. Learners can also change gather/sort order to random, which destroys the teaching order. We must tell learners to keep "Deck" plus a position-based sort.

8. **Re-importing an update** [D packaged-decks and FAQ; C `import/notes.rs`]
   - Notes are matched by **GUID**.
   - By default, a note is updated only if the file's version is newer ("IfNewer").
   - Updates fail if the note type's field or template names, count or order changed. "Changes to the front and back template will not prevent updates."
   - Existing cards are not rescheduled or repositioned ("TODO: could update existing card"; `card_ordinal_already_exists` skips them). **New notes added in an update get the file's `due` values**, so leave gaps (e.g. 10, 20, 30) or append at the end.

9. **CSV import** assigns positions in row order.
   - Notes are processed sequentially (`for foreign in notes`), and each new card takes the next collection position (or a random one if the target preset uses Random insertion) [C `text/import.rs`, `cardgen.rs`].
   - Header keys (`#deck:`, `#tags:`, `#guid column:`, `#notetype:`, deck column, and so on) are supported from **2.1.54** [D].
   - Updates in place keep the existing scheduling [D].

### 3.4 Other import side effects [C `gather.rs`]
- Without learning progress: the `marked` and `leech` tags are removed and flags are cleared.
- Filtered decks are converted to normal decks.
- The Default deck (id 1) is not exported when scheduling is excluded, "to avoid changing the importing client's defaults."
- Deck names that collide with an existing *filtered* deck get a timestamp suffix. Missing parent decks are created [C `import/decks.rs`].
- Note types with the same id but a different schema are imported as a copy, with "Basic-908e4"-style names [D FAQ].

---

## 4. Siblings, filtered decks, tags and subdecks

- **Siblings** are several cards from one note, such as a reversed card or cloze numbers [D].
  - Burying hides them until the next day. Learning cards are never buried [D].
  - All three bury options are **off** in the code defaults, so a 2-card note will show both new siblings on the same day unless the learner or a preset enables burying.
  - For a published deck, prefer one card per note, or ship a preset with "Bury new siblings" on and tell the learner to enable it.
- **Tags** are note-level; tagging a card tags all its siblings. Tags can be hierarchical (`tag:animal` matches `animal::mammal`). The manual recommends tags over "lots of little decks" because many small decks can mean reviews appear "in a recognizable order", which gives weaker memories [D editing].
- **Subdecks** sort alphabetically, so a prefix like `001` controls order. Under the default "Deck" gather order they fix the order in which topics' new cards are introduced [D].
  - Trade-off: subdecks guarantee a teaching sequence across topics. Tags alone rely on `due` positions for the sequence and allow filtered or custom study by topic.
  - **Recommended:** one parent deck, optionally a few numbered domain subdecks, hierarchical tags for exam objectives, and explicit `due` positions.
- **Filtered decks** are learner-created and temporary (custom study, cramming, a tag-based session) [D]. They are useful for exam-week cram sessions by tag, which is another argument for rich tags. Exported without scheduling, filtered decks become normal decks [C].

---

## 5. AnkiDroid, AnkiMobile and other apps

**AnkiMobile** [D docs.ankimobile.net]
- TTS tags are supported from 2.0.56. The desktop manual confirms `{{tts en_US:Field}}` needs Anki 2.1.20, AnkiMobile 2.0.56 or AnkiDroid 2.17.
- JavaScript runs, but taps on elements other than A/BUTTON need the class `tappable` (2.0.39+).
- Custom fonts load entirely into memory; one report says "no more than 3 fonts could be embedded."
- Missing template images show up as warnings on every card. Name static media with a leading `_` so Check Media ignores it [D media].

**AnkiDroid** [D manual and changelog]
- It imports .apkg files; .colpkg replaces the whole collection.
- Built-in TTS can read all text, or `<tts service="android" voice="en_GB">` tags.
- JavaScript is unsupported officially.
- Image Occlusion arrived in 2.17.0. FSRS is supported from 2.17 per the Anki manual.
- It bundles the Anki backend (2.20.0 "Includes Anki 24.11, with FSRS 5.0"; 2.22.2 "Includes Anki 25.07.4, with FSRS 6.0"). Import behaviour is therefore presumably the same rslib code. Its UI checkboxes are **not verified**.
- The fetched manual is partly outdated (it says AnkiDroid "can't directly import text files").
- Deck options are available on AnkiDroid (manual sections "Deck options") [D].

**RemNote** [D help.remnote.com, updated Aug 15, 2026]
- Imports .apkg files with review history. It suggests exporting with scheduling, presets and media.
- New imported cards go to a separate "Need to Learn" queue.
- Imported documents are tagged "Anki Deck". The importer shows at most the 2,000 most-used tags.
- CSS is not imported and JavaScript is not supported. On-the-fly TTS does not work.
- Built-in and Image Occlusion Enhanced occlusions import if the note type and field names are unchanged. Multi-field note types become tables.
- New-card ordering is **not documented, so not verified**.

**Mochi** [D mochi.cards docs]
- Imports .apkg "including review history". The 2019 blog said review history was not imported; the current docs supersede it.
- Strips CSS and JavaScript, converts HTML to Markdown, and suggests the Anki-to-Mochi converter for multi-field decks.
- Tags, card order and subdecks are **not verified**.
- Markdown imports "do not preserve ... review history or card order."

**Noji** [D help.noji.io]
- Accepts .apkg and .colpkg and "can migrate progress".
- Order, tags and presets are **not verified**.

For all three apps, a rich deck design with CSS, JavaScript or TTS tags will degrade. Plain semantic HTML fields travel best.

---

## 6. Practical limits

- **AnkiWeb collection sync limit** [D FAQ]: "compressed size of 100MB, and an uncompressed size of 250MB" (text plus scheduling, excluding media). "25,000 average-sized cards and several years of review history will take up about 25MB." There is no total media limit, but "individual media files [are] limited to 100MB." A large certification deck plus a learner's other decks is unlikely to hit this.
- **AnkiWeb shared-deck upload size limit:** **not verified**.
- **Deck-tree size:** "adding hundreds of decks may cause slowdowns," and very large trees broke the deck list before 2.1.50 [D]. Keep subdecks to tens.
- **Mobile:** AnkiMobile has the font memory limits above. AnkiDroid 2.21.0 lists "up to 100x import speed improvement" [D changelog]. No verified load-time figures.
- **Field/template counts:** no documented hard limit was found (**not verified**).
- **Updating note types:** after publishing, never rename, add or reorder fields or templates. That breaks updates for learners who already imported the deck [D FAQ]. Field and template ids (2.1.67+) help merging [D].

---

## What the deck author can control: checklist

1. **Teaching order.** Write explicit, unique, increasing `due` positions on new cards. In genanki, pass `Note(due=n)`, since the default is 0. In Anki desktop, use Browse → Reposition before export. Siblings share the note's position. Positions survive default imports [C].
2. **Topic sequence.** Use numbered subdecks (`01 Domain ...`). Under the default "Deck" gather order they are introduced top-down alphabetically [D].
3. **Tags.** Use hierarchical tags such as `exam::domain::objective`. They survive import. Note that `leech` and `marked` are stripped when importing without progress [C].
4. **Stable GUIDs and a frozen note-type schema,** so re-imports update notes in place [D/C]. Leave gaps in `due` for future inserts.
5. **One card per note where possible,** or accept sibling behaviour, because burying is off by default.
6. **An optional shipped preset** with steps, limits, burying and Easy Days. Give it a unique id, not 1. It is applied **only** if the learner ticks "Import any deck presets" [C/D].
7. **Deck description.** It is imported and overwrites an existing same-name deck's description if non-empty [C].
8. **Export without scheduling.** Include presets only if you want them offered. Include media. Avoid legacy format unless old clients are needed [D].
9. **Media and templates.** Name template-level static files with `_` [D], and keep CSS and JavaScript optional for portability to other apps.
10. **Things the author cannot control:** FSRS on/off, load balancing, desired retention (unless the preset is imported), FSRS parameters (stripped), per-deck limits (cleared), and the learner's Default preset.

## What we must tell the learner to set

1. When importing (desktop 23.10+), **leave "Import any learning progress" unticked**. Tick **"Import any deck presets"** if you want our recommended settings. Otherwise the deck uses your Default preset.
2. Keep **New card gather order = "Deck"** and **sort order = "Card type, then order gathered"** or "Order gathered". Do not use random, which destroys the teaching sequence.
3. Keep **Insertion order = Sequential**.
4. Enable **Bury new siblings** (and review siblings) if the deck has multi-card notes.
5. **New cards/day:** choose based on the exam date. At 20/day, expect about 200 reviews/day [D]. Consider "New cards ignore review limit" only if you know why.
6. **Turn on FSRS** (global) with **desired retention around 0.90**. Only exceed 0.95 close to the exam, and stay under 0.97 [D]. Use learning steps under 1 day. Optimize parameters once you have a few hundred reviews. **Press Again, never Hard, when you forgot.**
7. **Easy Days and load balancing** (24.11+) are optional, for spreading the workload.
8. Study from the **top-level deck**. Use tag-based **filtered decks** for cram sessions.
9. Do not reposition, "Forget" or reset the deck unless you want to restart it. To update later, re-import the new .apkg: edits merge by note and your progress is kept.
