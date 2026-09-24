# Flashcard decks initiative: legal and content-quality research

Researched 2026-09-23. This is not legal advice. It reports what the fetched sources say. Every claim has the URL it was read from. Where I could not reach a primary source, the text says **not verified**. Raw fetches are saved in `scratchpad/flashcards/legal/`.

---

## 0. Findings that constrain what can be built or sold

1. **"Anki" is a registered US trademark covering flashcard software and deck sharing.** The site, the product names and the domain paths should not use "Anki" as a brand. Use it only to describe compatibility (for example "works with Anki"). The Anki FAQ calls "Anki Pro" and "AnkiApp" knockoffs whose names "take advantage of the brand recognition we have built up"; both apps have since been renamed (Noji, AlgoApp).
2. **Selling decks is allowed by Anki's own FAQ.** "The cards you create with Anki are your own ... sell them if you wish". There is no DRM and no official paid marketplace.
3. **AnkiWeb is only a free-sample channel.** When you share a deck there, AnkiWeb gets a licence to distribute it. Downloaders get a personal-use licence. You must declare that the deck is entirely your own work or that you have a licence to share it. Decks with very few downloads, poor descriptions or niche content can be removed. I found no rule that explicitly allows or bans advertising paid decks in descriptions (**not verified either way**).
4. **Anki's AGPL licence does not reach your decks.** No source I read says an AGPL licence attaches to decks. genanki is MIT-licensed.
5. **Facts are free to use, but the way a source selects and arranges them may not be.** US law (Feist) protects only original selection and arrangement. EU and UK law add a separate 15-year database right against extracting a substantial part of a database.
6. **Share-alike sources lock the licence of anything built from them.** Wikipedia and Wiktionary text, most Commons media and Lingua Libre audio are CC BY-SA. A deck adapted from them must itself be CC BY-SA and carry attribution. You can still charge for access (CC FAQ), but buyers may redistribute it freely.
7. **OpenStax is no longer a clean CC BY source.** OpenStax's own CMS API lists 70 of its live books as **CC BY-NC-SA**, including Biology 2e, Chemistry 2e, Psychology 2e and the Calculus volumes. That bars commercial use of cards adapted from them. Only a handful of live books (for example "Physics", "Statistics" and "Introduction to Intellectual Property") are CC BY.
8. **Forvo audio is effectively unusable for decks you sell.** Forvo's own API page labels its cheapest plan "No commercial use". Wikipedia reports that Forvo moved from CC BY-NC-SA 3.0 to a restrictive licence around 2019.
9. **TTS audio:** AWS says Polly output can be stored and replayed without restriction. Microsoft's code of conduct requires disclosing synthetic voices. Some open **Piper voices trace back to a research-only dataset** (Lessac), so each voice's model card has to be checked.
10. **AI-generated card text:** the US Copyright Office says purely AI-generated output is not protectable. Paid decks produced mainly with an LLM may therefore carry little enforceable copyright.
11. **Quality evidence cuts against "premade" decks.** Pan et al. (2022) found that flashcards learners made themselves beat premade ones (d ≈ 0.45 for memory). Nielsen and the Anki manual also warn about shared decks. Heavily used medical decks still receive a steady stream of accepted "content error" fixes on AnkiHub.

---

## 1. The name "Anki": trademark, policy, AnkiWeb terms

### 1.1 Trademark registrations

- **USPTO record (primary source):** Mark "ANKI", US Serial No. 79340880, Registration No. 7838778. Registered on the Principal Register on 24 Jun 2025 and "LIVE/REGISTRATION/Issued and Active". The filing basis is 66A (Madrid Protocol) with International Registration No. 1662319.
  - **Class 009** covers downloadable software "for providing repetitive, flash card-based learning courses, flash card customization, flash card tagging and flash card deck sharing" and "downloadable databases ... in the nature of shared flash card decks".
  - **Class 042** covers SaaS for the same purposes.
  - **Current owner:** "Anki Software LLC, 2812 N Norwalk STE 106, Mesa, Arizona". The prosecution history shows "CHANGE OF OWNER RECEIVED FROM IB" on 2 Jul 2026.
  - Source: https://tsdr.uspto.gov/statusview/sn79340880
  - I did not verify who owned the mark before that change, or how Anki Software LLC relates to Ankitects or AnkiHub.
