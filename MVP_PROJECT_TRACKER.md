# Agile Project Methodology & MVP Tracker

> **Project Hierarchy**: **EPIC (MVP)** $\rightarrow$ **Features** $\rightarrow$ **User Stories** $\rightarrow$ **Technical Tasks**
> **Current Lifecycle State**: **MVP Phase 1 Delivered & Verified**

---

## 📌 Hierarchy Overview

```
[EPIC-001] Modern Web Chess Application (FIDE & Chess.com Standards)
 │
 ├── [FEAT-01] Official FIDE Rule Engine & Core State
 │    ├── US-101: Legal Piece Movement & Turns
 │    ├── US-102: Special FIDE Rules (Castling, En Passant)
 │    ├── US-103: Interactive Pawn Promotion
 │    └── US-104: Check, Checkmate & Draw Termination
 │
 ├── [FEAT-02] Chess.com-Style Board UI & Procedural Audio
 │    ├── US-201: Responsive Vector Board & Staunton Pieces
 │    ├── US-202: Dual Interaction (Drag & Drop + Click-to-Move)
 │    ├── US-203: Move & Check Visual Highlights
 │    └── US-204: Zero-Dependency Web Audio Effects
 │
 ├── [FEAT-03] Multi-Tier Background Web Worker AI
 │    ├── US-301: Minimax Search with Alpha-Beta Pruning
 │    ├── US-302: Difficulty Profiles (Beginner to Master)
 │    └── US-303: Non-blocking Web Worker Threading
 │
 ├── [FEAT-04] Live Positional Evaluation Bar
 │    ├── US-401: Continuous Centipawn Score Tracking
 │    └── US-402: Smooth Visual Advantage Indicator
 │
 ├── [FEAT-05] Dual Chess Clocks & Time Controls
 │    ├── US-501: FIDE Time Presets & Increments
 │    └── US-502: Flag-Fall Timeout Detection
 │
 ├── [FEAT-06] Move History & Position Navigation
 │    ├── US-601: Standard Algebraic Notation (SAN) Logging
 │    ├── US-602: Interactive Past-Move Stepping
 │    └── US-603: PGN & FEN Clipboard Export
 │
 └── [FEAT-07] Game Customization & Position Loader
      ├── US-701: Board Theme Selection
      └── US-702: Custom FEN Position Setup
```

---

## 👑 EPIC-001: Modern Web Chess Application MVP

- **Objective**: Deliver a full-featured, zero-install, responsive web chess application that adheres strictly to international FIDE tournament rules while delivering the polished look, feel, and sound of Chess.com.
- **Target Audience**: Casual chess players, competitive club players, and students wanting to practice against adjustable AI or play local pass-and-play.
- **Definition of Done (DoD)**:
  1. 100% of standard FIDE rules verified via automated test suite.
  2. Sub-second initial load with responsive mobile and desktop viewports.
  3. AI calculations must not block UI animations (60 FPS maintained).
  4. Complete documentation of architecture, user stories, and tasks.

---

## 📦 Feature & User Story Breakdown

---

### [FEAT-01] Official FIDE Rule Engine & Core State

#### 📖 US-101: Legal Piece Movement & Turn Enforcement
- **As a** chess player,
- **I want** the board to only permit legal moves for the active side,
- **So that** the game proceeds strictly according to FIDE rules.
- **Acceptance Criteria**:
  - [x] White always moves first in a standard game.
  - [x] Pieces cannot jump through obstructing pieces (except Knights).
  - [x] Moving a pinned piece that exposes the King to check is forbidden.
- **Tasks**:
  - [x] **TASK-101.1**: Initialize `chess.js` state in [`src/App.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/App.tsx).
  - [x] **TASK-101.2**: Generate legal moves using `chess.moves({ square, verbose: true })`.
  - [x] **TASK-101.3**: Map legal move targets in [`src/components/ChessBoard.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/ChessBoard.tsx).

---

