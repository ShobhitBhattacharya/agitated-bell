# Chess Master: Project Architecture & Engineering Handbook

> **Document Purpose**: This handbook serves as the definitive reference for this project—explaining **WHAT** was built, **HOW** it was built, and the architectural **WHY** behind every design and technical decision. Keep this document handy as you inspect and extend the project in VS Code.

---

## 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Agile Project Methodology & Traceability](#-agile-project-methodology--traceability)
3. [WHAT We Built (Feature Breakdown)](#2-what-we-built)
4. [HOW We Built It (Architecture & Implementation)](#3-how-we-built-it)
5. [WHY We Built It This Way (Technical Rationale)](#4-why-we-built-it-this-way)
6. [Codebase Map & File Responsibilities](#5-codebase-map--file-responsibilities)
7. [Testing & Quality Assurance](#6-testing--quality-assurance)
8. [Developer Guide: Extending & Modifying in VS Code](#7-developer-guide)

---

## 📋 Agile Project Methodology & Traceability

This project strictly adheres to a structured Agile delivery framework with complete bidirectional traceability from **EPIC (MVP)** down to **Features**, **User Stories (US)**, and **Technical Tasks**:

> 👉 **Full Agile Story Tracker**: See **[`MVP_PROJECT_TRACKER.md`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/MVP_PROJECT_TRACKER.md)** for detailed User Stories, Acceptance Criteria (Given/When/Then), Task IDs, and Sprint delivery records.

---

## 1. Executive Summary

**Chess Master** is an interactive, browser-based chess web application engineered to adhere strictly to **official FIDE regulations** and **Chess.com user experience standards**. 

It features:
- Complete FIDE rule validation (castling, en passant, promotion, threefold repetition, 50-move rule, insufficient material).
- Multi-tier AI engine running on a dedicated **Web Worker** using **Minimax with Alpha-Beta pruning** and **Piece-Square Tables (PST)**.
- Real-time **Live Evaluation Bar** displaying continuous positional balance.
- Procedural sound generation via the **Web Audio API** (zero external asset dependencies).
- Dual digital chess clocks with configurable increments.
- Full move history in **Standard Algebraic Notation (SAN)** with past-move stepping and FEN/PGN clipboard export.

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                              Main UI Thread                           │
 │                                                                        │
 │   ┌──────────────────────┐  ┌──────────────────────────────────────┐   │
 │   │ Live Evaluation Bar  │  │            Interactive Board         │   │
 │   │ (Centipawn Gauge)    │  │  - Click-to-Move / Drag-and-Drop    │   │
 │   └──────────▲───────────┘  │  - Chess.com Square Highlighting     │   │
 │              │              │  - Promotion Modal                   │   │
 │              │              └──────────────────▲───────────────────┘   │
 │              │                                 │                       │
 │   ┌──────────┴─────────────────────────────────┴───────────────────┐   │
 │   │                      App State & Rules                         │   │
 │   │        (chess.js FIDE Validator • Clocks • Audio Engine)       │   │
 │   └──────────────────────────────▲─────────────────────────────────┘   │
 └──────────────────────────────────┼─────────────────────────────────────┘
                                    │ Non-blocking message passing
                                    ▼ (FEN, Difficulty)
 ┌────────────────────────────────────────────────────────────────────────┐
 │                           Web Worker Thread                            │
 │                                                                        │
 │   ┌────────────────────────────────────────────────────────────────┐   │
 │   │                        AI Engine Worker                        │   │
 │   │   - Minimax + Alpha-Beta Pruning (Depths 1 to 5)               │   │
 │   │   - Piece-Square Evaluation Tables (PST)                       │   │
 │   │   - MVV-LVA Move Ordering (Captures first)                     │   │
 │   └────────────────────────────────────────────────────────────────┘   │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. WHAT We Built

### Core Gameplay & Rule Compliance
- **FIDE Checkmate & Stalemate**:
  - Detects true checkmate (Rule 1.2).
  - Detects stalemate (Rule 5.2.1: player to move has no legal moves and king is not in check $\rightarrow$ automatic draw).
- **En Passant Capture**:
  - Validated strictly on the immediate reply to a 2-square pawn advance.
- **Castling Rights**:
  - Kingside (`O-O`) and Queenside (`O-O-O`).
  - Verifies neither piece has moved, the transit path is clear, and the king is not in check, does not cross check, and does not land in check.
- **Pawn Promotion**:
  - Interactive modal displaying Queen, Knight, Rook, and Bishop as soon as a pawn reaches the 8th/1st rank.
- **Draw Mechanisms**:
  - **Threefold Repetition** (Rule 9.2): Identical position, castling rights, and en passant availability reached 3 times.
  - **Fifty-Move Rule** (Rule 9.3): 50 consecutive moves by White and Black without a pawn advance or piece capture.
  - **Insufficient Material** (Rule 9.6): K vs K, K+B vs K, K+N vs K, and K+B vs K+B with same-colored bishops.
  - **Mutual Draw Offer & Resignation**: Buttons with 3-second accidental-click confirmation shields.

### Chess.com Look & Feel
- **Board Themes**: 5 selectable palettes:
  - *Chess.com Classic Green* (`#ebecd0` / `#779556`)
  - *Classic Wood* (`#f0d9b5` / `#b58863`)
  - *Modern Slate* (`#dee3e6` / `#8ca2ad`)
  - *Midnight Navy* (`#9faec2` / `#3e4f65`)
  - *Tournament Glass* (`#d1d5db` / `#4b5563`)
- **Move Highlights**:
  - Source & destination squares highlighted in soft translucent yellow (`#f7f769` and `#baca44`).
  - Center dots for empty legal destinations; circular target rings for capturable enemy pieces.
  - King in check pulses with a radial crimson red gradient.
- **Live Evaluation Bar**:
  - Vertical bar beside the board that dynamically shifts with positional advantage, mapped with a sigmoid curve from -1500 to +1500 centipawns, showing labels like `+1.8`, `-0.7`, or `+M` (mate).
  - Automatically reverses orientation when the board is flipped.

### Interactive Learning Hub & Drills (Phase 2 & Content Expansion)
- **Central Learning Hub**:
  - Comprehensive learning portal with instant navigation to Casual AI, Timed Puzzle Rush, Opening Repertoires, and Endgame Training.
  - Interactive Topic Roadmap tracking learner progress across 28 structured lessons covering:
    - *Opening Principles* (Center Control, Minor Piece Development, King Safety & Castling, Piece Tempo & Initiative).
    - *Positional Ideas* (Space Advantage & Maneuvering, Outpost Squares, Open Files & Heavy Pieces, The Bishop Pair, Prophylaxis & Prevention).
    - *Tactical Motifs* (Pins, Forks, Skewers, Discovered Attacks, Deflection & Decoy, Overloaded Defenders, Interference & Line Blocking, Zwischenzug / In-Between Moves).
    - *Endgame Mastery* (King Opposition, Square of the Pawn, Rook Activity & Cut-off, Pawn Breakthrough, The Lucena Position, The Philidor Defense, King Activity & Centralization).
    - *Checkmate Patterns* (Back Rank Mate, Smothered Mate, Anastasia's Mate, Arabian Mate, Boden's Mate).
- **Local Progress & Streak Persistence**:
  - Browser-local storage (`chess-master-study-progress-v1` and `chess-master-puzzle-rush-progress-v1`) tracking completed curriculum topics, consecutive daily study streaks, lifetime puzzle solves, and high scores.
- **2-Minute Puzzle Rush**:
  - Real-time tactical rush engine with dynamic countdown, score calculation, instant green/red board feedback, and automatic opponent responses.
  - Stratified 150-puzzle CC0 catalogue sourced from the official Lichess open database, supporting Beginner (<800: 33 puzzles), Intermediate (800–2200: 88 puzzles), and Master (2200+: 29 puzzles) pools.
- **Opening Model-Line Trainer, Variations & Playstyle Classification**:
  - Repertoire drill board with selectable White or Black perspective, validating learner moves against 18 tournament-tested systems deepened to **10–16 plies** (5–8 full moves) with automated book replies and named variations:
    1. Italian Game (`C50-C59` · Positional) · *Variations: Evans Gambit (⚔️), Two Knights Defense (⚡)*
    2. Sicilian Defense (`B20-B99` · Dynamic) · *Variations: Dragon (⚔️), Alapin (♟️), Closed (♟️)*
    3. Queen's Gambit (`D06-D69` · Positional) · *Variations: QGA (⚡), Tarrasch Defense (⚔️)*
    4. King's Indian Defense (`E60-E99` · Aggressive) · *Variations: Sämisch Variation (♟️)*
    5. Ruy Lopez (`C60-C99` · Positional) · *Variations: Berlin Defense (🛡️), Exchange Variation (♟️)*
    6. French Defense (`C10-C14` · Solid) · *Variations: Advance Variation (♟️), Winawer Variation (⚔️)*
    7. Caro-Kann Defense (`B10-B19` · Solid) · *Variations: Advance Variation (⚡), Panov-Botvinnik Attack (⚔️)*
    8. Scandinavian Defense (`B01` · Dynamic) · *Variations: Modern 2... Nf6 (⚡)*
    9. English Opening (`A10-A39` · Positional) · *Variations: Symmetrical English (🛡️)*
    10. London System (`D02` · Solid) · *Variations: Jobava London System (⚔️)*
    11. Nimzo-Indian Defense (`E20-E59` · Positional) · *Variations: Classical 4. Qc2 (♟️)*
    12. Vienna Game (`C25-C29` · Aggressive) · *Variations: Vienna Gambit Accepted (⚔️)*
    13. Scotch Game (`C45` · Aggressive) · *Variations: Mieses Variation (⚡)*
    14. King's Gambit (`C30-C39` · Aggressive) · *Variations: Declined (♟️), Falkbeer Counter-Gambit (⚡)*
    15. Slav Defense (`D10-D19` · Solid) · *Variations: Semi-Slav Defense (⚡)*
    16. Grünfeld Defense (`D80-D99` · Dynamic) · *Variations: Russian System (♟️)*
    17. Dutch Defense (`A80-A99` · Aggressive) · *Variations: Leningrad Dutch (⚡)*
    18. Modern Benoni (`A60-A79` · Dynamic) · *Variations: Fianchetto Variation (♟️)*
  - **4-Tier Playstyle Classification**: Every opening and branch variation is categorized into:
    - ⚔️ `Aggressive / Tactical`: Direct attacks, gambits, and sacrificial piece play.
    - 🛡️ `Solid / Defensive`: Enduring, resilient pawn structures minimizing tactical risks.
    - ♟️ `Positional / Strategic`: Classical spatial control, harmonic piece maneuvers, and endgame advantages.
    - ⚡ `Dynamic / Counterattacking`: Hypermodern piece pressure, asymmetrical imbalances, and sharp counterpunches.
  - **Strategic Player Benefits**: Plain-English strategic summaries explaining exactly what each opening does for the player, helping users choose openings matching their natural gameplay style.
  - **In-Game Theory Coach**: Real-time opening detection with playstyle badge, player benefit, recommended 10–16 ply best line with a live **Next Best Move** chip, and interactive **Candidate Variations** tabs.
  - **Multi-Variation Study Drills**: Ability to toggle between Main Best Line and individual branch variations within the interactive drill board.
- **Interactive Endgame Principle Drills**:
  - Dedicated interactive drills for 14 cornerstone endgame principles:
    1. *The Lucena Position* (Bridge-building technique to escort passed rooks/pawns).
    2. *The Philidor Defense* (Passive and active 3rd/6th rank barrier defense).
    3. *Direct Opposition* (Key King maneuvers to control queuing squares).
    4. *Square of the Pawn* (Rapid geometric calculation of pawn promotion).
    5. *Rook Behind Passed Pawn* (Tarrasch rule deflection and cut-off).
    6. *Pawn Breakthrough* (Sacrificial breakthroughs in 3 vs 3 pawn structures).
    7. *King & Queen vs King Checkmate* (Systematic box contraction).
    8. *King & Rook vs King Checkmate* (Barrier creation and rank cutoffs).
    9. *Queen vs Pawn on 7th Rank* (Staircase pinning and king tempo).
    10. *King Triangulation* (Losing a tempo to force Zugzwang).
    11. *Réti's Dual Threat Endgame* (Simultaneous diagonal king march).
    12. *Distant Opposition* (Geometric distant file control converting to direct opposition).
    13. *Rook vs Bishop Fortress* (The safe corner drawing technique).
    14. *Wrong-Colored Bishop & Rook Pawn* (Corner stalemate defense).
- **Rated Endgame Tactical Drills**:
  - 72 rated endgame positions directly filterable in the Study Library for targeted endgame tactical practice.

### Clocks & Time Management
- Dual digital clocks supporting standard presets:
  - Bullet (1 min)
  - Blitz (3 min, 5|3)
  - Rapid (10 min, 15|10)
  - Untimed mode
- Increments automatically credited upon move completion.
- Warning red pulse when time drops below 20 seconds.
- Flag-fall detection (time runs out $\rightarrow$ loss on time).

### Audio Synthesis
- Procedural, zero-asset Web Audio synthesizer:
  - **Move**: Muffled wooden piece drop.
  - **Capture**: Crisp, resonant piece collision.
  - **Castle**: Rapid double-tap piece placement.
  - **Check**: High-frequency dual harmonic ping.
  - **Promotion**: 4-note ascending fanfare chime.
  - **Game Over**: Harmonized fanfare for victory; melancholy minor progression for defeat.

---

## 3. HOW We Built It

### Tech Stack
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Framework** | React 19 | Declarative UI, component lifecycle, reactive state |
| **Language** | TypeScript 5.7 | Static typing, interface contracts, compile-time safety |
| **Bundler** | Vite 6 | Sub-second cold starts, instantaneous Hot Module Replacement (HMR) |
| **Styling** | Tailwind CSS v4 | Utility-first CSS, modern theme definitions, responsive layouts |
| **Logic Engine**| `chess.js` (beta.9) | FIDE board state representation, SAN generator, FEN parser |
| **Icons** | `lucide-react` | Clean, modern SVG UI icons |
| **Effects** | `canvas-confetti` | Confetti burst upon human player victory |
| **Testing** | Vitest 5 | Unit tests for FIDE rules, search algorithms, and engine parity |

### Architectural Flow of a Move
1. **User Action**: The user either drags a piece or clicks a source square, then clicks a target square.
2. **Move Validation**: `chess.moves({ square, verbose: true })` calculates legal destinations.
3. **Promotion Check**: If a pawn lands on rank 8 (White) or rank 1 (Black), `pendingPromotion` state pauses execution and triggers `PromotionModal`.
4. **Move Application**: `chess.move({ from, to, promotion })` applies the move to the board model.
5. **State Synchronization**:
   - Updates `fen`, `lastMove`, and appends to `history` array.
   - Clears `redoStack`.
   - Adds time increment to the active player.
   - Triggers procedural audio sound.
6. **Evaluation & Status**:
   - `evaluateBoard(chess)` updates the Evaluation Bar.
   - `checkGameStatus(chess)` checks for checkmate, stalemate, 3-fold, 50-move, or insufficient material.
7. **AI Dispatch (if vs Computer)**:
   - If it's the computer's turn, a message `{ fen, difficulty, requestId }` is dispatched to `chessAi.worker.ts`.
   - The worker runs Minimax with Alpha-Beta pruning off-thread.
   - The worker replies with `{ bestMove, score, depth }`, executing the response move smoothly.

---

## 4. WHY We Built It This Way

### 1. Why `chess.js` instead of custom move generators?
- **FIDE Edge Cases**: Writing chess rules from scratch frequently leads to subtle bugs in castling rights (e.g. castling while in check or through check), en passant expiration, 3-fold repetition hashing (Zobrist keys), and 50-move counters.
- **Reliability**: `chess.js` is the battle-tested industry standard used across millions of production games. It guarantees 100% adherence to official FIDE regulations.

### 2. Why Web Workers for the AI?
- **Main Thread Unresponsiveness Problem**: Minimax searches at depths 4–5 evaluate tens of thousands of position trees. If run on JavaScript's main UI thread, the browser freezes: animations stutter, clock seconds skip, and drag gestures lag.
- **Worker Solution**: Running the search in `src/workers/chessAi.worker.ts` isolates computation onto a separate CPU thread. The UI remains at a smooth 60 FPS while the computer "thinks".

### 3. Why Procedural Web Audio API instead of MP3/WAV files?
- **Network Resiliency**: Audio files hosted via CDNs or public URLs often suffer from CORS restrictions, 404 errors, network latency, or browser audio cache purging.
- **Instant Response**: Browser-native `AudioContext` creates sound waves directly via mathematical oscillators and envelopes. Zero bytes to download, zero latency, and zero broken links.

### 4. Why Vector SVGs instead of standard PNG piece sets?
- **Resolution Independence**: Standard PNG piece sets blur or pixelate on high-DPI (Retina, 4K, modern phone) displays.
- **Scalability**: The SVG Staunton piece set renders razor-sharp at any viewport size (from a 320px phone to an ultra-wide desktop).

### 5. Why Tailwind CSS v4 with Vite?
- **Instant HMR**: In Vite, modifying any CSS rule or React component updates in the browser in less than 50 milliseconds without reloading the page or resetting your match.
- **Zero Config**: Tailwind v4 directly integrates via `@tailwindcss/vite` without cumbersome PostCSS configs.

---

## 5. Codebase Map & File Responsibilities

```
agitated-bell/
├── index.html                           # App entry HTML, fonts, and favicon
├── package.json                         # Dependencies, scripts, and tooling config
├── tsconfig.json                        # TypeScript configuration for React & WebWorker
├── vite.config.ts                       # Vite bundler config (port 3000, React, Tailwind plugins)
├── PROJECT_DOCUMENTATION.md             # This document!
├── MVP_PROJECT_TRACKER.md               # Agile breakdown (EPIC-001 & EPIC-002, User Stories, Tasks)
├── CHESS_CONTENT_RESOURCES.md           # Dataset provenance (Lichess CC0, Public Domain texts)
├── ANTIGRAVITY_HANDOFF.md               # Continuation guide, verified hashes, and roadmap tracking
│
├── src/
│   ├── main.tsx                         # React 19 root bootstrap
│   ├── App.tsx                          # Master state coordinator, views (hub/game/drills), and persistence
│   ├── index.css                        # Tailwind v4 import & custom board color themes
│   │
│   ├── types/
│   │   └── chess.ts                     # TypeScript interfaces (GameMode, Theme, TimeControl, etc.)
│   │
│   ├── utils/
│   │   ├── pieces.tsx                   # Scalable vector Staunton chess pieces (K, Q, R, B, N, P)
│   │   ├── audio.ts                     # Web Audio API sound synthesis engine
│   │   ├── evalTables.ts                # Piece-Square Tables (PST) for positional evaluation
│   │   ├── chessEngine.ts               # Minimax algorithm, Alpha-Beta pruning, deterministic best move
│   │   ├── gameReview.ts                # CAPS Accuracy engine ($103.1668 \times e^{-0.4354 \times \text{pawns}} - 3.1669$) & move classification
│   │   ├── gameArchive.ts               # Local game match archive, storage adapter, and lifetime stats
│   │   ├── botPersonalities.ts          # 4 distinct AI personalities (Mikhail, Elena, Viktor, Magnus Bot) & banter quotes
│   │   ├── chessKnowledgeBase.ts        # Explanatory concepts, roadmap categories, and study topics
│   │   ├── progressStorage.ts           # Browser-local versioned persistence for streaks and best scores
│   │   ├── puzzleRush.ts                # Stratified 150-puzzle CC0 catalogue & rating pool generators
│   │   ├── studyDrills.ts               # Endgame principle lessons & 72 rated endgame drills
│   │   └── studyTools.ts                # 18 deep opening lines (10-16 ply), 26 variations, & playstyle classification
│   │
│   ├── workers/
│   │   └── chessAi.worker.ts            # Dedicated Web Worker for background AI calculation
│   │
│   ├── components/
│   │   ├── ChessBoard.tsx               # 8x8 interactive board, right-click SVG arrows & square highlights
│   │   ├── AnalysisBoard.tsx            # Full interactive sandbox, piece palette, FEN/PGN import/export, minimax eval
│   │   ├── GameReviewModal.tsx          # Dual accuracy dials, move classification list, retry your mistakes drill
│   │   ├── GameArchiveModal.tsx         # Match history cards, win-rates %, favorite openings, 1-click review
│   │   ├── BotSelectorModal.tsx         # Opponent picker with ratings, tactical playstyles, and repertoires
│   │   ├── BotBanterBubble.tsx          # Real-time reactive opponent speech bubble during games
│   │   ├── CoordinateTrainer.tsx        # 30-second speed vision drill for board squares & notation
│   │   ├── SocialShareModal.tsx         # Branded match summary cards with 1-click clipboard copy
│   │   ├── EvaluationBar.tsx            # Chess.com-style vertical evaluation advantage bar
│   │   ├── ChessClock.tsx               # Digital timer with increment and time-warning alerts
│   │   ├── CapturedPieces.tsx           # Captured pieces tray with material lead counter
│   │   ├── MoveHistory.tsx              # SAN move list with step-through replay navigation
│   │   ├── GameControls.tsx             # New Game, Undo, Redo, Flip, Draw, Resign, Sound
│   │   ├── PromotionModal.tsx           # FIDE pawn promotion picker (Q, R, B, N)
│   │   ├── GameOverModal.tsx            # Victory/Draw dialog with rule citations & confetti
│   │   ├── GameSettingsModal.tsx        # Settings: AI difficulty, themes, time presets, FEN loader, Blunder Shield
│   │   ├── LearningHub.tsx              # Home learning portal & quick action cards
│   │   ├── PuzzleRush.tsx               # 2-minute timed tactical rush with feedback
│   │   ├── StudyLibrary.tsx             # Opening repertoire and endgame practice library
│   │   ├── StudyDrill.tsx               # Reusable interactive board drill (openings & endgames)
│   │   ├── StudyRoadmap.tsx             # Progress-aware curriculum roadmap
│   │   └── StudyProgressCard.tsx        # Streak display and overall completion badge
│   │
│   └── tests/
│       ├── chessRules.test.ts           # Vitest suite covering checkmate, stalemate, castling, AI search
│       ├── gameReview.test.ts           # Accuracy calculation formula, ACPL, and move classifications
│       ├── gameArchive.test.ts          # Match archiving, lifetime stats, and storage fallback
│       ├── botPersonalities.test.ts     # Bot rating profiles, banter categories, and resolver fallbacks
│       ├── knowledgeBase.test.ts        # Curriculum categories, roadmap order, and topic metadata
│       ├── progressStorage.test.ts      # LocalStorage serialization, streak calculation, recovery
│       ├── puzzleRush.test.ts           # Legality of CC0 puzzle source FENs, preludes, and solutions
│       ├── studyDrills.test.ts          # Endgame principle drills (opposition, square, Tarrasch, etc.)
│       ├── studyTools.test.ts           # Opening repertoire move legality and prompts
│       └── theoryTrainer.test.ts        # Theory trainer interactive state machine
```

---

## 6. Testing & Quality Assurance

The codebase is fortified with an automated test suite containing **10 test files and 60 passing tests** executed with **Vitest**.

### Key Test Suites Verified
1. **Game Review Engine (`gameReview.test.ts`)**:
   - CAPS accuracy mathematical calibration ($103.1668 \times e^{-0.4354 \times \text{pawns}} - 3.1669$).
   - Centipawn swing advantage graph generation and Key Moments extraction.
   - Scholar's mate accuracy rating and blunder detection.
2. **Match Archive & Storage (`gameArchive.test.ts`)**:
   - LocalStorage persistence with memory fallback for headless testing environments.
   - Aggregate statistics calculation (wins, losses, draws, win rate percentage, favorite opening).
3. **Bot Personalities & Banter (`botPersonalities.test.ts`)**:
   - Rating and difficulty alignment across all 4 bot profiles.
   - Banter category completeness and quote resolver safety.
4. **FIDE Rules & Engine Logic (`chessRules.test.ts`)**:
   - Checkmate (Rule 1.2) via Fool's Mate sequence (`f3 e5 g4 Qh4#`).
   - Stalemate (Rule 5.2.1) boundary stalemate position (`k7/2Q5/2K5/8/8/8/8/8 b - - 0 1`).
   - Insufficient Material (Rule 9.6) for King vs King and King + Knight vs King.
   - En Passant legality, timing window, and removal of captured pawn.
   - Castling through check restriction.
   - Promotion 4-piece mandatory choice (`q`, `r`, `b`, `n`).
   - AI search stability and depth scaling across all difficulty presets.
2. **Tactical Puzzle Integrity (`puzzleRush.test.ts`)**:
   - Validates all 58 Lichess CC0 puzzles: `sourceFen` + `opponentMove` = `fen`.
   - Ensures no starting position is already game over.
   - Proves every single move in every solution line is legal under FIDE rules.
   - Asserts rating pool depth: 25+ puzzles near 800, 15+ near 1400, 10+ near 2400.
3. **Endgame Principle & Rated Drills (`studyDrills.test.ts`)**:
   - Validates interactive drills for Direct Opposition, Square of the Pawn, Rook Behind Passed Pawn (Tarrasch), and Pawn Breakthrough.
   - Ensures legal starting FENs and valid move sequences.
4. **Opening Repertoires (`studyTools.test.ts` & `theoryTrainer.test.ts`)**:
   - Validates all opening model lines (Sicilian, French, Ruy Lopez, Queen's Gambit, King's Indian) starting from the initial position.
5. **Local Persistence & Streaks (`progressStorage.test.ts`)**:
   - Verifies consecutive calendar-day streak computation, empty fallback on corrupted JSON, and idempotent puzzle best tracking.
6. **Curriculum Knowledge Base (`knowledgeBase.test.ts`)**:
   - Verifies all categories have valid titles, icons, and non-empty topic lists.

### Running the Test Suite
```powershell
# Standard wrapper:
npm.cmd test

# Direct Node execution:
node ./node_modules/vitest/vitest.mjs run
```

---

## 7. Developer Guide: Extending & Modifying in VS Code

### 1. Adding a New Custom Board Theme
1. Open [`src/index.css`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/index.css).
2. Add your theme CSS class:
   ```css
   .board-theme-neon .square-light {
     background-color: #a7f3d0;
     color: #065f46;
   }
   .board-theme-neon .square-dark {
     background-color: #065f46;
     color: #a7f3d0;
   }
   ```
3. In [`src/types/chess.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/types/chess.ts), add `'neon'` to the `BoardTheme` union.
4. In [`src/components/GameSettingsModal.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/GameSettingsModal.tsx), add the theme to `BOARD_THEMES`:
   ```typescript
   { id: 'neon', name: 'Cyber Neon', light: '#a7f3d0', dark: '#065f46' }
   ```

### 2. Tuning AI Strength & Search Depth
Open [`src/utils/chessEngine.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/chessEngine.ts):
- Modify `depthMap`:
  ```typescript
  const depthMap: Record<AiDifficulty, number> = {
    easy: 1,
    medium: 3,
    hard: 4,
    master: 5,
  };
  ```
- Adjust positional tables in [`src/utils/evalTables.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/evalTables.ts) to make the AI more aggressive, center-focused, or flank-attacking.

### 3. Adding New Time Controls
Open [`src/components/GameSettingsModal.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/GameSettingsModal.tsx):
- Add an object to `TIME_CONTROL_PRESETS`:
  ```typescript
  { id: 'blitz_5_0', label: '5 min', category: 'Blitz', initialSeconds: 300, incrementSeconds: 0 }
  ```

---

*Document created and maintained for the Chess Master project. Last updated: September 2026.*
