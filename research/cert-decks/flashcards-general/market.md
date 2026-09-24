# Market research: curated, consistently styled, sourced flashcard decks

Research date: 2026-09-23. Every claim below has the URL it was read from. Unless a claim is marked otherwise, it was checked in the raw page text or data (curl output), not in a summarising tool. Claims marked **[summary-tool]** came from a summarising fetch tool and were not checked in raw text. Where I could not reach a source, I say **not verified**.

Raw captures (HTML, API responses, decoded review dumps) are saved in `./raw/` next to this file.

---

## 0. Bottom line

- **The quality gap is real, and people say so in public.** AnkiWeb's own terms say it does not check uploaded decks by hand. Anki's own manual warns that shared decks often lack context. Hundreds of AnkiWeb reviews describe wrong content, broken media, failed imports, cluttered or badly designed templates, and decks nobody updates. A small group of decks with a clear owner, a style and a release process (Ultimate Geography, Kaishi 1.5k) get strong praise for exactly those qualities.
- **I found no project doing "consistent, curated, sourced decks across many subjects" that you can import into Anki.** The nearest cases each cover only part of that:
  - **Brainscape Certified** covers many subjects and is expert-vetted, but works only inside Brainscape's own app and subscription. I did not verify whether it exports to Anki.
  - **AnkiHub** has a medical core and "hundreds" of community decks, and is now taking over stewardship of Anki itself.
  - **The "Ultimate" open-source family** (Geography, History, AnkiLangs) is the closest match in approach, but covers only a few subjects and is run by volunteers.
  - **Single-subject paid sellers** (Refold, Anki Core Decks, Anki Word Bank, Mehlman, Gumroad sellers) focus on languages or medicine.
  - **Paid marketplaces** (AnkiDecks.com) show uneven quality and near-zero sales on many listings.
- **Strategic risk:** in February 2026 Anki's creator announced a gradual handover of Anki's business operations and open-source stewardship to AnkiHub. The company that already runs the largest curated, paid deck platform will then sit next to the app itself.

---

## 1. AnkiWeb shared decks

### How the listing works

