# Flashcard deck publishing: technical research

Research date: 2026-09-23. Every claim below was read in raw page text fetched with curl during this task, unless marked **not verified**. Where a page carried a date, it is noted. Help-centre pages for Quizlet, Brainscape (Zendesk), SuperMemo (help.supermemo.org, supermemopedia.com) and Memrise's Zendesk returned HTTP 403 to both curl and WebFetch. Claims about those products are therefore limited to what could be read elsewhere, and gaps are marked.

---

## 1. Anki import/export formats, current version, platforms

### Package formats
- **.apkg ("Anki Deck Package")** exports a single deck and any child decks. Importing one *adds* its contents to the collection and does not overwrite the collection. — https://docs.ankiweb.net/exporting.html
- **.colpkg ("Anki Collection Package")** exports the entire collection, with scheduling. Importing one **deletes and replaces all current cards** in the collection. Collection packages from earlier Anki versions were named `collection.apkg`, and any file named `collection.apkg` is still treated as a collection package. — https://docs.ankiweb.net/exporting.html
- **Export options** for .apkg: "Include Scheduling Information" (when off, Anki "will remove the entire scheduling information, including marked and leech tags"), "Include Deck Presets", "Include Media", and "Support older Anki versions (slower/larger files)". With the last option off, the file is in a modern format with compressed media that older clients cannot read. — https://docs.ankiweb.net/exporting.html
- Anki can import text files, packaged Anki decks, and Mnemosyne 2.0 .db files. — https://docs.ankiweb.net/importing/intro.html
- **Which Anki version introduced .apkg / .colpkg: not verified.** The manual says only that collection packages from "previous versions" were called collection.apkg, without naming a version. The Anki GitHub release notes could not be fetched (HTTP 403 via the session proxy).

### Plain text / CSV import (current manual)
Source for everything in this subsection: https://docs.ankiweb.net/importing/text-files.html
- The file must be plain-text UTF-8, with fields separated by commas, semicolons or tabs. Anki counts fields from the first non-comment line. Lines starting with `#` are comments.
- Fields can be quoted to include newlines or separators, with `""` escaping a quote. HTML newlines (`<br>`) require "Allow HTML in fields". Multi-line escaped fields do not work for cloze deletions that span multiple lines.
- For media, copy the files into `collection.media` (no subdirectories) and reference them in fields as `<img src="x.jpg">` or `[sound:x.mp3]`. Referencing media through a template (`<img src="{{field}}">`) is **not supported**.
- **Duplicates/updating (text import):** Anki matches on the *first field* within the same note type. The default is to update the existing note's other fields. The alternatives are to ignore duplicates or to import them as new notes. Match scope can be "note type" or "note type and deck". Notes updated in place keep their scheduling and stay in their current decks.
- **File headers (Anki 2.1.54+)**, written as `#key:value` lines at the top of the file:

| Header | Values | Effect |
|---|---|---|
| `#separator:` | Comma, Semicolon, Tab, Space, Pipe, Colon (or literal) | Sets the field separator |
| `#html:` | true/false | Treat the file as HTML |
| `#tags:` | space-separated tags | Adds tags to every note |
| `#columns:` | names | Column count and names |
| `#notetype:` | name or id | Presets the note type |
| `#deck:` | name or id | Presets the deck |
| `#notetype column:` | 1,2,3… | Per-row note type (fields then map by position) |
| `#deck column:` | 1,2,3… | Per-row deck (created if missing) |
| `#tags column:` | 1,2,3… | Per-row tags |
| `#guid column:` | 1,2,3… | Per-row note GUID |

- **GUID column:** if the GUID is kept unchanged, re-importing updates existing notes. The manual says the GUID "is intended to be created by Anki". For your own IDs (e.g. `MYNOTE0001`), it recommends putting them in the *first field* rather than in the GUID. Rows with a non-empty GUID that already exists will not create duplicates.

### Current version and platforms
- **Anki desktop:** the download page shows "Current version is 26.09.3", with builds for Windows 10+ (x64) and Windows 11 (ARM), macOS 13+ (Apple Silicon and Intel), Linux 2022+ (x64) and Linux 2024+ (ARM). — https://apps.ankiweb.net/ . The ankitects/anki git tags also list 26.09.3 as the latest numeric tag (from `git ls-remote --tags https://github.com/ankitects/anki`).
- **AnkiMobile (iOS):** the official iOS app. "All purchases help fund Anki's development." — https://apps.ankiweb.net/
  - **Price: $24.99** on the US App Store. The listing says the app "is priced as a computer application", that it is "intended as a companion to the computer version", that note types must be modified on the computer, and that image occlusion cards can be studied but not created in AnkiMobile. — https://apps.apple.com/us/app/ankimobile-flashcards/id373493387
  - The newest version-history entry on that listing, as fetched, was **25.09 (09/08/2025)**, "Updates to match desktop 25.09 release". The listing may lag or be cached. The current AnkiMobile version was **not verified**.
