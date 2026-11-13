# Claude Code instructions — CTD Senior Capstone

## Purpose and stage
- University of Colorado Boulder Creative Technology & Design (ATLAS) senior capstone, Fall 2026–Spring 2027.
- Fall: research, ideation, feasibility tests, and a faculty-reviewed proposal/pitch (RMPP). Spring: production, user testing, refinement, and the ATLAS Expo.
- **Team (3):** Kaitlyn Samuelian, Caitlin Owen, Austin Page. Roles are not formally assigned.

## Where the project is now (as of Nov 13, 2026)
- **Working direction: MetamorphUs.** Strangers restore a dying digital ecosystem together with physical controllers (4 to 5, one element each: e.g. sunlight, water, wind, heat, nutrients). When every element is held in balance, the world blooms and transforms into a glowing butterfly made of petals. Proposal framing: strangers "becoming Mother Earth together."
- **Two fixed rules:** strangers must cooperate and one person can't succeed alone; physical controllers drive a digital ecosystem on a screen.
- **Still open:** controller form (Garden Table / Ecosystem Engine / Tethered Pods or other), how to prevent solo play (floor dots, range lock, camera, etc.), environmental events, display, software (p5.js, Unity, TouchDesigner…). Slides show open items as `[X]`; options live in the research pages; undecided ideas in `Ideation/Design-Ideas-To-Explore.md`.
- **Team roles (draft, `Project-Management/Team-Roles-Draft.md`):** Kaitlyn project lead + controls and code; Caitlin physical experience; Austin digital world. Confirm before logging.
- **Goal, in Kaitlyn's framing:** encourage connection through a payoff that can only happen if multiple people are interacting together, and the outcome must be remarkable. (Do NOT reframe it as "what makes strangers cooperate without being told"; she rejected that.)
- **History:** Synchrony Reward (group-size image) was the earlier direction; kept in docs as explored, not active.
- Not yet recorded as a confirmed decision in `Project-Management/Decision-Log.md`.

## Where information goes
- What people said → `Research/User-Interview-Notes.md`. Options and evidence → research pages (links in `docs/links.md`). Undecided ideas → `Ideation/Design-Ideas-To-Explore.md`. Decisions → `Decision-Log.md`. Slides → decided items only, `[X]` for open ones.
- Research pages use a handwritten-notes style; only the slides use the moonlit-forest theme.

## Teacher feedback (Nov 6, 2026: Aidan Chopra, Form professor, sounding board; from Kaitlyn's notes)
- Split the work into **Sensing** and **Display**.
- Push toward groups of strangers (~6) acting together; the payoff should be hard and worth it (e.g. hatch a dragon egg, save a kitten, real-world payoffs).
- Feasibility study should focus on sensing: several inputs weighed together (e.g. everyone presses a button at once), simple output, testers give "this would be better if…" ideas.
- Study Pearl Street buskers: much of the act is building and holding a crowd. The piece might draw its own crowd.
- Suzanne asked the team to turn in the feasibility tests on Nov 6 as-is; the team has a **one-week extension** and will resubmit the same link when complete (see `Deliverables/Fall-2026/Feasibility-Tests/`).

## Likely next steps (suggestions, not assignments)
- Finish and resubmit the feasibility tests (renderings, audience interviews, professor-feedback interview, technical tests for sensing, display, and connection).
- Build the sensing core first (people count + hold/smoothing logic). It works with any display, so it can start before the form is chosen.
- Run a cheap screen version of the display to test the experience before buying parts.
- Busker / crowd observation on Pearl Street.
- Decide display form and whether sync stays; then log it in `Decision-Log.md`.
- Move toward the ATLAS Capstone Proposal (template in `Course-Materials/Templates/`).

## Where things are
- `docs/links.md`: every online Claude doc/artifact made so far (precedents, brainstorms, build options, feasibility, teacher feedback). Those docs are online only; this repo just links them.
- `Exports/`: Markdown story-so-far (Nov 1), sounding-board notes (Nov 5), and a zip of Oct 26 idea docs.
- `Media/animations-2026-10-28/`: 13 concept mockup animations (illustrative, not prototypes) + combined reel.
- `Media/renderings-2026-11-04/`: draft three.js form-comparison renderings (V1 at 3 m, V2 cheapest S/M/L sizes, V3 at 48×30 in and 72×45 in). Cost figures in them are estimates.
- `Course-Materials/`: RMPP structure + rubric PDFs; `Templates/` holds the precedents, feasibility, and proposal templates as uploaded.
- `Project-Management/`: status, timeline, decision log, faculty questions. **Current-Status.md is dated Oct 21 and is out of date**; update it when the team confirms.

## Working rules (from the team)
- Kaitlyn prefers **new versions as new files** (V2, V3…). Never overwrite or delete earlier versions or explored ideas.
- Keep submissions to what the template asks for; brief.
- Inches preferred for sizes; confirm sizes before rendering.
- Separate "explored" vs "new" ideas; don't narrow or rank while brainstorming unless asked. When asked to narrow, compare by impact, audience, technical challenge, evidence, resources, and timeframe.
- Venn diagrams, 50 ideas, elevator-pitch slides, user flows, sounding boards are optional tools unless instructors require them.
- Experiment-count mismatch to confirm with faculty: team target 3–4 mini-experiments per person (≥1 technical) vs RMPP PDF 3–6 per person (1–3 technical).
- Never fabricate precedents, sources, interviews, faculty feedback, measurements, or prototype results. Prices in docs are estimates unless marked sourced.
- An AI-drafted document is not the team's completed academic work; the team reviews and owns submissions.
- Ask before commits, merges, destructive operations, publishing, emailing others, or paid operations.
- Privacy: don't store participant identifiers, recordings, health signals, or passwords without consent and a data plan (camera sensing makes this relevant).
- No tech stack chosen yet; prefer simple, maintainable code in `Development/`.
