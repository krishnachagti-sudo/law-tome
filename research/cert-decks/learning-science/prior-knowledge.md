# Prior knowledge, sequencing and the premade-deck problem

Research brief for the cert-decks card standard (draft 2). Written 24 September 2026.
Raw texts: `scratchpad/learning/raw-prior/` (see `PROVENANCE.txt` there).

## How to read this

Every claim carries a label and a source.

| Label | Meaning |
|---|---|
| **[E]** | Experimental study, or meta-analysis of experiments |
| **[R]** | Review, theory paper or observational survey (correlational, self-report) |
| **[P]** | Practitioner guidance, or my own inference from the evidence |

"Read in" says what I actually read: full text, or only the abstract (from ERIC, Europe PMC/PubMed or Crossref). When I read only an abstract, I report only what the abstract says. Anything I could not open is marked **not verified**.

The owner's failure case was a deck that "treated a concept as if I knew it well already, didn't explain stuff at the start". Every section below asks what the evidence says about that failure.

---

## 0. Bottom line (decision-relevant)

1. **The premade-card penalty is real, but the study behind it assumed learners had already read the material.** In all six experiments of Pan et al. (2022/2023), both conditions first read the source passage for 5 minutes, and only then used flashcards. The finding is "making cards beats using someone else's cards *after reading*", not "premade cards teach nothing" [E]. A premade deck with no teaching layer is outside what that study tested, and it is plausibly worse.
2. **How the cards were generated mattered.** Word-for-word transcription gave no benefit. Copy-paste and paraphrasing did help. Generating examples helped definition recall but not application. The effect held against high-quality premade cards, and was larger against low-quality ones [E].
3. **Nobody has tested editing or adapting premade cards.** Pan et al. call it "an uninvestigated middle ground". I found no study since [E-gap]. An empty "My note" field is therefore a hope, not a remedy.
4. **Novices and experts need opposite things (expertise reversal).** Explanations and guidance that help novices can become redundant, and even harmful, for knowledgeable learners [E/R]. So a deck for novices needs its explanations built in, and should let experienced learners skip them.
5. **Teaching the component terms first works.** Mayer's *pre-training* principle reports a median d = 0.46 [R summarising E]. The original experiments (brakes, tyre pump) improved transfer in all three experiments [E]. Advance organizers have a small average effect (mean ES ≈ 0.21 on learning, across 135 studies) [E, meta-analysis]. Primer cards are the flashcard form of pre-training.
6. **Flashcard backs should explain, not only give the answer.** Elaborated feedback averaged ES 0.49, against 0.32 for the correct answer alone and 0.05 for right/wrong only (40 studies) [E, meta-analysis]. Explanation feedback improved *new inference questions* but not repeated ones [E]. Without feedback, testing items that learners can't yet retrieve (≤50% initial success) gave no testing benefit (g = 0.03) [E, meta-analysis]. This is exactly the "cold detail card" situation.
7. **Experts misjudge what novices need (expert blind spot / curse of expertise).** More expert people ranked the prerequisites in the wrong order compared with actual student performance [R/E]. Novices learned a task better from beginners' instructions than from experts' [E]. Card writers (including LLM agents) are the experts here, so the order and the no-undefined-terms rule need a novice check, not only an author check.
8. **Medical students overwhelmingly use premade Anki decks, and say those decks help retention far more than understanding.** In one survey only 29.5% of users picked "understanding concepts" as a benefit, against 89.1% for retention. In another, 2.5% used Anki for "learning" alone, against 43.8% for "memorization only" [R, surveys]. The largest decks are built to accompany separate teaching resources: their tags point to specific third-party videos [R].

---

## 1. Pan et al. (2022/2023): user-generated vs premade flashcards, in depth

