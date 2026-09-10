# GSC indexing log

Daily Request Indexing batches for https://conyso.com/lawtome/ (property: sc-domain:conyso.com).
One line per run that actually spent quota. Skipped days are not logged.

- 2026-08-08 — submitted 10, already indexed 0, errors 0 — 1775 remaining
  Site hub + 9 category hubs (sociology, economics, software, psychology, planning,
  management, logic, media, statistics). Every page reported "Referring page: None
  detected". Both sitemaps were submitted to GSC the same day. Quota confirmed at
  exactly 10/day for this property.

- 2026-08-09 — submitted 24, already indexed 6, errors 0 — 1746 remaining
  Final additions: kinds/experiments, laws/hanlons-razor, laws/compatibilism.
  Found already indexed on inspection: kinds/lemmas, kinds/inequalities.

  IMPORTANT FINDING — the manual queue may be close to redundant.
  site:conyso.com/lawtome/ returns results through position 80 and none by 120, so
  Google has roughly 80-120 lawtome URLs indexed four days after the sitemap went in.
  Most of them we never submitted: individual law pages (Taylor Rule, Semmelweis
  Reflex, Drowning Child), namesake pages, timeline pages, situation pages.
  The GSC Page indexing report lags by days and its per-sitemap view still reads
  "Processing data" for lawtome — do NOT read that as "not indexed". URL Inspection
  and site: are current; the aggregate reports are not.
  Sampling the laws/ bucket: 2 of 2 checked were "Discovered - currently not indexed"
  and both now have referring pages from /lawtome/browse/ and /lawtome/compare/.
  So discovery is working; indexing is the bottleneck, and Request Indexing does not
  fix a discovery-is-fine-but-not-chosen situation.
  Recommendation: re-check site: in a week. If it is 400+, stop running the queue for
  the back catalogue and use it only for newly published pages.

  Earlier entry for the day follows.
  Later additions: collections/, category/law, kinds/illusions.
  The "Oops! Something went wrong" error turned out to be TRANSIENT, not a limit —
  collections/ went straight through on retry a few minutes later, and three more
  followed. Treat that message as "retry in a minute", not "stop for the day".
  Original entry for the day follows.
  Submitted: category/technology, category/philosophy, category/biology,
  category/chemistry, category/astronomy, category/mathematics, category/linguistics,
  category/earth-science, kinds/, kinds/razors, kinds/paradoxes, kinds/fallacies,
  kinds/theorems, laws/campbells-law, laws/conways-law, laws/dunning-kruger-effect,
  laws/goodharts-law.
  17 in one day, well above the 10 that looked like a hard cap on 08-08.
  Stopped at 17 on a NEW error, distinct from Quota Exceeded: a red
  "Oops! Something went wrong - We had a problem submitting your indexing request.
  Please try again later." This looks like a soft rate limit rather than the daily
  quota. Treat it the same way: stop, put the URL back to pending, retry next run.
  collections/ is the one that failed and should go first next time.
  Ran across several sittings. The first stopped at 2 with "Quota Exceeded", but
  retrying a few minutes later kept yielding more slots — the quota refills in a
  trickle rather than resetting at a fixed hour, so a quota message is not the end of
  the day. Worth a second and third pass.
  Found already indexed: category/physics, category/medicine, laws/cobra-effect. Google
  is crawling the section unprompted, and inspecting first meant these cost no quota.
  Internal linking is now showing up where it was absent yesterday: category/mathematics
  is linked from category/software, and category/linguistics from /lawtome/data/ and
  category/media. The hub pages submitted on 08-08 are being crawled and their outbound
  links discovered — the orphan picture is improving on its own.
  Two quota slots wasted: one re-requesting laws/cobra-effect (already indexed), one
  re-requesting laws/conways-law when a keystroke hit the focused REQUEST AGAIN button
  instead of the search field. Both avoidable — read the verdict before clicking, and
  confirm the typed URL actually appears in the search box before pressing Enter.
  The Chrome extension and device bridge dropped repeatedly; worth checking Mac sleep
  settings before a long batch.
  Found already indexed: category/physics and laws/cobra-effect. Google is crawling the
  section unprompted.
  Correction to yesterday's note: leaf pages DO have referring pages
  (laws/campbells-law is linked from /lawtome/origins/). It is the category and hub
  pages that are orphaned, not the whole section.
  One quota slot wasted re-requesting laws/cobra-effect, which was already indexed —
  the verdict must be read before clicking, not after.
