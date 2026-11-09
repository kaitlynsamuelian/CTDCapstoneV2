# CTD Senior Capstone | Fall 2026 – Spring 2027

University of Colorado Boulder, ATLAS Creative Technology & Design.
**Team:** Kaitlyn Samuelian, Caitlin Owen, Austin Page.

**As of Nov 9, 2026:** the team is leaning toward **Synchrony Reward**, a piece whose image/outcome changes with how many people experience it together, built in two parts: **Sensing** (count people, maybe sync) and **Display** (form still open). Feasibility tests are on a one-week extension. See `CLAUDE.md` for full context.

## Open in VS Code + Claude Code
1. Unzip, open the `CTD-Capstone` folder in VS Code.
2. Open the Claude Code extension. It reads `CLAUDE.md` automatically.
3. Good first prompt: *"Read CLAUDE.md, docs/links.md, and Project-Management/, then tell me what's next."*

## Put it in a git repo
```bash
cd CTD-Capstone
git init && git add . && git commit -m "Initial capstone project import"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
If you're adding this to the existing CTD-Capstone repo instead, copy the folders over the top of your clone and commit.

### Large media files
`Media/` is about 81 MB (biggest file 13.8 MB, all under GitHub's 100 MB limit), so a plain push works. Options if you want the repo lighter:
- **Git LFS:** `git lfs install && git lfs track "*.mp4" "*.gif" "*.zip"` before `git add`.
- **Skip media:** uncomment the lines in `.gitignore` to keep the media local only.

## Where things live
- `CLAUDE.md`: project context and working rules for Claude Code.
- `docs/links.md`: all online docs (precedents, brainstorms, build options, feasibility, teacher feedback).
- `Project-Management/`: status, timeline, decision log, faculty questions.
- `Course-Materials/`: RMPP structure, rubric, and assignment templates.
- `Research/`, `Ideation/`, `Testing/`, `Development/`, `Deliverables/`: working folders.
- `Exports/`: Markdown write-ups (story so far, sounding-board notes) and an Oct 26 docs zip.
- `Media/`: concept animations (Oct 28) and form renderings (Nov 4).
- `Claude-Setup/`: earlier Claude project instructions and first prompts.
