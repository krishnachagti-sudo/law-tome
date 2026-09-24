# Card design: what the evidence says about writing flashcards

Research date: 2026-09-24. Scope: how to write the cards themselves (question format, elaboration, examples, visuals, mnemonics, difficulty, wording) for free certification-exam decks.

**Labels.** [E] = experimental study or meta-analysis. [R] = review or theory. [P] = practitioner writing.

**Method.** Every figure below was read in raw text that I fetched in this session, either with curl plus text extraction or from Crossref, Europe PMC or OpenAlex API JSON. The raw files are in `scratchpad/learning/raw-design/`, named by DOI slug (for example `10_1037_a0037559.txt`), plus author PDFs converted to text (`rowland2014.txt`, `rawson2015.txt`, `pyc2009.txt`, `dunlosky_amered2013.txt`, `wilson2019.txt`, `fraundorf2023.txt`) and the practitioner essays (`matuschak_prompts.txt`, `nielsen_ltm.txt`, `wozniak_20rules.txt`). Where I read only an abstract, the claim is limited to what the abstract says. A claim I could not check against raw text is marked **not verified**.

---

## 1. Dunlosky et al. (2013): utility ratings for 10 techniques

Source: Dunlosky, Rawson, Marsh, Nathan & Willingham, "Improving Students' Learning With Effective Learning Techniques", *Psychological Science in the Public Interest* 14(1). DOI 10.1177/1529100612453266. I read the abstract twice, once from Crossref and once from Europe PMC (PMID 26173288). [R/E: a narrative review of experimental work]

- **High utility:** practice testing and distributed practice. The abstract says they "benefit learners of different ages and abilities and have been shown to boost students' performance across many criterion tasks and even in educational contexts."
- **Moderate utility:** elaborative interrogation, self-explanation and interleaved practice. They "fell short of a high utility assessment because the evidence for their efficacy is limited". Specifically, "elaborative interrogation and self-explanation have not been adequately evaluated in educational contexts."
- **Low utility:** summarization, highlighting, the keyword mnemonic, imagery use for text learning, and rereading. On the keyword mnemonic, the abstract says it "is difficult to implement in some contexts, and it appears to benefit students for a limited number of materials and for short retention intervals."
- Dunlosky's companion summary for teachers ("Strengthening the Student Toolbox", *American Educator*, Fall 2013, https://files.eric.ed.gov/fulltext/EJ1021069.pdf) contains Table 1. Keyword mnemonic: "Somewhat helpful for learning languages, but benefits are short-lived". Imagery for text: "Benefits limited to imagery-friendly text, and needs more research". Elaborative interrogation: "generating an explanation for why an explicitly stated fact or concept is true". The same summary warns that students with no relevant knowledge "may find it difficult—if not impossible—to use elaborative interrogation". [R]

**What this means for cards.** Every card is a practice test, and the deck's scheduler provides distributed practice, so the format already uses both high-utility techniques. The rest of the design space is secondary: elaboration, imagery and mnemonics sit in the moderate or low tiers.

---

## 2. Retrieval formats: recall vs recognition, short answer vs multiple choice, free recall, cloze

### 2.1 Recall beats recognition as a practice format (meta-analytic) [E]
Rowland (2014), *Psychological Bulletin* 140(6), DOI 10.1037/a0037559. I read the abstract from Europe PMC and the full text from a PDF (`rowland2014.txt`).
- Overall testing vs restudy effect: g = 0.50, 95% CI [0.42, 0.58].
- **Initial test type.** In the "high-exposure" dataset (studies that gave feedback or had more than 75% initial test performance, k = 92), cued recall gave g = 0.72 [0.61, 0.83] and free recall g = 0.81 [0.45, 1.18]. Both were "significantly larger effects than recognition (g = 0.36, CI [0.19, 0.52])". In the full dataset the figures were cued recall 0.61, free recall 0.29 and recognition 0.29. Rowland cautions that cued recall studies used feedback more often (44% vs 11% of effect sizes).
- **Feedback:** g = 0.73 with feedback vs 0.39 without.
- **Retention interval:** g = 0.69 at 1 day or more vs 0.41 at under 1 day.
- **Initial–final test format match:** the moderator "did not detect significant heterogeneity". Matched and mismatched formats both produced reliable testing effects.
- Caution: a search-engine summary reported recognition as "g = 0.32" for *initial* tests. In the raw text, 0.32 is the *final*-test recognition figure. This is why figures here were checked against raw text.

