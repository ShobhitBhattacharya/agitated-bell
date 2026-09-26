# ♞ Project Handoff & Context Document for VS Code

> **For any AI Assistant (GitHub Copilot, Cursor, Claude) or Developer in VS Code**:
> This document provides the complete technical context of the project—explaining **WHAT** has been built, **WHY** specific architectural decisions were made, **HOW** the system is implemented, and **WHAT the next immediate steps are** to continue development.

---

## 1. Project Overview & Current State

- **Project Name**: Modern Chess Web Application (`modern-chess`)
- **Location**: `c:\Users\shobh\Documents\antigravity\agitated-bell`
- **Current Lifecycle**: **MVP Phase 1 Delivered & Verified** (100% build pass, 7/7 unit tests passing)
- **Primary Goal**: A responsive, zero-install, browser-based chess platform strictly adhering to **official FIDE regulations** and **Chess.com UX standards**.

### Development Environment & Commands
- **Runtimes**: Node.js `v24.21.0`, npm `11.12.0`
- **Shell on Windows**: PowerShell requires `npm.cmd` (due to local execution policy):
  - **Start Dev Server**: `npm.cmd run dev` (Runs locally at `http://localhost:5173/`)
  - **Run Automated Tests**: `npm.cmd test` (Vitest suite)
  - **Compile Production Bundle**: `npm.cmd run build` (`tsc -b && vite build`)

---

## 2. WHAT Has Been Done

### ✅ Feature 1: FIDE Rules & Core Engine
- **Engine**: Integrated `chess.js` (beta.9) for board representation, FIDE validation, and SAN generation.
- **Castling**: Kingside (`O-O`) and Queenside (`O-O-O`) with full FIDE checks (cannot castle through check, into check, out of check, or if pieces have moved).
- **En Passant**: Accurate immediate-turn en passant pawn captures.
- **Pawn Promotion**: Dedicated interactive modal displaying Queen, Knight, Rook, and Bishop with vector artwork.
- **Draw Rules**: Detects Checkmate (Rule 1.2), Stalemate (Rule 5.2.1), Threefold Repetition (Rule 9.2), 50-Move Rule (Rule 9.3), and Insufficient Material (Rule 9.6: K vs K, K+N vs K, K+B vs K, same-color K+B vs K+B).

### ✅ Feature 2: Chess.com Look & Feel
- **Visuals**: Scalable vector Staunton pieces (`src/utils/pieces.tsx`) rendering crisply on any screen resolution.
- **Square Highlights**:
  - Selected square: `#f7f769`
  - Last move source & target: `#baca44`
  - Legal target dots (for empty squares) & target rings (for capturable enemy pieces)
  - Checked King: Pulsing radial red gradient alert
- **Color Themes**: 5 selectable themes (Chess.com Classic Green, Wood, Slate, Midnight Navy, Tournament Glass).
- **Input**: Dual interaction supporting both **Drag-and-Drop** (HTML5) and **Click-to-Move** with touch readiness.

### ✅ Feature 3: Web Worker Minimax AI
- **Algorithm**: Minimax search with Alpha-Beta pruning and MVV-LVA (Most Valuable Victim - Least Valuable Attacker) move ordering.
- **Evaluation**: Piece-Square Tables (PST) for center control, king safety, and development; tempo bonus for the active side.
- **Difficulty Levels**:
  - Beginner (~800 ELO): Fast moves with intentional blunders for casual play.
  - Intermediate (~1400 ELO): Depth 3 search with positional tables.
  - Advanced (~1800 ELO): Depth 4 search with tactical pruning.
  - Master (~2200 ELO): Depth 5 deep search with endgame awareness.
- **Thread Isolation**: The AI runs in a dedicated background Web Worker (`src/workers/chessAi.worker.ts`), keeping main UI animations and timers locked at 60 FPS.