- **AnkiDroid (Android):** "free and developed by contributors". — https://apps.ankiweb.net/ . The latest stable-looking git tag in ankidroid/Anki-Android is **v2.24.1** (from `git ls-remote`). Whether that is the current Play Store release was **not verified**.
- **AnkiWeb** cannot import .apkg files. Recipients need the desktop or mobile app. — https://docs.ankiweb.net/contrib.html

---

## 2. Generating .apkg programmatically; GUIDs and update behaviour

### genanki (Python)
- **Current version: 0.13.1** on PyPI (requires Python >=3.6). It was uploaded 2023-11-12, so it has had no PyPI release in almost 3 years. — https://pypi.org/pypi/genanki/json
- The library is not affiliated with the Anki project. — https://raw.githubusercontent.com/kerrickstaley/genanki/main/README.md
- **Model IDs:** "You need to pass a `model_id` so that Anki can keep track of your model. It's important that you use a unique `model_id` for each `Model`". The README says to generate one with `random.randrange(1 << 30, 1 << 31)` and hardcode it. Deck IDs likewise should be generated once and hardcoded. — same README
- **Note GUIDs:** "If you import a new note that has the same GUID as an existing note, the new note will overwrite the old one (as long as their models have the same fields)." Stable GUIDs are required so that regenerating and re-importing replaces notes. By default the GUID is **a hash of all field values**. So editing any field, or adding a field, changes the GUID, which produces a duplicate instead of an update. The fix is to subclass `Note` and hash only the identifying fields (`genanki.guid_for(...)`). — same README
- Other README notes: field content is HTML, so `<`, `>` and `&` must be escaped. Media goes in `Package.media_files`, referenced by basename only. Before 0.13.0, the built-in `CLOZE_MODEL` had only one field. — same README
- **Not verified:** whether genanki writes the legacy or the modern (compressed) package format, and whether it sets template/field IDs.