### 2.2 Short answer vs multiple choice: mixed, and it depends on retrieval success [E]
- **Smith & Karpicke (2014).** *Memory* 22(7), DOI 10.1080/09658211.2013.831454. Four experiments, N = 372. All formats beat study-only on verbatim and inference questions at 1 week, but "there were little or no advantages of answering short-answer or hybrid format questions over multiple-choice questions in three experiments". In Experiment 4, "when retrieval success was improved under initial short-answer conditions, there was an advantage of answering short-answer or hybrid questions". The authors conclude that the results show "the importance of retrieval success".
- **McDermott et al. (2014).** *J Exp Psych: Applied* 20(1), DOI 10.1037/xap0000004. In middle and high school classes, both quiz formats with feedback helped, "multiple-choice quizzing is as effective as short-answer quizzing", and quiz format "did not need to match the format of the criterial test".
- **Kang, McDermott & Roediger (2007).** *Eur J Cog Psych* 19(4–5), DOI 10.1080/09541440601056620. Without feedback, MC beat SA. With corrective feedback, "having had an intervening SA test led to the best performance on the final test".
- **McDaniel et al. (2007).** *Eur J Cog Psych* 19(4–5), DOI 10.1080/09541440701326154. In a college course, "short answer quizzes produced more robust benefits than multiple choice quizzes" on MC criterial tests.
- **Greving & Richter (2018).** *Frontiers in Psychology*, DOI 10.3389/fpsyg.2018.02412, N = 92. In a university lecture without feedback, there was a testing effect for short-answer questions "that targeted information that participants could retrieve from memory", and "no testing effect for multiple-choice testing". The follow-up, **Greving & Richter (2022)**, *J Cog Psych* 34(5), DOI 10.1080/20445911.2022.2085281, found the SA effect "strongest for difficult practice questions" and "evidence for the absence of a testing effect for multiple-choice questions" when no feedback was given.
- **van Wijk et al. (2024).** *BMC Med Educ*, DOI 10.1186/s12909-024-06538-0, n = 45, no feedback. Very-short-answer questions (VSAQ) vs MCQ: "no main effect of practice question format". VSAQs were answered incorrectly more often, and "lower initial retrieval success … might have limited their effectiveness".
- **Sher et al. (2026).** *BMC Med Educ*, DOI 10.1186/s12909-026-09359-5. A systematic review of VSAQ vs MCQ *as assessments*. Practice-effect evidence was "mixed, with no consistent advantage for either format".
- **Adesope, Trevisan & Sundararajan (2017).** *Rev Educ Res* 87(3), DOI 10.3102/0034654316689306. The abstract says effects were "moderated by the features of practice tests". Fraundorf et al. (2023, full text, PMC10409703) report that this meta-analysis found "a significant benefit of testing over restudy for all test formats", and cite its overall g as 0.70. **Not verified:** the format-specific figures in secondary sources (MC +0.70 vs SA +0.48), because I could not reach the primary text.
- **Fraundorf et al. (2023).** *Cogn Res Princ Implic* 8, DOI 10.1186/s41235-023-00508-8. This review of testing for physicians' board certification concludes: "the specific format of a test item is likely of less importance than the presentational quality of the question (e.g., clarity, readability, and veracity of text)." [R]

### 2.3 Multiple-choice design matters: good lures help, bad lures mislead [E]
- **Little, Bjork, Bjork & Angello (2012).** *Psych Sci* 23(11), DOI 10.1177/0956797612443370. When alternatives are "plausible enough", MC tests "can indeed trigger productive retrieval processes". They also "facilitated recall of information pertaining to incorrect alternatives, whereas cued-recall tests did not."
- **Roediger & Marsh (2005).** *JEP:LMC* 31(5), DOI 10.1037/0278-7393.31.5.1155. "Prior reading of a greater number of multiple-choice lures decreased the positive testing effect and increased production of multiple-choice lures as incorrect answers on the final test. Multiple-choice testing may inadvertently lead to the creation of false knowledge."

### 2.4 Free recall vs short answer (targeted) [E]
**Endres, Kranzdorf, Schneider & Renkl (2020).** *Instructional Science* 48(6), DOI 10.1007/s11251-020-09526-1, N = 54, within-subject. "Short-answer tasks led to increased retention of directly retrieved targeted information", whereas "free-recall tasks led to better retention of further information". Short-answer tasks "improved metacognitive calibration", and free recall "increased self-efficacy and situational interest".

### 2.5 Cloze (fill-in-the-blank)
- Fraundorf et al. (2023) class fill-in-the-blank as a **cued recall** task, which is the family with the largest effects in Rowland. [R]
- McDaniel et al. (2007), as reported by Fraundorf et al. (2023), used fill-in-the-blank quizzes in a neuroscience course. Practice "benefited subsequent exam performance even when students were tested on a different piece of information from the same statement". [R, reporting E]
- **Evidence gap:** I did not find a controlled head-to-head experiment of cloze cards vs Q/A cards in spaced-repetition flashcards. A Europe PMC search did not surface one. The claim that "cloze is as good as Q/A" is therefore **not verified**.
- Practitioner concern about cloze. Matuschak: "Cloze deletions seem particularly susceptible to this problem [pattern matching], especially when created by copying and editing passages from texts." [P] Wozniak recommends cloze for beginners who find the minimum information principle hard: "Cloze deletion is easy and effective". [P]

