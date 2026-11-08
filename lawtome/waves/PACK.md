# Morning judging pack

Instructions for the scheduled Claude run that prepares Krishna's morning
decisions. The detector measures; this run does the research a person would
otherwise do, so Krishna only decides and merges. It never decides, publishes,
posts, commits or edits a law file.

## Inputs

- Today's queue: `lawtome/waves/out/YYYY-MM-DD.md` and `.json`, the newest
  non-test report. If the newest is not from today, say so at the top of the
  pack and work from it anyway.
- `lawtome/waves/out/hourly-latest.md`: same-day alerts.
- The rules: `lawtome/waves/JUDGE.md`. Follow them exactly.
- `lawtome/waves/decisions.json`: skip any law judged in the last 7 days.
- `lawtome/waves/calendar.json`: events in the next 7 days.

## For each law wave in the queue (top 6 by score)

1. **Find the cause.** Use the evidence lines first, then web search: news,
   X, LinkedIn, YouTube, Reddit. The detector can't see phone-led platforms;
   web search sometimes can. For a phone-led wave, look for the original viral
   post. The best move may be to show up there, not to publish after it.
2. **Name the cause in one line, with its source URL,** or write "No cause
   found". Open every source you cite and quote the sentence that supports the
   claim. Never cite a page you haven't opened. Never repeat a number your
   source doesn't state.
3. **Apply JUDGE.md:** human hold, desktop-led with no cause, political
   neutrality, crowdedness. Then give a recommendation: `update`, `reply`,
   `page` or `skip`, with one line of why. Krishna makes the call.
4. **If the recommendation is `update`:** draft the law-page example as JSON,
   ready to paste into that law's `examples`:
   `{ "tag": "In the wild · <Mon YYYY>", "text": "...", "date": "YYYY-MM-DD", "source": { "text": "<Outlet>, <d Mon YYYY>", "url": "...", "checked": "<today>" } }`.
   Keep it to two sentences: the event, then how it shows the law's mechanism.
5. **If there is a live thread** (hub or reply-today line): draft one reply
   using the `krishna-voice` skill. The full answer goes in the comment itself,
   with at most one link to the law page. Follow the thread site's rules
   (JUDGE.md, "Reply today").

## The viral pool: first-mover links

Read the viral pool and the HN front page against the Tome. Propose at most
three unspoken links. Each must pass JUDGE.md's four tests:
1. mechanism, not topic;
2. one sentence;
3. it predicts;
4. it survives a refute pass. Write the refute pass out: the best alternative
   explanation, and why it loses.

Most days, propose none. An empty section is the right answer when nothing
passes.

## Calendar

For each event in the next 7 days, list the laws and one line on what to
prepare. If an event is within 48 hours, draft the law-page example now, marked
"to publish when the event happens".

## Emerging terms and missing laws

For each emerging term and each law-like article missing from the Tome:
- Is it new, or established (with a first-use source if you found one)?
- Is the coiner verifiable?
- Is it worth a Canon entry?

## Output

Write `lawtome/waves/out/packs/YYYY-MM-DD.md`. Put a 3-line summary at the top:
how many waves, how many recommended actions, and anything time-critical
today. Then one section per wave, then the viral pool, calendar and emerging
terms.

End with ready-to-paste `decisions.json` lines for Krishna to accept or edit.
Don't write them to `decisions.json` yourself.

Do nothing else: no commits, no branches, no edits outside `waves/out/packs/`,
no posting, no messages.
