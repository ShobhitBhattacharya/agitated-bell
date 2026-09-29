# ♞ Chess Master: Play & Learning Platform (FIDE & Chess.com Standards)

A high-performance modern web chess application and interactive learning platform built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

![FIDE Rules Compliant](https://img.shields.io/badge/FIDE-100%25%20Rule%20Compliant-brightgreen)
![Chess.com Standards](https://img.shields.io/badge/UX-Chess.com%20Standard-success)
![Tests](https://img.shields.io/badge/Vitest-34%20Passed-blue)
![Puzzles](https://img.shields.io/badge/Lichess%20CC0-58%20Puzzles-yellow)
![Architecture](https://img.shields.io/badge/AI-Web%20Worker%20Minimax-orange)

---

## 🌟 Key Features

### 1. ♞ Tournament-Grade Gameplay
- **100% FIDE Rules Compliant**: Castling, en passant, pawn promotion, stalemate, 50-move rule, threefold repetition, and insufficient material draws.
- **Multi-Tier Web Worker AI**: Minimax engine with alpha-beta pruning, piece-square tables, and move ordering running off-thread at 4 levels (Casual ~800 to Master ~2000).
- **Live Evaluation Bar**: Smooth real-time advantage indicator calibrated in centipawns.
- **Dual Chess Clocks**: Customizable time controls with Fischer increments (Bullet, Blitz, Rapid, Classical, Custom).
- **Audio & Visuals**: Procedural zero-dependency Web Audio sound effects, move highlights, and custom board themes.

### 2. 🎓 Interactive Learning Hub & Drills
- **Curriculum Roadmap**: Topic breakdown across Fundamentals, Openings, Strategy, Tactics, and Endgames with local streak and progress persistence.
- **Opening Model-Line Trainer**: Repertoire training with selectable White/Black perspectives and automated book replies.
- **Interactive Endgame Drills**: Hands-on practice for essential endgame principles:
  - *Direct Opposition*: Key King maneuvers to escort passed pawns.
  - *Square of the Pawn*: Rapid rule-of-the-square calculation without calculation fatigue.
  - *Rook Behind Passed Pawn*: Tarrasch rule implementation and rook deflection.
  - *Pawn Breakthrough*: Sacrificial breakthroughs in symmetrical pawn structures.

### 3. ⚡ Puzzle Rush Tactical Sprint
- **2-Minute Timed Rush**: Real-time solving sprint with instant move feedback and automatic defensive responses.
- **Stratified CC0 Puzzle Catalogue**: 58 curated, FIDE-legal puzzles from the official Lichess open database spanning ratings 473 through 3062 across Beginner (<800), Intermediate (800–2200), and Master (2200+) pools.
- **Personal Best Tracking**: High scores and lifetime solve counters stored locally.

---

## 🚀 Quick Start

### 1. Run Development Server
```bash
# Standard npm wrapper:
npm.cmd run dev

# Or direct Node execution (bypasses Windows PowerShell policy restrictions):
node ./node_modules/vite/bin/vite.js --host 127.0.0.1 --port 3000
```
Open [http://localhost:3000/](http://localhost:3000/) in your browser.

### 2. Run Automated Test Suite
```bash
# Standard npm wrapper:
npm.cmd test

# Or direct Node execution:
node ./node_modules/vitest/vitest.mjs run
```
*Current test suite: 7 test files, 34 automated unit & integration tests passing.*

### 3. Type Checking & Production Build
```bash
# Run TypeScript type check
node ./node_modules/typescript/bin/tsc -b

# Build production bundle
node ./node_modules/vite/bin/vite.js build
```

---

## 📚 Project Documentation & Methodology

We maintain complete, transparent project documentation right in the repository:

1. **[`MVP_PROJECT_TRACKER.md`](MVP_PROJECT_TRACKER.md)**:
   - Complete Agile breakdown:
     - **EPIC-001 (Core Chess MVP)**: 7 Features $\rightarrow$ 14 User Stories $\rightarrow$ 25+ Technical Tasks.
     - **EPIC-002 (Learning Hub & Drills)**: 3 Features $\rightarrow$ 7 User Stories $\rightarrow$ 15+ Technical Tasks.
   - Acceptance Criteria (Given/When/Then) and Sprint Traceability.
2. **[`PROJECT_DOCUMENTATION.md`](PROJECT_DOCUMENTATION.md)**:
   - Architectural handbook explaining **WHAT** was built, **HOW** it works, and the **WHY** behind every technical decision.
   - Component state architecture, Web Worker lifecycle, and VS Code extension guide.
3. **[`CHESS_CONTENT_RESOURCES.md`](CHESS_CONTENT_RESOURCES.md)**:
   - Provenance, licensing, and schema documentation for Lichess CC0 puzzles and public domain instructional references.
4. **[`ANTIGRAVITY_HANDOFF.md`](ANTIGRAVITY_HANDOFF.md)**:
   - Engineering continuation notes, verified hashes, and roadmap tracking.
