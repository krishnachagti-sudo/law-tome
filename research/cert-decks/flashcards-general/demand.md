# Flashcard-deck demand and search research

Researched 2026-09-23. Scope: which subjects people want decks for, who owns search results, whether any site pairs decks with readable reference pages, how Quizlet and Brainscape group subjects, and what people pay for.

**Evidence rules used here.** Every claim has a URL. I have marked where each fact came from:
- **[raw]**: I fetched the page or API myself (curl) and read the text or data directly.
- **[search]**: the fact comes from a search-result listing (title/URL) returned by the WebSearch tool. I did not open the page. These results come from the tool's own search engine (US region), **not Google**, so the ranking order is only a rough guide to Google results.
- **not verified**: I could not read it.

Blocked during this task: Quizlet (every URL returned HTTP 403 or a captcha, including the Wayback Machine copy), Patreon (403), Etsy (403), languageatlas.com (bot wall), prep2go.study (timeout), ankidecks.carter.red (HTTP 522). Reddit's HTML and JSON returned 403, but its **search RSS feed worked**, so the Reddit evidence below comes from the RSS feeds.

---

## 1. Which subjects people most want decks for

### 1a. AnkiWeb shared-deck categories (the official Anki hub)

The AnkiWeb shared-decks page at https://ankiweb.net/shared/decks is a JavaScript app. Its route bundle (`/_app/immutable/nodes/23.DdoaBMne.mjs`, loaded from https://ankiweb.net/shared/decks) hard-codes the category links shown on the page **[raw]**:
- **Languages:** Arabic, Chinese, English, French, German, Hebrew, Japanese, Korean, Russian, Spanish
- **"Art, sciences and trivia":** Anatomy, Biology, Chemistry, Geography, History, Law, Math, Music, Pathology, Physics

Each link is just a text search (for example `decks?search=japanese`). The page loads its results from `https://ankiweb.net/svc/shared/list-decks?search=<term>`, which returns protobuf. The field names come from the site's own JS schema (`chunks/frontend.Bv_Ahnfo.mjs`): `id, title, thumbs_up, thumbs_down, mtime, notes, audio, images` **[raw]**. **AnkiWeb publishes no download counts**, so the only popularity signal is thumbs-up ratings. After about a dozen rapid queries AnkiWeb returned "Please log in to perform more searches." **[raw]**, so I had to slow the queries down.

Results of each category search, all read raw from `https://ankiweb.net/svc/shared/list-decks?search=<term>`. The search matches free text, so a deck can appear under more than one term. For example, the JLPT deck matches "english" and "chinese", and "U.S. Presidents" matches "law".