### 2.6 Harder cues produce more durable learning, if retrieval succeeds [E]
- **Carpenter & DeLosh (2006).** *Mem Cogn* 34(2), DOI 10.3758/BF03193405. "Fewer retrieval cues were associated with better memory on the final test." A matched intervening and final test format did not enhance retention.
- **Carpenter (2009).** *JEP:LMC* 35(6), DOI 10.1037/a0017021. Items recalled from weak cues "were retained better over time" than items recalled from strong cues.

---

## 3. The generation effect [E]
- **Slamecka & Graf (1978).** *JEP: Human Learning and Memory* 4(6), DOI 10.1037/0278-7393.4.6.592 (abstract via OpenAlex). Five experiments; "performance in the generate condition was superior to that in the read condition", across recognition, free and cued recall.
- **Bertsch, Pesta, Wiscott & McDaniel (2007).** *Mem Cogn* 35(2), DOI 10.3758/BF03193441. 445 effect sizes over 86 studies; mean effect ".40—a benefit of almost half a standard deviation". The variability due to moderators "was substantial".
- **McCurdy et al. (2020).** *Psychon Bull Rev* 27(6), DOI 10.3758/s13423-020-01762-3. 126 articles, 310 experiments, 1,653 estimates. "Generation constraint significantly moderates the magnitude of the generation effect." (The direction is not stated in the abstract, so it is **not verified** here.)

**What this means for cards.** Making the learner produce the answer is the mechanism. Showing the answer for them to read is not.

---

## 4. Difficulty, success rate, and the "85% rule"
- **Pyc & Rawson (2009).** *J Mem Lang* 60(4), DOI 10.1016/j.jml.2009.01.004 (author PDF, `pyc2009.txt`). "As the difficulty of retrieval during practice increased, final test performance increased", tested under conditions where retrieval *succeeded*. They also found "as criterion level increased, retrieval was less difficult, and diminishing returns for final test performance were observed." [E]
- **Retrieval success matters.** See Smith & Karpicke Experiment 4 and van Wijk et al. above. In Rowland, the high-exposure set (feedback, or more than 75% initial success) showed larger effects. [E]
- **Wilson, Shenhav, Straccia & Cohen (2019), "The Eighty Five Percent Rule".** *Nat Commun* 10, DOI 10.1038/s41467-019-12552-4; full text PMC6831579. [R: theory and simulation, not a human learning experiment]
  - The result is derived for "binary classification tasks" and "stochastic gradient-descent based learning algorithms". The optimal error is 15.87% under Gaussian noise. The authors say it "remains to be generalized to a broader class of circumstances, such as multi-choice tasks and different learning algorithms". They also note that "not all models will exhibit a sweet spot", and give the example of "a Bayesian learner with a perfect memory".
  - The simulations use neural networks and a perceptual-learning model. There is no human memory or flashcard data.
  - **Conclusion:** the paper gives no direct support for an 85% target for recall of exam facts. Treat that figure as an analogy only.
- **Practitioner defaults.** Matuschak: "SuperMemo's algorithms (also used by most other major systems) are tuned for 90% accuracy." He adds that prompts should be "tractable … which you can almost always answer correctly" and "effortful … You shouldn't be able to trivially infer the answer." [P]

**What this means for cards.** Aim for cards that are hard to retrieve but are usually answered correctly. If a card keeps failing, rewrite or split it. Do not settle it by making it trivially easy.

---