#### 📖 US-102: Special FIDE Moves (Castling & En Passant)
- **As a** competitive player,
- **I want** full support for castling (kingside/queenside) and en passant,
- **So that** standard opening and tactical rules are respected.
- **Acceptance Criteria**:
  - [x] Castling is allowed only if King and target Rook have not moved.
  - [x] Castling is blocked if the King is in check, passes through check, or lands in check.
  - [x] En passant is allowed exclusively on the turn immediately following a 2-square pawn advance.
- **Tasks**:
  - [x] **TASK-102.1**: Implement castling validation in [`src/components/ChessBoard.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/ChessBoard.tsx).
  - [x] **TASK-102.2**: Write automated unit tests for en passant and castling through check in [`src/tests/chessRules.test.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/tests/chessRules.test.ts).

---

#### 📖 US-103: Interactive Pawn Promotion
- **As a** player advancing a pawn to the 8th (or 1st) rank,
- **I want** an intuitive modal to choose between Queen, Knight, Rook, or Bishop,
- **So that** I can execute promotions without auto-queen forcing underpromotions.
- **Acceptance Criteria**:
  - [x] Promotion modal appears immediately upon pawn reaching the final rank.
  - [x] Pieces displayed match the player's color.
  - [x] Dismissing/canceling modal cancels the unfinished move.
- **Tasks**:
  - [x] **TASK-103.1**: Build [`src/components/PromotionModal.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/PromotionModal.tsx).
  - [x] **TASK-103.2**: Add `pendingPromotion` state interceptor in `App.tsx`.
  - [x] **TASK-103.3**: Verify promotion test in `src/tests/chessRules.test.ts`.

---

#### 📖 US-104: Check, Checkmate & Draw Termination
- **As a** player,
- **I want** the game to automatically identify when checkmate or a draw occurs,
- **So that** the result is unambiguous and cited according to official rules.
- **Acceptance Criteria**:
  - [x] Checkmate triggers game over modal citing FIDE Rule 1.2.
  - [x] Stalemate triggers draw dialog citing FIDE Rule 5.2.1.
  - [x] Threefold repetition (Rule 9.2), 50-move rule (Rule 9.3), and Insufficient material (Rule 9.6) are detected.
- **Tasks**:
  - [x] **TASK-104.1**: Build `checkGameStatus()` in `App.tsx`.
  - [x] **TASK-104.2**: Create [`src/components/GameOverModal.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/GameOverModal.tsx) with rule citations and confetti celebrations.
  - [x] **TASK-104.3**: Unit test Fool's Mate and Stalemate positions.

---

### [FEAT-02] Chess.com-Style Board UI & Procedural Audio

#### 📖 US-201: Responsive Vector Board & Staunton Pieces
- **As a** user on desktop or mobile,
- **I want** razor-sharp pieces and a scalable board,
- **So that** the game looks crisp on any screen size.
- **Acceptance Criteria**:
  - [x] Vector SVG Staunton pieces for K, Q, R, B, N, P.
  - [x] Board dynamically resizes while maintaining a 1:1 aspect ratio.
- **Tasks**:
  - [x] **TASK-201.1**: Design vector pieces in [`src/utils/pieces.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/pieces.tsx).
  - [x] **TASK-201.2**: Implement responsive container queries & grid in [`src/components/ChessBoard.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/ChessBoard.tsx).

---

#### 📖 US-202: Dual Interaction (Drag & Drop + Click-to-Move)
- **As a** player,
- **I want** to either click-click or drag-drop pieces,
- **So that** I can play naturally on both touchscreens and mouse-driven desktops.
- **Acceptance Criteria**:
  - [x] HTML5 drag start, drag over, and drop events enabled.
  - [x] Click piece $\rightarrow$ click destination enabled.
- **Tasks**:
  - [x] **TASK-202.1**: Implement `handleSquareClick` and drag handlers in `ChessBoard.tsx`.

---

#### 📖 US-203: Move & Check Visual Highlights
- **As a** player,
- **I want** to see where the last piece moved and which squares are legal,
- **So that** I have immediate visual feedback on the state of the match.
- **Acceptance Criteria**:
  - [x] Selected square highlighted in `#f7f769`.
  - [x] Last move squares highlighted in `#baca44`.
  - [x] Empty destinations shown with centered circular dots; captures shown with target rings.
  - [x] Checked King highlighted with pulsing red gradient.
