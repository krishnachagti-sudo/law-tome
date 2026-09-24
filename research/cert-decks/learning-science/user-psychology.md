# The psychology of the person using the deck

**Research brief for a free, high-quality certification-exam flashcard project (Anki and similar)**
Compiled 2026-09-24. Raw texts are in `scratchpad/learning/raw-psych/`; each claim below names the file it came from.

---

## 0. Method, evidence labels and limits

**Labels**
- **[E]**: an experiment or a meta-analysis of experiments.
- **[S]**: a survey or observational/correlational study.
- **[R]**: a review, whether narrative or systematic without pooling.
- **[C]**: community evidence, such as Reddit r/Anki posts. These are anecdotes, and survivorship and selection bias are likely.
- **[P]**: practitioner or official documentation, such as the Anki manual, W3C WCAG or the British Dyslexia Association style guide.

**How the sources were read**
- PubMed abstracts were fetched with NCBI E-utilities (`pm_*.txt`, `pubmed_anki.txt`).
- DOIs were resolved at api.crossref.org (`cr_*.json`) and OpenAlex (`oa_batch*.txt`).
- Full texts were read as PDFs for Karpicke, Butler & Roediger 2009, Kornell & Bjork 2007 and Kornell 2009 (`*.txt`).
- The Anki manual was read from its GitHub source (`anki_manual_*.md`).
- Reddit r/Anki was read through its search RSS feeds (`reddit_*.txt`).
- A few pages were read only through a fetch tool that returned quoted extracts (`webfetch_*.txt`). Those claims are flagged.