## 5. Wording precision, atomicity, interference and cue overload
- **Retrieval-induced forgetting.** Murayama, Miyatsu, Buchli & Storm (2014), *Psych Bull* 140(5), DOI 10.1037/a0037505. "Retrieving a subset of items can cause the forgetting of other items". The meta-analysis "largely supported inhibition accounts". [E] Matuschak ties this to prompt consistency: prompts "should produce consistent answers … Otherwise, you may run afoul of … 'retrieval-induced forgetting'". [P]
- **Cue overload.** Watkins & Watkins (1975), "Buildup of proactive inhibition as a cue-overload effect", *JEP:HLM* 1(4), DOI 10.1037/0278-7393.1.4.442. Title and metadata only; **abstract not retrieved, so findings are not verified.**
- **Interference among similar items.** Wozniak (SuperMemo, "Effective learning: Twenty rules of formulating knowledge", 1999, https://www.supermemo.com/en/blog/twenty-rules-of-formulating-knowledge) [P]:
  - "Interference is probably the single greatest cause of forgetting in collections of an experienced user".
  - His examples include "optimum dosages of drugs", which is close to our "numbers/thresholds" knowledge type.
  - Remedies: "stick to the minimum information principle" and "eliminate interference as soon as you spot it".
  - "Context cues simplify wording": a prefix such as "bioch:" prevents confusing GRE with the Graduate Record Examination.
- **Atomicity** [P]:
  - Nielsen ("Augmenting Long-term Memory", http://augmentingcognition.com/ltm.html): "Make most Anki questions and answers as atomic as possible: That is, both the question and answer express just one idea." Breaking one `ln -s` card into two "turned a question I routinely got wrong into two questions I routinely got right".
  - Matuschak ("How to write good prompts", https://andymatuschak.org/prompts/): prompts should be "focused … It's usually best to focus on one detail at a time" and "precise … Vague questions will elicit vague answers". Also: "When you write coarser prompts in smaller quantity, you're not reducing the amount you have to learn. You're just making the material harder to review."
- **Sets and lists** [P]:
  - Wozniak: "Avoid sets", and convert them to enumerations. For enumerations, use "overlapping cloze deletions".
  - Matuschak: keep list order fixed so you learn its "shape". Software should ask "only … one blank" per review so that one variant does not "give away" another.
- **Binary prompts** [P]. Matuschak: "Avoid binary prompts. Questions which ask for a yes/no or this/that answer tend to require little effort and produce shallow understanding."
- **General phrasing** [P]. Matuschak: "general knowledge should be expressed generally, so long as you can avoid ambiguity."

---

## 6. Elaboration on the card: explanations, "why" prompts, variants
- **Explanation feedback beats answer-only feedback for transfer.** Butler, Godbole & Marsh (2013), *J Educ Psych* 105(2), DOI 10.1037/a0031026. "Correct answer feedback and explanation feedback led to equivalent performance on the repeated questions, but explanation feedback produced superior performance on the new inference questions." [E]
- **Elaborative interrogation and self-explanation.** Rated moderate utility by Dunlosky et al. (§1). They need prior knowledge. [R]
- **Learning from errors.** Metcalfe (2017), *Annu Rev Psychol* 68, DOI 10.1146/annurev-psych-010416-044022. "Errorful learning followed by corrective feedback is beneficial". "Errors committed with high confidence are corrected more readily". "Corrective feedback, including analysis of the reasoning leading up to the mistake, is crucial." [R]
- **Multiple angles on one fact** [P]:
  - Nielsen: "use multiple variants of the 'same' question", for example claim→source and source→claim.
  - Matuschak's conceptual "lenses": "Attributes and tendencies", "Similarities and differences", "Parts and wholes", "Causes and effects", "Significance and implications".
- **Personal and vivid examples** [P]. Wozniak: "Personalized examples are very resistant to interference". He reports a case where "an item without an example was forgotten 20 times within one year, while the same item with a subtle interference-busting example was not forgotten even once". This is an anecdote, not a controlled study.

---

## 7. Concrete examples for concept learning [E]
**Rawson, Thomas & Jacoby (2015).** *Educ Psychol Rev* 27(3), DOI 10.1007/s10648-014-9273-3, published online 2014. Full text from an author-hosted PDF (https://www.larryjacoby.ca/images/Rawson2015.pdf).
- Studying definitions followed by illustrative examples, vs extra study of definitions only, improved classification of studied *and novel* examples, "ds from 0.74 to 1.67". This appears in both the abstract and the General Discussion.
- Examples before vs after definitions made little difference: "performance was similar".
- **Interleaving × definitions (Experiment 2).** "When definitions were not presented, an advantage of interleaving over blocking emerged … However, no interleaving effect emerged when definitions were present." The authors warn that "presenting illustrative examples in blocked fashion would substantially attenuate the benefits of examples unless the definitions are also available."
- **Cost to definition recall.** Recall was lower with examples in Experiment 1a (d = 0.50), but not in Experiment 1b (d = 0.04) or Experiment 2.

**What this means for cards.** For declarative concepts, add example→concept classification cards, using several distinct examples per concept, including novel ones. Keep a definition card as well.

---

## 8. Worked examples [E/R]
- **Sweller & Cooper (1985).** *Cognition and Instruction* 2(1), DOI 10.1207/s1532690xci0201_3. Worked examples "require considerably less time to process than conventional problems", and later similar problems "were solved more rapidly" with fewer errors. However, "both of these findings were specific to problems identical in structure to the initial ones." [E]
- **Atkinson, Derry, Renkl & Wortham (2000).** *Rev Educ Res*, DOI 10.3102/00346543070002181 (abstract via OpenAlex). Recommends "multiple examples for each conceptual problem type" and varying "example formats within problem type". Learners "can be encouraged … to actively self-explain examples". Worked examples "are associated with early stages of skill development". [R]
- **Kalyuga, Ayres, Chandler & Sweller (2003), "The Expertise Reversal Effect".** *Educ Psychol* 38(1), DOI 10.1207/S15326985EP3801_4. Techniques "highly effective with inexperienced learners can lose their effectiveness and even have negative consequences when used with more experienced learners." [R]
- **Pan & Rickard (2018).** Transfer from testing is "weakest … to problems involving worked examples" (see §11). [E]
- Barbieri et al. (2023), a worked-examples meta-analysis in mathematics (DOI 10.1007/s10648-023-09745-1), and Bisra et al. (2018), a self-explanation meta-analysis (DOI 10.1007/s10648-018-9434-x). Abstracts not retrievable, so **not verified; I use no figures from them.**

**What this means for cards.** A flashcard is a weak container for full worked problems. Use cards for the *decision points* of a procedure ("what is the next step when X?") and for which procedure applies to which problem type. Leave whole-problem practice to question banks.

---

## 9. Visuals: dual coding, multimedia principles, seductive details
- **Dual coding theory.** Paivio (1991), *Can J Psychol* 45(3), DOI 10.1037/h0084295, and Clark & Paivio (1991), *Educ Psychol Rev* 3(3), DOI 10.1007/BF01320076. Metadata only. **Abstracts not retrieved, so I state no claims from them** beyond that the theory exists. [R]
- **Mayer (2008).** *Am Psychol* 63(8), DOI 10.1037/0003-066X.63.8.760. The abstract says the work yields "10 principles of multimedia instructional design that are grounded in theory and based on evidence". The principles are not listed in the abstract, so I cite none individually from it. [R]
- **Noetel et al. (2021/2022), meta-meta-analysis.** *Rev Educ Res* 92(3), DOI 10.3102/00346543211052329. 29 reviews, 1,189 studies, 78,177 participants.
  - "The largest benefits were for captioning second-language videos, temporal/spatial contiguity, and signaling."
  - There was "robust evidence for … coherence/removing seductive details … segmentation … verbal redundancy effects".
  - "Good design was more important for more complex materials, and in system-paced environments … than self-paced ones". Flashcards are self-paced, so expect smaller design effects.
  - [E, meta-meta]
- **Seductive details.** Sundararajan & Adesope (2020), *Educ Psychol Rev* 32(3), DOI 10.1007/s10648-020-09522-4, abstract via EBSCO: "including seductive details in learning material can hinder learning". Moderators include "image type used in comparison". **Not verified:** the pooled effect sizes that secondary sources give (g ≈ −0.16), because they were not present in the raw text I could access. Rey (2012), DOI 10.1016/j.edurev.2012.05.003, and Cheng et al. (2026), DOI 10.1007/s10648-025-10099-z: abstracts not retrieved. [E]
- **Simplified diagrams.** Butcher (2006), *J Educ Psych* 98(1), DOI 10.1037/0022-0663.98.1.182. "Simplified diagrams best supported factual learning" and "most strongly supported information integration". [E]
- **Pictures on vocabulary cards can backfire through overconfidence.** Carpenter & Olson (2012), *JEP:LMC* 38(1), DOI 10.1037/a0024828. "Swahili words were not learned better from pictures than from English translations (Experiments 1-3)." Learners showed "greater overconfidence" with pictures. Only when overconfidence was removed, by retrieval practice or a warning, were words "learned better from pictures". [E]
- **Practitioner view** [P]. Wozniak: "Graphic deletion is as good as cloze deletion" (image occlusion). Matching this, his rule "Use imagery" notes "it takes much less time to formulate a simple question-and-answer pair than to find or produce a neat graphic image."

**What this means for cards.** Add an image only when the image *is* the knowledge (diagram, topology, anatomy, UI, waveform). Use simple, labelled images, and test them with occlusion so the learner must retrieve. Never add decorative images.

---

## 10. Mnemonics, especially the keyword method
- Dunlosky et al.: low utility; benefits seen "for a limited number of materials and for short retention intervals". [R]
- **Wang, Thomas & Ouellette (1992).** *J Educ Psych* 84(4), DOI 10.1037/0022-0663.84.4.520. With retention interval between subjects, "long-term forgetting was greater for learners instructed to use the keyword mnemonic than for learners engaged in rote rehearsal." [E]
- **Wang & Thomas (1995).** *J Educ Psych* 87(3), DOI 10.1037/0022-0663.87.3.468. The keyword method was superior immediately, but "after 2 days, there was a marked reversal". "Keyword-based memories are especially fragile over time and will benefit from repeated testing and rehearsal." [E]
- Wozniak: mnemonic techniques are needed "in only 1-5% of your items" (his estimate, not data). [P]

**What this means for cards.** A mnemonic can go on the *back* of a card as an optional hook for a stubborn item. Never let it replace retrieval of the actual content. Spaced review is what makes it last.

---

## 11. Transfer, application and scenario questions [E]
- **Butler (2010).** *JEP:LMC* 36(5), DOI 10.1037/a0019902. "Repeated testing produced superior retention and transfer" to new inferential questions, including in other knowledge domains.
- **Pan & Rickard (2018).** *Psych Bull* 144(7), DOI 10.1037/bul0000151. 192 transfer effect sizes, 122 experiments, N = 10,382; transfer d = 0.40 [0.31, 0.50].
  - Transfer is greatest "across test formats, to application and inference questions, to problems involving medical diagnoses".
  - It is weakest "to rearranged stimulus-response items, to untested materials seen during initial study, and to problems involving worked examples".
  - "Response congruency and elaborated retrieval practice, as well as initial test performance, strongly influence the likelihood of positive transfer." After bias correction, the intercepts often indicated "no positive transfer when none of the aforementioned moderators are present."
- **Agarwal (2019).** *J Educ Psych* 111(2), DOI 10.1037/edu0000282. "Higher order and mixed quizzes improved higher order test performance, but fact quizzes did not."
- **Yang et al. (2021).** *Psych Bull* 147(4), DOI 10.1037/bul0000309. Classroom meta-analysis of 222 studies and 48,478 students; g = 0.499. The effect is modulated by "test format consistency, material matching, provision of corrective feedback, number of test repetitions".
- **Fraundorf et al. (2023)** [R] cite meta-analytic evidence that testing benefits "complex problem-solving tasks and other types of high-level conceptual knowledge". They also cite classification learning (for example, bird families from photos) as "somewhat analogous to diagnosing".

**What this means for cards.** Definition cards will not, on their own, produce exam-style application. Include scenario→concept or scenario→action cards, and mixed fact-plus-application sets.

---

## 12. Distinguishing similar concepts: interleaving and contrast [E]
- **Brunmair & Richter (2019).** *Psych Bull* 145(11), DOI 10.1037/bul0000209. 59 studies; overall interleaving g = 0.42. The effect was stronger when material is "more similar between categories" and "less similar within categories". For words, blocking was better (g = −0.39). The authors advise caution "for expository texts and words".
- **Kornell & Bjork (2008).** *Psych Sci* 19(6), DOI 10.1111/j.1467-9280.2008.02127.x. Interleaving painters' works improved induction, yet "participants rated massing as more effective than spacing".
- **Rawson et al. (2015), Experiment 2.** Interleaving helped only when definitions were absent (§7).

**What this means for cards.** For look-alike concepts, write explicit discrimination cards ("X vs Y: which applies when …?" or "What distinguishes X from Y?") and example-classification cards that mix the confusable categories. Shuffled review provides the interleaving.

---

## 13. Pretesting and prequestions (errorful generation) [E]
- **Richland, Kornell & Kao (2009).** *JEP:Applied* 15(3), DOI 10.1037/a0016496. Post-test performance was better after pretests "even though only items that were not successfully retrieved on the pretest were analyzed."
- **Kornell, Hays & Bjork (2009).** *JEP:LMC* 35(4), DOI 10.1037/a0015729. "Unsuccessful retrieval attempts enhanced learning".
- **Pan & Sana (2021).** *JEP:Applied* 27(2), DOI 10.1037/xap0000345. Five experiments, n = 1,573. "Pretesting yielded higher overall scores" than posttesting, and this held across MC and cued-recall formats, with or without feedback, and at 5 minutes or 48 hours.
- **Pan & Carpenter (2023).** *Educ Psychol Rev* 35(4), DOI 10.1007/s10648-023-09814-5. The benefit arises "if there is an opportunity to study the correct answers afterwards"; "the extent of that enhancement may vary". [R]

**What this means for cards.** Showing a new card as a question *before* the learner has studied the answer is supported, provided the answer and explanation are shown immediately. First-exposure failure is not a design flaw.

---

## 14. Practitioner guidance, quoted [P]

**Andy Matuschak, "How to write good prompts: using spaced repetition to create understanding"** (https://andymatuschak.org/prompts/):
- Five properties: prompts should be "focused", "precise", "consistent", "tractable" and "effortful".
- "Achieving these properties is mostly about writing tightly-scoped questions."
- On procedures: "a few keywords (or word groups) carry the critical details of the procedure … The other words are just a skeleton."
- On wordy prompts: "wordy prompts like these tend to dull my concentration and produce vague, distracted answers."
- On creative/application prompts: "much less well understood than the retrieval-focused prompts".
- "Discourage pattern matching … keeping questions short and simple."

**Michael Nielsen, "Augmenting Long-term Memory"** (http://augmentingcognition.com/ltm.html):
- On atomicity (see §5), and "Avoid orphan questions … too disconnected from my other interests".
- **A relevant counterpoint for a shared-deck project:** "Construct your own decks: The Anki site has many shared decks, but I've found only a little use for them. The most important reason is that making Anki cards is an act of understanding in itself." He has "found value in shared decks containing very elementary questions … But for deeper kinds of understanding, I've not yet found good ways of using shared decks."

**Piotr Wozniak, "Twenty rules of formulating knowledge"** (1999, supermemo.com):
- "Do not learn if you do not understand".
- "Stick to the minimum information principle".
- "Avoid sets", "Avoid enumerations", "Combat interference", "Optimize wording".
- "Provide sources", "Provide date stamping".

---

## 15. Knowledge type → best-supported card format → evidence strength

| Knowledge type | Best-supported card format | Key evidence | Strength |
|---|---|---|---|
| **Isolated facts** (term, acronym, port, owner) | Atomic short-answer / cued-recall Q→A (one fact, one answer). Reverse-direction variants where both directions matter. Context prefix to prevent confusions | Rowland 2014 (recall > recognition); Carpenter & DeLosh 2006; Nielsen/Matuschak/Wozniak atomicity | **Strong** that recall beats recognition. Atomicity is practitioner-only [P] |
| **Concepts / definitions** | Two card types: (a) term→definition-in-own-words or definition→term; (b) **example→which concept?** classification using several varied examples, including novel ones. Explanation on the back | Rawson et al. 2015 (ds 0.74–1.67 for classification); Butler et al. 2013 (explanation feedback → inference transfer) | **Moderate–strong** (lab, three experiments; one meta-analytic basis for feedback) |
| **Distinctions between similar concepts** | Explicit contrast cards ("What distinguishes X from Y?" / "Scenario: X or Y? Why?") mixed with example-classification across the confusable set. Avoid binary yes/no without "why" | Brunmair & Richter 2019 (interleaving g = 0.42, stronger when categories are similar); Kornell & Bjork 2008; Rawson Exp 2; Wozniak on interference [P]; Matuschak on binary prompts [P] | **Moderate** (meta-analysis on interleaving; the contrast-card format itself is [P]) |
| **Procedures / steps** | One card per decision point or key step ("After X, what next?", "What must be true before Y?"). Overlapping cloze for fixed-order sequences. Keyword Q&A for the load-bearing verbs and parameters. Full problem practice outside the deck | Matuschak on procedures [P]; Wozniak overlapping cloze [P]; Sweller & Cooper 1985 and Pan & Rickard 2018 (weak transfer to worked-example problems) | **Weak–moderate**. No flashcard-specific experiment found |
| **Numbers / thresholds / limits** | Single number per card, with the unit and the condition in the question; sibling numbers on separate cards with discriminating context; the "why" or the consequence on the back. Mnemonic on the back only if the item keeps failing | Wozniak on interference, including drug dosages [P]; Wang & Thomas 1992/1995 (keyword fragility); Carpenter 2009 | **Weak** (mostly practitioner). No direct experiments on threshold cards found |
| **Scenario judgement** (exam-style application) | Short vignette → "which concept / what action / why", with explanation feedback. Practise mixed with fact cards. Optionally MC-style cards with plausible distractors, each distractor explained | Agarwal 2019 (higher-order quizzes needed for higher-order tests); Pan & Rickard 2018; Butler 2010; Butler et al. 2013; Little et al. 2012; Roediger & Marsh 2005 (lure risk) | **Moderate–strong** (meta-analysis plus several experiments) |
| **Visual/spatial knowledge** (diagrams, topologies, UIs) | Image occlusion on a simplified, labelled diagram. No decorative images | Butcher 2006; Noetel 2022 (coherence); Sundararajan & Adesope 2020 (direction only); Carpenter & Olson 2012 (overconfidence); Wozniak graphic deletion [P] | **Moderate** that decoration should be avoided; **weak** for the occlusion format itself |
| **Lists / sets** | Convert sets to ordered enumerations; overlapping cloze, one blank per review. Split into small groups; add "why is X on the list" cards | Wozniak [P]; Matuschak [P] | **Weak** (practitioner only) |

---

## 16. Implications for our card standard

1. **Every card must require production (recall), not recognition.** Default to short-answer / cued recall. Evidence: Rowland 2014, high-exposure set, recognition g = 0.36 vs cued recall 0.72 and free recall 0.81; Slamecka & Graf 1978; Bertsch et al. 2007 (generation ≈ 0.40 SD).
2. **One idea per card, with a precise and unambiguous expected answer.** Evidence: [P] Nielsen, Matuschak, Wozniak. Support is indirect: retrieval-induced forgetting (Murayama et al. 2014) makes inconsistent answers costly. Fraundorf et al. 2023 judge item clarity more important than item format.
3. **Target "hard but usually successful" retrieval.** Split or add cues to cards that keep failing, rather than making them trivial. Evidence: Pyc & Rawson 2009; Smith & Karpicke 2014 Exp 4; van Wijk et al. 2024; Carpenter & DeLosh 2006. **Do not cite the "85% rule" as evidence for a flashcard success target.** Wilson et al. 2019 derive it for binary classification with gradient-descent learners and state that it is not generalised to multi-choice tasks.
4. **Put an explanation on the back of every card** (why the answer is true, or why the nearest wrong answer is wrong), not just the bare answer. Evidence: Butler et al. 2013 (transfer to inference questions); Metcalfe 2017; Rowland 2014 (feedback g = 0.73 vs 0.39).
5. **Give every declarative concept at least one example→concept classification card**, with varied and ideally novel examples, alongside the definition card. Evidence: Rawson et al. 2015.
6. **Write explicit discrimination cards for confusable pairs** and rely on shuffled, mixed review. Evidence: Brunmair & Richter 2019 (larger effects when categories are similar); Kornell & Bjork 2008; Wozniak on interference [P].
7. **Include exam-style scenario cards in every domain**, mixed with fact cards. Fact cards alone do not reliably transfer to application. Evidence: Agarwal 2019; Pan & Rickard 2018; Butler 2010.
8. **If a card uses multiple choice, every distractor must be plausible and must be explained on the back.** Use MC sparingly, never as the only format for a fact. Evidence: Little et al. 2012; Roediger & Marsh 2005 (lures can create false knowledge); Greving & Richter 2018/2022 (no MC testing effect without feedback).
9. **Use cloze for fixed wording and ordered sequences, one blank per card.** Cloze deletions must not be copied verbatim from source passages, and no card may give away its sibling's answer. Evidence: cloze counts as cued recall (Fraundorf 2023; Rowland 2014). Pattern-matching and give-away risks are [P] (Matuschak, Wozniak). Controlled cloze-vs-Q/A flashcard comparisons were **not found**.
10. **Images only when the image is the content.** Use simplified and labelled images, preferably tested by occlusion. No decorative images. Evidence: Noetel et al. 2022 (coherence); Sundararajan & Adesope 2020; Butcher 2006; Carpenter & Olson 2012 (pictures breed overconfidence).
11. **Mnemonics are optional back-of-card aids for chronically failed items** and never replace retrieval of the real content. Evidence: Dunlosky et al. 2013 (low utility, short retention); Wang & Thomas 1995 (reversal after 2 days); Wang et al. 1992.
12. **Put numbers and thresholds on their own cards, with units and conditions stated.** Separate sibling values by context, and include the consequence or rationale. Evidence: practitioner only (Wozniak) [P]; flagged as an evidence gap.
13. **Procedures become decision-point cards, not "list all steps" cards.** Whole-problem practice is out of scope for the deck. Evidence: Matuschak [P]; Pan & Rickard 2018 (weak transfer to worked-example problems); Sweller & Cooper 1985 (structure-specific gains).
14. **New cards may be shown as a question first** (pretest), with the full answer and explanation immediately after. Evidence: Richland et al. 2009; Kornell et al. 2009; Pan & Sana 2021; Pan & Carpenter 2023.
15. **Each card carries a source and an "as-of" date** (exam blueprint version). Evidence: Wozniak rules 18–19 [P]; Nielsen's source-attribution variants [P].
16. **Accept Nielsen's caveat and design for it.** Learners lose some of the benefit of writing their own cards. Counter this by making the explanations rich and encouraging learners to edit or add personal examples. This is a design choice. The size of the loss from pre-made cards is **not measured** in anything I read.

---

## 17. Not verified or gaps
- Adesope et al. 2017 format-specific effect sizes (MC vs SA), because the primary text was not accessible.
- Sundararajan & Adesope 2020 pooled g values. Rey 2012 figures. Cheng et al. 2026 figures.
- Content of Paivio 1991 and Clark & Paivio 1991; Watkins & Watkins 1975 findings; Barbieri et al. 2023 and Bisra et al. 2018 figures.
- The direction of generation constraint in McCurdy et al. 2020.
- No controlled experiment found comparing cloze vs Q/A flashcards, or on how to format numeric/threshold cards.
- No human flashcard evidence found for a specific optimal success rate.

## Sources (DOIs resolved at api.crossref.org; raw files in raw-design/)
10.1177/1529100612453266 · 10.1037/a0037559 · 10.3102/0034654316689306 · 10.1037/bul0000309 · 10.1037/bul0000151 · 10.1080/09658211.2013.831454 · 10.1037/xap0000004 · 10.1080/09541440601056620 · 10.1080/09541440701326154 · 10.3389/fpsyg.2018.02412 · 10.1080/20445911.2022.2085281 · 10.1186/s12909-024-06538-0 · 10.1186/s12909-026-09359-5 · 10.1186/s41235-023-00508-8 · 10.1177/0956797612443370 · 10.1037/0278-7393.31.5.1155 · 10.1007/s11251-020-09526-1 · 10.3758/BF03193405 · 10.1037/a0017021 · 10.1037/0278-7393.4.6.592 · 10.3758/BF03193441 · 10.3758/s13423-020-01762-3 · 10.1016/j.jml.2009.01.004 · 10.1038/s41467-019-12552-4 · 10.1037/a0037505 · 10.1037/0278-7393.1.4.442 · 10.1037/a0031026 · 10.1146/annurev-psych-010416-044022 · 10.1007/s10648-014-9273-3 · 10.1207/s1532690xci0201_3 · 10.3102/00346543070002181 · 10.1207/S15326985EP3801_4 · 10.1007/s10648-023-09745-1 · 10.1037/h0084295 · 10.1007/BF01320076 · 10.1037/0003-066X.63.8.760 · 10.3102/00346543211052329 · 10.1007/s10648-020-09522-4 · 10.1016/j.edurev.2012.05.003 · 10.1007/s10648-025-10099-z · 10.1037/0022-0663.98.1.182 · 10.1037/a0024828 · 10.1037/0022-0663.84.4.520 · 10.1037/0022-0663.87.3.468 · 10.1037/a0019902 · 10.1037/edu0000282 · 10.1037/bul0000209 · 10.1111/j.1467-9280.2008.02127.x · 10.1037/a0016496 · 10.1037/a0015729 · 10.1037/xap0000345 · 10.1007/s10648-023-09814-5 · 10.1007/s10648-018-9434-x
Practitioner: https://andymatuschak.org/prompts/ · http://augmentingcognition.com/ltm.html · https://www.supermemo.com/en/blog/twenty-rules-of-formulating-knowledge · https://files.eric.ed.gov/fulltext/EJ1021069.pdf