- **Tasks**:
  - [x] **TASK-203.1**: Add CSS highlight classes in [`src/index.css`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/index.css).
  - [x] **TASK-203.2**: Bind dynamic class names in `ChessBoard.tsx`.

---

#### 📖 US-204: Zero-Dependency Web Audio Effects
- **As a** player,
- **I want** authentic sound feedback for moves, captures, and checks,
- **So that** the gameplay feels tactile and satisfying.
- **Acceptance Criteria**:
  - [x] Procedural sound using `AudioContext` (no external MP3/WAV files).
  - [x] Distinct sounds for standard move, capture, castle, check, promotion, and game over.
  - [x] One-click audio mute/unmute toggle.
- **Tasks**:
  - [x] **TASK-204.1**: Build synthesis engine in [`src/utils/audio.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/audio.ts).
  - [x] **TASK-204.2**: Connect audio triggers to move execution in `App.tsx`.

---

### [FEAT-03] Multi-Tier Background Web Worker AI

#### 📖 US-301: Minimax Search with Alpha-Beta Pruning
- **As a** solo player,
- **I want** an intelligent computer opponent that plays strategically,
- **So that** I can practice against realistic chess play.
- **Acceptance Criteria**:
  - [x] Piece values: P=100, N=320, B=330, R=500, Q=900, K=20000.
  - [x] Piece-Square Tables (PST) evaluate center control and king safety.
  - [x] Move ordering (MVV-LVA) optimizes pruning efficiency.
- **Tasks**:
  - [x] **TASK-301.1**: Define PST arrays in [`src/utils/evalTables.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/evalTables.ts).
  - [x] **TASK-301.2**: Implement Minimax with Alpha-Beta in [`src/utils/chessEngine.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/utils/chessEngine.ts).

---

#### 📖 US-302: Difficulty Profiles
- **As a** player of any skill level,
- **I want** to choose between Beginner, Intermediate, Advanced, and Master,
- **So that** I am matched against an appropriate challenge.
- **Acceptance Criteria**:
  - [x] Beginner (~800 ELO): Fast moves with random blunder rate.
  - [x] Intermediate (~1400 ELO): Depth 3 search with PST evaluation.
  - [x] Advanced (~1800 ELO): Depth 4 search with tactical pruning.
  - [x] Master (~2200 ELO): Depth 5 deep search with endgame awareness.
- **Tasks**:
  - [x] **TASK-302.1**: Implement difficulty tier branching in `getBestMove()`.

---

#### 📖 US-303: Non-Blocking Web Worker
- **As a** player,
- **I want** the browser UI to remain 100% smooth while the AI calculates,
- **So that** timers and piece animations do not freeze.
- **Acceptance Criteria**:
  - [x] Search algorithm runs in [`src/workers/chessAi.worker.ts`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/workers/chessAi.worker.ts).
  - [x] Main thread sends FEN and receives best move via asynchronous message passing.
- **Tasks**:
  - [x] **TASK-303.1**: Create `chessAi.worker.ts`.
  - [x] **TASK-303.2**: Implement Web Worker lifecycle & fallback in `App.tsx`.

---

### [FEAT-04] Live Positional Evaluation Bar

#### 📖 US-401 & US-402: Evaluation Bar & Visual Gauge
- **As a** player,
- **I want** a real-time evaluation bar next to the board (like Chess.com),
- **So that** I can see which side has the advantage.
- **Acceptance Criteria**:
  - [x] Centipawn advantage calculated continuously.
  - [x] Displays formatted score (e.g. `+1.5`, `-0.8`, `+M`).
  - [x] Smooth CSS transitions for height changes.
  - [x] Flips orientation automatically when the board is flipped.
- **Tasks**:
  - [x] **TASK-401.1**: Build [`src/components/EvaluationBar.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/EvaluationBar.tsx).
  - [x] **TASK-401.2**: Integrate live centipawn calculations in `App.tsx`.

---