### ✅ Feature 4: Live Evaluation Bar
- **Component**: [`src/components/EvaluationBar.tsx`](src/components/EvaluationBar.tsx) renders a Chess.com-style vertical bar.
- **Score Display**: Shows centipawns (`+1.4`, `-0.8`) or mate indicators (`+M`, `-M`).
- **Sigmoid Mapping**: Converts -1500 to +1500 centipawns to percentage fill with smooth CSS transitions; auto-flips with board orientation.

### ✅ Feature 5: Dual Chess Clocks
- **Component**: [`src/components/ChessClock.tsx`](src/components/ChessClock.tsx).
- **Presets**: Bullet (1m), Blitz (3m, 5|3), Rapid (10m, 15|10), and Untimed.
- **Increment**: Increments automatically credited upon move completion.
- **Urgency Alert**: Pulsing red alert under 20 seconds; automatic flag-fall timeout win detection.

### ✅ Feature 6: Move History & Position Navigation
- **Component**: [`src/components/MoveHistory.tsx`](src/components/MoveHistory.tsx).
- **Formatting**: Two-column Standard Algebraic Notation (SAN) table.
- **Replay**: Clicking any past move replays the board state at that exact ply; navigation buttons (`|<<`, `<`, `>`, `>>|`).
- **Clipboard Export**: One-click **Copy PGN** and **Copy FEN** buttons.

### ✅ Feature 7: Game Settings & Custom Position Loader
- **Component**: [`src/components/GameSettingsModal.tsx`](src/components/GameSettingsModal.tsx).
- **Custom FEN**: Load any custom chess puzzle or starting setup via FEN string.

---

## 3. WHY It Was Done This Way (Architectural Rationale)

1. **Why `chess.js` over a custom move generator?**
   - Writing custom chess move generators inevitably produces subtle edge-case bugs around pinned pieces, castling through check, en passant timers, and threefold repetition hashing (Zobrist keys). `chess.js` guarantees battle-tested FIDE compliance.
2. **Why Web Workers for the AI?**
   - Depth 4–5 Minimax searches evaluate tens of thousands of board positions. Running this on JavaScript's main UI thread causes noticeable frame drops, skipped timer seconds, and drag gesture stutter. Moving the engine to `chessAi.worker.ts` isolates computation to a background thread.
3. **Why Procedural Web Audio API instead of MP3 files?**
   - External audio files suffer from CORS errors, CDN downtime, 404s, and caching delays. Browser-native `AudioContext` synthesizes wood-clack soundwaves mathematically in real time with zero network latency and 100% offline reliability.
4. **Why Vector SVGs over PNG piece sets?**
   - Bitmaps pixelate or blur on Retina, 4K, and modern mobile displays. SVG Staunton icons remain razor-sharp at any viewport dimension.
5. **Why Vite + Tailwind v4 + React 19?**
   - Provides sub-50ms Hot Module Replacement (HMR). Modifying components in VS Code updates in the browser instantly without losing current game state.

---

## 4. HOW It Works (Data Flow & Architecture)

```
[ User Interaction ] ──(Click / Drag)──> [ src/components/ChessBoard.tsx ]
                                                      │
                                           (from, to, promotion?)
                                                      ▼
[ src/App.tsx ] <───(Move Validation & Execution)─── [ chess.js Engine ]
      │
      ├─► [ src/utils/audio.ts ] ──► Synthesizes move/capture/check sound
      ├─► [ src/components/ChessClock.tsx ] ──► Deducts time, adds increment
      ├─► [ src/components/EvaluationBar.tsx ] ──► Updates centipawn score
      ├─► [ src/components/MoveHistory.tsx ] ──► Appends SAN move item
      │
      └─► (If vs-AI turn) ──► Post message to [ src/workers/chessAi.worker.ts ]
                                    │
                                 (Minimax search with Alpha-Beta)
                                    │
                                 Return bestMove { from, to, promotion }
                                    ▼
                             Execute AI move in App.tsx
```

---

## 5. Codebase Map (Quick Reference for VS Code)

