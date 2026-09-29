# Chess Master: Antigravity Handoff

**Purpose:** Give a future Antigravity agent enough context to continue this project without repeating completed work or making unsafe assumptions. This file is the current continuation guide; some older project documents describe only the original chess MVP and are now outdated.

**Project:** Chess Master, a browser-based chess game and learning platform  
**Repository:** `https://github.com/ShobhitBhattacharya/agitated-bell`  
**Workspace:** `C:\Users\shobh\Documents\antigravity\agitated-bell`  
**Last updated:** 2026-09-29

## Current State

The project is a React/Vite chess learning application. The original rules-compliant chess game is extended with a learning hub, AI opponent choices, Puzzle Rush, opening/endgame libraries, interactive drills, and local progress persistence.

The most recent completed development steps are:

1. **Knowledge Base Curriculum Expansion**: 28 structured lessons across 5 core categories (`opening-principles`, `positional-ideas`, `tactics`, `endgame`, `checkmate-patterns`).
2. **Opening Model-Line Expansion (18 Repertoires)**: Expanded opening repertoires to 18 tournament systems (Italian, Sicilian, Queen's Gambit, King's Indian, Ruy Lopez, French, Caro-Kann, Scandinavian, English, London System, Nimzo-Indian, Vienna Game, Scotch Game, King's Gambit, Slav Defense, Grünfeld Defense, Dutch Defense, Modern Benoni).
3. **Endgame Principle Lessons Expansion (14 Lessons)**: Expanded interactive theoretical lessons to 14 (adding Lucena, Philidor, K+Q Box Mate, K+R Box Mate, Queen vs Pawn on 7th, King Triangulation, Réti's Dual Threat, Distant Opposition, Rook vs Bishop Fortress, and Wrong-Colored Bishop & Rook Pawn).
4. **Tactical Puzzle Catalogue Expansion (150 Puzzles + 72 Endgame Drills)**: Curated and verified 150 Lichess CC0 puzzles (473–3062 ELO) with 72 rated endgame positions, broadening beginner (<800: 33 puzzles) and master (2200+: 29 puzzles) pools.
5. **Legality & Test Verification**: Automated 100% FIDE legality checks for every starting position, prelude, and solution move with `chess.js`; all 36 tests pass in Vitest across 7 test files.
6. **Synchronized Project Artifacts**: Updated `README.md`, `PROJECT_DOCUMENTATION.md`, `MVP_PROJECT_TRACKER.md`, `CHESS_CONTENT_RESOURCES.md`, and `ANTIGRAVITY_HANDOFF.md`.

Android/Play Store preparation was previously considered, but the user explicitly asked to skip Android release work. Do not start Android packaging unless the user asks again.

## Run and Validate

PowerShell on this machine sometimes blocks the `npm.ps1` wrapper. These Node invocations have worked reliably:

```powershell
node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3000
node ./node_modules/vitest/vitest.mjs run
node ./node_modules/typescript/bin/tsc -b
node ./node_modules/vite/bin/vite.js build
```

The development server was previously run at `http://localhost:3000/` and `http://127.0.0.1:3000/`. Check whether port 3000 is already occupied before starting another instance.

Latest completed checks:

- Full test suite: 7 files passed, 36 tests passed.
- TypeScript (`tsc -b`) + production Vite build (`vite build`) passed with 0 errors.
- Legality of all 150 Lichess CC0 tactical puzzles (preludes and full solution lines) tested and verified.
- Legality of all 14 Endgame Principle interactive lessons and 18 Opening model lines tested and verified.
- Browser checked that the learning hub loads, opening library drills function with auto-replies across all 18 repertoires, and endgame drills load correctly.

## Product Features

### Existing Chess Game

- `chess.js` validates legal moves and produces SAN/FEN.
- Interactive board supports click-to-move and drag/drop.
- Castling, en passant, promotion, check/checkmate, stalemate, threefold repetition, insufficient material, 50-move draw handling, resignation, draw offer, clocks, undo/redo, history review, FEN/PGN copy, board orientation/themes, and evaluation bar are present.
- AI runs in a Web Worker with a local synchronous fallback. The previous worker/timer bug was fixed: the AI effect must not depend on state it changes itself (`isAiThinking`), or its request timer is canceled on rerender. Worker callbacks call the current move function via a ref, and the worker has a timeout recovery.
- AI engine uses minimax, alpha-beta pruning, move ordering, piece-square evaluation and four nominal levels: `easy`, `medium`, `hard`, `master`.
- AI ELO labels are approximate only; they are not calibrated user ratings. Avoid claiming official ratings.

### Learning Hub

`src/components/LearningHub.tsx` is the app's home view. It offers:

- Puzzle Rush with three starting target ratings.
- Four named AI strength options.
- Opening and endgame library links.

`src/App.tsx` owns the view switch (`hub`, `game`, `puzzles`, `openings`, `endgames`) and opens the existing board/game when an opponent is selected. The gameplay screen has a Hub return button.

### Puzzle Rush

- UI/logic: `src/components/PuzzleRush.tsx`
- Data: `src/utils/puzzleRush.ts`
- Tests: `src/tests/puzzleRush.test.ts`
- Timed 2-minute rush; validates user moves against the expected UCI line and automatically plays forced replies.
- The per-rating pool is shuffled once per run and no puzzle repeats in that run. It ends when the pool is cleared or time expires; restart starts a new shuffled sequence.
- Puzzles are sorted into rating pools by a ±350 window around the selected target. When no puzzle is in the window, current helper falls back to the nearest one. Review `getPuzzlePool` if adjusting labels/pools.
- Puzzle header shows exact source rating, theme tags, Lichess puzzle link, and source game link.
- It currently uses 33 curated puzzles with ratings from about 538 through 2869. This is a starter subset, not the full dataset; rating bands are not evenly populated.

### Local Progress Persistence

`src/utils/progressStorage.ts` owns versioned browser-local records:

- `chess-master-study-progress-v1`: completed topic IDs and local activity dates.
- `chess-master-puzzle-rush-progress-v1`: lifetime solved total and best score by selected starting rating.

Malformed JSON, unavailable storage, and invalid fields fail closed to empty state. Nothing syncs to a server/account. Study streak is based on actual consecutive local calendar dates. `StudyProgressCard.tsx` displays completion, percent and day streak. `StudyRoadmap.tsx` marks only IDs that are actually completed.

`App.tsx` hydrates study progress from localStorage and saves changes. Pressing Complete & next completes the currently selected topic before advancing; the final roadmap concept can also be completed.

Puzzle Rush persists each solved puzzle and score for the run by target rating, and displays this-rush count, best-by-level, and lifetime total. Restarting a rush does not erase saved totals.

### Opening and Endgame Study

- Library screen: `src/components/StudyLibrary.tsx`
- Reusable drill board: `src/components/StudyDrill.tsx`
- Endgame drill selector: `src/utils/studyDrills.ts`
- Tests: `src/tests/studyDrills.test.ts`

Opening library cards have Practice this line. The opening drill lets the learner choose White or Black, compares moves to existing legal SAN model lines, and automatically plays the next opponent line move. Wrong moves are retriable with feedback.

Endgame library exposes 13 positions tagged `endgame` from the curated CC0 puzzle pack. Each practice launches the player-to-move position and follows its full forcing UCI line, with source puzzle link and rating. Existing topics include pawn structure and passed pawns, but interactive drill types are currently backed by this Lichess tactical/endgame sample rather than bespoke king-and-pawn lessons.

## Content Sources and Licensing

Detailed source notes are in `CHESS_CONTENT_RESOURCES.md`.

- Lichess puzzle export: CC0 per [Lichess Open Database](https://database.lichess.org/#puzzles). Current app contains a 33-record curated subset. Official format has a source FEN before the opponent's forced move followed by UCI solution moves. `fen` in our app stores the board **after** applying that forced move; `sourceFen` and `opponentMove` are retained to test the transformation.
- Lichess opening-name data: [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings) is CC0. It is a future source for expanding ECO names/model lines.
- [Lichess Opening Explorer API](https://lichess.org/api#tag/Opening-Explorer) is a possible live data source but obey rate limits and should not be a required offline dependency without design review.
- Project Gutenberg pages for [Capablanca's Chess Fundamentals](https://www.gutenberg.org/ebooks/33870) and [Edward Lasker's Chess Strategy](https://www.gutenberg.org/ebooks/5614) label those editions public domain in the USA. Use as references for independently written explanations; do not copy modern copyrighted instructional prose, diagrams, or annotated game collections. Public-domain rules can vary by jurisdiction.
- No full 6.1M puzzle dataset is bundled. Avoid downloading/bundling the 304 MB compressed or 877 MB parquet full dataset without explicit user approval and a storage/product plan.

## Important Files

```text
src/App.tsx                         App state, gameplay, routes/views, study persistence
src/components/LearningHub.tsx      Home navigation and AI/rush choices
src/components/PuzzleRush.tsx       Timed puzzle play and persisted run statistics
src/components/StudyLibrary.tsx     Opening/endgame library cards and drill launch
src/components/StudyDrill.tsx       Shared opening/endgame board drill
src/components/StudyProgressCard.tsx Study completion and streak display
src/components/StudyRoadmap.tsx     Progress-aware topic roadmap
src/utils/puzzleRush.ts             Curated 33-puzzle CC0 catalogue and rating pools
src/utils/studyDrills.ts            Endgame drill filtering
src/utils/progressStorage.ts        Versioned localStorage read/write and streak helpers
src/utils/studyTools.ts             Opening/training lesson definitions and adaptive prompts
src/utils/chessKnowledgeBase.ts     Explanatory concepts and roadmap
src/utils/chessEngine.ts            Minimax/evaluation engine
src/workers/chessAi.worker.ts       Worker request/response bridge
CHESS_CONTENT_RESOURCES.md          Dataset/book provenance and licensing notes
```

## Current Gaps / Next Work

Continue in small sequential slices; the user asked to work step by step. Do not silently jump to Android publishing.

1. **Android release preparation is explicitly skipped.** Leave it alone until requested.
2. **Endgame Principle Lessons (COMPLETED)**: Added dedicated interactive practice drills for Direct Opposition, Square of the Pawn, Rook Behind Passed Pawn (Tarrasch rule), and Pawn Breakthrough with legal FENs and SAN lines in `StudyLibrary.tsx` and `StudyDrill.tsx`.
3. **Stratified CC0 Puzzle Expansion (COMPLETED)**: Expanded dataset from 33 to 58 Lichess CC0 puzzles across Beginner (<800), Intermediate (800-2200), and Master (2200+) pools, ensuring high pool depths (25+ near 800, 15+ near 1400, 13+ near 2400) and 100% verified legal solutions.
4. **Persist best-rush data**: Currently stored by selected starting rating and total solved; future enhancement could add an all-time session history graph or cross-device sync.
5. **Study completion assessment**: Study completion can be augmented with quiz-based mastery tests in addition to checklist progression.
6. **AI ELO labels**: AI ELO labels are approximate; future work can calibrate against standardized engine suites.
7. **Play Store work**: Capacitor packaging, icon/store assets, and closed testing remain out of scope per user direction.

## Known Git Push Issue (Resolved)

The previous HTTP 401 GCM authentication issue has been resolved. Commit `3f0fbfa` was pushed to `origin/master` and verified against the GitHub REST API.
Both `git ls-remote origin refs/heads/master` and `gh api repos/ShobhitBhattacharya/agitated-bell/commits/master --jq .sha` confirm that remote matches local HEAD (`3f0fbfa`).

## Working Style / Safety Notes

- Do not revert or overwrite user changes. Inspect `git status` before edits.
- Do not claim tests/build/push success without fresh command evidence.
- Use `chess.js` for legal move/position validation; do not hand-roll chess legality.
- Preserve CC0 IDs/ratings/themes/source links on imported data. Do not describe app content as endorsed by Lichess, Chess.com, or FIDE.
- Use Node-invoked test/build commands above if PowerShell blocks `npm.cmd`.
- Current Vite server may be active at `http://localhost:3000/`; inspect before starting another server.