### [FEAT-05] Dual Chess Clocks & Time Controls

#### 📖 US-501 & US-502: Clocks & Flag-Fall Detection
- **As a** timed player,
- **I want** individual countdown clocks with increment support,
- **So that** games run under official time controls.
- **Acceptance Criteria**:
  - [x] Bullet (1 min), Blitz (3 min, 5|3), Rapid (10 min, 15|10), and Untimed presets.
  - [x] Time increment credited automatically after each move.
  - [x] Clock reaches 0:00 $\rightarrow$ opponent wins on time.
- **Tasks**:
  - [x] **TASK-501.1**: Build [`src/components/ChessClock.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/ChessClock.tsx).
  - [x] **TASK-501.2**: Implement interval countdown and timeout handling in `App.tsx`.

---

### [FEAT-06] Move History & Position Navigation

#### 📖 US-601, US-602 & US-603: SAN History & Navigation
- **As a** player reviewing a game,
- **I want** to see all moves in algebraic notation and step back through the match,
- **So that** I can analyze mistakes and export the game.
- **Acceptance Criteria**:
  - [x] Standard Algebraic Notation (SAN) formatted in move pairs (1. e4 e5 ...).
  - [x] Clicking any past move shows that historical board state.
  - [x] First, Previous, Next, and Current step buttons.
  - [x] One-click PGN and FEN clipboard copy.
- **Tasks**:
  - [x] **TASK-601.1**: Build [`src/components/MoveHistory.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/MoveHistory.tsx).
  - [x] **TASK-601.2**: Implement `handleSelectPly` state replay in `App.tsx`.

---

### [FEAT-07] Game Customization & Position Loader

#### 📖 US-701 & US-702: Themes & Custom FEN Loader
- **As a** user,
- **I want** to customize board visuals and load puzzle positions from FEN strings,
- **So that** I can study specific endgame or middlegame scenarios.
- **Acceptance Criteria**:
  - [x] 5 selectable themes with live color swatches.
  - [x] Input box to load custom FEN strings with error validation.
- **Tasks**:
  - [x] **TASK-701.1**: Build [`src/components/GameSettingsModal.tsx`](file:///c:/Users/shobh/Documents/antigravity/agitated-bell/src/components/GameSettingsModal.tsx).
  - [x] **TASK-701.2**: Integrate FEN loader with `startNewGame(fen)` in `App.tsx`.

---

## 📈 Agile Sprint Traceability Matrix

| Sprint | Focus Area | User Stories Delivered | Output Artifacts | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Sprint 1** | **Foundations & Rules** | US-101, US-102, US-103, US-104 | `types/chess.ts`, `App.tsx`, `chessRules.test.ts` | **DONE** |
| **Sprint 2** | **Board UI & Audio** | US-201, US-202, US-203, US-204 | `ChessBoard.tsx`, `pieces.tsx`, `audio.ts`, `index.css` | **DONE** |
| **Sprint 3** | **AI & Evaluation** | US-301, US-302, US-303, US-401, US-402 | `chessEngine.ts`, `evalTables.ts`, `chessAi.worker.ts`, `EvaluationBar.tsx` | **DONE** |
| **Sprint 4** | **Game Suite & Polish** | US-501, US-502, US-601, US-602, US-701, US-702 | `ChessClock.tsx`, `MoveHistory.tsx`, `GameControls.tsx`, `GameSettingsModal.tsx` | **DONE** |

---

## 🔮 Future Backlog (Post-MVP Epics)

- **EPIC-002: Online Multiplayer**
  - WebSockets / WebRTC peer-to-peer room matchmaking.
- **EPIC-003: Tactical Puzzle Trainer**
  - Daily puzzles fetched from open Lichess puzzle database.
- **EPIC-004: Opening Book Explorer**
  - Visual opening name explorer (Sicilian, Ruy Lopez, Queen's Gambit, etc.).
- **EPIC-005: Post-Game Accuracy Analysis**
  - Move classifications (Brilliant, Great, Best, Inaccuracy, Mistake, Blunder).

---

*This document is the official Agile Trial & Methodology record for the Chess Master MVP.*