**Source.** Pan, S. C., Zung, I., Imundo, M. N., Zhang, X., & Qiu, Y. "User-generated digital flashcards yield better learning than premade flashcards." *Journal of Applied Research in Memory and Cognition* 12(4), 574–588. DOI 10.1037/mac0000083 (Crossref: issued 2023; accepted 14 Oct 2022). Accepted-manuscript full text read from the PsyArXiv preprint, DOI 10.31234/osf.io/f5k8p (https://osf.io/download/3s6dh/). Raw: `raw-prior/pan2022_plain.txt`.

### Design (all [E], read in full text)
- **Six experiments, within-participants.** Each participant used both premade and self-made cards, one condition per passage, with the order counterbalanced. Participants were US undergraduates from a participant pool, working online.
- **Materials.** Two passages ("Expressionist Art", "Ancient Rome") of just over 500 words each, with a Flesch-Kincaid score of 15–16. Each passage had 10 italicised key terms, and each term had a one-sentence definition.
- **Procedure.** Participants **read the passage for 5 min**, then spent 20 min (Exps 1–2) or 25 min (Exps 3A–4B) on flashcards. Total time was equal in both conditions, so in the user-generated condition the time spent making cards came out of practice time. The card order was fixed. Dropping and starring cards were disabled.
- **Test.** 48 hours later, 40 four-option multiple-choice questions: *definition* questions (memory) and *application* questions (a new example, which is transfer).
- **Final samples.** Exp 1: 57. Exp 2: 54. Exp 3A: 50. Exp 3B: 45. Exp 4A: 42. Exp 4B: 36. Exps 3A/3B and 4A/4B were preregistered.

### Results by generation method
| Exp | How users made cards | Premade cards were | Result at 48 h |
|---|---|---|---|
| 1 | Word-for-word transcription | Verbatim from passage | **No difference** on either question type (definition F(1,55)=0.91, p=.35) |
| 2 | Copy-and-paste | Verbatim | User-generated better: definition d = 0.41, application d = 0.30 |
| 3A | Paraphrase ("accurate and complete definition" in own words) | Verbatim | Better on definition **and** application |
| 3B | Generate an example sentence (paraphrasing not allowed) | Verbatim | Better on **definition only**; no clear application gain |
| 4A | Paraphrase | **High-quality** premade (best-scoring learner paraphrases from 3A) | User-generated still better on both |
| 4B | Paraphrase | **Low-quality** premade (low-scoring but not inaccurate paraphrases) | User-generated better; the definition gap was larger than in 4A |

- **Internal meta-analysis across all six experiments:** definition d = 0.45, 95% CI [0.25, 0.66]; application d = 0.29, 95% CI [0.12, 0.45]. I read these numbers twice, in the abstract and in the results section. "In five out of six experiments" user-generated cards improved learning.
- **Premade users got more practice and still lost.** Repetitions per card were, for example, 6.0 (premade) vs 4.4 (user-generated) in Exp 1, and 9.3 vs 4.4 in Exp 4B. Making cards took 2.5 to 12.9 minutes.
- **The quality of learners' own cards barely mattered.** Paraphrased definitions averaged 71% complete (Exp 3A) and 61–63% complete (4A/4B). Quality correlated with test scores only in Exp 3A (r = 0.30 definition, 0.37 application), and adding it as a covariate did not remove the advantage.
- **Learners did not notice the benefit.** Judgments of learning and predicted test scores were similar in both conditions. "Most participants did not exhibit a strong metacognitive awareness of the benefits of generating flashcard content even after doing so."

### Which aspects of generation mattered (authors' interpretation, [R] within an [E] paper)
- The authors' "candidate principle": generating content helps "by eliciting extra processing—i.e., re-reading, mental elaboration, depth-of-processing, or even improved attention—of to-be-learned information".
- They suggest transcription failed because it was slow, effortful and letter-focused. It left no capacity to re-examine the text. Copy-paste left more capacity free.
- They suggest paraphrasing beat examples on transfer because attention stayed on the text, while inventing examples split attention between the text and prior knowledge.
- A speculative mechanism: making cards may raise retrieval success during later practice. "If so, then user-generated flashcards should be especially helpful for learners lacking strong mastery". This was not tested, because participants did not type their recall attempts.

### Limits the authors state, plus mine
- The authors say the finding needs testing on other platforms, learners and materials. Features such as shuffling and dropping were disabled. Retrieval success was never measured.
- **"If instructor-provided flashcards preview an upcoming exam, then students would be well-advised to use them."** Alignment with the exam can outweigh the generation benefit (authors' caveat, [R]).
- **"An uninvestigated middle ground … modifying existing flashcard sets (Green & Bailey, 2010). Modifying flashcards may enhance learning, perhaps to a lesser extent than generating brand-new sets."** This is a hypothesis in the paper, not data.
- My own reading [P]: the materials were very short (10 terms per passage), the test was multiple choice after 48 hours, and the learners were undergraduates. None of this resembles weeks of spaced review for a certification exam. The study also says nothing about premade decks used *without* first reading the source. The draft standard's line "d = 0.45, even against high-quality premade cards" slightly overstates the paper: 0.45 is the pooled estimate across all six experiments (one of them null), not the estimate against high-quality cards specifically.

### Context: why learners use premade cards
- Zung, Imundo & Pan (2022), *Memory*, DOI 10.1080/09658211.2022.2058553. A survey of n = 901 US undergraduates found digital flashcards are used in a way that "only partially reflects evidence-based learning principles" [R; abstract read at Europe PMC].
- Pan et al. report from that survey that 56% of students preferred premade cards, citing convenience and saving time. Of the 44% who preferred making their own, reasons included content control and a belief that making cards aids learning. [R; read in Pan's text only, **not verified** in Zung's full text.]

---

## 2. The generation effect (what the premade user loses)

- **Bertsch, Pesta, Wiscott & McDaniel (2007)**, *Memory & Cognition* 35(2):201–210, DOI 10.3758/bf03193441. Meta-analysis of 445 effect sizes from 86 studies. "The size of the generation effect across the 86 studies was .40—a benefit of almost half a standard deviation of generation over reading", with substantial variation by moderator [E; abstract read at Europe PMC].
- **McCurdy, Viechtbauer, Sklenar, Frankenstein & Leshikar (2020)**, *Psychonomic Bulletin & Review*, DOI 10.3758/s13423-020-01762-3. 126 articles, 310 experiments, 1,653 estimates. "Generation constraint significantly moderates the magnitude of the generation effect", meaning how constrained the learner is to produce one specific response [E; abstract read at Europe PMC]. The abstract gives no direction or size for this moderator, so I don't state one.
- Relevance [P]: a premade card hands over the answer and removes the generation step. The classic generation effect concerns single words or items, which is not the same as authoring a card. Pan's transcription null result shows that simply producing text is not enough.

---

## 3. Does editing or adapting a premade card recover the benefit?

- **No direct evidence found.** Pan et al. call modification an "uninvestigated middle ground" (above). Searches of Europe PMC (flashcard AND modify/edit/adapt AND premade/shared/user-generated) and Crossref found no experiment [E-gap].
- **Nearest evidence** [E], each only suggestive:
  - Pan Exp 1: *transcribing* someone else's definition gave no benefit. Retyping a premade card is closest to this.
  - Pan Exps 3A/4A/4B: *paraphrasing* the definition gave the largest and broadest benefit, including transfer. This is the closest model for a "rewrite this in your own words" prompt on a premade card.
  - Zhang (2023), ProQuest dissertation (ERIC ED637692), unpublished. Expert-made mnemonics "did not bolster memory, knowledge application, and accurate judgments of memory more than restudy". Self-generated mnemonics beat restudy but took twice as long as retrieval practice [E, unpublished; abstract read at ERIC].
- **Self-explanation** is a better-tested form of "add your own processing" to existing material. Bisra, Liu, Nesbit, Salimi & Winne (2018), *Educational Psychology Review* 30:703–725, DOI 10.1007/s10648-018-9434-x: 69 effect sizes, random-effects mean g = 0.55 for prompts to self-explain [E; abstract read at ERIC].
- **In the field, learners rarely edit.** In Levy et al. (2023), first-year medical students on premade decks did not agree that they had to edit cards often to understand them (item mean 2.85 for Anki users, 2.11 for limited users, on a 1–5 scale). Both groups agreed they *suspend* cards they miss repeatedly [R; full text read, see §11].
- **Verdict** [P]: an empty "My note" field is untested and, going by Pan's metacognition finding, learners will not feel it helps. A field that asks for a *paraphrase* is the best-grounded variant, because it copies the method that worked in Pan. It remains untested in this form.

---

## 4. Learning from a premade question bank vs making one

- **Ebersbach, Feierabend & Nazari (2020)**, *Applied Cognitive Psychology* 34:724–736, DOI 10.1002/acp.3639. In a university lecture, generating questions and answering questions (testing) both beat restudying at one week. Bayesian analyses suggested "generating questions and testing similarly benefit factual and transfer knowledge" [E; abstract read at ERIC].
- Pan et al. summarise the question-generation literature: in several studies, generating questions beat restudy **but not** retrieval practice alone. Possible reasons they give are time cost, extraneous processing, and the need for training [R; Pan's text].
- **Gupta, Shetty, Shetty & Banga (2026)**, *BMC Medical Education*, DOI 10.1186/s12909-026-08585-1. A randomised crossover trial with dental students (n = 64, 62 completed). Writing MCQs *with faculty-moderated discussion* beat extra study time (d = 1.38 and 1.22). But the control had no retrieval practice, and the intervention included faculty discussion, so it does not isolate generation vs a premade bank [E, confounded; abstract read at Europe PMC].
- **Griffith & Pawlow (2025)**, *Nurse Educator*, DOI 10.1097/nne.0000000000001926. A scoping review: "MCQ quality improved with faculty involvement. Working in small groups increased knowledge and positive perception" [R; abstract only].
- **Verdict** [P]: answering good premade questions is a strong method in its own right. The extra benefit of making questions is inconsistent once you compare against retrieval practice rather than restudy. So the premade gap concerns the extra *processing* that authoring forces, which a deck can partly supply through explanations, examples and paraphrase prompts.

---

## 5. Cognitive load, element interactivity and the expertise reversal effect

- **Kalyuga, Ayres, Chandler & Sweller (2003)**, "The expertise reversal effect", *Educational Psychologist* 38(1):23–31, DOI 10.1207/S15326985EP3801_4 (Crossref-verified). "Instructional techniques that are highly effective with inexperienced learners can lose their effectiveness and even have negative consequences when used with more experienced learners" [R reviewing E; abstract text from OpenAlex, fetched by a parallel agent in this session; see PROVENANCE].
- **Kalyuga (2007)**, *Educational Psychology Review* 19:509–539, DOI 10.1007/s10648-007-9054-3. A review linking the effect to aptitude–treatment interactions, with implications for "learner-tailored instructional systems" [R; ERIC abstract].
- **Kalyuga (2009), book chapter**, DOI 10.4018/978-1-60566-048-6.ch003: "prior knowledge is the most important learner characteristic that influences learning processes". The effect is explained by "the cognitive overload that more knowledgeable learners may experience due to processing redundant for these learners instructional components" [R; Crossref abstract].
- **Oksa, Kalyuga & Chandler (2009/2010)**, *Instructional Science* 38:217–236, DOI 10.1007/s11251-009-9109-6. Line-by-line modern-English explanatory notes on Shakespeare lowered cognitive load and improved comprehension for students with no prior knowledge (Exps 1 and 3). The effect *reversed* for Shakespeare experts (Exp 2), for whom "the explanations were redundant" [E; ERIC abstract].
- **Rey & Buchwald (2011)**, *J. Exp. Psych.: Applied* (ERIC EJ919603). Novices given additional explanatory text scored higher on retention and transfer, "while this result was reversed for experts" (n = 104) [E; ERIC abstract].
- **Rey & Fischer (2013)**, *Instructional Science* 41:407–429, DOI 10.1007/s11251-012-9237-2. With expertise induced experimentally, the reversal was replicated for transfer but not retention (n = 93) [E; ERIC abstract].
- **Element interactivity.** Sweller (2010), *Educational Psychology Review* 22:123–138, DOI 10.1007/s10648-010-9128-5: element interactivity is "the basic, defining mechanism of intrinsic cognitive load", and the article argues it underlies extraneous load too [R; ERIC abstract]. Chen, Kalyuga & Sweller (2017), *EPR* 29:393–405, DOI 10.1007/s10648-016-9359-1: expertise reversal is "a particular example of the element interactivity effect" [R; ERIC abstract]. Chen, Paas & Sweller (2023), ERIC EJ1380031: element interactivity depends on "the structure of the information being processed **and** the knowledge held in long-term memory of the person processing the information" [R; ERIC abstract].
- **Meta-analysis:** Tetzlaff, Simonsmeier, Peters & Brod (2025), "A cornerstone of adaptivity – A meta-analysis of the expertise reversal effect", *Learning and Instruction* 98, 102142, DOI 10.1016/j.learninstruc.2025.102142. Its existence and metadata are verified via Crossref, and Semantic Scholar lists it as open access under CC BY. **Its findings are not verified:** the full text (pedocs.de) was unreachable from this session.

**What novices vs experts need** [P, inferred from the above]:
- **A novice** meets a technical term as a new, unchunked element. A card that uses three undefined terms asks the learner to hold several interacting unknowns at once. Integrated explanations and definitions help novices.
- **An expert** already holds those elements as chunks, so the same explanations are redundant and can hurt.
- So a deck cannot suit both with one fixed presentation. It should give novices explanations by default and let experts drop them.

---

## 6. Prior knowledge: activation, advance organizers and pre-training

### Prior knowledge in general
- **Simonsmeier, Flaig, Deiglmayr, Schalk & Schneider (2022)**, *Educational Psychologist* 57(1):31–54, DOI 10.1080/00461520.2021.1939700. 8,776 effect sizes. Pretest–posttest stability was high (r = 0.534). The correlation between prior knowledge and *normalised gains* was about zero (r = −0.059), with a wide 95% prediction interval of [−0.688, 0.621]. This "falsifies general statements such as 'knowledge is power' as well as 'the effect of prior knowledge is negligible'" [E, meta-analysis; ERIC abstract].
- Implication [P]: novices do not learn less, relative to where they start, if instruction fits them. But they stay behind in absolute terms, so a novice deck has to start lower rather than assume.

### Advance organizers (Ausubel)
- **Ausubel (1960)**, "The use of advance organizers in the learning and retention of meaningful verbal material", *J. Educ. Psych.* 51:267–272, DOI 10.1037/h0046669. Metadata is verified via Crossref. **The content is not verified**, because no abstract or text was available.
- **Luiten, Ames & Ackerson (1980)**, *AERJ* 17:211–218, DOI 10.3102/00028312017002211: 135 studies. The Crossref abstract says a "facilitative effect on both learning and retention"; the ERIC abstract says "a small facilitative effect". The full conference version (ERIC ED171803, 1979, scanned PDF read) reports a mean effect size of **.21** on learning (110 effect sizes). Retention effect sizes rise with delay, from .19 (2–6 days) to .38 (22+ days), but "the majority of studies reviewed used identical instruments to measure both learning and retention". High-ability subjects showed nearly twice the effect of low-ability subjects, and aural organizers beat written ones [E, meta-analysis; I read .21 twice, in the table and in the text].
- **Stone (1982/83)**, ERIC ED220476. Advance organizers were "associated with increased learning and retention", but several findings contradicted Ausubel's model: "lower ES's associated with written-only and abstract AO's", no special benefit "for low ability, or low knowledge learners" [E, meta-analysis; ERIC abstract; full text not available].
- **Kozlow (1978)**, ERIC ED161755: 77 reports. Some effects "may have been due to the possible contribution of the AO alone to answering the test questions or to an inequality of study time". "Student inability to understand the AO information may account for some of the non-significant findings." "Comparative AOs may be more effective than expository ones" [E, meta-analysis; ERIC abstract].
- Take-away [P]: an organizer helps a little on average. It must itself be understandable to the novice, and concrete or comparative framing looks better than abstract text. Written-only abstract organizers are the weakest form, which is a warning for a "Start here" page made only of text.

### Pre-training (the closest analogue of primer cards)
- **Mayer, Mathias & Wetzell (2002)**, *J. Exp. Psych.: Applied* 8(3):147–154, DOI 10.1037//1076-898x.8.3.147. Pre-training on each component (its name and possible states) before a narrated animation of a braking system or tyre pump improved **transfer in all 3 experiments** and retention in Exps 1–2. It beat both no pre-training and training given *after* the animation (Exp 3). This is consistent with "a 2-stage theory of mental model construction" [E; abstract at Europe PMC].
- **Mayer (2017)**, "Using multimedia for e-learning", *J. Computer Assisted Learning* 33:403–423, DOI 10.1111/jcal.12197. Median effect size for pre-training **d = 0.46**. "Some principles have boundary conditions, such as being stronger for low- rather than high-knowledge learners" [R summarising E; I read d = 0.46 twice, in the ERIC and Crossref abstracts].
- **Delgado & Mayer (2025)**, *J. Computer Assisted Learning* (ERIC EJ1459034). With 93 participants, a pre-training video giving "names and characteristics" of the equipment raised knowledge scores, reduced errors on the real-life task and lowered reported cognitive load [E; ERIC abstract].
- **Mayer, Dyck & Cook (1984)**, *J. Educ. Psych.* (ERIC EJ310884). "Definitions pretraining" helped readers "build mental models of cause-and-effect phenomena" [E; ERIC abstract; the authors are listed only as "Mayer, Richard E, And Others", so co-authors are **not verified**].

### Prequestions and pretests (the alternative to primers)
- **Pan & Carpenter (2023)**, *EPR* 35, DOI 10.1007/s10648-023-09814-5. Testing people on material they have not yet learned "can benefit learning if there is an opportunity to study the correct answers afterwards". The size varies with procedure and outcome [R; ERIC abstract].
- **Rivers, Berdelis, Pan & Tauber (2026)**, *Applied Cognitive Psychology* 40, DOI 10.1002/acp.70165. Covert and overt prequestions both beat reading alone. "Prequestioning was just as effective as reviewing statements about what was to come before reading a passage" [E; ERIC abstract].
- **Arnold & McDermott (2013)**, *JEP:LMC* 39:940–945, DOI 10.1037/a0029199. "Unsuccessful retrieval attempts enhance the effectiveness of subsequent restudy" (test-potentiated learning) [E; ERIC abstract].
- Implication [P]: a primer *card* in question form ("What is a Sprint?") is fine even when the learner cannot answer it the first time, **as long as the back teaches**. A detail card is also fine on first sight if its back explains. What fails is a card whose back assumes knowledge the learner lacks.

---

## 7. Prerequisite sequencing, knowledge spaces and learning progressions

- **Gagné (1970)**, "Basic Studies of Learning Hierarchies in School Subjects", ERIC ED039611. Across seven studies, "learning of subordinate skills produces marked positive transfer in learning of complex problem solving tasks", and "comparing and contrasting tasks are affected by the attainment of subordinate skills" [E; ERIC abstract].
- **Partin (1976)**, ERIC ED121758. 57 high-school students followed a self-instruction programme sequenced by Gagné-style task analysis, by ordering theory, or at random. There was "no significant differences … in number of objectives mastered". But "the two groups receiving hierarchical presentations required significantly less time". The author warns against considering learning "only in terms of prerequisite skills" [E; ERIC abstract].
- **Knowledge space theory in practice (ALEKS).** Sun, Else-Quest, Hodges, French & Dowling (2021), *Investigations in Mathematics Learning* 13:182–196, DOI 10.1080/19477503.2021.1926194. 33 studies, 9,238 students. ALEKS was "comparable" to traditional instruction (g = 0.05, 95% CI [−0.01, 0.20]) and "especially effective when used to supplement traditional instruction" (g = 0.43, 95% CI [0.02, 0.83]) [E, meta-analysis; ERIC abstract]. A prerequisite-driven engine is not better on its own. It helps as an add-on to teaching.
- **Expert-designed vs real prerequisite structures.** Segedinac et al. (2018), *Chemistry Education Research and Practice* (ERIC EJ1183941). In stoichiometry there was "decent agreement between expected and real knowledge spaces", but "a number of relations that were not present in the expected one appeared in the real knowledge space" [E/R; ERIC abstract].
- **Learning progressions.** Duschl, Maeng & Sezen (2011), *Studies in Science Education* 47:123–182, DOI 10.1080/03057267.2011.604476. An analytical review of how progressions and teaching sequences are proposed and validated. It distinguishes "Evolutionary LP" models from curriculum-coherence "Validation LP" models [R; ERIC abstract]. I found no controlled test showing one progression design beats another for adult certification learning (**not verified / gap**).
- Take-away [P]: ordering by prerequisites is supported mainly as an *efficiency* gain and as a condition for complex tasks. It is not a large effect by itself. The real risk is an order that the author believes is right but that learners' actual dependencies contradict (see §8).

---

## 8. Curse of knowledge / expert blind spot

- **Nathan & Petrosino (2003)**, *AERJ* 40(4):905–928, DOI 10.3102/00028312040004905 (N = 48 preservice teachers). Those with more advanced mathematics education "were more likely to view symbolic reasoning and mastery of equations as a necessary prerequisite for word equations and story problem solving", which "is in contrast with students' actual performance patterns" [R/E, correlational; ERIC and Crossref abstracts].
- **Hinds, Patterson & Pfeffer (2001)**, *J. Applied Psychology* 86(6):1232, DOI 10.1037/0021-9010.86.6.1232. Experts giving instructions used "more abstract and advanced statements and fewer concrete statements" than beginners did. "Beginner-instructed novices performed better than expert-instructed novices and reported fewer problems" on the target task, although expert instruction helped transfer to a different task [E; Europe PMC abstract].
- **Hinds (1999)**, "The curse of expertise…", *JEP: Applied* 5:205–221, DOI 10.1037/1076-898x.5.2.205. Metadata only; **findings not verified**.
- **Fisher & Keil (2016)**, *Cognitive Science* 40:1251–1269, DOI 10.1111/cogs.12280. Expertise increased confidence in the ability to explain, but "this confidence is unwarranted", explained by "a failure to recognize the amount of detailed information that had been forgotten" [E; ERIC abstract].
- **Kulgemeyer (2018)**, ERIC EJ1165853. Among 10th-graders (N = 213), those who communicated from the *structure of the content*, rather than from the listener's prerequisites, did worse on a communication test [E, correlational; ERIC abstract].
- **DEAME framework** (Balczewski et al. 2025, *Medical Science Educator*, DOI 10.1007/s40670-025-02518-1; full text read). The coders found that how strongly a prompt cues its answer "may change depending on the expertise of the learner. For example, a cardiologist may not have trouble selecting a limited number of likely candidate answer classes for 'What do you do for heart failure?', but a medical student might" [R].
- Relevance [P]: this is almost certainly the mechanism behind the owner's failed deck. The author (or an LLM drafting agent, which has "expert" knowledge) cannot see which terms are undefined. A mechanical term check helps. A read-through by a real novice is the more direct fix.

---

## 9. Scaffolding and fading

- **Atkinson, Renkl & Merrill (2003)**, *J. Educ. Psych.* 95(4):774, DOI 10.1037/0022-0663.95.4.774. Fading worked-out steps, combined with self-explanation prompts, "produced medium to large effects on near and far transfer without requiring additional time on task" [E; ERIC abstract].
- **Renkl, Atkinson & Grosse (2004)**, *Instructional Science* (ERIC EJ732331). Fading worked steps helps, and "individuals learned most about those principles that were faded" [E; ERIC abstract].
- **Salden, Aleven, Schwonke & Renkl (2010)**, *Instructional Science* (ERIC EJ880294). "Improved learning results from adaptive fading over fixed fading over problem solving" [E; ERIC abstract].
- **Kim, Belland & Walker (2018)**, *EPR* (ERIC EJ1179108). Computer-based scaffolding in STEM problem-based learning: g = 0.385 on cognitive outcomes (Bayesian meta-analysis) [E; ERIC abstract].
- **Qu, Sun, Lei & Zhou (2026)**, *J. Psycholinguistic Research* (ERIC EJ1511273). "Diminishing-cues retrieval practice" beat standard retrieval practice for difficult vocabulary [E; ERIC abstract].
- Relevance [P]: the flashcard form of fading is primer cards with generous backs early on, then detail cards with shorter backs, then contrast or application cards. Anki cannot adapt fading to each learner. The deck can only fix the order.

---

## 10. Concept-before-detail vs detail-first

The evidence splits by what "first" means:
- **Components before the system** (pre-training): supported, d = 0.46 median, stronger for low-knowledge learners (§6) [E/R].
- **Problem-solving before instruction** (productive failure). Sinha & Kapur (2021), *Review of Educational Research* 91:761–798, DOI 10.3102/00346543211019105: 53 studies, 166 comparisons, g = 0.36 [0.20, 0.51] in favour of problem-solving first. But the trend favoured instruction first "for younger age learners … and for the learning of domain-general skills" [E, meta-analysis; ERIC abstract]. This concerns classroom problem-solving followed by *teacher consolidation*, not flashcards.
- **Question before answer** (prequestions): works when the answer is studied afterwards (§6) [R/E].
- Take-away [P]: none of this supports showing a detail card *with an unexplained back* before the concept is taught. The evidence supports either (a) teaching components first, or (b) letting learners attempt first and then **explaining**. Both come down to the back of the card carrying the teaching.

---

## 11. Explanations in retrieval feedback

- **Van der Kleij, Feskens & Eggen (2015)**, *Review of Educational Research* 85(4):475–511, DOI 10.3102/0034654314564881. 40 studies, 70 effect sizes, computer-based item feedback. Elaborated feedback (EF) had ES **0.49**, correct-answer feedback (KCR) **0.32**, right/wrong only (KR) **0.05**. "EF was particularly more effective than KR and KCR for higher order learning outcomes" [E, meta-analysis; numbers read twice, in the ERIC and Crossref abstracts].
- **Butler, Godbole & Marsh (2013)**, *J. Educ. Psych.* 105:290–298, DOI 10.1037/a0031026. Correct-answer and explanation feedback "led to equivalent performance on the repeated questions, but explanation feedback produced superior performance on the new inference questions" [E; ERIC abstract].
- **Corral & Carpenter (2024)**, *Cognitive Research: Principles and Implications* (ERIC EJ1453351). Across six experiments, "explanation feedback generally led to better learning and transfer than correct-answer feedback" for complex concepts [E; ERIC abstract].
- **Wisniewski, Zierer & Hattie (2020)**, *Frontiers in Psychology*, DOI 10.3389/fpsyg.2019.03087. 435 studies, d = 0.48 overall. By feedback type: reinforcement/punishment 0.24, corrective 0.46, high-information 0.99 [E, meta-analysis; full text read at Europe PMC]. Their "high-information" category also includes self-regulation information, so it is not the same as "explanation on the card back".
- **Rowland (2014)**, *Psychological Bulletin*, DOI 10.1037/a0037559. Without feedback, initial retrieval success ≤50% gave no reliable testing effect (g = 0.03, CI [−0.21, 0.27]). 51–75% success gave g = 0.29, and >75% gave g = 0.56. Studies with feedback, regardless of success, gave g = 0.73 [E, meta-analysis; full text read in the copy fetched by a parallel agent; see PROVENANCE].
- Relevance [P]: a card a novice cannot answer is only useful if the reveal teaches. Anki always shows the back, which counts as feedback, so the *content* of that back decides whether the card teaches or just marks the learner wrong. The standard's mandatory `Explanation` field is well supported.

---

## 12. Shared / premade Anki decks in medical education

All of these are observational and self-reported [R]. None compares premade and self-made decks experimentally.

| Study | Sample | Premade use | What they say about understanding vs memorising |
|---|---|---|---|
| Nour & Harris (2025), *Cureus*, DOI 10.7759/cureus.95674 (full text) | UCF first-years, 89 of 120 responded; 83 answered the deck question | **81/83 (97.6%)** used pre-made cards; 78.3% preferred fill-in-the-blank | Authors: "students bypass critical thinking skill development or the productive struggle"; faculty could guide use "as a recall or memory tool, instead of a deeper learning method" |
| Wothe et al. (2023), *J Med Educ Curric Dev*, DOI 10.1177/23821205231173289 (full text) | U. Minnesota, 165/887 responded | Of 139 Anki users, **121 (87%)** used decks made by others and 18 (13%) made their own; 71 of the 121 used national shared decks | Daily use correlated with Step 1 score (P = .039) but not Step 2 |
| Almaabreh et al. (2026), *BMC Med Educ*, DOI 10.1186/s12909-026-09040-x (full text) | Jordan, 318 students, 80 Anki users | **64/80 (80%)** premade (e.g. AnKing); 41 (51.2%) also made their own | Purpose: "memorization only" 43.8%, "learning" 2.5%, both 53.8%. Preferred tool for understanding: Anki 23.8%, traditional 23.8%, both 52.5%. Deck type not associated with perceived performance (χ²(9) = 9.36, p = .405). Card creation was the most time-consuming task (50.5%) |
| Alnaser-Almusa et al. (2026), *Front. Med.*, DOI 10.3389/fmed.2026.1896043 (full text) | Alfaisal, 306 surveyed, 150–156 users | 117 (75%) used colleagues' cards; 63 (40.4%) AnKing; 56 (35.9%) also made their own | Benefits picked: retention **139 (89.1%)**, understanding concepts **46 (29.5%)**. The discussion text says 26.9%, which conflicts with the table. No association with CGPA (β = 0.04, p = 0.52). Authors: cloze cards may train key-term recognition "rather than learning the entire concept", and splitting a concept across many cards "can further exacerbate the problem of understanding entire concepts" (their inference) |
| Levy et al. (2023), *J Med Educ Curric Dev*, DOI 10.1177/23821205231205389 (full text) | UNLV first-years, N = 45, 8-week course | Premade decks | "Information … digestible and understandable": mean 4.12 (users), 3.79 (limited users). Both groups agreed they suspend cards missed repeatedly, "opportunities to refine information in these cards to make them more understandable". Exam difference not significant |
| Frappa et al. (2026), *Med Sci Educ*, DOI 10.1007/s40670-026-02643-5 (full text) | Systematic review, 11 studies | n/a | Positive association with Step 1 in 3 studies; mixed for course exams; "evidence is largely observational". "Overreliance on flashcards may also risk superficial learning if not balanced with deeper conceptual and clinical reasoning" |
| Balczewski et al. (2025), DEAME, DOI 10.1007/s40670-025-02518-1 (full text) | 1,300 cards from 6 popular decks | Decks of ~15,000–31,000 cards | Tags link cards to third-party resources, e.g. "Sketchy Pharmacology > Anti-inflammatory Drugs > Gout Drugs". Learners "minimally create their own" cards and use decks "distributed widely on social media platforms like Reddit and AnkiHub" |

- **Secondhand, not verified:** Nour & Harris cite Loving et al., reporting that 80% found near-peer-made cards helpful, against 29% for third-party cards and 48% for self-made. I could not locate Loving et al., so this is **not verified**.
- Pattern [P]: the most successful premade-deck ecosystem (US medical school) pairs decks with separate teaching resources (lectures, and third-party videos the tags point to). The deck is the memory layer, not the teaching layer. Learners themselves report that they get retention from it, not understanding. A certification deck whose learners have *no* parallel course is the owner's exact failure scenario.

---

## 13. How a premade deck should onboard a novice

Each step is tied to evidence; [P] marks design inference.

1. **A "Start here" page, short and concrete, read before any card.** It gives a one-screen map of the topic: what the thing is, what problem it solves, and a worked scenario. It lists prerequisites and the few assumed terms. This is an advance organizer: small but positive effect; comparative or concrete framing beats abstract text; it must be understandable to the novice (Luiten; Stone; Kozlow) [E]. Pan's premade condition also came *after* reading the source (§1) [E].
2. **Primer cards first, one per core concept, in dependency order.** Each gives the name, a plain one- or two-sentence meaning, why it matters, and an example. This is pre-training on components before the system (Mayer 2002; d = 0.46) [E/R]. Order by prerequisites mainly saves time (Partin; Gagné) [E].
3. **Every card back teaches.** It gives the answer, then a one- or two-sentence *why* (elaborated feedback beats correct answer alone, especially for transfer: Van der Kleij; Butler) [E]. A novice who fails a card still learns from it, because feedback removes the ≤50%-success penalty (Rowland) [E].
4. **Details only after their terms have been introduced, then contrasts.** This keeps element interactivity low for novices (Sweller; Chen et al.) [R]. It follows the fading pattern of full support first, less support later (Atkinson et al.; Renkl et al.) [E].
5. **Ask for a paraphrase, not a blank note.** Primer cards invite the learner to write the meaning in their own words in `My note`, because paraphrasing was the most effective generation method in Pan (definition and transfer) and transcription was useless [E]. Whether a paraphrase added to a *premade* card recovers the benefit is untested [P].
6. **When a card keeps failing, go back to the page.** Learners on premade decks tend to suspend repeatedly missed cards (Levy et al.) [R]. The card's `PageURL` should send them to the explanation instead [P].
7. **Let experienced learners skip the scaffolding.** Explanations help novices and can hurt experts (expertise reversal: Kalyuga et al.; Oksa et al.; Rey & Buchwald) [E/R]. Primer cards carry a tag so an experienced learner can suspend them in one step [P].
8. **Check the order with a real novice, not only the author.** Experts misjudge prerequisites and write more abstractly (Nathan & Petrosino; Hinds et al.; Segedinac et al.) [E/R].

---

## 14. Implications for our card standard (tested against the draft rules)

1. **Primer cards (§2a): KEEP, and strengthen.** The best direct support is pre-training: component names and behaviours taught before the system improved transfer in 3/3 experiments; median d = 0.46; stronger for low-knowledge learners (Mayer, Mathias & Wetzell 2002; Mayer 2017) [E/R]. Advance organizers add a small effect, ES ≈ 0.21 (Luiten et al. 1980) [E]. Refinements:
   - A primer's `Example` should be *concrete*, and where possible *comparative* (like X, but…). Abstract written organizers show the weakest effects (Stone; Kozlow) [E].
   - Tag primers `primer` (for instance `kind::primer`) so experts can suspend them. This is the expertise-reversal fix (Kalyuga et al. 2003; Oksa et al.) [E/R, design inference].
   - A primer in question form is fine even if the novice can't answer it on first sight, because prequestions followed by the answer aid learning (Pan & Carpenter 2023) [R].

2. **Teaching order (`Order`, primers before details before contrasts): KEEP, but claim less and verify more.** Prerequisite sequencing is supported mainly as a time saving. In Partin (1976), hierarchical order gave the same mastery in less time [E]. Subordinate skills transfer to complex tasks (Gagné 1970) [E]. A knowledge-space engine alone matched traditional teaching, g = 0.05 (Sun et al. 2021) [E]. Refinements:
   - **Add a novice read-through to §6 (Making a deck).** Before first release, someone who does not know the subject studies the first 50–100 new cards in order and flags every card they could not follow. Experts misorder prerequisites (Nathan & Petrosino 2003), and novices learn better from beginners' instructions (Hinds et al. 2001) [E/R]. This is the most direct fix for the owner's failure, and it catches what the mechanical term check can't: concepts that are named but not understood.
   - Keep "To verify: which deck options an .apkg carries". Nothing I found addresses it. **Not verified.**

3. **No-undefined-terms (`Uses`/`Introduces` checker): KEEP. It is the right mechanism, because authors cannot see their own blind spots.** It is supported by element interactivity: each undefined term is an extra interacting element for a novice (Sweller 2010; Chen, Paas & Sweller 2023) [R]. It is also supported by the expert blind spot and curse of expertise (Nathan & Petrosino; Fisher & Keil; Hinds et al.) [E/R]. Refinements:
   - `Uses` must include abbreviations, acronyms and symbols, not only terms [P].
   - The checker should also run against the **`Back`, `Explanation` and `Example`** fields, not only prompt and answer. An explanation that uses an undefined term defeats itself [P].
   - Add a soft cap of **at most one newly introduced term per primer card** [H, inference from element interactivity].

4. **"My note" field: KEEP, but give it a purpose, and keep the honest caveat.** No experiment tests editing or adapting premade cards. Pan et al. call it "an uninvestigated middle ground" [E-gap]. The evidence says *which* kind of generation helps: paraphrasing helped both definitions and application, copy-paste helped both, examples helped definitions only, and transcription did nothing (Pan et al. 2022) [E]. Learners also don't *feel* the benefit, so they won't do it unprompted [E]. Refinements:
   - On primer and concept cards, the deck page and card template should say, for instance: "Write the answer in your own words in My note, then review." Don't leave the field unexplained.
   - Suggest paraphrasing as a first-pass activity for primers only. Pan's generation took 13–52% of session time, so asking it for every card would be costly [E, time data].
   - Keep principle 11's wording, "whether it closes the gap is untested".

5. **Readable page first (principle 1): KEEP, and make it structurally part of the deck, not optional.** In Pan et al., *both* conditions read the passage before any flashcard use, so even the "premade" learners in the famous finding had been taught first [E]. In medicine, successful premade decks are paired with separate teaching resources and tagged to them (DEAME) [R]. Users report retention, not understanding (Alnaser-Almusa et al.: understanding 29.5% vs retention 89.1%; Almaabreh et al.: "learning" as purpose 2.5%) [R]. Refinements:
   - Because learners skip pages (principle 2's premise), the page's core explanations **must also exist as primer cards**. The page is for depth; the primers are for the learner who never opens it. The draft already says this, and the evidence supports it.
   - The "Start here" section should be a *concrete* organizer (a scenario, a comparison, a small diagram), not an abstract summary (Stone; Kozlow) [E].
   - Add a rule: when a card is failed repeatedly, the card, via its `PageURL`, and the deck page tell the learner to reread the linked section before suspending (Levy et al. 2023 on suspension habits) [R + H].

6. **`Explanation` field on every card: KEEP. This is one of the best-supported rules in the standard.** Elaborated feedback ES 0.49 vs 0.32 for the answer alone vs 0.05 for right/wrong only (Van der Kleij et al. 2015). Explanation feedback improves new inference questions (Butler et al. 2013). Without explanatory feedback, cards the learner can't yet retrieve give no testing benefit (Rowland 2014: g = 0.03 at ≤50% success, g = 0.73 with feedback) [E]. Refinement: the checker should flag an `Explanation` that merely restates the `Back` (for instance, high word overlap) [H]. The value is in the *why*.

7. **Correct the "honest summary" wording.** Current text: "self-made cards beat premade ones (Pan et al. 2022, d = 0.45, even against high-quality premade cards)". Suggested replacement: "In six experiments, students who read a text and then made their own flashcards remembered definitions better two days later than students who used premade cards for the same time (pooled d = 0.45) and applied them better (d = 0.29). The advantage held against high-quality premade cards, but it depended on *how* cards were made: copying word for word gave no benefit" [E]. Cite as *JARMC* 12(4):574–588, DOI 10.1037/mac0000083. Crossref dates it 2023; the preprint and acceptance are 2022.

8. **Contrast cards after both concepts are known: KEEP.** A comparing/contrasting task depends on attaining the subordinate concepts first (Gagné 1970) [E]. Comparative organizers may beat expository ones (Kozlow 1978) [E].

9. **Don't overclaim "understanding" on the site.** Even medical students who rely heavily on premade decks rate them low for understanding (§12) [R]. The site should say plainly that the deck plus its page teaches, while the deck alone mainly maintains memory [P].

10. **Not recommended on current evidence:** replacing primers with "try the detail card cold first" (productive failure). The PS-I advantage (g = 0.36; Sinha & Kapur 2021) comes from classroom problem-solving followed by teacher consolidation, and the trend reversed for domain-general skills and younger learners [E]. It does not transfer to self-study flashcards without a teacher.

---

## 15. Gaps and things not verified

- No experiment on editing, annotating or adapting premade flashcards (§3).
- No experiment comparing premade decks *with vs without* a teaching layer (primers or a page). This is the core question for us, and it is untested.
- Tetzlaff et al. (2025) expertise-reversal meta-analysis: findings not read (host unreachable).
- Ausubel (1960) and Hinds (1999): only metadata was verified.
- Kalyuga et al. (2003) abstract and Rowland (2014) text came from a parallel agent's fetch in this session (OpenAlex returned 429 to me). See `raw-prior/PROVENANCE.txt`.
- Loving et al. (near-peer vs third-party vs self-made cards) is cited secondhand only.
- Zung et al. (2022) 56%/44% preference figures were read only in Pan et al.'s text.
- Mayer 2017's d = 0.46 is a *median* across experiments. The number of pre-training comparisons was not in the abstract, so it is not verified.
- Alnaser-Almusa et al. (2026) report 29.5% in the table and 26.9% in the text for "understanding concepts". I cite the table.

## Sources (DOIs resolved at api.crossref.org unless noted)

- Pan, Zung, Imundo, Zhang & Qiu. JARMC 12(4):574–588. https://doi.org/10.1037/mac0000083; preprint https://doi.org/10.31234/osf.io/f5k8p
- Zung, Imundo & Pan (2022). Memory. https://doi.org/10.1080/09658211.2022.2058553
- Bertsch et al. (2007). https://doi.org/10.3758/bf03193441
- McCurdy et al. (2020). https://doi.org/10.3758/s13423-020-01762-3
- Kalyuga, Ayres, Chandler & Sweller (2003). https://doi.org/10.1207/S15326985EP3801_4
- Kalyuga (2007). https://doi.org/10.1007/s10648-007-9054-3
- Kalyuga (2009) chapter. https://doi.org/10.4018/978-1-60566-048-6.ch003
- Oksa, Kalyuga & Chandler. https://doi.org/10.1007/s11251-009-9109-6
- Rey & Buchwald (2011). ERIC EJ919603, https://eric.ed.gov/?id=EJ919603
- Rey & Fischer. https://doi.org/10.1007/s11251-012-9237-2
- Sweller (2010). https://doi.org/10.1007/s10648-010-9128-5
- Chen, Kalyuga & Sweller. https://doi.org/10.1007/s10648-016-9359-1
- Chen, Paas & Sweller (2023). ERIC EJ1380031
- Tetzlaff et al. (2025). https://doi.org/10.1016/j.learninstruc.2025.102142 (metadata only)
- Simonsmeier et al. https://doi.org/10.1080/00461520.2021.1939700
- Ausubel (1960). https://doi.org/10.1037/h0046669 (metadata only)
- Luiten, Ames & Ackerson (1980). https://doi.org/10.3102/00028312017002211; full text of the 1979 version at https://files.eric.ed.gov/fulltext/ED171803.pdf
- Stone. ERIC ED220476. Kozlow. ERIC ED161755
- Mayer, Mathias & Wetzell (2002). https://doi.org/10.1037//1076-898x.8.3.147
- Mayer (2017). https://doi.org/10.1111/jcal.12197
- Delgado & Mayer (2025). ERIC EJ1459034. Mayer et al. (1984). ERIC EJ310884
- Pan & Carpenter (2023). https://doi.org/10.1007/s10648-023-09814-5
- Rivers et al. (2026). https://doi.org/10.1002/acp.70165
- Arnold & McDermott (2013). https://doi.org/10.1037/a0029199
- Gagné (1970). ERIC ED039611. Partin (1976). ERIC ED121758
- Sun et al. (2021). https://doi.org/10.1080/19477503.2021.1926194
- Segedinac et al. (2018). ERIC EJ1183941
- Duschl, Maeng & Sezen. https://doi.org/10.1080/03057267.2011.604476
- Nathan & Petrosino. https://doi.org/10.3102/00028312040004905
- Hinds, Patterson & Pfeffer (2001). https://doi.org/10.1037/0021-9010.86.6.1232
- Hinds (1999). https://doi.org/10.1037/1076-898x.5.2.205 (metadata only)
- Fisher & Keil. https://doi.org/10.1111/cogs.12280
- Kulgemeyer (2018). ERIC EJ1165853
- Atkinson, Renkl & Merrill. https://doi.org/10.1037/0022-0663.95.4.774
- Renkl, Atkinson & Grosse (2004). ERIC EJ732331. Salden et al. (2010). ERIC EJ880294
- Kim, Belland & Walker (2018). ERIC EJ1179108. Qu et al. (2026). ERIC EJ1511273
- Sinha & Kapur. https://doi.org/10.3102/00346543211019105
- Van der Kleij, Feskens & Eggen. https://doi.org/10.3102/0034654314564881
- Butler, Godbole & Marsh. https://doi.org/10.1037/a0031026
- Corral & Carpenter (2024). ERIC EJ1453351
- Wisniewski, Zierer & Hattie. https://doi.org/10.3389/fpsyg.2019.03087
- Rowland (2014). https://doi.org/10.1037/a0037559
- Bisra et al. https://doi.org/10.1007/s10648-018-9434-x
- Ebersbach et al. https://doi.org/10.1002/acp.3639
- Zhang (2023) dissertation. ERIC ED637692
- Gupta et al. (2026). https://doi.org/10.1186/s12909-026-08585-1
- Griffith & Pawlow (2025). https://doi.org/10.1097/nne.0000000000001926
- Nour & Harris (2025). https://doi.org/10.7759/cureus.95674
- Wothe et al. (2023). https://doi.org/10.1177/23821205231173289
- Almaabreh et al. (2026). https://doi.org/10.1186/s12909-026-09040-x
- Alnaser-Almusa et al. (2026). https://doi.org/10.3389/fmed.2026.1896043
- Levy et al. (2023). https://doi.org/10.1177/23821205231205389
- Frappa et al. (2026). https://doi.org/10.1007/s40670-026-02643-5
- Balczewski et al. (2025). https://doi.org/10.1007/s40670-025-02518-1
