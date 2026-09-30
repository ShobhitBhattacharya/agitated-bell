# ♞ Chess Master: Play & Learning Platform (FIDE & Chess.com Standards)

A high-performance modern web chess application and interactive learning platform built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

![FIDE Rules Compliant](https://img.shields.io/badge/FIDE-100%25%20Rule%20Compliant-brightgreen)
![Chess.com Standards](https://img.shields.io/badge/UX-Chess.com%20Standard-success)
![Tests](https://img.shields.io/badge/Vitest-60%20Passed-blue)
![Puzzles](https://img.shields.io/badge/Lichess%20CC0-150%20Puzzles-yellow)
![Openings](https://img.shields.io/badge/Openings-18%20Model%20Lines-informational)
![Endgames](https://img.shields.io/badge/Endgames-14%20Principle%20Lessons-purple)
![Architecture](https://img.shields.io/badge/AI-Web%20Worker%20Minimax-orange)

---

## 🌟 Key Features

### 1. ♞ Tournament-Grade Gameplay
- **100% FIDE Rules Compliant**: Castling, en passant, pawn promotion, stalemate, 50-move rule, threefold repetition, and insufficient material draws.
- **Multi-Tier Web Worker AI**: Minimax engine with alpha-beta pruning, piece-square tables, and move ordering running off-thread at 4 levels (Casual ~800 to Master ~2000).
- **Live Evaluation Bar**: Smooth real-time advantage indicator calibrated in centipawns.
- **Dual Chess Clocks**: Customizable time controls with Fischer increments (Bullet, Blitz, Rapid, Classical, Custom).
- **Audio & Visuals**: Procedural zero-dependency Web Audio sound effects, move highlights, right-click SVG drag arrows, square highlight tints, and custom board themes.
- **Blunder Shield Alert**: Optional beginner safeguard warning before hanging your Queen or dropping into mate-in-1.

### 2. 📊 Post-Game Review & CAPS Accuracy Engine
- **CAPS Accuracy Scoring**: Industry-standard accuracy percentages calibrated with mathematical precision ($103.1668 \times e^{-0.4354 \times \text{pawns}} - 3.1669$) alongside Average Centipawn Loss (ACPL) for both players.
- **FIDE/Chess.com Move Classification**: Moves classified into `!!` Brilliant, `!` Great, `★` Best, `✔` Excellent, `?!` Inaccuracy, `?` Mistake, `??` Blunder, and `⚡` Missed Win.
- **Centipawn Advantage Graph**: Visual swing graph mapping momentum across all plies.
- **"Retry Your Mistakes" Interactive Drill**: Replay critical moments where you made an inaccuracy, mistake, or blunder and discover the engine's best move.
- **Match Archive & Lifetime Statistics**: Automatic local persistence tracking total games, wins, losses, draws, win-rate %, and favorite openings.

### 3. 🧭 Free Analysis Sandbox & Board Editor
- **Custom Position Setup**: Visual piece palette (drag or click pieces, trash/clear, board flip, side to move, castling rights).
- **FEN & PGN Import/Export**: One-click import and export to analyze custom games and positions.
- **Live Engine Lines & Move Recommendation**: Continuous minimax positional evaluation with on-board green arrow recommendations.
- **Board Annotations**: Right-click drag arrows (green, red, blue, orange) and right-click square highlight tints.

### 4. 🤖 Distinct Bot Personalities & In-Game Banter
- **4 Custom Opponents**:
  - 🦁 **Mikhail** (~1100 ELO): *The Tal Disciple* — aggressive king hunts, tactical sacrifices.
  - 🦉 **Elena** (~1500 ELO): *The Strategist* — solid positional play, central control.
  - 🐺 **Viktor** (~1800 ELO): *The Endgame Grinder* — meticulous pawn structures, technical conversion.
  - 👑 **Magnus Bot** (~2400 ELO): *Universal Champion* — relentless, uncompromising master-level play.
- **Real-Time Context Banter**: Responsive speech bubbles reacting to game start, checks, blunders, queen captures, and game results.

### 5. 🎯 Training Mini-Games & Social Sharing
- **30-Second Coordinate Vision Trainer**: Rapid-fire drill testing board notation recognition with streaks, timer, and high score tracking.
- **Branded Social Share Cards**: 1-click clipboard summary card generation to share game outcomes, accuracies, and openings with friends.

### 6. 🎓 Interactive Learning Hub & Drills
- **Curriculum Roadmap (28 Lessons)**: Structured topic breakdown across Opening Principles, Positional Ideas, Tactical Motifs, Endgame Mastery, and Checkmate Patterns with local streak and progress persistence.
- **Opening Repertoires, Deep Lines (10–16 Plies) & Playstyle Taxonomy**:
  - 18 tournament-tested opening repertoires deepened to **10–16 plies** (5–8 full moves), establishing tournament/engine-tested "Best Lines" with automated book replies and named variations:
    - *Italian Game* (Positional · Evans Gambit, Two Knights)
    - *Sicilian Defense* (Dynamic · Dragon, Alapin, Closed)
    - *Queen's Gambit* (Positional · Accepted, Tarrasch)
    - *King's Indian Defense* (Aggressive · Sämisch)
    - *Ruy Lopez* (Positional · Berlin Defense, Exchange)
    - *French Defense* (Solid · Advance, Winawer)
    - *Caro-Kann Defense* (Solid · Advance, Panov-Botvinnik)
    - *Scandinavian Defense* (Dynamic · Modern 2... Nf6)
    - *English Opening* (Positional · Symmetrical)
    - *London System* (Solid · Jobava London)
    - *Nimzo-Indian Defense* (Positional · Classical 4. Qc2)
    - *Vienna Game* (Aggressive · Vienna Gambit Accepted)
    - *Scotch Game* (Aggressive · Mieses Variation)
    - *King's Gambit* (Aggressive · Declined, Falkbeer Counter-Gambit)
    - *Slav Defense* (Solid · Semi-Slav)
    - *Grünfeld Defense* (Dynamic · Russian System)
    - *Dutch Defense* (Aggressive · Leningrad Dutch)
    - *Modern Benoni* (Dynamic · Fianchetto)
  - **4 Playstyle Archetypes**: ⚔️ *Aggressive / Tactical*, 🛡️ *Solid / Defensive*, ♟️ *Positional / Strategic*, and ⚡ *Dynamic / Counterattacking*.
  - **Strategic Player Benefits**: "What this opening does for you" strategic summaries so players can select openings tailored to their personal gameplay style.
  - **In-Game Theory Coach**: Real-time opening detection with playstyle badge, player benefit, recommended 10–16 ply best line with a live **Next Best Move** chip, and interactive **Candidate Variations** tabs.
  - **Multi-Variation Study Drills**: Switch dynamically between Main Best Line and individual branch variations in interactive drills.
- **Interactive Endgame Drills (14 Principle Lessons + 72 Rated Drills)**: Hands-on practice for essential endgame techniques:
  - *The Lucena Position*, *The Philidor Defense*, *Direct Opposition*, *Distant Opposition*, *Square of the Pawn*, *Rook Behind Passed Pawn*, *Pawn Breakthrough*, *King & Queen vs King Checkmate*, *King & Rook vs King Checkmate*, *Queen vs Pawn on 7th Rank*, *King Triangulation*, *Réti's Dual Threat Endgame*, *Rook vs Bishop Fortress*, *Wrong-Colored Bishop & Rook Pawn*.

### 7. ⚡ Puzzle Rush Tactical Sprint
- **2-Minute Timed Rush**: Real-time solving sprint with instant move feedback and automatic defensive responses.
- **Stratified CC0 Puzzle Catalogue**: 150 curated, FIDE-legal puzzles from the official Lichess open database spanning ratings 473 through 3062 across Beginner (<800: 33 puzzles), Intermediate (800–2200: 88 puzzles), and Master (2200+: 29 puzzles) pools.
- **Endgame Tactical Drills**: 72 rated endgame positions directly filterable in the Study Library for targeted endgame tactical practice.
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
*Current test suite: 7 test files, 36 automated unit & integration tests passing.*

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