```
agitated-bell/
├── PROJECT_HANDOFF.md                  # <-- This file! Master context document
├── PROJECT_DOCUMENTATION.md            # Detailed architecture handbook
├── MVP_PROJECT_TRACKER.md              # Agile tracker (Epics, Features, User Stories)
├── azure-devops-work-items.csv         # CSV export for Azure Boards / Jira
├── README.md                           # Quickstart guide
├── package.json                        # Dependencies and scripts
├── index.html                          # Entry HTML
├── src/
│   ├── main.tsx                        # React 19 bootstrap
│   ├── App.tsx                         # Master state coordinator, turns, timers
│   ├── index.css                       # Tailwind v4 import & board theme styles
│   ├── types/
│   │   └── chess.ts                    # TypeScript types (GameMode, Theme, TimeControl)
│   ├── utils/
│   │   ├── pieces.tsx                  # Vector SVG Staunton piece icons
│   │   ├── audio.ts                    # Procedural Web Audio API sound generator
│   │   ├── evalTables.ts               # Piece-Square Tables (PST) for AI evaluation
│   │   └── chessEngine.ts              # Minimax search & board evaluation functions
│   ├── workers/
│   │   └── chessAi.worker.ts           # Web Worker running AI search off-thread
│   ├── components/
│   │   ├── ChessBoard.tsx              # 8x8 interactive board with highlights
│   │   ├── EvaluationBar.tsx           # Chess.com-style vertical evaluation bar
│   │   ├── ChessClock.tsx              # Digital clock with increments
│   │   ├── CapturedPieces.tsx          # Captured pieces tray & material counter
│   │   ├── MoveHistory.tsx             # SAN move list with past-ply stepping
│   │   ├── GameControls.tsx            # New Game, Undo, Redo, Flip, Draw, Resign
│   │   ├── PromotionModal.tsx          # FIDE pawn promotion picker (Q, R, B, N)
│   │   ├── GameOverModal.tsx           # Victory/Draw dialog with rule citations
│   │   └── GameSettingsModal.tsx       # Mode, difficulty, theme, and FEN loader
│   └── tests/
│       └── chessRules.test.ts          # Vitest suite (7 passing tests)
```

---

## 6. WHAT Are the Next Steps (Roadmap for VS Code)

When continuing work in VS Code, here are the recommended next features to implement:

### 1. Arrow Drawing & Square Marking (High Value UX)
- **Goal**: Right-click drag to draw colored arrows on the board, and right-click to highlight squares green/red (identical to Chess.com).
- **Where to implement**: Add an SVG overlay canvas inside [`src/components/ChessBoard.tsx`](src/components/ChessBoard.tsx) listening to `onContextMenu` and `onPointerDown`/`onPointerUp` with right-click button (`button === 2`).

### 2. Opening Book Explorer
- **Goal**: Display the name of the chess opening currently being played (e.g. "Sicilian Defense: Najdorf Variation", "Queen's Gambit Declined") based on the current FEN/move sequence.
- **Where to implement**: Add an opening ECO dictionary lookup utility in `src/utils/openings.ts` and display the opening banner above `MoveHistory.tsx`.

### 3. Tactical Puzzle Trainer Mode
- **Goal**: Allow players to solve tactical puzzles (e.g. "White to move and win material in 2").
- **Where to implement**: Add a puzzle bank in `src/utils/puzzles.ts` and add a new Game Mode tab in `GameSettingsModal.tsx`.

### 4. Git Push & Free Cloud Hosting (GitHub Pages)
- **Goal**: Publish the app online for free so anyone can play from their mobile phone or PC.
- **Steps**:
  ```powershell
  git init
  git add .
  git commit -m "feat: complete MVP web chess app with FIDE rules and Chess.com UI"
  # Push to GitHub repository and enable GitHub Pages via Settings > Pages > GitHub Actions
  ```

---

*This document was generated for seamless continuation in VS Code. All files are ready to edit!*
