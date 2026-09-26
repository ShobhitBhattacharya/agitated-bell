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
├── vite.config.ts                       # Vite bundler config with Tailwind & React plugins
├── PROJECT_DOCUMENTATION.md             # This document!
│
├── src/
│   ├── main.tsx                         # React 19 root bootstrap
│   ├── App.tsx                          # Master state coordinator, clocks, and turns
│   ├── index.css                        # Tailwind v4 import & custom board color themes
│   │
│   ├── types/
│   │   └── chess.ts                     # TypeScript interfaces (GameMode, Theme, TimeControl, etc.)
│   │
│   ├── utils/
│   │   ├── pieces.tsx                   # Scalable vector Staunton chess pieces (K, Q, R, B, N, P)
│   │   ├── audio.ts                     # Web Audio API sound synthesis engine
│   │   ├── evalTables.ts                # Piece-Square Tables (PST) for positional evaluation
│   │   └── chessEngine.ts               # Minimax algorithm, Alpha-Beta pruning, and move ordering
│   │
│   ├── workers/
│   │   └── chessAi.worker.ts            # Dedicated Web Worker for background AI calculation
│   │
│   ├── components/
│   │   ├── ChessBoard.tsx               # 8x8 interactive board, drag-and-drop & click-to-move
│   │   ├── EvaluationBar.tsx            # Chess.com-style vertical evaluation advantage bar
│   │   ├── ChessClock.tsx               # Digital timer with increment and time-warning alerts
│   │   ├── CapturedPieces.tsx           # Captured pieces tray with material lead counter
│   │   ├── MoveHistory.tsx              # SAN move list with step-through replay navigation
│   │   ├── GameControls.tsx             # New Game, Undo, Redo, Flip, Draw, Resign, Sound
│   │   ├── PromotionModal.tsx           # FIDE pawn promotion picker (Q, R, B, N)
│   │   ├── GameOverModal.tsx            # Victory/Draw dialog with rule citations & confetti
│   │   └── GameSettingsModal.tsx        # Settings: AI difficulty, themes, time presets, FEN loader
│   │
│   └── tests/
│       └── chessRules.test.ts           # Vitest suite covering checkmate, stalemate, castling, etc.
```

---

## 6. Testing & Quality Assurance

Automated unit tests are housed in [`src/tests/chessRules.test.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/tests/chessRules.test.ts) and run with **Vitest**.

### Key Test Cases Verified
1. **Checkmate (Rule 1.2)**: Verified via Fool's Mate sequence (`f3 e5 g4 Qh4#`).
2. **Stalemate (Rule 5.2.1)**: Known King vs Queen/King boundary stalemate position (`k7/2Q5/2K5/8/8/8/8/8 b - - 0 1`).
3. **Insufficient Material (Rule 9.6)**: Tested King vs King and King + Knight vs King.
4. **En Passant**: Tested 2-square pawn jump, en passant capture legality, and removal of captured pawn from the 5th rank.
5. **Castling through Check**: Proves castling kingside is rejected if the transit square is attacked by an enemy piece.
6. **Promotion**: Proves pawn reaching the 8th rank creates exactly 4 legal options (`q`, `r`, `b`, `n`).
7. **AI Search Stability**: Verifies position evaluation and depth search across Beginner, Intermediate, and Advanced tiers.

To run the test suite at any time:
```powershell
npm.cmd test
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