- **Rendering.** `https://ankiweb.net/shared/decks` is a JavaScript single-page app. A plain HTTP fetch returns only "JavaScript is required" (https://ankiweb.net/shared/decks). I read the data from the site's own public endpoint `https://ankiweb.net/svc/shared/list-decks?search=<term>` and decoded its protobuf response. The field names (`title`, `thumbs_up`, `thumbs_down`, `mtime`, `notes`, `audio`, `images`) come from the site's JS bundle (https://ankiweb.net/_app/immutable/chunks/frontend.Bv_Ahnfo.mjs).
- **Total number of decks: not shown.** The list endpoint needs a search term; without one it returns "missing field `search`". The list component also has the message "Too many matches found. Please refine your search." (https://ankiweb.net/svc/shared/list-decks, and the SharedList chunk at https://ankiweb.net/_app/immutable/chunks/SharedList.Dgtp1108.mjs). I found no official total count.
- **Categories on the landing page** (from the page bundle, https://ankiweb.net/_app/immutable/nodes/23.DdoaBMne.mjs, served at https://ankiweb.net/shared/decks):
  - *Languages:* Arabic, Chinese, English, French, German, Hebrew, Japanese, Korean, Russian, Spanish.
  - *Art, sciences and trivia:* Anatomy, Biology, Chemistry, Geography, History, Law, Math, Music, Pathology, Physics.
  - Each category is only a pre-filled search link, such as `decks?search=japanese`. The page also says: "Can't find what you're looking for? Try a search!"
- **Ratings.**
  - Ratings are thumbs up / thumbs down. The list's columns are Title, Ratings, Modified, Notes, Audio and Images, and the default sort is "rating" (SharedList chunk above).
  - The rating sort uses a Wilson-score lower bound (`z=1.96`) on the up/down counts (same chunk, function `ht`).
  - A review is a thumbs up or down plus a text "Reason". The review form notes: "the thumbs up/thumbs down count on the info page will not update immediately" (https://ankiweb.net/_app/immutable/nodes/27.CzwH17ff.mjs).
- **Downloads are not shown to the public.** In the deck-info response, `downloads` sits only inside `admin_info`, next to `sharer_email` and `sharer_ip`. It is also in an admin-only `radmin/all-shared-items` response (frontend.Bv_Ahnfo.mjs above).
- **Match counts per search term** (API responses, 2026-09-23): japanese 1,871; english 2,486; anatomy 1,136; spanish 1,048; chemistry 791; french 718; medicine 446; history 393; geography 358; law 255. These are the number of rows each search returned, not the number of decks per category (https://ankiweb.net/svc/shared/list-decks?search=japanese, and the same URL with each other term).

### Top decks in several categories

Shown in the API's default order, which is the rating order. The figures are thumbs up / down, number of notes and last-modified date. Each deck's page is `https://ankiweb.net/shared/info/<id>`.

| Search | Top decks (up/down · notes · last modified) |
|---|---|
| japanese | Tae Kim grammar & anime [911122782] 1554/29 · 2,164 · 2023-10-19; egg rolls JLPT N1–N5 [832276382] 908/13 · 10,641 · 2026-09-06; Core 2000 Step 01 [114060567] 514/17 · 400 · 2015-12-02; Kaishi 1.5k [1196762551] 310/12 · 1,501 · 2026-09-15 |
| english | 4000 Essential English Words [1104981491] 7466/87 · 3,871 · 2024-08-27; 550+ Phrasal Verbs [958938000] 1096/19 |
| spanish | Spanish Top 5000 Vocabulary [241428882] 483/95 · 5,001 · 2017-10-14; EIIE collection "(Donate & Support)" [995462426] 282/29 |
| french | 5000 most frequently used French words v6.0 [893324022] 884/49 · 15,474 · 2022-04-26 |
| geography | Ultimate Geography v5.3 [2109889812] 409/10 · 319 · 2025-04-15; [VectorMaps] USA [1226689493] 87/8 · 2013-05-16 |
| anatomy | 🍒 Anatomy and Physiology [demo] [2099309714] 297/4 · 2026-07-27; USUHS [940918845] 63/3 · 16,031 · 2017-08-16 |
| history | Great Works of Art (expanded, v3.0) [184436527] 103/0 · 2021-02-15; U.S. Presidents [2087959279] 40/3 · 2016-01-19 |
| law | Jura (Zivilrecht…) [1144614352] 54/0 · 9,462 · 2024-09-16; 48 Laws of Power [1605585273] 15/3 · 2014-07-26 |
| chemistry | Amino Acid Flashcards [274734459] 126/9 · 2015-01-09; GCSE Chemistry AQA [120073256] 90/2 · 2023-03-12 |
| medicine | Kieler Basisdeck Medizin [76882632] 65/0 · 2021-11-21; Internal Medicine [1310490434] 18/1 · 2016-09-01 |

Sources: https://ankiweb.net/svc/shared/list-decks?search=japanese (and `=english`, `=spanish`, `=french`, `=geography`, `=anatomy`, `=history`, `=law`, `=chemistry`, `=medicine`).

What stands out:

- Many top decks have not been updated in 5 to 13 years (for example 2013, 2015 and 2016 dates above).
- Vote counts are small outside languages. The top "law" deck has 54 up-votes.
- The "medicine" search is thin because serious medical users sit on AnkiHub (section 2).

### Official statements on quality and moderation

- **AnkiWeb Terms** (https://ankiweb.net/account/terms; text read from the route bundle https://ankiweb.net/_app/immutable/nodes/12.DfEVPDuk.mjs):
  - Moderation: "While we do not have the resources to manually check decks that are uploaded to our website, we reserve the right to remove any we come across that we deem inappropriate, including but not limited to ones with poor quality descriptions or content, and ones that are only useful to a small group of people (such as lecture notes for a specific class)."
  - Automatic removal: "The system will automatically remove shared decks that receive very few downloads after 3 months."
  - Licence: users get a personal-use licence to shared decks. The uploader must assert "that it is entirely your own work, or that you have obtained a license".
- **Anki manual** (https://docs.ankiweb.net/getting-started.html):
  - On missing context: "Most shared decks are created by people who are learning material outside Anki… They might not make any effort to add background information or explanations to the cards, because they already understand the material. So when someone else downloads their deck and tries to use it, they might find it very difficult."
  - On limits: "for complex subjects, shared decks should be used as a supplement to external material, not as a replacement for it."
- **Paid decks:** Anki has no official marketplace. An Anki Forums helper wrote: "No, there's no official site for paid decks." (https://forums.ankiweb.net/t/about-selling-anki-decks/69343)

---

## 2. High-quality and paid deck producers

### AnkiHub / The AnKing (medical, the largest curated platform)

- **Plans.** The AnkiHub homepage lists: Free $0; Core "Sync our best decks" $6/mo; Premium "AI-power your learning" $10/mo; Lifetime $450 ("early access rate"). The same page also shows an older block: "Yearly plan $4.58/mo Billed annually at $55/yr… Monthly plan $5/mo Lifetime access $240". The page therefore shows two inconsistent price sets (https://www.ankihub.net).
- **What each tier includes.**
  - Core includes "Hundreds of up-to-date decks, including the AnKing Step Deck".
  - Premium adds Smart Search, an AI chatbot, and "Access to Boards & Beyond and First Aid Forward content". The page also mentions a "McGraw Hill partnership!" (https://www.ankihub.net).
- **How it works.** "A deck creator shares a deck for everyone to use. You can now subscribe to this deck and submit suggestions. Once those suggestions are approved by the deck creator, the updates are automatically sent to all subscribers!" (https://www.ankihub.net)
- **AnKing Step Deck.** "The largest, most up to date flashcard deck for Step 1, 2, & 3. Over 30k flashcards organized by all your favorite resources including Sketchy, Boards & Beyond, First Aid, and more!" (https://www.ankihub.net)
- **Other listed decks.** MCAT, Turn Up 2 Law & Ethics, Dermki, Taiwan Chinese, Ankisthesia, Blue Ophthalmology and AnatoKing, "and hundreds more community-made decks" (https://www.ankihub.net).
- **The AnKing** calls AnkiHub "our subscription service" and also sells courses and tutoring (https://www.theanking.com).
- **Anki stewardship moving to AnkiHub.** On 2026-02-02 Anki's author (dae) wrote: "I ended up suggesting to them that we look into gradually transitioning business operations and open source stewardship over, with provisions in place to ensure that Anki remains open source" (https://forums.ankiweb.net/t/ankis-growing-up/68610).
- **Free alternative.** AnkiCollab is described on the forums as a free, open-source collaboration add-on, positioned against AnkiHub as the paid one (https://forums.ankiweb.net/t/collection-of-anki-resources/60044, https://forums.ankiweb.net/t/anki-add-on-account-too-young/68858).

### Ultimate Geography (open source, community-maintained)

- **Scope.** "the world's 205 sovereign states… 59 territories… 48 oceans and seas… 7 continents… for a total of 319 unique notes, 978 cards, 221 flags and 319 maps" (https://raw.githubusercontent.com/anki-geo/ultimate-geography/master/README.md).
- **Languages.** Available in 15+ languages (same README).
- **Consistent structure.** One note type with "eight fields" and cards generated from "four templates". "The appearance of the cards is controlled solely with CSS; the content of the notes is free from HTML markup." (same README)
- **Releases.** Versioned releases come with release notes and upgrade instructions (same README).
- **GitHub stars:** about 1.2k **[summary-tool]** (https://github.com/anki-geo/ultimate-geography).

### Kaishi 1.5k (Japanese, free)

- **What it is.** "a modern Anki deck made to introduce beginners to basic Japanese vocabulary" (https://raw.githubusercontent.com/donkuri/Kaishi/main/README.md).
- **Why it exists.** The team built it because "Core 2k… had multiple mistranslations, missing or unrelated pictures and some of the sentences weren't very useful, sometimes not even reflecting the meaning of the word used" (same README).
- **How it was made.**
  - Words: data was merged from Core2k, Core10k and Tango, then sorted by frequency to pick about 1,500 words.
  - Sentences: the team had "to fix roughly 120 sentences out of the 1500".
  - Pitch accent was verified, audio was normalised, and "multiple people proofread the deck" (same README).

### Core 2k/6k (Japanese, legacy community rips)

- These are several AnkiWeb uploads of the old iKnow Core series, for example [2141233552] 343/8, last updated 2018-09-11, and [114060567] 514/17, last updated 2015-12-02.
- One reviewer says [114060567] is really "Japanese Core 1000: Step 1 in iKnow. This is NOT Japanese Core 2000 Step 01" (https://ankiweb.net/shared/info/114060567).

### Refold (languages, paid)

- **Deck prices** (https://refold.la/decks):
  - "Spanish 1K… 1000 Cards $29.99"; Japanese, Korean, French, German and Italian 1K at $29.99; Mandarin 1K $24.99.
  - Minimal-pairs decks $14.99; English Phrasal Verbs 857 cards $24.99.
  - Phonetic-writing decks are free. The page says "36 decks found".
- **Subscription plans** (https://refold.la/pricing): Free $0; Toolkit $9/mo ("Online review of all Refold vocabulary decks"); All Access $49.99/mo (includes "Downloads for all decks in Anki format"); Coaching $99/mo.

### Brainscape (proprietary app with "Certified" decks)

- **Pricing** (https://www.brainscape.com/pricing):
  - Basic is free, with "Study 2,500 pre-loaded flashcards".
  - Pro is "$7.99/mo" (the page text reads "$7.99/mo Year", so it has a monthly/annual toggle) and includes "Study unlimited Certified flashcards".
  - Enterprise has bulk pricing.
- **Certified decks** (https://www.brainscape.com/): "Made and vetted by our panels of experts for hundreds of subjects, exams, languages, and certifications." Examples:
  - Spanish: 14,336 cards, 628,201 learners.
  - World Geography: 1,049 cards, 284,798 learners.
  - NCLEX-RN: 3,767 cards, 181,093 learners.
  - NREMT Paramedic: 2,166 cards, 57,086 learners.
  - Human Anatomy: 3,031 cards, 14,872 learners.
- **Scale claim.** "Billions of flashcards made by top publishers, educators, and students" (same page).
- **Selling model.** "Users who like your flashcards will upgrade to Brainscape Pro to 'unlock' them. You earn royalties!" (https://www.brainscape.com/sell-flashcards)
- **Export to Anki: not verified.**

### Quizlet

- quizlet.com returned a captcha/403 to every direct request. The figures below come from Wayback Machine copies of Quizlet's own pages and **may be out of date**.
- **Price, from the 2024-02-20 snapshot** (https://web.archive.org/web/20240220100455/https://quizlet.com/upgrade): Quizlet Plus is "$35.99 / year That's like $2.99 / month" or "$7.99 / month", with a 7-day free trial. Current pricing: not verified.
- **Scale, from the 2024-06-19 snapshot** (https://web.archive.org/web/20240619165611/https://quizlet.com/mission): "60 million monthly learners 500+ million study sets 2 in 3 US high school students use Quizlet".
- **Google Play, current** (https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid&hl=en_US): "Quizlet Inc. Contains ads 4.6 star 916K reviews… 50M+ Downloads". The listing also says "Discover millions of flashcard sets created by students and teachers".

### Memrise

- **Community content moved out, then partly back** (https://explore.memrise.com/community-courses):
  - "Memrise community courses are the user-generated word lists that learners (not us) have made… Since 31 March 2024, they have lived on a separate site".
  - "Since 2026, we have started bringing user-created content back into the main product as word lists".
  - The company curates "3,200+ curated wordlists… across 45 languages".
- **Official courses.** "149 languages from 23 source languages" (same page).
- **Pricing: not verified.** The plans page is https://app.memrise.com/payment/plans, which is a JavaScript app.

### Cram.com

- "Carry 190+ million flashcards in your pocket"; "dive into millions of student-made flashcards" (https://www.cram.com).
- The footer references "Learneo Terms of Service" (https://www.cram.com). Pricing: not verified.

### Knowt

- **Positioning.** "#1 Free Quizlet Alternative with AI Study Tools" (https://knowt.com/).
- **Pricing** (https://knowt.com/plans): Free ("Browse 5 million resources"); "Ultra - Annual $12.99 per month Billed upfront for $149.99"; "Ultra - Monthly $24.99".
- **Users.** The two pages disagree: "8,480,817 users across the top schools" (https://knowt.com/) versus "6,500,000 users" (https://knowt.com/plans).

### Noji (formerly AnkiPro)

- **Official Anki FAQ:** "AnkiApp (now AlgoApp), Anki Pro (now Noji), and other similarly named apps were developed by separate groups of people, and they are not related to the rest of the Anki ecosystem… we suspect the names were deliberately chosen to take advantage of the brand recognition" (https://faqs.ankiweb.net/anki-knockoffs.html).
- **Noji's claims** (https://noji.io): "Join our community of 6M+ users!"; "More than 50,000 pre-made decks"; "© 2026, Vedas Apps Ltd."
- **Leftover name.** Its comparison page is still at `/ankipro-vs-anki/`. It contains leftover find-and-replace errors, for example "As an open-source project, Noji is currently maintained by volunteers" when the sentence is about Anki (https://noji.io/ankipro-vs-anki/).
- **Unverified claim.** A search-summary statement that the rebrand happened on 2 June 2025 under trademark pressure was not verified in a fetched page.

### Premium sellers and marketplaces (typical prices)

- **Gumroad** search for "anki" (https://gumroad.com/discover?query=anki). Prices come from the page's embedded data; ratings are count and average.
  - Spoonfed Chinese: $3, pay-what-you-want, 117 ratings, average 4.6, "over 8000 sentences" (https://promagma.gumroad.com/l/IEmpwF).
  - Spanish Core 1500: $15 (7 ratings). Portuguese Core 1500: $15.
  - ÜBERDeck German 1,500: $29. ÜBERDeck bundle: $64.99.
  - Duke Elder (ophthalmology): £10.
  - UKMLAce: £50 (0 ratings). AcutExams MRCEM Primary: £50.
  - Mazo MIR: €40. FlashCards Dr. Jonah ENARM: $10.
  - A-level "Complete A*" decks: £37–£99, mostly 0 ratings.
  - Dyce Veterinary Anatomy: $49.
  - AWS Associate pack: $3.99.
  - Ultimate Exam Bundle (Power BI/Fabric): $200.
- **Mehlman Medical** "HY Premium Anki Decks": "$44 through $300" (https://mehlmanmedical.com/product/hy-premium-anki-decks/).
- **AnkiDecks.com** (a marketplace; its FAQ says "AnkiDecks is an independent site that is not affiliated with the Anki project"; https://ankidecks.com/faq).
  - Homepage promise: "Search and download high quality, hand curated Anki decks" (https://ankidecks.com/).
  - The founder's 2020 launch post: "we verify every uploaded deck by hand" (https://forums.ankiweb.net/t/https-ankidecks-com/1864).
  - Sampled listings (https://ankidecks.com/decks/<id>) show very low sales:
    - #333: $200.00, "0 downloads".
    - #342 German 12,207 items: $24.95, 26 downloads.
    - #382: $45.00, 1 download.
    - #395–#407 (GCSE, A-level, nursing): $12–$20, mostly 0 downloads.
    - #243: $14.99, 137 downloads.
- **Anki Word Bank** (languages): "98+ curated flashcard decks with native audio · From $5 · 30-day money-back guarantee" (https://ankiwordbank.com/decks).
  - Its own comparison post admits its example sentences are "AI-generated, contextual".
  - The same post lists competitors: Refold, DeckLearn, Anki Core Decks, GregMat/Magoosh (https://ankiwordbank.com/blog/best-paid-anki-decks-2026).
- **Anki Core Decks** (Loïs Talagrand): "6 languages · 8,000–11,000 cards"; "Frequency-ranked, mnemonic-powered Anki decks"; "Endorsed by Dr. Norbert Schmitt" (https://ankicoredecks.com/). Price: not verified.
- **"Cherry" (🍒) freemium decks on AnkiWeb.**
  - A free demo is on AnkiWeb, and the full deck is sold on Ko-fi: "Support me by buying the complete 🫀 Anatomy and Physiology deck 🫁 on ko-fi! (use code CHERRY at checkout for 20% off)" (https://ankiweb.net/shared/info/2099309714).
  - The same author has AP Psychology [1320299468] and World Religions [1811927487] decks, so this is a small multi-subject brand with a consistent style.
  - Ko-fi prices: not verified.
- **Etsy:** returned 403 to fetches. Not verified.

---

## 3. Evidence of the quality problem (quotes with URLs)

All quotes are verbatim AnkiWeb reviews, read from the deck-info API `https://ankiweb.net/svc/shared/item-info?sharedId=<id>`. Human-readable page: `https://ankiweb.net/shared/info/<id>`.

### Wrong content and errors

- "Nearly every date is wrong. Many titles are wrong. Many works are falsely attributed… There are many spelling errors. There are no sources or cited information" (Great Works of Art, https://ankiweb.net/shared/info/685421036).
- "Contains a number of duplicates - Inconsistent artist names - Answer cards often contain too much information" (same deck).
- "Poor taste and incorrect definitions" and "edgy humor. incorrect cards. genuinely awful" (Spanish Top 5000 Vocabulary, https://ankiweb.net/shared/info/241428882).
- "would be fantastic if some of the definitions given actually fit the example sentence given" (Japanese Core 2000, https://ankiweb.net/shared/info/2141233552).
- "I've run into a fair number of outright errors and mistranslations" (NihongoShark Kanji, https://ankiweb.net/shared/info/1956010956).
- "Deck is out of date, Burma was renamed to Myanmar" (VectorMaps Countries, https://ankiweb.net/shared/info/2915332392).

### Broken media and failed imports

- "Images broken." (Internal Medicine, https://ankiweb.net/shared/info/1310490434)
- "a lot of pics missing for me" (https://ankiweb.net/shared/info/685421036).
- "none of the flag images will display in ankidroid or ankiweb" (Ultimate Geography, https://ankiweb.net/shared/info/2109889812).
- "Notes that could not be imported as note type has changed: 2007 How do I fix this?" and "sound does not play" (https://ankiweb.net/shared/info/2141233552).
- "Cannot be imported. Tried to download it again and again." (https://ankiweb.net/shared/info/114060567)

### Bad templates, clutter and design

- "The audios are bad and the cards are very cluttered" and "Readings should not be on the front of the card..." (JLPT N5, https://ankiweb.net/shared/info/1194221613).
- "the other side is a grid of six rows by 3 columns… It is not best practice to memorize grids or lists" and "ten nested folders" (5000 French words, https://ankiweb.net/shared/info/893324022).
- "the author of this deck seems to have a weird aversion to capital letters… It makes it look very unprofessional" (Tae Kim deck, https://ankiweb.net/shared/info/911122782).
- "It's ugly, it's overloaded with visual information that's useless" (KanjiDamage, https://ankiweb.net/shared/info/748570187).
- "the coloring should be the same everywhere… you don't want your brain to recognize a country because it's red" (https://ankiweb.net/shared/info/2915332392).
- "Super tedious and very very confusing and reading the manual only makes things worse" (Ultimate Spanish Conjugation, https://ankiweb.net/shared/info/638411848).
- "the projections used for the maps are inconsistent, which is mildly distracting" (Ultimate Geography, https://ankiweb.net/shared/info/2109889812).

### Offensive content

- Reviews call several popular decks vulgar, for example "somewhat vulgar, sometimes bordering on pornographic" (https://ankiweb.net/shared/info/748570187) and "full sexual and sexist descriptions" (https://ankiweb.net/shared/info/1956010956).

### Forum and maintainer testimony

- An Anki Forums regular: "so many decks shared on AnkiWeb are not worth your time… You'll be surprised how many shared decks are just 'Basic' note types (not even renamed), even including duplicate reversed notes" (https://forums.ankiweb.net/t/how-to-download-all-shared-decks-or-search-for-a-specific-term-tag-in-all-shared-decks/39232).
- A German deck author: every German frequency deck he tried "was riddled with mistakes" (https://forums.ankiweb.net/t/deletion-request/68455).
- The same thread shows buyers distrust paid decks that are AI-assisted and not disclosed as such: "Instead you see 'Everything is manually curated and checked for correctness and consistency'" (https://forums.ankiweb.net/t/deletion-request/68455).
- Kaishi's maintainers on Core 2k and Tango: "The deck's fields were formatted terribly… Core 2k… had multiple mistranslations, missing or unrelated pictures" (https://raw.githubusercontent.com/donkuri/Kaishi/main/README.md).

### What users praise in good decks

- **Accuracy and curation:** "accurate, broad and in many languages"; "Excellently curated and managed deck" (https://ankiweb.net/shared/info/2109889812).
- **Clean, restrained format:** "Well formatted cards, not overly complicated or with too much extraneous information"; "it gives the information that you need no more no less" (same deck).
- **Updates:** "this deck gets version updates, getting better and better"; "it's up to date, provides some helpful notes (like when a capital has recently changed)" (same deck).
- **Context and explanations:** "it has illustrations and notes on words that could cause confusion whereas other decks just leave you to figure it out"; "Good word selection, intuitive and very well structured card layout" (Kaishi, https://ankiweb.net/shared/info/1196762551).
- **Ordering and progression:** Kaishi's negative reviews complain about progression ("no progression in terms of grammar in the sentences"), and positive reviews praise new words introduced among known ones (same deck).
- **Audio placement:** "Not a fan of no audio on the front side of cards" (same deck). Front-side audio is a common request (also on https://ankiweb.net/shared/info/2141233552).
- **Collaboration:** users ask for "adding this deck to Ankihub for collaboration and community-sourced updates" (https://ankiweb.net/shared/info/2109889812).
- **Willingness to pay for quality:** "I have no problem to pay for high-quality (!!) decks with original content"; "I have happily paid for most of the decks I use" (https://forums.ankiweb.net/t/is-there-a-way-to-sell-my-decks-for-a-fee/17315).
- **Seller advice from that thread:** "Make sure it's high quality, up to date, accurately described, and perhaps upload a sample of 10% of the deck" (same thread).

**Not reachable:** reddit.com (r/Anki, r/medicalschoolanki, r/LearnJapanese) returned 403 to both curl and the fetch tool, so I could not quote Reddit threads. AnkiWeb reviews and the Anki Forums were used instead.

---

## 4. Audience size (only numbers read)

- **AnkiDroid (Google Play):** "AnkiDroid Open Source Team 4.8 star 165K reviews… 10M+ Downloads" (https://play.google.com/store/apps/details?id=com.ichi2.anki&hl=en_US).
- **r/Anki:** the subscriber count is not shown on current Reddit. A Wayback copy of https://www.reddit.com/r/Anki/ from 2026-09-16 has the page attributes `weekly-active-users="104677"` and `weekly-contributions="1575"`, with members labelled "Learners" (https://web.archive.org/web/20260916064656/https://www.reddit.com/r/Anki/). Live reddit.com was not reachable.
- **Official Anki user figures:** none found. https://apps.ankiweb.net/ gives no user count.
- **Popularity proxy:** the top AnkiWeb deck in the samples has 7,466 thumbs-up (4000 Essential English Words, https://ankiweb.net/svc/shared/list-decks?search=english).
- **Quizlet, from its own pages:** "60 million monthly learners 500+ million study sets" (June 2024 Wayback copy, https://web.archive.org/web/20240619165611/https://quizlet.com/mission). Google Play shows "50M+ Downloads" (https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid&hl=en_US).
- **Others (self-reported):**
  - Noji: "6M+ users" (https://noji.io).
  - Knowt: "8,480,817 users" (https://knowt.com/).
  - Brainscape: "Trusted by millions of users" (https://www.brainscape.com/).
  - Cram: "190+ million flashcards" (https://www.cram.com).

---

## 5. Does anyone already do "consistent, curated, sourced decks across many subjects"?

| Project | What it is | How it differs from the planned initiative |
|---|---|---|
| **Brainscape Certified** (https://www.brainscape.com/) | Decks "Made and vetted by our panels of experts for hundreds of subjects, exams, languages, and certifications", sold through Pro at $7.99/mo | **Closest in breadth and curation.** It is locked into the Brainscape app (Anki export not verified), is not presented as sourced or cited, and relies on a subscription. |
| **AnkiHub** (https://www.ankihub.net) | A subscription platform: The AnKing Step Deck, MCAT and "hundreds more community-made decks", updated through approved suggestions, with publisher content (First Aid Forward, B&B) | **Closest inside Anki.** Mostly medical, and community-made (so style varies between decks). It is set to take over Anki stewardship (https://forums.ankiweb.net/t/ankis-growing-up/68610). |
| **Ultimate family: Ultimate Geography, Ultimate History, AnkiLangs** (https://raw.githubusercontent.com/anki-geo/ultimate-geography/master/README.md, https://raw.githubusercontent.com/omarkohl/ultimate-history/main/README.md, https://raw.githubusercontent.com/ankilangs/ankilangs/main/README.md) | Open-source, collaboratively edited, versioned decks with fixed note types. Ultimate History "view[s] history as a graph of events and people" and reuses UG's templates. AnkiLangs aims at "high quality, free and open source Anki decks for language learning" | **Closest in philosophy** (consistent templates, releases, CC licences). Only about three subjects, run by volunteers, with no shared catalogue. Their visibility on GitHub is small: Ultimate History and AnkiLangs have about 12 and 4 stars respectively **[summary-tool]** (https://github.com/topics/anki-decks?o=desc&s=stars). |
| **Refold, Anki Core Decks, Anki Word Bank, DeckLearn** (https://refold.la/decks, https://ankicoredecks.com/, https://ankiwordbank.com/decks) | Paid, consistently designed deck lines | **Languages only.** Anki Word Bank uses AI-generated sentences. |
| **"Cherry" 🍒 decks** (https://ankiweb.net/shared/info/2099309714) | One creator with consistent tagging and ordering across Anatomy and Physiology, AP Psychology and World Religions; free demo on AnkiWeb, full deck on Ko-fi | Very small scale, not sourced, and a single author. It does show the freemium AnkiWeb-demo model working (297 up / 4 down). |
| **AnkiDecks.com and Gumroad sellers** (https://ankidecks.com/, https://gumroad.com/discover?query=anki) | Marketplaces where each seller sets their own style | No shared house style. Many listings show 0 downloads or 0 ratings. |
| **Quizlet, Cram, Knowt, Noji, Memrise** | Huge libraries of user-generated sets (Quizlet "500+ million study sets", 2024; Cram "190+ million flashcards"; Noji "50,000 pre-made decks") | Not curated for consistency. Memrise curates only its language word lists. None of these is Anki-first. |

**Verdict.** I found no project combining all four of these:

1. many subjects;
2. one consistent house style and template;
3. per-card sources or citations;
4. native Anki `.apkg` distribution.

Brainscape comes closest on points 1 and 2 but fails point 4. AnkiHub comes closest on point 4 and on the ability to keep decks updated, but it is medical-first and community-styled. The Ultimate projects come closest on points 2 and 4 but cover few subjects.

"Sourced" looks like the most open space. The only explicit complaint about missing sources I found ("There are no sources or cited information", https://ankiweb.net/shared/info/685421036) is about a deck with no competitor in its niche. None of the paid or curated offerings above advertises per-card citations in the pages I read.