- Trademarkia's copy of the same record gives the same owner and history: https://www.trademarkia.com/anki-79340880
- **An unrelated "ANKI" mark also exists.** Canada's register lists TMA937714 "ANKI", owned by Anki, Inc. (San Francisco), for "Robotic computer hardware; computer software for use in controlling and operating robots": https://ised-isde.canada.ca/cipo/trademark-search/1636344?wbdisable=true
- **Context on stewardship.** On 2 Feb 2026 Damien Elmes posted that he had suggested "gradually transitioning business operations and open source stewardship over" to AnkiHub, "with provisions in place to ensure that Anki remains open source": https://forums.ankiweb.net/t/ankis-growing-up/68610 (raw post: https://forums.ankiweb.net/raw/68610/1). His follow-up says the computer version stays free and open source, syncing stays free and AnkiMobile stays a US$25 one-time purchase: https://forums.ankiweb.net/raw/68610/110

### 1.2 Published policy on using the name

- **No trademark usage policy found.** I did not find a written policy from Ankitects or Anki on using "Anki" in product names or domains. The search surfaced none (**not verified that none exists**).
- **The Anki FAQ "Anki knockoffs" page** says the official ecosystem is "Anki, AnkiMobile, AnkiDroid, and AnkiWeb", all linked from https://apps.ankiweb.net. It continues: "AnkiApp (now AlgoApp), Anki Pro (now Noji), and other similarly named apps were developed by separate groups of people ... we suspect the names were deliberately chosen to take advantage of the brand recognition we have built up. Using Anki in the name implies that they will function with the other Anki clients, which they do not." Source: https://faqs.ankiweb.net/anki-knockoffs.html
- **Search snippets were not confirmed.** Some summaries claimed that Anki Pro became Noji "under trademark pressure" on 2 June 2025. I did not read that in a primary source (**not verified**). The FAQ confirms only the rename.
- **Logo licence (from Anki's LICENSE file).** The logo is AGPL3. It is also available under "a limited alternative license for inclusion in books, blogs, videos and so on" if three conditions are met:
  - it refers to Anki, AnkiWeb, AnkiMobile or AnkiDroid, with a link to https://apps.ankiweb.net;
  - the work makes clear it is "your own content and not something originating from the Anki project";
  - the logo is used unmodified.
  - Source: https://raw.githubusercontent.com/ankitects/anki/main/LICENSE

### 1.3 Selling decks

- **Anki FAQ, "Can I use Anki in a company or school?":** "The cards you create with Anki are your own, so you are free to license them as you please, and sell them if you wish. Anki does not include any DRM features ... If your decks turn up on the Internet in violation of your copyright, you are of course free to send takedown notices." Source: https://faqs.ankiweb.net/can-i-use-anki-in-a-company-or-school.html
- **Forum, 2022.** One user (Robert) wrote: "there's no legal problem with selling decks that you have copyright for. However, you have to make it clear that you're not selling Anki itself". This is a community member, not an official statement: https://forums.ankiweb.net/t/is-there-a-way-to-sell-my-decks-for-a-fee/17315
- **Forum, 2026-04-03.** A regular contributor (abdo) wrote: "No, there's no official site for paid decks." Source: https://forums.ankiweb.net/t/about-selling-anki-decks/69343

### 1.4 AnkiWeb terms on shared decks

Source: https://ankiweb.net/account/terms. The page renders client-side; the text below was read from the page's own JS bundle served by ankiweb.net.

- **Parties.** The agreement is with Ankitects Pty Ltd.
- **Acceptable content.** You assert that uploads do not contain "Content that you do not have the intellectual property rights to use, due to copyright, trademark, patent or other protection", and nothing "illegal in Australia, Germany, the United States, or your country of residence".
- **What you grant AnkiWeb.** When you share a deck, "you grant us a worldwide, royalty-free, non-exclusive license to make the deck available to users under the Shared Deck License". You also grant "the right to modify the deck you shared, including ... creating excerpts, and converting to new file formats".
- **What downloaders get.** "a permanent, non-revocable, worldwide, royalty free, non-exclusive license to use the material in your personal studies. This license is for personal use only, and the deck may not be redistributed, re-uploaded, published, or used for any other purposes without explicit permission".
- **Extra rights only.** You "may optionally grant users extra rights ... in your deck's description ... You may not impose any extra restrictions."
- **Removing a shared deck.** Removal stops future downloads, but copies already downloaded cannot be recalled.
- **Removal by AnkiWeb.** "The system will automatically remove shared decks that receive very few downloads after 3 months." AnkiWeb also reserves the right to remove decks "with poor quality descriptions or content, and ones that are only useful to a small group of people".
- **Share form.** The form requires the declaration "the material I am sharing is entirely my own work, or I have obtained a license from the intellectual property holder(s) to share it here". It warns that "decks that don't contain a useful description may be removed" and shows a counter of "/20 shares in last 7 days". Source: the AnkiWeb share page bundle, same origin.
- **Account expiry.** "Decks stored in your account will expire if your account is not accessed in 6 months or longer."
- **Advertising paid decks.** I found no clause that explicitly permits or forbids advertising paid products in a shared-deck description. The nearest rule is that content must not "attempt to modify or replace the function, content or branding of our website" (**not verified either way**).
- **Implication.** A CC BY-SA deck (see §3) can be shared, because the terms allow granting extra rights. A deck built from CC BY-NC-SA or other third-party material may fail the "entirely my own work, or ... license" declaration unless the licence covers it.

---

## 2. Anki's licence, .apkg files and genanki

- **Anki's licence.** "Anki is licensed under the GNU Affero General Public License, version 3 or later, with portions contributed by Anki users licensed under the BSD-3 license". Documentation in `docs-site` is CC BY-SA 4.0. Source: https://raw.githubusercontent.com/ankitects/anki/main/LICENSE
- **Decks are the author's.** The Anki FAQ says "The cards you create with Anki are your own, so you are free to license them as you please": https://faqs.ankiweb.net/can-i-use-anki-in-a-company-or-school.html
- **genanki is MIT.** Its LICENSE.txt is "The MIT License, Copyright (c) 2017 Kerrick Staley": https://raw.githubusercontent.com/kerrickstaley/genanki/main/LICENSE.txt
- **Add-ons must be AGPL3-compatible**, but only if distributed through AnkiWeb: "As add-ons extend the computer version, they must be licensed under the AGPL3 or a compatible license. If you do not explicitly state a license, it will be assumed to be AGPL3." Source: https://ankiweb.net/account/terms. This matters only if the project ships an add-on, not for decks.
- **The GNU GPL FAQ on program output was not read.** The entry "In what cases is the output of a GPL program covered by the GPL too?" at https://www.gnu.org/licenses/gpl-faq.html was unreachable (connection reset; WebFetch returned 503). **Not verified.**
- **Card templates were not checked.** I did not check whether copying Anki's built-in card templates (HTML, CSS or JS) verbatim into a deck raises an AGPL question (**not verified**).

---

## 3. Copyright in flashcard content and the status of common sources

### 3.1 Facts and compilations (US)

- ***Feist Publications v. Rural Telephone Service*, 499 U.S. 340 (1991)**, text at https://www.law.cornell.edu/supremecourt/text/499/340:
  - "Since facts do not owe their origin to an act of authorship, they are not original and, thus, are not copyrightable."
  - Compilations are protected only if facts are "selected, coordinated, or arranged in such a way that the resulting work as a whole constitutes an original work of authorship".
  - "the copyright in a factual compilation is thin. Notwithstanding a valid copyright, a subsequent compiler remains free to use the facts contained in another's publication to aid in preparing a competing work, so long as the competing work does not feature the same selection and arrangement."
  - "The primary objective of copyright is not to reward the labor of authors" (rejecting sweat-of-the-brow).
- **US Copyright Office Circular 33, "Works Not Protected by Copyright".** "Words and short phrases, such as names, titles, and slogans, are uncopyrightable because they contain an insufficient amount of authorship." A "mere listing of ingredients" has no copyrightable authorship. Source: https://www.copyright.gov/circs/circ33.pdf
- **US government works.** "Copyright protection under this title is not available for any work of the United States Government" (17 U.S.C. §105): https://www.law.cornell.edu/uscode/text/17/105. This covers US federal works only. Other governments differ, and I did not verify any other country.
- **AI-generated output.** The US Copyright Office's AI Report Part 2 (29 Jan 2025) concludes that "outputs of generative AI can be protected by copyright only where a human author has determined sufficient expressive elements ... but not the mere provision of prompts". It adds that "the inclusion of AI-generated material in a larger human-generated work does not bar copyrightability." Source: https://www.copyright.gov/newsnet/2025/1060.html

### 3.2 EU and UK database right

- **Directive 96/9/EC** (text from WIPO Lex: https://www.wipo.int/wipolex/en/text/126788; EUR-Lex returned a bot challenge):
  - **Art. 3.** Copyright covers databases that "by reason of the selection or arrangement of their contents, constitute the author's own intellectual creation". It "shall not extend to their contents".
  - **Art. 7(1), the sui generis right.** It protects a maker who made "a substantial investment in either the obtaining, verification or presentation of the contents", and lets them "prevent extraction and/or re-utilization of the whole or of a substantial part".
  - **Art. 7(5).** "The repeated and systematic extraction and/or re-utilization of insubstantial parts ... shall not be permitted" where it conflicts with normal exploitation.
  - **Art. 8(1).** Lawful users may extract insubstantial parts "for any purposes whatsoever".
  - **Art. 10.** The right lasts "fifteen years from the first of January of the year following the date of completion". A substantial change restarts the term.
  - **Art. 11(1).** The right applies to makers who are nationals or habitual residents of the EU.
- **UK, Copyright and Rights in Databases Regulations 1997** (as originally made; I did not check later amendments):
  - reg. 13: the database right subsists where there is "a substantial investment in obtaining, verifying or presenting the contents": https://www.legislation.gov.uk/uksi/1997/3032/regulation/13/made
  - reg. 16: extracting or re-utilising "all or a substantial part" infringes, and so can repeated and systematic extraction of insubstantial parts: https://www.legislation.gov.uk/uksi/1997/3032/regulation/16/made
  - reg. 17: 15-year term: https://www.legislation.gov.uk/uksi/1997/3032/regulation/17/made
- **Implication (my reading, not a source's).** Copying a whole ranked frequency list or a whole EU-made dataset into a deck is the kind of extraction the right targets, even if each fact is free. Licensed or CC0 datasets avoid the question.

### 3.3 Status of specific sources

| Source | What the fetched source says | URL |
|---|---|---|
| **Wikidata** | "All structured data in the main, property and lexeme namespaces is made available under the Creative Commons CC0 License (Public domain); text in other namespaces is ... CC BY-SA 4.0." | https://www.wikidata.org/wiki/Wikidata:Licensing |
| **Wikipedia text** | CC BY-SA and, unless otherwise indicated, GFDL. Attribution by hyperlink, URL or author list. "If you make modifications or additions to the page you re-use, you must license them under the Creative Commons Attribution-Share-Alike License 4.0 or later." Each copy needs a licensing notice. Images carry their own licences, and fair-use images may not be fair use in commercial reuse. | https://en.wikipedia.org/wiki/Wikipedia:Reusing_Wikipedia_content |
| **Wiktionary** | Dual CC BY-SA 4.0 and GFDL. Reusers' "materials have to be licensed under the same, similar, or compatible license". Also: "Individual words are not copyrightable ... Lists of words in a standard arrangement such as alphabetical order are not copyrightable, but using a selection similar to that of another person may draw suspicions." | https://en.wiktionary.org/wiki/Wiktionary:Copyrights |
| **Wikimedia Commons** | "Each media file has its licensing specified on its file description page" (usually CC BY, CC BY-SA or GFDL, or public domain). The WMF "does not provide any warranty regarding the copyright status". Personality rights may apply to images of people. Credit the creator, not the uploader. | https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia |
| **OpenStax** | Licences from the OpenStax CMS API (129 book records): 70 live books are "Creative Commons Attribution-NonCommercial-ShareAlike License" (e.g. Biology 2e → https://creativecommons.org/licenses/by-nc-sa/4.0/). Only "Introduction to Intellectual Property", "Physics", "Statistics" and "Física universitaria volumen 1" are live under CC BY. 33 retired books are CC BY. Wikipedia: "OpenStax has now standardised all of its textbook licences to CC BY-NC-SA." | https://openstax.org/apps/cms/api/v2/pages/?type=books.Book&fields=title,license_name,license_url,book_state&limit=250 ; https://en.wikipedia.org/wiki/OpenStax |
| **Natural Earth** | "All versions of Natural Earth raster + vector map data ... are in the public domain ... for personal, educational, and commercial purposes. No permission is needed ... Crediting the authors is unnecessary." | https://www.naturalearthdata.com/about/terms-of-use/ |
| **US federal works** | Not copyrightable (17 U.S.C. §105). | https://www.law.cornell.edu/uscode/text/17/105 |
| **SUBTLEX-US** | The Ghent page describes the data and download files. I found **no licence statement** on the page. **Licence not verified.** | https://www.ugent.be/pp/experimentele-psychologie/en/research/documents/subtlexus |
| **Leipzig Corpora / Wortschatz frequency dictionaries** | All pages sat behind an "Anubis" anti-bot wall. A search snippet claimed the frequency-dictionary word lists are CC BY 3.0. **Not verified.** | https://wortschatz.uni-leipzig.de/en/download ; https://wortschatz-leipzig.de/en/freqdict |

**Earlier OpenStax editions.** Retired CC BY editions stay under CC BY for anyone who has a copy: the CC BY-SA 4.0 legal code and its CC BY sibling describe the grant as "irrevocable" (https://creativecommons.org/licenses/by-sa/4.0/legalcode.en). The CC BY text itself was not fetched separately.

### 3.4 What share-alike means for a deck built from Wikipedia or Wiktionary

From the CC BY-SA 4.0 legal code, https://creativecommons.org/licenses/by-sa/4.0/legalcode.en:

- **"Adapted Material"** is material "derived from or based upon the Licensed Material ... translated, altered, arranged, transformed, or otherwise modified in a manner requiring permission".
- **§3(b) ShareAlike.** If you share Adapted Material, "The Adapter's License You apply must be a Creative Commons license with the same License Elements, this version or later, or a BY-SA Compatible License". You "may not ... apply any Effective Technological Measures to, Adapted Material that restrict exercise of the rights granted".
- **§3(a) Attribution.** Keep creator identification, the copyright notice, the licence notice and a URI to the material, and "indicate if You modified the Licensed Material". A link to a page carrying this information may be enough.
- **§4 databases.** If you include "all or a substantial portion of the database contents in a database in which You have Sui Generis Database Rights", your database (not its individual contents) is Adapted Material and so falls under ShareAlike.

From the CC FAQ, https://creativecommons.org/faq/:

- **Charging and paywalls are allowed.** "some licensors charge for initial access to CC-licensed works ... However, even if you have paid an access charge, once you have a copy ... you may make any further uses permitted by the license."
- **Restricted sites are allowed; DRM is not.** You may post CC material on a site restricted "to paying customers, but you may not place effective technological measures (including DRM) on the files that prevents them from sharing the material elsewhere".
- **Collections.** "All Creative Commons licenses ... allow licensed material to be included in collections ... You may choose a license for the collection, however this does not change the license applicable to the original material." NonCommercial material "cannot be used commercially".

**Practical reading (mine, not a source's).** Cards whose text is adapted from Wikipedia or Wiktionary must be released CC BY-SA with attribution. The deck can be sold, but any buyer may re-share it legally.

Unmodified CC BY-SA items placed alongside your own cards may count as a "collection" rather than an adaptation. Where that line falls for a single flashcard is not settled by any source I read (**not verified**).

---

## 4. Audio

### 4.1 Text-to-speech engines

- **Amazon Polly** (https://aws.amazon.com/polly/faqs/):
  - The service is available "with no restrictions on storing and reusing generated speech".
  - "Can I use the service for generating static voice prompts that will be replayed multiple times? Yes, you can. The service does not restrict this and there are no additional costs".
  - "You always retain ownership of your content".
  - The AWS Service Terms §50.3 let AWS store and use Polly inputs to improve its services unless you opt out: https://aws.amazon.com/service-terms/
- **Google Cloud Text-to-Speech:**
  - Google classifies "Text-to-Speech" as an **AI/ML Service** (not listed under Generative AI Services): https://cloud.google.com/terms/services
  - The Service Specific Terms bar using AI/ML output "to develop a similar or competing product" or to "create or improve models similar to a Google Model": https://cloud.google.com/terms/service-terms
  - I found no TTS-specific clause restricting redistribution of synthesized audio in decks, but I did not read the full terms end to end (**not verified exhaustively**).
  - The "Generated Output is Customer Data ... Google does not assert any ownership rights" clause sits in the Generative AI section, and TTS is not listed as a Generative AI Service.
- **Microsoft Azure Speech** (Microsoft Enterprise AI Services Code of Conduct, which "replaces ... Azure Speech in Foundry Tools text to speech" code; https://learn.microsoft.com/en-us/legal/ai-code-of-conduct):
  - Customers must "Disclose when the output ... [is] generated by AI, including the synthetic nature of generated voices".
  - "All content released through a customer's use ... must be originally created by the publisher, appropriately licensed ... or used as otherwise permitted by law."
  - I did not read the Microsoft Product Terms on output ownership (**not verified**).
- **Piper (open source):**
  - The voices repository card says `license: mit`: https://huggingface.co/rhasspy/piper-voices/raw/main/README.md
  - Each voice's MODEL_CARD names a separate dataset licence:
    - en_US **lessac** was trained on the Blizzard 2013 Lessac data, and many other voices, including en_US amy, en_GB alba and de_DE thorsten, are "Finetuned from U.S. English lessac voice": https://huggingface.co/rhasspy/piper-voices/raw/main/en/en_US/lessac/medium/MODEL_CARD
    - en_GB alba data is CC BY 4.0.
    - de_DE thorsten data is CC0.
    - en_US ljspeech data is "public domain".
  - The Lessac/Blizzard 2013 licence is a "RESEARCH LICENCE AGREEMENT". It defines Research Purposes as excluding "using the Materials for any commercial purpose, including the development, marketing, commercialisation, sale or licencing of voice synthesis ... products". It grants use "exclusively for Research Purposes only". Source: https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/license.html
  - Whether that licence restricts audio produced by a model trained on the data is not addressed by any source I read (**not verified**). For a commercial product, voices trained only on CC0 or public-domain data (e.g. thorsten, ljspeech) have the cleaner paper trail.

### 4.2 Native-speaker recordings

- **Lingua Libre:** "Content is available under Creative Commons 4.0 Attribution-ShareAlike unless otherwise noted". Recordings are published to Wikimedia Commons: https://lingualibre.org/wiki/LinguaLibre:About. Share-alike therefore applies (§3.4). Each file's Commons page states its actual licence.
- **Forvo:**
  - The API page lists a "Non-Profit ... For academic and individual use with Anki, GoldenDict etc ... No commercial use" plan and "Commercial use allowed" plans at US$28.95/month and up: https://api.forvo.com/
  - Forvo's licence page (https://forvo.com/license/) returned HTTP 403, so the primary licence text is **not verified**.
  - Wikipedia says Forvo operated under CC BY-NC-SA 3.0 from 2008 and "By the end of 2019 ... replac[ed] them with an 'ad hoc' license that severely restricts user's rights to copy, modify and redistribute the audio files": https://en.wikipedia.org/wiki/Forvo
  - Even the old licence was NonCommercial.

---

## 5. Card-design principles

### 5.1 Piotr Wozniak, "Effective learning: Twenty rules of formulating knowledge"

Byline: "Dr Piotr Wozniak, February, 1999 (updated)". Source: https://www.supermemo.com/en/blog/twenty-rules-of-formulating-knowledge

The article says "The rules are listed in the order of importance" and assumes spaced repetition. The rules as titled:

1. Do not learn if you do not understand
2. Learn before you memorize
3. Build upon the basics
4. Stick to the minimum information principle ("The material you learn must be formulated in as simple way as it is")
5. Cloze deletion is easy and effective
6. Use imagery
7. Use mnemonic techniques
8. Graphic deletion is as good as cloze deletion
9. Avoid sets
10. Avoid enumerations
11. Combat interference
12. Optimize wording
13. Refer to other memories
14. Personalize and provide examples
15. Rely on emotional states
16. Context cues simplify wording
17. Redundancy does not contradict minimum information principle
18. Provide sources
19. Provide date stamping ("time stamping is useful for volatile knowledge that changes in time")
20. Prioritize

Wozniak's summary notes that "the first 16 rules revolve around making memories simple". On cloze deletion, he says it "greatly speeds up formulating knowledge and is highly recommended for beginners".

Rule 19 in practice: the article's own "Avoid sets" example converts "a 15-member set" of European Union members into items. That count is from the 1999 text and is now out of date, which shows why date stamps matter.

### 5.2 Anki manual

From https://docs.ankiweb.net/getting-started.html:

- "Creating your own deck is the most effective way to learn a complex subject".
- It quotes "Do not learn if you do not understand. --SuperMemo".
- Shared-deck authors "might not make any effort to add background information or explanations ... So when someone else downloads their deck ... they might find it very difficult".
- "for simple subjects that are basically a list of facts, such as capital city names or country flags, you probably don't need any external material. However, for complex subjects, shared decks should be used as a supplement to external material, not as a replacement for it."

Cloze mechanics are covered at https://docs.ankiweb.net/editing.html (Cloze Deletion section).

### 5.3 Andy Matuschak, "How to write good prompts" (2020)

Source: https://andymatuschak.org/prompts/

Retrieval practice prompts should be:

- **focused:** "It's usually best to focus on one detail at a time";
- **precise** about what they ask;
- **consistent**, producing the same answer each time (citing retrieval-induced forgetting);
- **tractable:** "write prompts which you can almost always answer correctly";
- **effortful:** "You shouldn't be able to trivially infer the answer".

On cloze, he warns: "Cloze deletions seem particularly susceptible to [pattern matching], especially when created by copying and editing passages from texts. This is best avoided by keeping questions short and simple." He also cautions against economising on the number of prompts.

### 5.4 Michael Nielsen, "Augmenting Long-term Memory" (July 2018)

Source: http://augmentingcognition.com/ltm.html

- "Make most Anki questions and answers as atomic as possible: That is, both the question and answer express just one idea."
- "Construct your own decks ... I've found only a little use for [shared decks]. The most important reason is that making Anki cards is an act of understanding in itself."
- He does see value in shared decks for "very elementary questions, such as art decks", and in medical-student communities that build decks collaboratively.

### 5.5 Empirical evidence

- **Pan, Zung, Imundo, Zhang & Qiu, "User-Generated Digital Flashcards Yield Better Learning Than Premade Flashcards"**, *Journal of Applied Research in Memory and Cognition* (2022), doi:10.1037/mac0000083. Source: https://sc-pan.github.io/pdf/PZIZQ_2022.pdf
  - Six experiments with a 48-hour delayed test.
  - "user-generated flashcards improved memory relative to premade flashcards (an estimated advantage of d = 0.45, 95% CI [0.25, 0.66]), and in most cases, enhanced performance on application questions (d = 0.29, 95% CI [0.12, 0.45])".
  - The benefits held "relative to premade flashcards of high and low quality".
  - This is the most direct evidence against the value of premade decks.
- **Endres, Kranzdorf, Schneider & Renkl, "It matters how to recall – task differences in retrieval practice"**, *Instructional Science* (2020), abstract via Crossref: https://api.crossref.org/works/10.1007/s11251-020-09526-1
  - Short-answer tasks "led to increased retention of directly retrieved targeted information".
  - Free recall led to "better retention of further information".
- **Cloze versus question-and-answer.** I did not find, in any fetched source, a controlled head-to-head comparison of cloze and Q/A flashcards (**not verified; the evidence base here is thin**). A 2025 *Instructional Science* paper on cloze tests as retrieval practice exists (Ponce et al., https://api.crossref.org/works/10.1007/s11251-025-09746-3), but I could not read its abstract.
- **Minimum information principle.** I found no experimental test of it as such. The sources are Wozniak's practitioner guidance and the Matuschak and Nielsen essays above (**not verified empirically**).
- **Card design taxonomy.** Balczewski et al. (2025), *Med Sci Educ*, qualitatively analysed "Thirteen hundred EFs from six popular undergraduate medical education decks". They propose the DEAME framework (7 categories, 48 codes) and note that "no unifying terminologies exist" for flashcard design. The study describes design; it does not measure errors. Source: https://pubmed.ncbi.nlm.nih.gov/41798330/

---

## 6. Accuracy and fact-checking risks

- **Medical decks keep receiving accepted corrections.** AnkiHub's model: users "Submit suggestions to change, add, or remove flashcards. Deck admins approve suggestions and updates are automatically sent to all subscribers" (https://www.ankihub.net/). The public "accepted-suggestion" tag feed on 2026-09-23 listed recent accepted **"Content error"** suggestions for the AnKing Step Deck, the AnKing MCAT Deck and Malleus Clinical Medicine (AU/NZ): https://community.ankihub.net/tag/accepted-suggestion.json
  - **Example 1:** https://community.ankihub.net/t/611789. The deck author accepted a correction on a card about ulcerative colitis maintenance therapy. They wrote that they made it "back in 2023. Admittedly, know very little about UC", and agreed to change it to test only first-line management.
  - **Example 2:** https://community.ankihub.net/t/498045. An AnKing Step Deck mechanism-of-action correction was debated, with one user saying the citation list "Gives me pause ... if there are no references to Amboss/UWorld/NBME".
- **Shared-deck quality is disclaimed.** AnkiWeb says "Shared decks have been provided by third parties and are not reviewed by us, so we can offer no warranty": https://ankiweb.net/account/terms
- **Licence and fact status of reused media is not guaranteed.** Wikimedia says: "the Wikimedia Foundation does not provide any warranty regarding the copyright status or correctness of licensing terms". Reusers are told to verify each file: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- **AI-generated content is warned as potentially inaccurate.** Google's terms say Generative AI Services "may provide inaccurate or offensive Generated Output": https://cloud.google.com/terms/service-terms
- **Volatile facts go stale.** Wozniak's rules 18 and 19 (provide sources, date-stamp volatile knowledge) apply, and his own EU example is now outdated (§5.1).
- **Copyright disputes over paid decks.** A forum user said the paid "Spoonfed Chinese" deck had "some questions about the copyright". This is an unverified claim by a user: https://forums.ankiweb.net/t/is-there-a-way-to-sell-my-decks-for-a-fee/17315
- **No quantified error rate found.** I did not find a published study measuring error rates in popular Anki decks (**not verified that none exists**).

---

## 7. Sources that could not be read

| Source | Problem |
|---|---|
| GNU GPL FAQ (https://www.gnu.org/licenses/gpl-faq.html) | Connection reset / HTTP 503 |
| EUR-Lex (Directive 96/9/EC) | HTTP 202 bot challenge; the WIPO Lex copy was used instead |
| Leipzig Wortschatz (all pages) | Anubis proof-of-work wall |
| Forvo licence and terms pages | HTTP 403 |
| OpenStax HTML pages | JS-only; the CMS JSON API was used instead |
| Springer article pages | Client challenge; Crossref was used for abstracts |
| AnkiWeb terms | JS-rendered; text read from the page's own JS bundle |