**Not verified or not found.** These gaps matter for the recommendations.
- **Dropout from spaced-repetition apps.** I found no peer-reviewed study measuring dropout or adherence in Anki or other spaced-repetition apps (a PubMed search for "spaced repetition adherence dropout app" returned nothing). Everything below about *why people quit* rests on the official manual [P], community reports [C] and adjacent psychology [E/S]. It is not direct dropout data.
- **Hanus & Fox 2015** (the gamified classroom that lowered motivation). I could not reach the abstract or full text; only a search-engine snippet was available. It is **not verified** and is not used as evidence.
- **The Lally et al. "66 days" figure.** The primary abstract gives only the **18–254 day range**. The "average of 66 days" was read in a paper co-authored by Lally (Gardner, Lally & Wardle 2012), not in the primary full text. Whether 66 is a median or a mean in the primary paper is **not verified**.
- **Silverman & Barasch 2023 (streaks).** This was read only as the publisher and institution summary (`webfetch_silverman_barasch2023.txt`), not the full paper.
- **Lu et al. 2021 (medical students' Anki use and Step 1).** Its numbers were read through a fetch tool's extraction of the PMC full text (`webfetch_lu2021_pmc8651966.txt`). They were not checked line by line.
- **Screen readers.** I did not verify how Anki or AnkiDroid behave with screen readers. Only the Anki manual's text-to-speech (TTS) template syntax was verified.

---

## 1. Executive summary: the decision-relevant findings

1. **Workload is set by new cards per day, and beginners underestimate it.** The official Anki manual states: "If you are consistently learning 20 new cards a day, you can expect your daily reviews to be roughly about 200 cards/day." It also says that users who "excitedly studied hundreds of new cards" early "become overwhelmed by the reviews required" [P] (`anki_manual_deck-options.md`). Community burnout posts describe the same arc repeatedly: go in hard, reviews snowball, bail out [C].
2. **Learners systematically misjudge what works.**
   - 72% of participants believed massing beat spacing, although spacing won for 90% of them [E] (Kornell 2009).
   - 84% of students reread as a strategy; only 11% reported practising retrieval [S] (Karpicke et al. 2009).
   - Learners stop studying an item once they can recall it once, which hurts retention [E] (Karpicke 2009; Kornell & Bjork 2008).
   - Effortful learning *feels* like less learning [E] (Deslauriers et al. 2019).

   Deck pages must set expectations explicitly. Correcting these beliefs is hard, even with explanation [E] (Yan, Bjork & Bjork 2016).
3. **Habits take weeks to months, and one missed day does not break them.** The time to reach 95% of the automaticity plateau ranged from 18 to 254 days [E/S] (Lally et al.). A 2024 meta-analysis reports medians of 59–66 days and an individual range of 4–335 days [R/E] (Singh et al. 2024). Missing one opportunity "did not materially affect" habit formation (Lally). Implementation intentions ("if situation X, then I will do Y") have d = .65 on goal attainment [E] (Gollwitzer & Sheeran 2006).
4. **Gamification has small-to-medium average benefits with real risks.**
   - Meta-analyses find g = .49 for cognitive outcomes, .36 for motivational and .25 for behavioural outcomes (Sailer & Homner). Bai et al. find g = 0.504 [E].
   - A mapping study found 87 papers reporting negative effects, most often from badges, leaderboards, competition and points [R].
   - Expected, contingent rewards undermine intrinsic motivation (d from −0.28 to −0.40) [E] (Deci, Koestner & Ryan 1999).
   - Intact streaks motivate, but broken streaks demotivate, especially when users blame themselves. Being able to "repair" a streak softens this [E] (Silverman & Barasch 2023, summary only).
5. **Retrieval practice may reduce the harm of exam stress and exam nerves.**
   - Participants who learned by retrieval practice showed no stress-related memory impairment, while restudiers did [E] (Smith, Floerke & Thomas 2016).
   - 72% of 1,408 school students said retrieval practice made them less nervous for tests [S] (Agarwal et al. 2014).
   - Test anxiety is negatively related to performance [E/S meta] (von der Embse et al. 2018). It was a negative predictor of Step 1 score among Anki users [S] (Deng et al. 2015).
6. **Evidence that Anki use raises exam scores is observational and mixed.**
   - Several US studies associate Anki use or volume with higher USMLE Step 1 and CBSE scores. Examples: +1 Step 1 point per ~1,700 unique cards (Deng 2015); 241.10 vs 235.51 (Lu 2021) [S].
   - Other studies find no association with in-course exams or grade point average (Spence 2025; Alnaser-Almusa 2026; Levy 2023; Magro 2024) [S].
   - A 2026 systematic review concludes the "evidence is largely observational" [R] (Frappa et al.).
   - One quasi-experiment with random allocation (Durrani 2024) found a benefit, with an effect size of 0.8 [E].
   - We should promise **better retention of the facts on the cards**, not a pass.

---

## 2. Why people quit spaced repetition, and what an author can do

### 2.1 Review debt and too many new cards per day

**What the manual says [P]** (`anki_manual_deck-options.md`)
- New cards create a review burden. At 20 new cards a day, expect "roughly about 200 cards/day" of reviews.
- "More than one Anki user has excitedly studied hundreds of new cards over their first few days of using the program, and then has become overwhelmed by the reviews required."
- Backlogs: "If you have a backlog of overdue review cards, it is recommended that you stop introducing new cards until you catch up with that backlog. Continuing to introduce new cards when you're already behind can make the backlog worse."
- Maximum reviews/day "can save you from a heart attack when returning to Anki after taking a week off."
- On falling behind (`anki_manual_studying.md`): when you return after a long break, "you don't have to start anew and can just start back from where you left."
- The manual recommends the "Relative overdueness" sort order (with FSRS, "Ascending retrievability") "if you have a large backlog that may take some time to get through."
- The manual also documents a "Catching Up" method: split the due cards into a filtered deck for "Just Due" (`is:due prop:due>-7`) and one for "Over Due" (`is:due prop:due<=-7`), and study the overdue deck "the same way you would study new cards" (`anki_manual_filtered-decks.md`). A 2026-09-15 r/Anki post by a user who fell behind to "~6k overdue cards" during depression credits this method [C] (`reddit_backlog.txt`).

**Community evidence [C]** (`reddit_burnout.txt`, `reddit_backlog.txt`, `reddit_quit_anki.txt`; individual anecdotes)
- **"How to avoid the creep of Anki burnout" (2021).** "I've been using Anki on and off for 8 years now and it always ends the same. I immediately see the benefits, I go in too hard, have far too many cards to review each day, and then bail out." Daily time had crept from 30 to 45 to 60 minutes. The poster's summary of the replies:
  - set new cards to show after reviews;
  - stop adding new cards in low-motivation periods ("maintenance mode");
  - "Commit to an amount of time every day (say 25 minutes) that you can do even on your worst days."
- **"1671 reviews / burnout / please help" (2021).** A student with exams in May spent a whole day on 1,671 reviews and was "about to throw in the towel". The settings included 100 new cards a day, and many cards had sunk to 130% ease after frequent "hard" presses.
- **"Why I don't recommend you to set the maximum reviews to 9999" (2022).** "It's better to do 200 reviews each day and eventually catch up … than doing 1000 cards on day and then just give up on Anki."
- **"tips on how to get back to anki?" (2026).** After a burnout break: "whenever I open the app and see my 3000+ cards due i feel so overwhelmed."
- **"I finally cleared my 2500+ backlog" (2025).** After a two-month break the backlog took 38 days to clear at about 200 a day: "I've forgotten so many stuff and now the effort I have put into them before was for nothing because I have to re-study them again."
- **"Anki slow & steady" (2026).** A self-described language learner limits study to 15–20 minutes a day, having "imported massive decks and got overwhelmed, and quit" earlier. Adding too many cards two months in created "a hole that it took a month to dig out of."
- **"My Japanese vocab routine - 6k deck, 10 new cards a day, zero burnout" (2025).** The poster adds 5–15 new words a day.
- **"(rant) … disproportionate number of medical students in this subreddit…" (2025).** Posts from heavy users showing "multiple hundreds of cards" and ">30 minutes" a day distort beginners' expectations.

**Survey evidence [S]**
- In a Saudi survey of 306 medical students, time commitment (73.7%) and unfamiliarity with the software were the main barriers (Alnaser-Almusa et al. 2026, `pubmed_anki.txt`).
- A Jordanian survey (n = 318) cites "the platform's cognitive and time demands, along with technical issues and the potential for burnout" (Almaabreh et al. 2026).

**Author levers**
- Publish a new-cards/day recommendation derived from the exam date and a time budget.
- Explain the ~10× review multiplier from the manual.
- Ship a backlog-recovery page.
- Size decks and subdecks so that a "core" subset exists.

### 2.2 "Ease hell" under SM-2

**The manual [P]**
- "repeatedly failing a card after it has graduated from the learning phase could reduce its ease a lot, leading to what some people called 'ease hell'. This is not a problem that FSRS suffers from."
- It also warns that FSRS "can adapt to almost any habit, except for one: pressing 'Hard' instead of 'Again' when you forget", because "Hard" is treated as a successful recall.

**Community [C]**
- r/Anki has many posts on ease hell and on add-ons to fight it, such as "Straight Reward" (`reddit_ease_hell.txt`).
- One six-year user "only ever read any guides in the last few days. Just learned of the concept 'ease hell'" (2021).

**Author levers**
- Recommend FSRS with the default 90% desired retention. The manual says: "Above 90% the workload increases very quickly, and above 97% the workload can be overwhelming."
- Teach one grading rule: forgot means "Again".

### 2.3 Leeches

**The manual [P]** (`anki_manual_leeches.md`)
- Leeches "take up a lot more of your time". By default, at 8 lapses Anki tags the note as a leech and suspends it.
- "The most efficient method to deal with leeches is to change how the information is presented. Maybe your cards have too much information, or you're trying to memorize something without fully understanding it."
- Some leeches come from "interference" between similar items.

**Author lever.** Leeches are partly a deck-quality problem. Keep cards atomic, and add disambiguation cards for easily confused pairs. Collect leech reports from users, for example through a feedback link, and rewrite those cards first.

### 2.4 Boredom, effort and delayed payoff

- **[E] meta.** A meta-analysis of 170 studies (4,670 subjects) found "a strong positive association between mental effort and negative affect". The authors conclude "mental effort is inherently aversive" (David, Vassena & Bijleveld 2024, `pm_unpleasant_thinking.txt`).
- **[C] "Why Anki will never be popular…" (2024).** The post argues that effortful recall, repetition and delayed gratification make Anki effective *and* hard to stick with.
- **[C] "20 reasons why Anki isn't popular" (2025).** Among the listed reasons: cramming can outperform spaced repetition "for short timeframes like 1-3 days"; "you can't pause forgetting"; the difference between recognition and recall.
- **[C] "I've had an epiphany with Anki: It's not supposed to be fun" (2025).** "The novelty provided a temporary boost in motivation. But the novelty always wore off." The add-ons tried included leaderboard and Pokémon ones.
- **[S]** In a UCF survey, 56.6% of first-year Anki users reported "multitasking with Anki during activities like exercising or eating" (Nour & Harris 2025). This is a coping pattern for tedium; its effect on learning was not measured.

**Author levers**
- Say honestly that it will feel effortful, and explain why that is the point (§3).
- Keep answers short, so each card costs little effort.
- Cut low-value cards; the manual itself recommends deleting "difficult and obscure items" that are not "important enough".

---

## 3. Metacognitive illusions: learners' beliefs versus reality

| Finding | Label | Source (raw file) |
|---|---|---|
| Of 177 college students, 84% listed rereading and 55% ranked it their #1 strategy. Only 11% (19/177) said they practised retrieval, and 1% (2/177) ranked it first. 40% reported using flashcards. | [S] | Karpicke, Butler & Roediger 2009, *Memory* 17:471–479 (`karpicke2009.txt`) |
| Karpicke et al., forced choice after reading a chapter: 57% would restudy, 18% would self-test and 21% would do something else. When rereading was allowed after the test, 42% chose testing. | [S] | same |
| Of 472 UCLA students, 80% said no teacher taught them how they study. 59% study "whatever's due soonest/overdue". 86% do not review after a course ends. | [S] | Kornell & Bjork 2007, *Psychon Bull Rev* 14:219–224 (`kornellbjork2007.txt`) |
| In the same survey, asked why they quiz themselves: 68% said "to figure out how well I have learned" and only 18% said "I learn more that way". | [S] | same |
| Once convinced they knew an answer, 64% would "put it aside". | [S] | same |
| In flashcard experiments, 56% reported using flashcards and 75% of those reported dropping cards. 58% of dropped items were dropped after a single correct recall. | [E/S] | same, reviewing Kornell & Bjork's flashcard studies |
| Being allowed to drop flashcards "had small but consistently negative effects on learning". | [E] | Kornell & Bjork 2008, *Memory* 16:125–136 (`pm_kornell_dropping.txt`) |
| "Once students can recall an item they tend to believe they have 'learned' it", so they end practice early, which "ultimately results in poor retention". | [E] | Karpicke 2009, *J Exp Psychol Gen* 138:469–486 (`pm_karpicke2009.txt`) |
| Spacing beat massing for 90% of participants, yet after the first session 72% believed massing was more effective. Spacing also beat cramming. Small flashcard stacks (massing) were worse than one large stack. | [E] | Kornell 2009, *Appl Cognit Psychol* 23:1297–1317 (`kornell2009.txt`) |
| Learning artists' styles: 78% did better with spaced study, but only 22% thought spaced study had helped them more. | [E] | Kornell & Bjork 2007, reporting Kornell & Bjork 2007a (`kornellbjork2007.txt`) |
| Judgments of learning (JOLs) are inflated because the answer is present at study but absent at test ("foresight bias"). Test experience and delayed JOLs reduce the bias. | [E] | Koriat & Bjork 2005; 2006 (`pm_koriat_bjork.txt`) |
| "Stability bias": learners predict little benefit from further study and little forgetting. | [E] | Kornell & Bjork 2009, *J Exp Psychol Gen* 138:449–468 (`pm_stability_bias.txt`) |
| Students understand the value of practising to a higher criterion but do not typically implement or understand the benefit of longer lags. | [S] | Wissman, Rawson & Pyc 2012, n = 374 (`pm_wissman.txt`) |
| Self-testing and rereading were both positively associated with grade point average. Low performers studied late at night more often, and "all students—but especially low performers—were driven by impending deadlines." | [S] | Hartwig & Dunlosky 2012, n = 324 (`pm_hartwig.txt`) |
| Students in active classrooms learned more but *felt* they learned less. The authors write that increased cognitive effort is initially taken "to signify poorer learning". | [E] | Deslauriers et al. 2019, *PNAS* 116:19251 (`pm_deslauriers.txt`) |
| Correcting the belief that blocking beats interleaving was hard. Theory-based explanation had "only modest effects". Only experience combined with theory helped a majority. | [E] | Yan, Bjork & Bjork 2016, *J Exp Psychol Gen* 145:918 (`pm_yan2016.txt`) |
| Recall tests yield larger testing benefits than recognition tests. | [E meta] | Rowland 2014, *Psychol Bull* 140:1432 (`pm_rowland.txt`) |
| Covert retrieval (thinking of the answer without producing it) benefited retention as much as overt retrieval, and more than restudy, when subjects actually retrieved. | [E] | Smith, Roediger & Karpicke 2013 (`pm_covert.txt`) |
| Practice testing and distributed practice were rated "high utility". Highlighting and rereading were among the techniques students rely on heavily. | [R] | Dunlosky et al. 2013, *PSPI* 14:4–58 (`pm_dunlosky2013.txt`) |
| In classrooms, quizzing raises achievement to a medium extent (g = 0.499; 222 studies; 48,478 students). Corrective feedback and test-format consistency moderate the effect. | [E meta] | Yang et al. 2021, *Psychol Bull* 147:399 (`pm_yang2021.txt`) |

**The flashcard "illusion of competence."** Recognising the answer on the back feels like knowing it. The Anki manual instructs users to decide on the answer *before* revealing: "By not turning the card over until you've recalled the answer, you can learn things more effectively" [P] (`anki_manual_background.md`). The Smith et al. (2013) covert-retrieval finding supports silent recall, *provided a real retrieval attempt happens* [E]. An r/Anki newcomer describes the failure mode directly: "clicking 'again' 5 times and pseudo remembering the order" (2021) [C].

**Author levers**
- **Card design.**
  - Use one prompt that demands production, not recognition.
  - Avoid prompts whose wording gives the answer away; this is the foresight-bias mechanism.
  - Avoid fixed card order; the manual warns that "Deck, then due date" ordering "makes it easier to guess the answer based on context".
- **Onboarding copy.**
  - Tell learners they must commit to an answer before flipping.
  - Warn that effort and failure are signs of learning (Deslauriers).
  - Recommend a single large shuffled deck over small stacks (Kornell 2009).
  - Warn that "I know it now" does not mean "I will know it on exam day" (Karpicke 2009; stability bias).
  - Given Yan et al., one paragraph of theory will not be enough. Pair it with an *experience*, such as a self-test on day 1 and again on day 7 so learners see their own forgetting.

---

## 4. Habit formation

- **[E/S]** Lally, van Jaarsveld, Potts & Wardle, "How are habits formed", *Eur J Soc Psychol* (Crossref: online 2009-07-16; journal issue 2010; `cr_10.1002_ejsp.674.json`, `oa_batch1.txt`).
  - 96 volunteers did one daily behaviour in a fixed context for 12 weeks; 82 gave enough data.
  - The time to reach 95% of the asymptote of automaticity "ranged from 18 to 254 days".
  - "Missing one opportunity to perform the behaviour did not materially affect the habit formation process."
  - "Performing the behaviour more consistently was associated with better model fit."
- **[R]** Gardner, Lally & Wardle 2012, *Br J Gen Pract* (read through a fetch tool, `webfetch_gardner2012_bjgp.txt`).
  - Automaticity "plateaued on average around 66 days".
  - "it may be helpful to tell patients to expect habit formation … to take around 10 weeks".
- **[R/E meta]** Singh et al. 2024, *Healthcare* (`pm_singh_habit.txt`).
  - 20 studies, 2,601 participants.
  - Median times to habit were 59–66 days and means 106–154 days, "with substantial individual variability (4-335 days)".
  - Morning practices and self-selected habits generally showed greater habit strength.
  - Most studies had high risk of bias.
- **[E meta]** Gollwitzer & Sheeran 2006, *Adv Exp Soc Psychol* 38 (abstract on the Konstanz repository, `gollwitzer2006_kops_abstract.txt`).
  - Across 94 independent tests, implementation intentions ("If situation Y is encountered, then I will initiate goal-directed behavior X!") had "a positive effect of medium-to-large magnitude (d = .65) on goal attainment".
- **[C]** Community advice converges on the same idea: a fixed daily time floor (e.g., "25 minutes … even on your worst days"; "first thing in the morning"; reviews during "gaps" such as queues) (`reddit_burnout.txt`, `reddit_backlog.txt`).

**Author levers**
- Onboarding should ask the learner to write an if-then plan, e.g., "After my morning coffee, I open the deck on my phone."
- Tell them to expect weeks to months before it feels automatic.
- Stress that one missed day does not reset anything, neither the habit (Lally) nor the schedule (Anki manual: "you don't have to start anew").

---

## 5. Gamification and streaks: evidence and risks

- **[E meta]** Sailer & Homner, "The Gamification of Learning: a Meta-analysis", *Educ Psychol Rev* (online 2019; `oa_batch1.txt`).
  - Cognitive outcomes: g = .49 (k = 19, N = 1,686).
  - Motivational outcomes: g = .36 (k = 16, N = 2,246).
  - Behavioural outcomes: g = .25 (k = 9, N = 951).
  - The cognitive effect held in high-rigour studies; the motivational and behavioural effects were "less stable".
- **[E meta]** Bai, Hew & Huang 2020, *Educ Res Rev*: 30 interventions, 3,202 participants, 24 studies. Hedges' g = 0.504 [0.284–0.723] in favour of gamification (`s2_bai2020.json`; the abstract text was truncated after the p-value).
- **[R]** Almeida et al. 2023, arXiv 2305.08346 (`arxiv_2305.08346_almeida2023.txt`).
  - A systematic mapping found **87 papers** reporting undesired effects of game elements.
  - "badges, leaderboards, competitions, and points are the game design elements most often reported as causing negative effects".
  - The most cited negative effects were "lack of effect, worsened performance, motivational issues".
  - "gaming the system and cheating" was also often reported.
- **[E meta]** Deci, Koestner & Ryan 1999, *Psychol Bull* 125:627 (`pm_deci1999.txt`).
  - 128 studies. Engagement-, completion- and performance-contingent rewards undermined free-choice intrinsic motivation (d = −0.40, −0.36, −0.28).
  - Positive feedback *enhanced* free-choice behaviour (d = 0.33) and interest (d = 0.31).
- **[E]** Silverman & Barasch 2023, *J Consumer Research* 49(6):1095–1117 (institution summary only).
  - Intact logged streaks increased later engagement relative to broken ones, "independent of actual past behavior".
  - The effect was amplified when people blamed themselves for the break and attenuated when they could "repair" the streak.
- **[C]**
  - Streak celebrations are common on r/Anki ("1000 day streak", "1300 Day Streak! Graduating Medical Student") (`reddit_motivation.txt`).
  - Counter-view: the "not supposed to be fun" post above.
  - One user's only remaining motivation was a Habitica XP task at a one-month streak ("How to stop the burnout machine effect?", 2025).
- **Medical-education add-on [P]:** "Retention Royale" is described as an Anki add-on made because "sustaining motivation remains challenging amid high burnout rates". This is a description, not an evaluation (Whitford et al. 2026, `pubmed_anki.txt`).

**Author levers**
- Do not build points or leaderboards into deck pages.
- If progress is shown, frame it as informational feedback (Deci: positive feedback helps), e.g., "cards mature", "domains covered".
- If streaks are mentioned, teach forgiveness and repair. For example, count "days studied this month" rather than an unbroken chain. This is inferred from Silverman & Barasch and Lally, not directly tested for flashcards.

---

## 6. Test anxiety, stress and retrieval practice

- **[E]** Smith, Floerke & Thomas 2016, *Science* 354:1046 (`pm_smith2016.txt`). After stress was induced 24 h after learning, restudy learners "demonstrated the typical stress-related memory impairment, whereas those who learned by retrieval practice were immune to the deleterious effects of stress."
- **[S]** Agarwal, D'Antonio, Roediger, McDermott & McDaniel 2014, *J Appl Res Mem Cogn* (abstract via OpenAlex, `oa_batch1.txt`). Of 1,408 middle- and high-school students in classes that used retrieval practice, "92% of students reported that retrieval practice helped them learn and 72% reported that retrieval practice made them less nervous for unit tests and exams." This is self-report without a control group.
- **[S meta]** von der Embse et al. 2018, *J Affect Disord* 227:483 (`pm_ttest_anxiety_meta.txt`).
  - 238 studies. Test anxiety was negatively related to standardised tests, entrance exams and grade point average, with magnitudes "in the small to moderate range".
  - "Perceived difficulty of the test and the high-stakes nature" were related to higher anxiety.
- **[S]** Deng, Gluckstein & Larsen 2015 (n = 72): test anxiety was a significant negative predictor of Step 1 score (B = −1.986, p < 0.001) (`pubmed_anki.txt`).
- **[S]** Spence et al. 2025 (n = 176): "Higher self-reported wellness and sleep of at least seven hours were both associated with better written exam performance (p = 0.01)." Anki use was not associated with performance.

**Author levers**
- Frame the deck as exam rehearsal that builds confidence.
- Include practice in the exam's format where our licence and sources allow; Yang 2021 lists test-format consistency as a moderator.
- In exam-week guidance, protect sleep over extra reviews. This is correlational (Spence) and should be worded that way.

---

## 7. Motivation (self-determination theory) and deadlines

- **[E/S meta]** Howard et al. 2021, *Perspect Psychol Sci* 16:1300 (`pm_howard2021.txt`). 344 samples, 223,209 participants.
  - Intrinsic motivation was related to success and well-being.
  - Identified regulation (personal value) was "particularly highly related to persistence".
  - External regulation "was not associated with performance or persistence but was associated with decreased well-being".
  - Introjected (ego) motives were linked to persistence and also to ill-being.
- **[E/S meta]** Steel 2007, *Psychol Bull* 133:65 (`pm_steel_procr.txt`). 691 correlations. Strong predictors of procrastination were "task aversiveness, task delay, self-efficacy, and impulsiveness".
- **[S]** Deadlines drive student study scheduling:
  - "driven by impending deadlines" (Hartwig & Dunlosky 2012);
  - 59% study "whatever's due soonest/overdue" (Kornell & Bjork 2007);
  - 86% don't return to material after a course (same).
- **Exam-specific.** A certification exam is a strong external and identified goal: people value the credential. The "external regulation" finding suggests framing the reason to study as *competence the learner values*, not only the pass. This is an inference, not tested for flashcard decks.

**Author levers**
- **Autonomy:** offer choice, such as subdecks by exam domain, optional "core" and "extended" tags, and user-set pace.
- **Competence:** show progress by exam blueprint domain.
- **Value:** connect cards to the job the certification is for.
- **Task aversiveness:** keep sessions short.
- **Self-efficacy:** give early wins with a small starting load.

---

## 8. Perceived usefulness versus actual learning

- **Anki-specific [S].**
  - Saudi survey (n = 306): 89.1% reported better retention as a benefit, and a majority perceived a positive link with performance. Yet regression showed no association between Anki use and CGPA (β = 0.04, 95% CI −0.08 to 0.16, p = 0.52) (Alnaser-Almusa et al. 2026).
  - Jordanian survey: 82.5% of users perceived improved performance. Users more often reported scores above 90% (21.3% vs 13.9%), but this was not significant (OR 3.93, 95% CI 0.50–31.24) (Almaabreh et al. 2026).
  - UCF survey: 87.8% believed Anki "significantly contributes to their success". The share of study time spent on Anki correlated with *perceived* success (r = 0.621); actual outcomes were not measured (Nour & Harris 2025).
  - NYU: 75% rated faculty pharmacology Anki cards useful, but test scores did not differ significantly from the prior cohort (Magro et al. 2024).
- **General [E].**
  - Active learning felt like less learning but produced more (Deslauriers 2019).
  - Spacing felt worse but was better (Kornell 2009).

**Implication.** Satisfaction ratings of our decks will not measure learning. Where possible, measure outcomes, for example pre- and post-quiz items on the deck page, and report them honestly.

---

## 9. Daily time budgets, microlearning and mobile

- **[P]** The review load is roughly 10× new cards/day at steady state (manual: 20 new cards a day gives about 200 reviews a day). Time per review varies by learner and card and is **not verified** here. The deck page should tell users to measure their own seconds per card. Easy Days lets users reduce load on chosen weekdays. The manual notes that "setting all days to 'Reduced' or 'Minimum' will result in the same workload as setting all days to 'Normal'."
- **[C] reported budgets.** 25 minutes a day as the floor; 30 minutes growing to 60; "15-20 minutes a day"; "approximately 30 minutes per day" across 8+ decks for an 8-year user (`reddit_*.txt`).
- **[R]** Monib, Qazi & Apong 2024/25, *Heliyon*: a systematic review of 40 studies on microlearning, defined as "bite-sized content … within a few seconds or minutes". It reports positive impacts on learning outcomes, as a narrative synthesis with no pooled effect (`pm_mobile_microlearning.txt`).
- **[S]** Using Anki while eating or exercising was common (56.6%, Nour & Harris 2025). There is no evidence here on its learning effect; divided attention is **not evaluated** in these sources.
- **[C]** Community advice: do reviews in daily gaps "while waiting in line … or while waiting for the kettle" (backlog guide post, 2021).

**Author levers**
- Every deck page should state the expected steady-state review count for the recommended new/day.
- Provide a simple planner: cards ÷ days available.
- Design cards to be answerable in a few seconds on a phone: short fields, no wide tables, images legible at phone width.

---

## 10. Accessibility needs relevant to card design

- **[P] WCAG 2.2 SC 1.4.3 Contrast (Minimum)** (`w3c_contrast.txt`). Text needs "a contrast ratio of at least 4.5:1", or 3:1 for large text. The thresholds are not rounded ("4.499:1 would not meet the 4.5:1 threshold").
- **[P] WCAG 2.2 SC 1.4.1 Use of Color** (`w3c_use_of_color.txt`). "Color is not used as the only visual means of conveying information".
- **[P] British Dyslexia Association style guide** (`bda_style.txt`):
  - sans-serif fonts (Arial, Verdana, Calibri, Open Sans and others);
  - 12–14 pt or "16-19 px"; line spacing around 1.5;
  - "Avoid underlining and italics … Use bold for emphasis"; avoid all-caps continuous text;
  - left-aligned, unjustified text;
  - "dark coloured text on a light (not white) background";
  - "Avoid green and red/pink" for colour-vision deficiency;
  - short sentences, plain language, and expanded abbreviations on first use;
  - the guide also aims to allow "the use of text to speech".
- **[E] Special dyslexia fonts do not help.**
  - OpenDyslexic showed "no improvement in reading rate or accuracy" versus Arial and Times New Roman, and no participant preferred it (Wery & Diliberto 2017, `pm_wery_dyslexie.txt`).
  - The Dyslexie font "neither benefits nor impedes" reading in 170 + 147 children, who preferred Arial and Times (Kuster et al. 2018, `pm_kuster_dyslexie.txt`).
  - In an eye-tracking study of 48 readers with dyslexia, sans-serif, monospaced and roman (non-italic) styles improved reading performance over serif, proportional and italic fonts (Rello & Baeza-Yates 2013, `oa_batch2.txt`).
- **[P] Anki features** (`anki_manual_templates-fields.md`, `anki_manual_templates-styling.md`).
  - Per-field text-to-speech: `{{tts en_US:Front}}`.
  - Text-to-speech for multiple fields and static text: `[anki:tts]…[/anki:tts]`.
  - Night-mode styling: `.card.nightMode`.
- Screen-reader behaviour is **not verified**.

**Author levers**
- Ship a default card template with a sans-serif font, about 16–19 px, left-aligned text, 1.5 line height, and bold rather than italics for emphasis.
- Check colour contrast at 4.5:1 or better in both light and night mode.
- Never use red versus green alone to signal meaning.
- Provide a TTS variant or instructions.
- Give images alt text or a text equivalent in the answer.

---

## 11. Exam deadlines and spacing

- **[E meta]** Cepeda et al. 2006 (`pm_cepeda2006.txt`): 839 assessments in 317 experiments. "the ISI producing maximal retention increased as retention interval increased." (ISI is the inter-study interval, the gap between study sessions.)
- **[E]** Cepeda et al. 2008 (`pm_cepeda2008.txt`): more than 1,350 people. The optimal gap as a proportion of test delay "declined from about 20 to 40% of a 1-week test delay to about 5 to 10% of a 1-year test delay".
- **[E]** Kornell 2009: spacing beat cramming (massing on the last day).
- **[P]** The Anki manual lists "cramming cards before a test" as a use of filtered decks. It warns that the "review ahead" custom study "is not appropriate for repeated use" (`anki_manual_filtered-decks.md`).
- **[C]** "For short timeframes like 1-3 days … cramming can … outperform spaced repetition" (2025 post). This is a community claim, not verified against a primary study here.

**Implication for exam-date planning (an inference).** Introduce all new cards well before the exam, so several spaced reviews fit before exam day. If an exam is weeks away, pure spaced review of the whole deck may be impossible; the deck page should say so and help prioritise.

---

## 12. Medical students' Anki use and exam scores (design and limits)

| Study | Design | n | Finding | Limits |
|---|---|---|---|---|
| Deng, Gluckstein & Larsen 2015, *Perspect Med Educ* 4:308 (erratum 2016) | Survey + Step 1 score, multivariate regression | 72 | Unique Anki cards seen predicted Step 1 (B = 5.9×10⁻⁴, p = 0.024), about +1 point per 1,700 unique cards. Firecracker cards did not. Practice questions (MCQs): +1 per 445. Test anxiety negative (B = −1.986). | Single school, self-report of card counts, correlational [S] |
| Lu, Farhat & Beck Dallaghan 2021, *Med Sci Educ* 31:1975 | Survey paired with Step 1 | 201 analysed (36.9% response) | Users 241.10 vs non-users 235.51 (d = 0.38). Consistent users about 246.9 vs "sometimes" users 236.32. | Authors: "can observe correlation but not causality"; confounders; response rate [S] (via fetch tool) |
| Wothe et al. 2023, *J Med Educ Curric Dev* | Cross-sectional survey + outcomes database | 165 | Daily use correlated with Step 1 (p = .039), not Step 2. Better sleep quality (p = .01). No difference in burnout or other wellness measures. | Cross-sectional [S] |
| Gilbert et al. 2023, *Med Sci Educ* 33:955 | Cohort (users vs non-users after training program) | 130 | Users scored 6.2–7.0% higher on course exams and 12.9% higher on the CBSE (the NBME Comprehensive Basic Science Exam). | Self-selected users [S] |
| Levy et al. 2023 | Anki data export add-on, 8-week course | 45 | Heavy and intermediate users scored higher, but the difference was not significant (p > 0.05) | Tiny subgroups (n = 5) [S] |
| Mehta et al. 2023, *Med Sci Educ* 33:1089 | Retrospective Anki log comparison | n/r in abstract | Higher scorers studied more cards and started earlier | Retrospective grouping [S] |
| Winter et al. 2025 | Stat Scraper export vs CBSE | 36 | Mature cards correlated with CBSE (p = 0.002). Above-average mature cards: 71.5% vs 60.0%. | Small n [S] |
| Spence et al. 2025 | Survey linked to 6 in-house exams | 176 | 82% used Anki; use was not associated with exam performance. Wellness and sleep of 7 h or more were associated with better written-exam scores. | Cross-sectional [S] |
| Alnaser-Almusa et al. 2026 | Survey + CGPA regression | 306 | No association (β = 0.04, p = 0.52) despite perceived benefit | Self-report [S] |
| Haughey et al. 2025 | Pre/post module tests + survey | 43–53 | No overall benefit. Benefit for extensive vs inconsistent users, and in physiology. | Small n [S] |
| Magro et al. 2024 | Faculty deck, cohort vs prior cohort | 104 | 75% found the cards useful; test scores did not differ significantly | Historical control [S] |
| Hubner et al. 2025 | Step 2 CK resource survey | 275 | Flashcard use had no significant association (Anki used by 50.3%) | Self-reported scores; AMBOSS-employed co-authors [S] |
| Durrani et al. 2024, *BMC Med Educ* | Quasi-experimental, random allocation, paediatrics | 115 | Anki group rose from 27.93 to 30.8 on 50 MCQs; control unchanged. Effect size 0.8. | Single site; control used books and lectures [E] |
| Frappa et al. 2026, *Med Sci Educ* (systematic review) | 11 studies | — | Positive association with Step 1 (4–13 points, one dose-response). In-course exams mixed. Step 2 CK: no benefit. | "evidence is largely observational" [R] |

All rows are from `pubmed_anki.txt` except Lu 2021 (`webfetch_lu2021_pmc8651966.txt`). "n/r" means not reported in the abstract.

**Honest reading**
- **Selection bias.** Consistent, early, heavy users score higher, but those users may simply be more conscientious. Deng controlled for MCAT score and grades; most studies did not.
- **Test type matters.** The benefit shows up mostly on broad, fact-heavy standardised exams (Step 1, CBSE). It shows up less on course exams or clinical-reasoning exams (Step 2 CK).
- **Why this matters to us.** Certification exams vary. The benefit likely depends on how recall-heavy the exam is. That is an inference; no certification-exam study was found.
- **Wellness.** One study found no burnout difference (Wothe). Another found wellness and sleep mattered more than tool choice (Spence). Surveys flag the time burden and burnout risk (Alnaser-Almusa; Almaabreh).

---

## 13. The learner's journey: main risks at each stage

### First day
- **Over-enthusiasm.** Importing a full deck and studying "hundreds of new cards" leads to being overwhelmed within days [P manual; C many posts].
- **Wrong mental model.**
  - Only 11% practise retrieval spontaneously (Karpicke 2009).
  - 80% improvised their study methods (Kornell & Bjork 2007).
  - Learners think one correct recall means "learned" (Karpicke 2009) and flip before recalling.
- **Grading errors.** Pressing "Hard" when they forgot, which inflates intervals under FSRS and drives down ease under SM-2 [P].
- **Complexity.** "An app that has a 200 pages manual…" [C]; unfamiliarity with the software is a main barrier [S, Alnaser-Almusa].
- **What the page should do on day 1:**
  - give one settings box (new cards/day; FSRS on at 90%);
  - state the rule to recall before flipping and to press Again when you forget;
  - help the learner write an if-then plan;
  - give a realistic time estimate.

### First week
- **Rising load.** Reviews rise as new cards come back. The review count climbs even though nothing is "wrong", and the effort feels aversive (David et al. 2024).
- **Feels unproductive.** Spacing and retrieval feel worse than rereading (Kornell 2009; Deslauriers 2019). This is the moment learners abandon the method.
- **First missed day.** The learner fears the pile. Tell them that missing a day doesn't reset the habit (Lally) or the schedule (manual), and to do reviews before any new cards.
- **First leeches.** Most likely a card-quality problem [P]. We should fix them upstream.

### Weeks 2 to exam (the long middle)
- **Habit still forming.** A plateau takes weeks to months, with 18–254 days in Lally.
- **Life disruption, then backlog, then avoidance.** For example "3000+ cards due i feel so overwhelmed" [C]. The recovery protocol is:
  - stop new cards;
  - cap reviews per day;
  - sort by relative overdueness or retrievability;
  - or use the manual's "Just Due / Over Due" filtered-deck split [P].
- **Novelty-based motivation fades** [C]. Gamified extras can backfire [R].

### Exam week
- **Stress impairs retrieval, except for well-practised material** (Smith 2016). Test anxiety hurts scores (von der Embse; Deng).
- **Temptation to cram with "review ahead".** The manual says it is "not appropriate for repeated use" [P]. Cramming new material late is less effective than spacing (Kornell 2009).
- **Sleep.** Sleep of at least 7 h was associated with better scores [S, Spence 2025].
- **What the page should do:**
  - stop new cards about N days out (set by the author per exam);
  - do due reviews only;
  - offer a filtered deck of the weakest or tagged high-yield cards;
  - protect sleep.

### After the exam
- **Most learners stop.** 86% never return to course material (Kornell & Bjork 2007). Deadline-driven study ends with the deadline (Hartwig & Dunlosky).
- **Left alone, the deck becomes review debt, which leads to guilt and deletion.**
- **What the page should do.** Offer three explicit, guilt-free options:
  - (a) *Archive*: suspend the deck.
  - (b) *Maintain*: keep the deck with 0 new cards and a low daily review cap. Reviews become sparse over time because intervals grow; the exact figure is not verified.
  - (c) *Recertification mode*: keep a small tagged subset.

---

## 14. Implications for our decks and deck pages

1. **Publish a new-cards/day recommendation with the maths.** Default to about **10–20 new cards a day** and state that steady-state reviews are roughly **10× that** (manual: 20 new gives about 200 reviews a day) [P]. Offer a planner: *new per day = cards ÷ (days until exam − buffer days)*. Warn that if this exceeds the time budget, the learner should use the "core" subset rather than raise the daily cap. The 10–20 range is [P] plus [C] (10 per day "zero burnout"; 15–20 min per day "slow & steady"); it is not a tested optimum.
2. **Ship a "core" and "extended" split (tags or subdecks) and exam-domain subdecks.** This supports autonomy and competence (Howard 2021), lets time-poor learners succeed, and gives a triage path near deadlines (Hartwig & Dunlosky; Cepeda 2008).
3. **Onboarding in five lines on every deck page:**
   - (i) Say the answer before flipping (Anki manual; Rowland 2014).
   - (ii) Forgot means Again, never Hard (FSRS docs).
   - (iii) Use FSRS at 90% desired retention; above 90% the workload rises fast (manual).
   - (iv) Write an if-then plan and a daily time floor (Gollwitzer & Sheeran d = .65; community 25-minute floor).
   - (v) Expect it to feel harder than rereading; that is how it works (Deslauriers 2019; Kornell 2009).
4. **Set honest expectations.**
   - Say "Habits take weeks to months (18–254 days in one study); missing a day is fine" (Lally).
   - Say "Flashcards help you retain facts. Evidence linking Anki use to exam scores is mostly observational and mixed" (Frappa 2026 review; Spence 2025; Alnaser-Almusa 2026).
   - Do not claim that the deck raises pass rates.
5. **Put a backlog recovery box on every deck page:**
   - stop new cards until caught up;
   - set Maximum reviews/day to a sustainable number;
   - sort by Relative overdueness (SM-2) or Ascending retrievability (FSRS);
   - or use the "Just Due / Over Due" filtered-deck method;
   - you don't have to start over.

   All of this is from the Anki manual [P], with community success reports [C].
6. **Write cards for recall, not recognition.**
   - Atomic prompts; short answers.
   - No cue that leaks the answer (foresight bias; Koriat & Bjork).
   - Disambiguation cards for confusable pairs, the common cause of "interference" leeches (manual).
   - Randomised order (manual warns against fixed order).
7. **Treat leeches as bug reports.** Offer a feedback link per note. Prioritise rewriting notes that users report as leeches (manual: "change how the information is presented").
8. **Keep cards cheap to answer on a phone** (microlearning review, [R]): answers readable in seconds, images legible at phone width, no wide tables.
9. **Accessibility defaults in our note types:**
   - sans-serif font, about 16–19 px, line height about 1.5, left-aligned;
   - bold rather than italics for emphasis;
   - no all-caps sentences;
   - contrast of at least 4.5:1 in light *and* night mode (WCAG 1.4.3);
   - no colour-only meaning (WCAG 1.4.1; the BDA guide says avoid red and green);
   - an optional TTS template (`{{tts …}}`);
   - text equivalents for images.

   Do **not** default to "dyslexia fonts" (Wery 2017; Kuster 2018).
10. **No points, badges or leaderboards on our pages.** If we show progress, use informational feedback (domains covered, cards matured) (Deci 1999: positive feedback d ≈ 0.3; Almeida 2023: badges and leaderboards most often implicated in negative effects). If we mention streaks, promote "days studied this month" and repair-friendly framing, not unbroken chains (Silverman & Barasch 2023).
11. **Exam-week guidance.**
    - Stop new cards a set number of days before the exam; the author sets this per exam, and the exact number is not established by the evidence here (Cepeda 2008 ridgeline logic).
    - Do due reviews and a filtered "weak or high-yield" session.
    - Avoid repeated "review ahead" (manual).
    - Prioritise sleep (Spence 2025, correlational).
    - Reassure the learner that practised retrieval holds up under stress (Smith 2016).
12. **After-exam guidance.** Offer an explicit exit path with archive, maintenance at 0 new and a low cap, or a recertification subset. This prevents post-exam debt and guilt from turning into deletion (Kornell & Bjork 2007: 86% don't revisit material).
13. **Beginner-friendly social proof.** Show *moderate* example workloads, not heavy medical-student numbers, which distort expectations ([C] 2025 rant post).
14. **Measure learning, not satisfaction.** Perceived usefulness is high even when outcomes don't differ (Alnaser-Almusa; Magro; Nour). Any evaluation of our decks should use objective items, such as a short pre/post quiz, and publish null results too.
15. **Tell learners what anxiety does and what helps.** Anxiety is common and hurts scores (von der Embse 2018). In one self-report survey, 72% said retrieval practice made them less nervous (Agarwal 2014). Suggest a format-matched practice test in the last weeks (Yang 2021 moderators).

---

## 15. Source index (raw files in `raw-psych/`)

- **Anki and medical-education studies:** `pubmed_anki.txt` (36 PubMed abstracts: Deng 2015; Gilbert 2023; Wothe 2023; Levy 2023; Mehta 2023; Winter 2025; Spence 2025; Alnaser-Almusa 2026; Almaabreh 2026; Nour & Harris 2025; Haughey 2025; Magro 2024; Hubner 2025; Durrani 2024; Frappa 2026; Mohamed 2025; Whitford 2026 and others); `webfetch_lu2021_pmc8651966.txt`.
- **Metacognition:** `karpicke2009.txt` (full text); `kornellbjork2007.txt` (full text); `kornell2009.txt` (full text); `pm_karpicke2009.txt`; `pm_kornell_dropping.txt`; `pm_wissman.txt`; `pm_hartwig.txt`; `pm_koriat_bjork.txt`; `pm_stability_bias.txt`; `pm_deslauriers.txt`; `pm_yan2016.txt`; `pm_rowland.txt`; `pm_covert.txt`; `pm_yang2021.txt`; `pm_dunlosky2013.txt`.
- **Spacing:** `pm_cepeda2006.txt`; `pm_cepeda2008.txt`.
- **Habits:** `cr_10.1002_ejsp.674.json`; `oa_batch1.txt` (Lally abstract); `webfetch_gardner2012_bjgp.txt`; `pm_singh_habit.txt`; `gollwitzer2006_kops_abstract.txt`.
- **Motivation and gamification:** `oa_batch1.txt` (Sailer & Homner; Agarwal 2014); `s2_bai2020.json` (Bai et al.); `arxiv_2305.08346_almeida2023.txt`; `pm_deci1999.txt`; `pm_howard2021.txt`; `pm_steel_procr.txt`; `webfetch_silverman_barasch2023.txt`; `pm_unpleasant_thinking.txt`.
- **Anxiety and stress:** `pm_smith2016.txt`; `pm_ttest_anxiety_meta.txt`.
- **Accessibility:** `w3c_contrast.txt`; `w3c_use_of_color.txt`; `bda_style.txt` / `bda_style.pdf`; `pm_wery_dyslexie.txt`; `pm_kuster_dyslexie.txt`; `oa_batch2.txt` (Rello & Baeza-Yates).
- **Microlearning:** `pm_mobile_microlearning.txt`.
- **Anki documentation:** `anki_manual_deck-options.md`; `anki_manual_leeches.md`; `anki_manual_studying.md`; `anki_manual_filtered-decks.md`; `anki_manual_background.md`; `anki_manual_getting-started.md`; `anki_manual_templates-fields.md`; `anki_manual_templates-styling.md`.
- **Community:** `reddit_burnout.txt`; `reddit_backlog.txt`; `reddit_quit_anki.txt`; `reddit_ease_hell.txt`; `reddit_motivation.txt`; `reddit_too_many_reviews.txt` (plus the `.rss` originals).