### JS/Node alternatives (npm registry, fetched 2026-09-23)
From https://registry.npmjs.org/-/v1/search?text=anki%20apkg :
- `anki-apkg-export` 4.0.3, last published 2020. `genanki-js` 2.0.0, last modified 2022 (https://registry.npmjs.org/genanki-js). Both are stale.
- Recently published: `ankipack` 0.3.1 (2026-09-08), described as "Generate, read and edit Anki .apkg decks with full FSRS support. Works in browsers, Node.js, and Bun". `@shbernal/anki-apkg-export` 6.1.1 (2026-09-05). `gemanki` 1.0.2 (2026-06-20).
- The quality and GUID handling of these packages were **not verified**. Only the registry metadata was read.

### What Anki does on import when a note already exists
- **.apkg:** Anki identifies notes already in the collection "due to a previous import". **If the file's notes are newer than the local copy, they are updated by default.** Updating "is generally not possible if the note type is changed (e.g. … add an extra field)". Missing notes are still added. — https://docs.ankiweb.net/importing/packaged-decks.html
- **Anki 23.10+:** users can choose to update notes and note types unconditionally, overwriting their own modifications, or to never update existing objects. If both the user and the author modified a note type, the two versions can be **merged**. Merging requires a full sync. — https://docs.ankiweb.net/importing/packaged-decks.html
- **Note to deck authors:** merging relies on **template and field IDs, introduced in Anki 2.1.67**. Without them, Anki falls back to matching by name. The manual recommends sharing note types that carry these IDs. — https://docs.ankiweb.net/importing/packaged-decks.html
- **Scheduling on import (23.10+):** an "Import any learning progress" option. Leaving it unselected strips scheduling plus leech/marked tags. Its default state was not verified. — https://docs.ankiweb.net/importing/packaged-decks.html
- **Keeping local edits:** Anki keeps the version with the most recent modification time. Re-importing an unchanged .apkg after the user edited cards keeps the user's edits. — https://docs.ankiweb.net/exporting.html
- **Deletions do not propagate:** "cards that have been deleted in the new apkg file will not be deleted in the user's collection". — https://docs.ankiweb.net/contrib.html
- **Implication for publishers** (my inference from the sources above, not a quoted claim): keep note GUIDs, note-type IDs and field/template IDs stable across releases, and avoid changing a note type's fields after release. These IDs and structure are what let a re-import update notes in place without wiping review history.

---

## 3. How deck updates are distributed today

### AnkiWeb shared decks
- A publisher can update a shared deck by clicking "Share" again. Download counts and ratings are kept. The deck must be at the same location/name as when it was first shared, so renaming it (e.g. into a parent deck) breaks updating. — https://docs.ankiweb.net/contrib.html
- "Users who downloaded the deck previously will not automatically receive updates." If they re-download and re-import, new material is added without altering their study progress, "provided neither you nor the user has altered the note type since the first import." — https://docs.ankiweb.net/contrib.html
- Forum answer (community member, 2024-08-25, not official documentation): re-sharing **completely replaces** the prior AnkiWeb copy rather than merging with it. — https://forums.ankiweb.net/t/updating-shared-deck/48602 (read via the `.json` endpoint)

### CrowdAnki (GitHub JSON)
- CrowdAnki is an Anki add-on that imports and exports decks and notes "in a JSON format", intended for crowd-sourcing decks. From version 0.6 it has Git integration that keeps a history of edits. The README describes a GitHub collaboration workflow. The add-on is listed on AnkiWeb at code 1788670778. — https://raw.githubusercontent.com/Stvad/CrowdAnki/master/README.md

### Ultimate Geography (worked example)
Source for this subsection: https://raw.githubusercontent.com/anki-geo/ultimate-geography/master/README.md
- Installing and upgrading requires the CrowdAnki add-on. Users download a per-language/variant ZIP (e.g. `Ultimate_Geography_v[...]_DE.zip`) from the GitHub **Releases** page and run "CrowdAnki: Import from disk". Users are told to "watch this repository's releases" to hear about new versions.
- Upgrades follow the same process as installing. "Always read the release notes carefully."
- **Major versions** (e.g. v3.0) signal that a normal upgrade may lose significant progress or customisations. The release notes and a wiki page give upgrade paths, or a "clean import" option.
- Users who first installed from an APKG (the deck also has an AnkiWeb page, https://ankiweb.net/shared/info/2109889812) get a duplicate "Ultimate Geography_2" deck on their first CrowdAnki upgrade and must consolidate it by hand.
- Design choices relevant to us: appearance is controlled "solely with CSS; the content of the notes is free from HTML markup". All tags are namespaced (`UG::`). The deck has standard, extended and experimental variants.
- Known reverts: CrowdAnki moves cards back into the main deck unless "Do Not Move Existing Cards" is ticked, and it resets the deck's option group. Template/style customisations are overwritten unless the user clones the note type.

### AnkiHub
- AnkiHub describes itself as "Collaborative Anki Decks". Users submit suggestions, and "Deck admins approve suggestions and updates are automatically sent to all subscribers". Paid members get "Direct sync with shared decks" and "Creation & distribution of your own collaborative decks". — https://www.ankihub.net/ (copyright line reads 2026)
- **Pricing on the homepage (fetched 2026-09-23):** Free $0 (tutorial deck plus free community decks), Core $6/mo ("Hundreds of up-to-date decks … Build-your-own deck features"), Premium $10/mo (AI features, Boards & Beyond / First Aid Forward integration), and Lifetime $450 ("early access rate"). One block also shows Yearly $66/yr.
  - The same page also contains apparently older blocks: $4.58/mo billed $55/yr, $5/mo, and $240 lifetime. **The current price is ambiguous on the page itself.** Treat $6/$10/$450 as the headline tiers, but this is not fully verified.
  - https://www.ankihub.net/pricing returned 404.
- **Protected fields:** users can protect fields or tags so that AnkiHub syncs do not overwrite them, using the add-on, special tags such as `AnkiHub_Protect::Front`, or deck-wide settings on the website. For edits after August 2026, fields a user edits in the AnKing Step deck are protected automatically. — https://community.ankihub.net/t/protecting-fields-and-tags/165604 (post updated 2026-09-23)
- Whether a third-party publisher can host decks on AnkiHub for free, and on what terms, was **not verified**.

---

## 4. Other apps' import formats

| App | .apkg import? | CSV/TSV | Markdown | Notes / limits | Source |
|---|---|---|---|---|---|
| **RemNote** | **Yes**, including review history. Handles basic, cloze, image occlusion (native and IO Enhanced) and most custom note types | Has a "How to Import Flashcards from Text" article (not read) | not verified | Custom CSS is not imported. Card JavaScript is not supported. On-the-fly TTS does not play. IO note types must keep their original names and field names. At most 2,000 tags are shown in the importer. Imported cards go to a "Need to Learn" queue. Page dated August 15, 2026 | https://help.remnote.com/en/articles/6751471-importing-from-anki |
| **Mochi** | **Yes**, including review history | **Yes.** Headers map to template fields (by name or ID). Without a template, columns become card sides | **Yes.** A folder of files (one card each) or one file split on a chosen delimiter. No review history | Mochi **strips CSS and JavaScript and converts HTML to Markdown** on .apkg import. The native `.mochi` format is a ZIP of JSON plus assets and can update an existing deck via `:deck-id` | https://mochi.cards/docs/import-and-export/importing/ |
| **Noji (formerly AnkiPro)** | **Yes**, .apkg and .colpkg, with progress if exported with it. Uploaded via drag-and-drop at noji.io | A "Importing from Quizlet and CSV files" article exists (not read) | not verified | Page dated July 31, 2024. The "formerly AnkiPro" identity comes from a search result snippet and is **not verified** in fetched text | https://help.noji.io/en/articles/9654023-upload-an-anki-deck-file |
| **Knowt** | **No** direct .apkg import documented. Anki content must be copied through a spreadsheet | Paste-in "Import manually", choosing term/definition and row separators | not documented | — | https://help.knowt.com/en/articles/10298094-how-can-i-import-flashcards-from-things-like-anki-and-csv-files |
| **Brainscape** | not verified (help centre returned 403) | **Yes**: .csv, and since Nov 2024 also .tsv, .txt, .xls/.xlsx, .ods, plus AI-cleaned paste | not verified | — | https://www.brainscape.com/academy/improved-flashcard-imports/ |
| **Mnemosyne** | not documented on the import page | **Tab-separated** text in UTF-8 (a question and answer per line; the Vocabulary type takes 3 columns) | no | Anki can import Mnemosyne 2.0 .db files, which is the reverse direction (https://docs.ankiweb.net/importing/intro.html) | https://mnemosyne-proj.org/help/importing.php |
| **Obsidian Spaced Repetition plugin** | not documented in the README | not documented | **Native.** Cards are written in notes tagged `#flashcards`: `Q::A`, `Q:::A` (reversible), multi-line with `?` / `??`, and cloze via `==highlight==`, `**bold**` or `{{…}}`. Supports FSRS or SM-2 | — | https://raw.githubusercontent.com/st3v3nmw/obsidian-spaced-repetition/master/README.md |
| **Logseq** | not verified | not verified | **Native.** A block tagged `#card` or `[[card]]` becomes a card, with the answer in a child block. Cloze syntax is `{{cloze text}}` | Source is the *unofficial* docs, "Last updated 3 years ago". The official docs site is a JS app that could not be read | https://unofficial-logseq-docs.gitbook.io/unofficial-logseq-docs/intermediate-to-advance-features/flashcards-spaced-repetition |
| **Memrise** | no import format documented | not verified | no | Community courses moved to community-courses.memrise.com on 31 March 2024. In 2026, user-created "word lists" returned to the app, with about 800 community courses migrated so far. The page describes no file import | https://explore.memrise.com/community-courses |
| **Quizlet** | not verified | not verified (help centre returned 403 to curl and WebFetch) | not verified | — | https://help.quizlet.com/hc/en-us/articles/360029977151-Creating-sets-by-importing-content (blocked) |
| **SuperMemo** | not verified | not verified (help.supermemo.org and supermemopedia.com returned 403) | not verified | — | https://help.supermemo.org/wiki/File_menu (blocked) |

---

## 5. Note types and card design features

- **Cloze:** uses the Cloze note type with a "Text" field. Syntax is `{{c1::…}}`, and each cN number produces a card. **Nested clozes are supported from 2.1.56**, limited to 3 levels in Anki 24.11 and roughly 8 in other versions. Partial overlaps are not supported. — https://docs.ankiweb.net/editing.html
- **Image occlusion:** "**Anki 23.10+** supports Image Occlusion cards natively", as a built-in note type and a special case of cloze. — https://docs.ankiweb.net/editing.html. AnkiMobile can study IO cards but cannot create them. — https://apps.apple.com/us/app/ankimobile-flashcards/id373493387
- **TTS:** `{{tts en_US:Field}}` requires Anki 2.1.20, AnkiMobile 2.0.56 or AnkiDroid 2.17. It accepts optional `voices=` and `speed=` settings. `{{tts-voices:}}` lists the available voices. The `cloze-only` filter needs 2.1.29+, AnkiMobile 2.0.65+ or AnkiDroid 2.17+. Multi-field or static text uses `[anki:tts lang=en_US]…[/anki:tts]` (2.1.50+, AnkiMobile 2.0.84+, AnkiDroid 2.17+). Windows, macOS and iOS use OS voices. **Linux has no built-in voices.** — https://docs.ankiweb.net/templates/fields.html
- **Recorded audio:** use `[sound:file.mp3]`. MP3 audio and MP4 video are "the most universally supported" across AnkiWeb and the mobile clients. — https://docs.ankiweb.net/media.html
- **Type-in answer:** `{{type:Field}}`, `{{type:cloze:Text}}` (multiple answers separated by commas), and `{{type:nc:Field}}` to ignore diacritics. — https://docs.ankiweb.net/templates/fields.html
- **Night mode:** style with `.card.nightMode { … }` and `.nightMode .myclass { … }`. — https://docs.ankiweb.net/templates/styling.html
- **Platform CSS classes:** `.win`, `.linux`, `.mobile`, `.iphone`, `.ipad` and `.android`, among others. — https://docs.ankiweb.net/templates/styling.html
- **Fonts:** bundle a font as an underscore-prefixed file (e.g. `_arial.ttf`) in the media folder and load it with `@font-face`. The underscore stops "Check Media" from deleting static template files. — https://docs.ankiweb.net/templates/styling.html ; https://docs.ankiweb.net/media.html
- **JavaScript** in templates is "provided without any support or warranty". Clients render differently, so update the DOM with `getElementById` rather than `document.write`. — https://docs.ankiweb.net/templates/styling.html. RemNote and Mochi drop card JS/CSS on import (see section 4).
- **MathJax:** supported out of the box on Anki 2.1+, AnkiMobile and AnkiDroid 2.9+. Syntax is `\( … \)` inline, and TeX content is expected. — https://docs.ankiweb.net/math.html
- **FSRS:**
  - Client support: "Anki 23.10, AnkiMobile 23.10, and AnkiWeb all support it. AnkiDroid supports it in 2.17+." FSRS is enabled globally, not per preset. — https://docs.ankiweb.net/deck-options.html
  - AnkiMobile 25.07 "Updates to match desktop 25.07 release (FSRS6, etc)". — https://apps.apple.com/us/app/ankimobile-flashcards/id373493387
  - **Relevant to deck authors:** the manual says "Do not change the parameters manually or copy them from someone else". The parameters are optimised from the user's own review history. Desired retention and parameters are preset-specific. — https://docs.ankiweb.net/deck-options.html. An .apkg can include deck presets (https://docs.ankiweb.net/exporting.html). Shipping presets with tuned FSRS parameters would therefore go against the manual's advice (my inference).

---

## 6. Media and size constraints

- **AnkiWeb collection limits:** 100 MB compressed and 250 MB uncompressed, *excluding* media. "At the moment there are no limits on the size of your media, although the size of individual media files is limited to 100MB." — https://faqs.ankiweb.net/are-there-limits-on-file-sizes-on-ankiweb.html (the FAQ is undated)
- **AnkiWeb *shared deck* upload limit: not officially verified.** A forum reply from a community member on 2026-08-25 says it is "probably around 150 MB", and that larger decks are commonly split or distributed via Google Drive. This is hearsay, not documentation. — https://forums.ankiweb.net/t/is-there-a-limit-on-shared-decks-and-is-2gb-okay/70793
- **Media folder rules:** no subdirectories in `collection.media`. Manually added files should be passed through Tools > Check Media, or incompatible filenames "will be skipped when syncing". Symlinks are not followed when syncing. — https://docs.ankiweb.net/media.html ; https://docs.ankiweb.net/importing/text-files.html
- **genanki media:** reference media by basename only. Paths like `images/x.jpg` will not work, and filenames should be unique. — https://raw.githubusercontent.com/kerrickstaley/genanki/main/README.md
- **Copyright:** the same forum reply warns that redistributing copyrighted media may be illegal. This is a community opinion, not an AnkiWeb policy document. — https://forums.ankiweb.net/t/is-there-a-limit-on-shared-decks-and-is-2gb-okay/70793

---

### Items explicitly not verified
- Which Anki version introduced .apkg and .colpkg
- The current AnkiMobile and AnkiDroid store versions
- genanki's output format version and whether it writes field/template IDs
- Quality of the JS libraries
- Quizlet, SuperMemo and Brainscape help-centre details (blocked)
- Import support in Logseq's official docs
- The official AnkiWeb shared-deck size cap
- AnkiHub's definitive current pricing and its terms for third-party publishers