| Search term | Decks returned | Sum of thumbs-up | Top deck (thumbs-up) |
|---|---|---|---|
| english | 2,489 | 32,908 | 4000 Essential English Words (all books) [en-en], 7,466 (https://ankiweb.net/shared/info/1104981491) |
| japanese | 1,871 | 12,816 | Japanese course based on Tae Kim's grammar guide & anime, 1,554 (https://ankiweb.net/shared/info/911122782) |
| chinese | 1,071 | 7,008 | 极品GRE红宝书, 987 (https://ankiweb.net/shared/info/2054082259) |
| german | 1,333 | 5,018 | B1 Wortliste DTZ Goethe, 394 (https://ankiweb.net/shared/info/1586166030) |
| spanish | 1,048 | 3,725 | Spanish Top 5000 Vocabulary, 483 (https://ankiweb.net/shared/info/241428882) |
| french | 718 | 3,391 | 5000 most frequently used French words, 884 (https://ankiweb.net/shared/info/893324022) |
| russian | 573 | 2,373 | Top 5000 - 1,395 Russian Verbs, 129 (https://ankiweb.net/shared/info/822208674) |
| geography | 358 | 1,902 | Ultimate Geography v5.3, 409 (https://ankiweb.net/shared/info/2109889812) |
| biology | 995 | 1,735 | 🍒 Anatomy and Physiology [demo], 297 (https://ankiweb.net/shared/info/2099309714) |
| arabic | 608 | 1,722 | Qur'anic Vocabulary: all word forms, 186 (https://ankiweb.net/shared/info/1429416700) |
| korean | 450 | 1,633 | Korean Grammar Sentences by Evita, 286 (https://ankiweb.net/shared/info/3614346923) |
| anatomy | 1,136 | 1,390 | 🍒 Anatomy and Physiology [demo], 297 |
| chemistry | 791 | 1,223 | Amino Acid Flashcards, 126 (https://ankiweb.net/shared/info/274734459) |
| math | 621 | 1,117 | Multiplication Table 2x1 through 20x20, 69 (https://ankiweb.net/shared/info/1680286867) |
| physics | 469 | 745 | Periodic table memory pegs, 93 (https://ankiweb.net/shared/info/490209917) |
| hebrew | 201 | 517 | Biblical Hebrew Vocabulary, 57 (https://ankiweb.net/shared/info/819202036) |
| law | 255 | 277 | Jura (Zivilrecht, Öffentliches Recht, Strafrecht), 54 (https://ankiweb.net/shared/info/1144614352); 48 Laws of Power, 15 (https://ankiweb.net/shared/info/1605585273) |
| pathology | 258 | 196 | Zanki Physiology and Pathology, 33 (https://ankiweb.net/shared/info/1164658687) |

Other decks in these results that matter for this project **[raw, same endpoint]**:
- 【egg rolls】JLPT N1～N5 一万词 v3.5 has 908 thumbs-up and was updated 2026-09 (https://ankiweb.net/shared/info/832276382).
- "4000 Essential English Words" has 7,466 thumbs-up, the largest single count I saw.
- "EIIE – My Anki Decks Collection (Donate & Support)" has 282 thumbs-up and shows up in the French, German and Spanish results (https://ankiweb.net/shared/info/995462426). It is a donation-funded deck maker.
- Language decks are mostly frequency lists ("5000 most frequent…"), official exam word lists (Goethe A1/B1, JLPT, HSK) and core-2k/6k sentence decks.

**Not verified:** the History and Music categories, and topic searches such as jlpt, medicine, "cognitive biases", capitals, "periodic table", fallacies, mcat, hsk, flags, psychology and programming. After 18 successful queries AnkiWeb answered every request with "Please log in to perform more searches." and kept doing so through retries spaced 5 minutes apart. I did not log in. The table therefore covers 18 of the 20 official category links.

**What this shows:** on AnkiWeb, languages dwarf everything else. The English search alone (32,908 thumbs-up) has almost four times the combined total of the eight science and trivia categories I could query (8,585 = 1,902 + 1,735 + 1,390 + 1,223 + 1,117 + 745 + 277 + 196). Among non-language subjects, geography, biology/anatomy and chemistry lead. Law as a school subject is thin (255 decks, 277 thumbs-up). The flagship medical decks mostly live on AnkiHub, not AnkiWeb (see 1d), so AnkiWeb under-counts medicine.

### 1b. GitHub (open-source decks)

GitHub repository search for `anki deck`, sorted by stars, run through the GitHub API **[raw]** (query results, 2,965 repos total):
- 5mdld/anki-jlpt-decks (JLPT N1–N5), 2,997 stars: https://github.com/5mdld/anki-jlpt-decks
- donkuri/kaishi (Japanese beginner vocab), 1,518 stars: https://github.com/donkuri/kaishi
- anki-geo/ultimate-geography, 1,170 stars: https://github.com/anki-geo/ultimate-geography
- ad-si/Coding-Flashcards (Rust, SQLite, Lua, C…), 758 stars. Written in markdown and converted to Anki or PDF: https://github.com/ad-si/Coding-Flashcards
- krmanik/HSK-3.0, 372 stars: https://github.com/krmanik/HSK-3.0
- MilesCranmer/anki_science (physics, astronomy, CS, ML, statistics), 256 stars: https://github.com/MilesCranmer/anki_science
- jamsinclair/open-anki-jlpt-decks, 242 stars; patsytau/anki_german_a1_vocab, 233 stars; Ecattea/COCA-English-Anki-Deck, 172 stars; 5mdld/anki-english-60k-decks, 144 stars
- Tooling: kerrickstaley/genanki (Python deck generator), 2,711 stars: https://github.com/kerrickstaley/genanki

The pattern matches AnkiWeb: Japanese, English, Chinese and German vocab first, then geography, then programming and science.

### 1c. Reddit: what people ask for

Source: Reddit search RSS feeds, which were readable even though the Reddit HTML was blocked **[raw]**:
- https://www.reddit.com/r/Anki/search.rss?q=title%3A%22looking+for%22+deck&restrict_sr=1&sort=relevance&t=all&limit=100
- https://www.reddit.com/r/Anki/search.rss?q=title%3A%22is+there+a+deck%22&restrict_sr=1&sort=relevance&t=all&limit=100
- https://www.reddit.com/r/Anki/search.rss?q=title%3A%22deck+for%22&restrict_sr=1&sort=new&t=all&limit=100
- https://www.reddit.com/r/Anki/search.rss?q=title%3Arecommend+deck&restrict_sr=1&sort=relevance&t=all&limit=100
- https://www.reddit.com/r/Anki/search.rss?q=title%3A%22best+deck%22&restrict_sr=1&sort=relevance&t=all&limit=100
- https://www.reddit.com/r/Anki/search.rss?q=title%3A%22any+decks%22&restrict_sr=1&sort=relevance&t=all&limit=100

I kept the r/Anki titles that were deck requests and dropped settings, add-on and changelog posts. That left about 200 titles, which I sorted by keyword. This is rough and the buckets are my own:

| Bucket | Titles |
|---|---|
| Languages (English vocab/phrases, Japanese, German, French, Spanish, Italian, Arabic, ASL, minor languages) | 87 |
| Medicine/health (anatomy, USMLE/UWorld, nursing, paramedic, microbiology, psychopharmacology) | 21 |
| General knowledge and hobbies (D&D, music theory, cars, cooking, colours, permit test, "useful universal stuff") | 16 |
| Science (periodic table, chemistry, physics, geology) | 6 |
| Tech/certs (Python, coding, AWS Cloud Practitioner, ICAO) | 6 |
| Law/politics (PH law, parliamentary procedure, US politics) | 4 |
| Geography/maps (mountains, metro maps, rivers) | 4 |
| Math | 3 |
| Nature ID (plants, mushrooms) | 2 |
| Unclassified or generic ("Looking for decks", "What's a shared anki deck that you recommend?") | 51 |

Example titles (all from the feeds above) that point to the "general knowledge / reference" niche:
- "Looking for decks to improve my general knowledge" (2021)
- "What decks would you recommend to learn useful universal stuff?" (2013)
- "Can anyone recommend shared decks with picture mnemonics? Any topic" (2020)
- "Is there a deck for mountains?" (2023)
- "Looking for a Metro Map Deck" (2025)
- "Best deck for the periodic table?" (2024)
- "Best deck for economics?" (2023)
- "Are there any decks for basic music theory?" (2020)
- "Would like to learn Python - Any decks?" (2023)
- "Anyone know of a good, up-to-date deck for AWS Certified Cloud Practitioner?" (2024)
- "I'M LOOKING FOR PARLIAMENTARY RULES AND PROCEDURES ANKI DECKS" (2020)
- "(Anki Deck) Plonk It — Guide to GeoGuessr (4163 notes)" (2025)
- "New decks with all animals and plants in the world" (2025), from https://www.reddit.com/r/Anki/search.rss?q=deck+request&restrict_sr=1&sort=top&t=all&limit=100

Other subreddits (search RSS, top of all time) **[raw]**:
- **r/medicalschoolanki** (https://www.reddit.com/r/medicalschoolanki/search.rss?q=deck&restrict_sr=1&sort=top&t=all&limit=100): the top posts are almost all named Step decks. Examples: "AnKing Overhaul Step 1/Step 2 Version 11 Update", "The KING of all Step 1 Anki decks!", "Mnemosyne Deck - An Anki Deck Based on First Aid for Step 1", "Zanki Step 2", "LIGHTYEAR: A Boards and Beyond based STEP 1 Anki deck", "Full Pixorize Deck", "AnKing Version 12 to ∞! Automatic syncing forever on AnkiHub!" and "Ankihub Scholarship Ended Indefinitely" (2026-08-20).
- **r/languagelearning** (https://www.reddit.com/r/languagelearning/search.rss?q=anki+deck&restrict_sr=1&sort=top&t=all&limit=100): a recurring top post is "Xefjord's Complete Languages". Its title grew from "51 Free Anki Decks Across 40 Languages" (2020) to "150+ Free Anki Language Decks" (2025). Also "Spanish Vocab Sorted By CEFR Level" and "I organized a list with the 8600 most frequently used spanish words".
- **r/GetStudying** (https://www.reddit.com/r/GetStudying/search.rss?q=anki+deck&restrict_sr=1&sort=top&t=all&limit=100): mostly posts about study method. The deck posts are "The Ultimate Flashcard Anki deck for acing Science exams (12th grade NCERT / JEE / NEET)" and "YSK: If you ever made flashcards on brainscape they have all been made public" (2018).

### 1d. Exam-prep markets: does a dedicated Anki deck exist?

| Exam | Dedicated decks exist? | Evidence |
|---|---|---|
| USMLE Step 1/2/3 | Yes, and one deck dominates. | AnkiHub page **[raw]**: "The AnKing Step Deck is the most comprehensive flashcard resource for USMLE Step 1, 2 & 3 … trusted by over 100,000 medical students", "Over 30k flashcards", "now with over 300,000 downloads!" https://www.ankihub.net/step-deck |
| MCAT | Yes | AnkiHub has an MCAT deck (https://www.ankihub.net/mcat-deck, fetched **[raw]**). Search also lists Sketchy, MCATalyst, MCATBros and Jack Westin deck roundups **[search]**: https://info.sketchy.com/guide/mcat-comprehensive-anki-deck, https://www.mcat-alyst.com/anki-decks, https://jackwestin.com/blog/mcat-anki-decks-2026/ |
| Bar exam (US) | Yes, per subject. | **[search]**: AnkiWeb "Bar Exam UBE Torts Law" https://ankiweb.net/shared/info/13732314, "Bar Exam UBE Civil Procedure" https://ankiweb.net/shared/info/1015308533; AnkiHub community CA Bar Exam wiki https://community.ankihub.net/t/wiki-ca-bar-exam-2024-by-undisclosed-professional-student/132478. Brainscape's subject tree lists MBE, MEE, MPRE, and the California, Florida, Texas and Virginia bars **[raw]** https://www.brainscape.com/subjects |
| CFA | Yes, free and paid. | **[search]** AnkiWeb "The Ultimate CFA Level 1 Anki Deck" https://ankiweb.net/shared/info/1338419429. Paid: Gumroad CFA L1, US$9.99, sales_count 15 **[raw]** https://ankiguru.gumroad.com/l/cfa-level-1-anki-flashcards-deck |
| AWS certs | Yes, free and paid. | **[search]** AnkiWeb https://ankiweb.net/shared/info/2070564159, GitHub https://github.com/moraesvic/aws-saa-anki. Paid: Gumroad "AWS Triple Associate Exam Flashcard Pack 2026 (+6 Bonus Anki Decks)", US$3.99, sales_count 897, 4.7 average from 12 ratings **[raw]** https://cloudlane.gumroad.com/l/aws-associate |
| JLPT | Yes, and it is the most-starred deck type on GitHub. | 5mdld/anki-jlpt-decks, 2,997 stars **[raw]**; AnkiWeb JLPT deck with 908 thumbs-up **[raw]** |
| HSK | Yes, many. | HSKStory free per-level decks **[raw]** https://hskstory.com/anki/hsk-6; AnkiWeb "HSK 1-6 official vocabulary" **[search]** https://ankiweb.net/shared/info/2072064249 |
| DELE / DELF | Yes, but thin. | **[search]** AnkiWeb "DELE B2 and informal Spanish expressions" https://ankiweb.net/shared/info/36241266, "DELF B2 IB French B NM Vocabulaire" https://ankiweb.net/shared/info/2118718680; Prep2Go citizenship-exam decks https://www.prep2go.study/shop (not verified, timed out) |
| Goethe (German) | Yes | AnkiWeb B1 Wortliste DTZ Goethe, 394 thumbs-up; Goethe A1 Wordlist, 336 thumbs-up **[raw]** |

Every major exam market already has at least one dedicated deck. Medicine (AnKing/AnkiHub) and JLPT are effectively claimed.

---

## 2. What search results look like today

All results are **[search]** (WebSearch tool, not Google). Order as returned.

| Query | Who shows up (in order) |
|---|---|
| "periodic table anki deck" | GitHub (davidson16807) ×2, GitHub (remiberthoz), AnkiWeb ×3, **anki-decks.com** ×2, Wikipedia |
| "world capitals anki" | AnkiWeb ×2, GitHub, AnkiWeb, Wikipedia ×2, **anki-decks.com**, personal blog (increasemyknowledge.com), **ankidecks.carter.red**, Wikipedia |
| "JLPT N5 anki deck" | AnkiWeb, Quizlet, AnkiWeb, GitHub, Migaku blog, AnkiWeb, YouTube, Flica blog, GitHub, Medium |
| "cognitive biases flashcards" | Quizlet ×2, **Brainscape subject page**, Medium, Quizlet ×2, Brainscape, Thinkific (paid printable bundle), Cognitive Bias Lab, Cram |
| "cognitive biases anki deck" | GitHub ×2, LessWrong, Anki Forums, AnkiWeb ×2, LessWrong, Wikipedia ×2, **ankidecks.com** |
| "AWS solutions architect anki deck" | AnkiWeb, GitHub ×2, AnkiWeb, Etsy, **anki-decks.com**, AWSomecards, GitHub, Gumroad ×2 |
| "best anki decks for USMLE step 1" | testprepnerds, AnkiHub, MedBoardTutors, StudyCardsAI ×2, MedAnkiGen, exam-prep.org, MDSteps, crushtheusmleexam (all publishers/affiliates) |
| "bar exam anki deck" | AnkiWeb ×3, Etsy, Bar Exam Toolbox, AnkiHub community, bar-tutor blog, Wikipedia ×2 |
| "CFA level 1 anki deck" | AnkiWeb, Etsy, Gumroad, AnkiWeb, Podia, 300hours forum, TPT, Gumroad ×3 |
| "HSK 1-6 anki deck" | AnkiWeb ×2, **anki-decks.com**, HSKLord, Mandarin Corner, HSKLord, Baúl Chino, HSKStory, GitHub, Gumroad |
| "MCAT anki deck" | Jack Westin, Sketchy, MedLife Mastery, AnkiHub, Match Guy, MCATalyst, MCATBros, then spam pages |
| "DELE B2 anki deck" | AnkiWeb ×2, **anki-decks.com**, AnkiWeb, Language Atlas, Prep2Go ×3, AnkiWeb, Gumroad |
| "spanish anki deck" | AnkiWeb, Refold (paid), Migaku blog, AnkiWeb, YouTube ×2, Language Atlas, **anki-decks.com**, Wikipedia |
| "mental models anki deck" | AnkiWeb, GitHub, AnkiWeb, GitHub ×2, DEV, personal blog, Wikipedia, Anki Forums, Wikipedia |
| "logical fallacies anki deck" | GitHub, AnkiWeb ×2, LessWrong, AnkiWeb ×2, **ankidecks.com**, **flashify.app**, Brainscape |
| "eponymous laws flashcards anki" | **Quizlet "List of Eponymous Laws"**, AnkiWeb ×3 (unrelated criminal/tort/A-level law decks), Wikipedia, **anki-decks.com** law category, blogs |
| "periodic table flashcards" | Amazon (physical cards) ×3, sciencenotes.org printable, Quizlet, Pinterest, retail, Cram, StudyStack, Brainscape |
| "world flags flashcards" | Amazon, Quizlet, Amazon, Study.com, Brainscape, Quizlet, Amazon, Totcards, printable, TES |

Search URLs are the queries themselves. The destination URLs for each result are listed in the appendix.

**Patterns:**
- For **"X anki deck"**, AnkiWeb deck pages (`ankiweb.net/shared/info/<id>`) and GitHub repos rank on nearly every query. Reddit did **not** appear in any result list from this search tool. That may be a quirk of the tool, so treat it as not verified for Google.
- For **"X flashcards"** (no "anki"), results move to Quizlet, Brainscape, Cram and StudyStack, plus Amazon physical cards and free printables.
- For **exam queries** (USMLE, MCAT), publisher and affiliate "best decks 2026" articles take most slots.
- For **the owner's own topics**: "cognitive biases flashcards" goes to Quizlet and Brainscape. "cognitive biases anki deck" goes to GitHub, LessWrong and small AnkiWeb decks. "eponymous laws flashcards anki" has **no dedicated deck** in the results; the top hit is one Quizlet set and the rest are unrelated law-school decks.

### Sites that have built a catalogue of deck landing pages
- **anki-decks.com** ("AnkiDecks AI Flashcard Generator") has a landing page for each AnkiWeb deck, grouped by topic. The periodic-table page shows only metadata ("Deck contains 118 Anki Flashcards Ratings 22 Notes 118 Audio 0 Images 116 Download Anki Deck"), no card content, and upsells its AI generator **[raw]** https://anki-decks.com/anki-decks/chemistry/comprehensive-periodic-table-of-the/. Its footer topic list is Anatomy, Biology, Chemistry, Geography, History, Law, Pathology and Physics, the same as AnkiWeb's categories. The Law category page lists AnkiWeb decks by rating ("U.S. Presidents (/w pics) Rating 37", "48 Laws of Power Rating 10"…) **[raw]** https://anki-decks.com/anki-decks/law/. The homepage claims "Browse 100,000+ decks made by students" **[raw]** https://anki-decks.com/. It shows up in 7 of the searches above (periodic table, world capitals, AWS, HSK, DELE, Spanish, eponymous laws).
- **ankidecks.com** ("Anki Decks | Buy or Sell") is a separate, curated **marketplace**. Each deck page shows its all-time downloads and a price **[raw]** (see §5). It ranks for "cognitive biases anki deck" and "logical fallacies anki deck".
- **ankidecks.carter.red** ("Countries, capitals and flags of the World | Geography Anki Cards") appears in search **[search]**, but the site returned HTTP 522 (not verified).
- **flashify.app/deck/…** has public AI-generated deck pages that list every card **[raw]** (see §3).
- **Brainscape `/subjects/<topic>`** pages list the user decks for each topic, with learner counts **[raw]** (see §4).

---

## 3. "Flashcards as reference": decks with a readable web version

Sites I read that pair a download with readable content on the web:
- **HSKStory.** The Anki deck page (https://hskstory.com/anki/hsk-6) offers a direct `.apkg` ("Direct .apkg · Anki Desktop, AnkiMobile, and AnkiDroid · Also available on AnkiWeb", "0 signups needed") and links to "Browse all HSK 6 vocabulary". That page (https://hskstory.com/vocabulary/hsk/6) is titled "HSK 6 Vocabulary — 1,777 Words", has a "Download PDF" link and links back to "the Free HSK 6 Anki deck" **[raw]**. This is the closest match to the deck + glossary page + PDF model I found. It also says: "The stable deck identity lets future corrections update these cards instead of duplicating them." **[raw]**
- **AWSomecards.** It **retired its Anki downloads** in favour of free web flashcards. The old Anki URL now shows "Anki decks have been retired … now available as free interactive web flashcards", with an HTML comment "Anki downloads retired: consolidate SEO + send users to the live web deck" and a canonical link to the web deck **[raw]** https://awsomecards.com/anki-flashcards/solutions-architect-associate. The homepage says "3,900+ flashcards 11 certifications $0 forever free no signup required" **[raw]** https://awsomecards.com/. Its SAA page loads cards client-side ("Loading flashcards…"), so the card text is not in the HTML **[raw]** https://awsomecards.com/solutions-architect-associate.
- **flashify.app.** Each public deck page shows every card in HTML: "01 The Ad hominem fallacy attacks the person… Example: …", with tags like `Flashify::LogicalFallacies::AdHominem` **[raw]** https://flashify.app/deck/common-logical-fallacies-definitions-examples-and-how-to-spot-them. That deck is small (13 cards) and AI-generated.
- **Cognitive Bias Lab.** It has in-browser flipcards for biases, filterable by category (Decision-Making, Social, Memory, Reasoning, Perceptual) with a Definitions/Examples toggle, and links out to a Quizlet deck. It offers no Anki download **[raw]** https://www.cognitivebiaslab.com/practice/flipcards/.
- **ad-si/Coding-Flashcards** is "Written in markdown with script to convert them to Anki decks or PDF files" **[raw, GitHub API]** https://github.com/ad-si/Coding-Flashcards. The source is readable on GitHub.
- **anki-decks.com** deck pages show only metadata, with **no** readable cards (see above), which is the opposite of the reference model.

I found no site that publishes **hundreds** of decks where each has a full, readable, indexable glossary page. The closest is HSKStory, which covers one subject (6+ decks).

---

## 4. Non-Anki demand: Quizlet and Brainscape

**Brainscape.** The "Knowledge Genome" top-level subjects, read on https://www.brainscape.com/subjects **[raw]**, are: Entrance Exams, Professional Certifications, Foreign Languages, Medical & Nursing, Science, English, Humanities & Social Studies, Mathematics, Law, Vocations, Health & Fitness, Business & Finance, Technology & Engineering, Food & Beverage, Fine Arts, Random Knowledge.

Notable sub-nodes on the same page: Law has CIPP/US, SQE1/SQE2, the California, Florida, Texas and Virginia bars, MBE, MPRE and more. Technology has AWS Certifications. Random Knowledge has World Maps, World Geography, US Geography, Psychology 101, Wine Appreciation and more. Science has Periodic Table as its own node.

"Browse Top Certified Flashcards" on that page, with learner counts **[raw]**:
- Spanish: 143 decks, 14,336 cards, **628,201 learners**
- World Geography: 12 decks, 1,049 cards, **284,798 learners**
- NREMT® Paramedic: 57,086 learners
- Personal Development: 15,201 learners
- Human Anatomy: 14,872 learners
- Vocab Builder: 12,680 learners

Brainscape "Cognitive Biases" subject page (https://www.brainscape.com/subjects/cognitive-biases) **[raw]**: all decks are user-made, and the largest has 93 learners ("24 Cognitive Biases"). Most have fewer than 10. One is "Charlie Munger Cognitive Biases", another "Cognitive Biases and Principles in UX". Demand exists but no one serves it well.

**Quizlet.** Not verified. Every Quizlet URL (`/subjects`, `/features/Languages`, `/blog`, `/newsroom`, `robots.txt`) returned HTTP 403 to both curl and WebFetch, and the Wayback Machine served a captcha. A search snippet says Quizlet's categories are "Science, Languages, Arts and Humanities, Math, and Social Science", with the source given as https://quizlet.com/features/Languages **[search only, not verified]**. I found no public Quizlet statement of its most popular subjects.

---

## 5. What people pay for (prices I saw)

**Subscriptions for maintained decks (medicine).** From the AnkiHub Step Deck page **[raw]** https://www.ankihub.net/step-deck, the page shows two sets of pricing:
- One block: "Yearly plan $4.58 /mo Billed annually at $55/yr", "Monthly plan $5 /mo", "Lifetime access $240"
- Another block: "Free plan $0", "Core plan … $6 /mo", "Premium plan … $10 /mo", "Lifetime plan … $450 early access rate!"
- What members pay for is freshness and maintenance: "Carefully maintained, updated daily", "Over 750,000 updates!", "Tagged by all your favorite resources, including First Aid, Boards & Beyond, UWorld", plus AI Smart Search and integration with Boards & Beyond and First Aid Forward content.
- r/medicalschoolanki post title: "Ankihub Scholarship Ended Indefinitely" (2026-08-20) **[raw RSS]**.
- AnKing's Patreon (https://www.patreon.com/ankingmed): not verified, HTTP 403.

**One-time language decks.** Refold's "Fundamental Vocabulary to Learn Spanish" costs **"Buy Now for $29.99"** as an Anki deck, or "Subscribe for $9/month" to study online. The page notes the subscription does not include the Anki download **[raw]** https://refold.la/decks/buy/fundamental-vocabulary-to-learn-spanish. HSKLord's store menu lists "HSK Mastery Bundle ($59)" and "HSK 7-9 Advanced ($59)" **[raw]** https://hsklord.com/resources/hsk-anki-deck.

**Gumroad listings** (price_cents, sales_count and ratings read from each page's embedded product JSON) **[raw]**:

| Product | Price | Sales count / ratings shown in data |
|---|---|---|
| AWS Triple Associate Exam Flashcard Pack 2026 (+6 Bonus Anki Decks), https://cloudlane.gumroad.com/l/aws-associate | US$3.99 | sales_count 897; 4.7 avg, 12 ratings |
| Anki Deck - 399 Common English Phrases & Sentence Patterns, https://gumroad.com/l/htTqg | US$29.00 | 4.6 avg, 93 ratings |
| German Fluency Anki Deck, B2–C1 Vocabulary, Neural Audio, https://scifimodelere.gumroad.com/l/german-fluency-anki | US$25.00 | not shown |
| INCOSE Knowledge Exam Anki Deck — ASEP & CSEP, https://ankiking.gumroad.com/l/asep-anki-deck | US$19.99 | not shown |
| Simplified HSK 3.0 Level 6 Anki Flashcard Deck v2, https://chlkdst.gumroad.com/l/cxrtv | US$16.49 | not shown |
| CFA Level 1 Anki Flashcards Deck, https://ankiguru.gumroad.com/l/cfa-level-1-anki-flashcards-deck | US$9.99 | sales_count 15; 1.0 avg, 1 rating |
| CFP® Exam Anki Flashcards Deck, https://ankiguru.gumroad.com/l/CFP-Exam-Anki-Flashcards-Deck | US$9.99 | sales_count 13 |
| AP Biology Anki Flashcards Deck - 700+ Cards, https://ankiguru.gumroad.com/l/ap-biology-anki-flashcards-deck | US$9.99 | sales_count 3 |
| The Ultimate Japanese Learning Anki Deck, https://rajibulski.gumroad.com/l/theultimatejapaneseankideck | US$7.00 | sales_count 5 |
| HSK Flashcards for Anki, https://pinhok.gumroad.com/l/ujOxK | US$7.00 | not shown |

**ankidecks.com marketplace** (each page shows "N downloads all time" and "Price") **[raw]**:
- Free decks get far more downloads: Bouras (MCAT), 6,565, https://ankidecks.com/decks/about/118/show; Xefjord's Complete Spanish (Latin America), 5,735, /171/show; Complete Human Anatomy LATIN SAMPLE, 3,755, /214/show; ENGLISH SAMPLE, 2,880, /215/show; Ultimate Toki Pona, 2,140, /177/show; Cognitive Biases (24 biases from yourbias.is), 833, /59/show; Logical Fallacies, 818, /58/show; PCRE RegEx, 612, /112/show.
- Paid decks: Complete Human Anatomy - Latin, $28.99, 278 downloads (/213/show); English, $28.99, 182 (/227/show); Lippincott Biochemistry, $14.99, 137 (/243/show); Beautiful Templates Bundle, $9.99, 425 (/117/show); anatomy region packs, $4.99–$13.99, 0–68 each (/204–/226); "Tous les decks français et japonais (ULTRA PACK)", $200.00, 0 (/333/show); GCSE OCR A Design and Technology, $20.00, 0 (/395/show).
- The pattern: a **free sample drives thousands of downloads, and the paid full version converts at roughly 5–10%**. Anatomy: 3,755 + 2,880 free-sample downloads against 278 + 182 paid. That ratio is my own calculation from those four numbers.

**Donation-funded makers:**
- "🏚 EIIE – My Anki Decks Collection (Donate & Support)" on AnkiWeb, 282 thumbs-up **[raw]** https://ankiweb.net/shared/info/995462426
- Xefjord's free decks are promoted on r/languagelearning and ankidecks.com. His Patreon (https://www.patreon.com/xefjord) was not verified (403).

**Other paid channels that appear in search, but whose prices I could not read:**
- Etsy: AWS and CFA decks, https://www.etsy.com/listing/1838765599/aws-solutions-architect-anki-flashcards, https://www.etsy.com/listing/4379742092/cfa-level-1-exam-prep-1294-anki (403)
- Podia CFA template: https://bhillbiz.podia.com/2026-cfa-level-1-anki-flashcard-deck-template **[search]**
- TPT: https://www.teacherspayteachers.com/Product/CFA-Level-1-Anki-Flashcards-FREE-12868240 **[search]**
- Thinkific printable bias/fallacy bundle: https://leapfroggingsuccessacademy.thinkific.com/courses/bundle-top-72-cognitive-biases-cognitive-distortions-logical-fallacies-printable-flash-cards **[search]**
- Mandarin Corner: the page shows "Courses as low as $5!" but I could not read the deck price, https://mandarincorner.org/store-anki-flashcards-for-hsk-1-to-6-vocabulary-and-sentences-5000-flashcards/ **[raw]**

**What drives payment, going by these pages:**
1. A high-stakes exam with a deadline: USMLE, CFA, CFP, AWS, INCOSE, bar.
2. Ongoing maintenance and updates (AnkiHub).
3. Audio and polished language content (Refold, German Fluency, English Phrases).
4. Very low prices can still sell volume: US$3.99 with 897 sales.

General knowledge and reference topics sell poorly. The cognitive-bias and fallacy decks on ankidecks.com are free and get about 800 downloads each.

---

## 6. Implications for a Conyso deck site (my reading of the evidence above)

- **Demand is concentrated.** Languages first, then medicine, then exam certifications. General knowledge and reference topics (biases, laws, mental models, fallacies) are a long tail with modest demand: about 800 downloads per bias or fallacy deck (ankidecks.com), at most 93 learners per Brainscape bias deck, and one Quizlet set for "eponymous laws".
- **Nobody owns the reference angle.** For the owner's two subjects, the existing decks are small: 24 biases from yourbias.is, 24 fallacies, 25 "Munger" biases. A 544-bias deck and a 1,116-law deck would each be far larger than anything I found. No search result for "eponymous laws" shows a real deck.
- **The catalogue model exists, but in a low-quality form.** anki-decks.com and ankidecks.com rank with thin metadata pages. HSKStory shows the better model (deck + readable vocabulary page + PDF + stable IDs for updates) for one subject. AWSomecards moved from Anki downloads to web cards specifically to consolidate SEO, which suggests readable HTML ranks better than download-only pages.
- **Suggested opening:** free, high-quality decks, each with a full readable card page, in topics where the incumbents are thin (biases, named laws, mental models, fallacies, geography/general knowledge). Use these to build authority. Paid decks or bundles fit exam topics, where people demonstrably pay US$4–$30.

---

## Appendix A: search-result URLs, in the order returned [search]

- **periodic table anki deck:** github.com/davidson16807/periodic-table-anki-decks; github.com/davidson16807/periodic-table-anki-decks/blob/main/README.md; github.com/remiberthoz/anki-periodic-table-memory-pegs; ankiweb.net/shared/info/1749433712; ankiweb.net/shared/info/483356496; ankiweb.net/shared/info/490209917; anki-decks.com/anki-decks/chemistry/comprehensive-periodic-table-of-the/; anki-decks.com/anki-decks/physics/complete-periodic-table/; en.wikipedia.org/wiki/Periodic_table
- **world capitals anki:** ankiweb.net/shared/info/1080597248; ankiweb.net/shared/info/417970663; github.com/OnkelTem/anki-dm-countries; ankiweb.net/shared/info/2026128613; en.wikipedia.org/wiki/Capital; en.wikipedia.org/wiki/Capital_city; anki-decks.com/anki-decks/geography/countries-capitals-and-flags-of-the/; increasemyknowledge.com/worldcapitals/; en.wikipedia.org/wiki/Lists_of_capitals; ankidecks.carter.red/decks/geography/countries-capitals-and-flags-of-the-world
- **JLPT N5 anki deck:** ankiweb.net/shared/info/810991190; quizlet.com/886138495/jlpt-n5-vocabulary-deck-anki-flash-cards/; ankiweb.net/shared/info/523650169; github.com/chyyran/jlpt-anki-decks/blob/master/JLPT%20N5%20Vocab.apkg; migaku.com/blog/japanese/best-japanese-anki-decks; ankiweb.net/shared/info/1550984460; youtube.com/watch?v=0jrevNjYjFc; flica.app/article/best-anki-decks-jlpt-n5-2026; github.com/coolmule0/JLPT-N5-N1-Japanese-Vocabulary-Anki; medium.com/@pierre.y.dumas/using-python-to-generate-an-anki-deck-9effd6f93c99
- **cognitive biases flashcards:** quizlet.com/223781659/12-cognitive-biases-flash-cards/; quizlet.com/582668901/common-cognitive-biases-flash-cards/; brainscape.com/subjects/cognitive-biases; medium.com/tradecraft-traction/flashcards-to-learn-168-cognitive-biases-4c37f3418f15; quizlet.com/532270258/cognitive-biases-flash-cards/; quizlet.com/111193215/cognitive-bias-flash-cards/; brainscape.com/flashcards/cognitive-biases-10471832/packs/18752364; leapfroggingsuccessacademy.thinkific.com/courses/bundle-top-72-cognitive-biases-cognitive-distortions-logical-fallacies-printable-flash-cards; cognitivebiaslab.com/practice/flipcards/; cram.com/flashcards/cognitive-biases-1407730
- **cognitive biases anki deck:** github.com/togakangaroo/anki-cognitive-biases-and-effects; lesswrong.com/posts/BH9ysqhTmsF2WaftT/…; github.com/mstenemo/Cognitive_Biases_and_Fallacies; forums.ankiweb.net/t/cognitive-biases-deck/27402; ankiweb.net/shared/info/633870209; ankiweb.net/shared/info/970971960; lesswrong.com/posts/NZY2eAALzTTuYzR2t/…; en.wikipedia.org/wiki/List_of_cognitive_biases; en.wikipedia.org/wiki/Cognitive_bias; ankidecks.com/decks/about/59/show
- **AWS solutions architect anki deck:** ankiweb.net/shared/info/2070564159; github.com/moraesvic/aws-saa-anki; github.com/Woile/aws-cert; ankiweb.net/shared/info/210617321; etsy.com/listing/1838765599/…; anki-decks.com/deck/detail/3fs9ySbLL/; awsomecards.com/anki-flashcards/solutions-architect-associate; github.com/mschon/anki-decks-aws-architecture-icons; cloudlane.gumroad.com; cloudlane.gumroad.com/l/aws-associate
- **best anki decks for USMLE step 1:** testprepnerds.com/usmle/best-anki-deck-step-1/; ankihub.net/step-deck; medboardtutors.com/blog/best-anki-decks-for-usmle-step-1-guide; studycardsai.com/blog/anki-deck-for-usmle-step-1; studycardsai.com/blog/anki-deck-for-step-1; medankigen.com/blog/best-anki-decks-for-step-1; exam-prep.org/best-step-1-anki-decks-usmle-preparation/; mdsteps.com/articles/usmle-step-1/…; crushtheusmleexam.com/best-step-1-anki-decks/
- **bar exam anki deck:** ankiweb.net/shared/info/1204374405; ankiweb.net/shared/info/1015308533; ankiweb.net/shared/info/13732314; etsy.com/listing/4353697118/…; barexamtoolbox.com/using-anki-flashcards-to-study-for-the-bar/; community.ankihub.net/t/wiki-ca-bar-exam-2024-…/132478; virginiabarexamtutor.com/…; en.wikipedia.org/wiki/Bar_examination; en.wikipedia.org/wiki/Bar_(law)
- **CFA level 1 anki deck:** ankiweb.net/shared/info/1338419429; etsy.com/listing/4379742092/…; ankiguru.gumroad.com/l/cfa-level-1-anki-flashcards-deck?layout=profile; ankiweb.net/shared/info/989354710; bhillbiz.podia.com/2026-cfa-level-1-anki-flashcard-deck-template; 300hours.com/f/cfa/general/t/anki-and-other-srs-flash-card-study-methods/; teacherspayteachers.com/Product/CFA-Level-1-Anki-Flashcards-FREE-12868240; ankiguru.gumroad.com/l/cfa-level-1-anki-flashcards-deck; ankiguru.gumroad.com; anthonytoday101.gumroad.com/l/cazwm
- **HSK 1-6 anki deck:** ankiweb.net/shared/info/395921696; ankiweb.net/shared/info/2072064249; anki-decks.com/anki-decks/chinese/hanping-chinese-hsk-1-6/; hsklord.com/blog/anki-chinese-decks-guide; mandarincorner.org/store-anki-flashcards-for-hsk-1-to-6-…; hsklord.com/resources/hsk-anki-deck; baulchino.com/mazos-anki; hskstory.com/anki/hsk-6; github.com/faceleg/Anki-xiehanzi; chlkdst.gumroad.com/l/cxrtv
- **MCAT anki deck:** jackwestin.com/blog/mcat-anki-decks-2026/; info.sketchy.com/guide/mcat-comprehensive-anki-deck; medlifemastery.com/mcat/preparation/memorization/flashcards/best-anki-decks/; ankihub.net/mcat-deck; thematchguy.com/how-to-use-anki-for-mcat-best-decks-study-schedule/; mcat-alyst.com/anki-decks; mcatbros.com/mcat-anki-decks; (two spam pages on .princeton.edu and .jhu.edu subdomains)
- **DELE B2 anki deck:** ankiweb.net/shared/info/36241266; ankiweb.net/shared/info/2118718680; anki-decks.com/anki-decks/spanish/dele-b2-and-informal-spanish-expres/; ankiweb.net/shared/info/1746255282; languageatlas.com/anki/spanish-b2-anki/; prep2go.study/shop/delf-a2-anki-deck; prep2go.study/shop; prep2go.study/shop/deck/delf-b2-grammar-anki-deck; ankiweb.net/shared/decks?search=spanish; scifimodelere.gumroad.com/l/german-fluency-anki
- **spanish anki deck:** ankiweb.net/shared/info/487439573; refold.la/decks/buy/fundamental-vocabulary-to-learn-spanish; migaku.com/blog/spanish/best-spanish-anki-decks; ankiweb.net/shared/info/1992218469; youtube.com/watch?v=epRG089yKzo; youtube.com/watch?v=JjBfI-oVHfA; languageatlas.com/anki/spanish-a1-anki/; anki-decks.com/anki-decks/spanish/; en.wikipedia.org/wiki/Spanish-suited_playing_cards
- **mental models anki deck:** ankiweb.net/shared/info/669613720; github.com/marcelinollano/mentalmodels; ankiweb.net/shared/info/1729819997; github.com/asdfgeoff/anki-templates/tree/master/mental-models; github.com/gabrielrondon/mental-models; dev.to/muubar/…; geoffruddock.com/mental-models-with-anki/; en.wikipedia.org/wiki/Mental_model; forums.ankiweb.net/t/deck-options-in-a-mental-map/15757; en.wikipedia.org/wiki/Mental_Models
- **logical fallacies anki deck:** github.com/bilbywilby/Logical-Fallacies-Anki-Deck/blob/main/README.md; ankiweb.net/shared/info/499653917; ankiweb.net/shared/info/633870209; ankiweb.net/shared/info/2012154676; lesswrong.com/posts/Xd8aQsZroPYN4CZXM/lesswrong-wiki-as-anki-deck; ankiweb.net/shared/info/990932777; ankiweb.net/shared/info/451823976; ankidecks.com/decks/about/58/show; flashify.app/deck/common-logical-fallacies-…; brainscape.com/flashcards/logical-fallacies-12733538/packs/21224942
- **eponymous laws flashcards anki:** quizlet.com/215492839/list-of-eponymous-laws-flash-cards/; ankiweb.net/shared/info/594886506; ankiweb.net/shared/info/1574247927; ankiweb.net/shared/info/658673229; en.wikipedia.org/wiki/List_of_eponymous_laws; anki-decks.com/anki-decks/law/; gareth-evans.com/how-to-learn-law-effectively-using-anki/; barexamtoolbox.com/…; image-ppubs.uspto.gov/…
- **periodic table flashcards:** amazon.com/…/163775177X; sciencenotes.org/periodic-table-flash-cards-free-printable-pdf-element-facts/; quizlet.com/13491157/…; amazon.com/CARDDIA-…; amazon.com/Little-Wigwam-…; pinterest.com/ideas/periodic-table-flashcards-printable/…; brooksidetoyandscience.com/products/periodic-table-flash-cards; cram.com/flashcards/periodic-table-of-elements-flash-cards-315885; studystack.com/flashcard-8322; brainscape.com/subjects/paper-1-chemistry
- **world flags flashcards:** amazon.com/Zastic-…; quizlet.com/gb/2545358/flags-of-the-world-flash-cards/; amazon.com/BrightenKidz-…; study.com/academy/flashcards/flags-of-the-world-flashcards.html; brainscape.com/packs/all-country-flags-of-the-world-7826678; quizlet.com/253140435/…; amazon.com/…/B01NB16MBC; totcards.com/free-countries-flashcards.html; justfamilyfun.com/flag-flashcards/; tes.com/en-nz/teaching-resource/world-flags-map-flashcards-236-countries-13238807
- Two further searches (`site:reddit.com r/Anki best shared decks recommendations` and `reddit "is there an anki deck for" general knowledge`) returned **no Reddit URLs at all**. This is why I call Reddit's absence from these results a probable quirk of the tool.

## Appendix B: raw working files
Saved in this scratchpad folder: `aw/*.json` (AnkiWeb API decodes), `aw_rest.txt`, `rss_anki.txt`, `rss_other.txt`, `anki_titles.txt`, `pages/` (HTML fetched with curl).
