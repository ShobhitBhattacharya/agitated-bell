# Chess Content Resources

Research notes for expanding the learning catalogue. Reviewed September 29, 2026.

## Puzzles

### Lichess puzzle database

- Source: [Lichess Open Database: Puzzles](https://database.lichess.org/#puzzles)
- Download: `lichess_db_puzzle.csv.zst`
- License: CC0, according to the Lichess database page. The data may be copied, modified, and redistributed.
- Scale: approximately 6.1 million puzzles; the export is a compressed, large CSV and should not be bundled wholesale in the app.
- Fields: puzzle ID, FEN, UCI solution moves, puzzle rating, rating deviation, popularity, play count, themes, source game URL, opening tags, and daily date.
- Important solving rule: the FEN is the position before the opponent's preceding move. Apply the first UCI move as the opponent's forced move; the solver's first move is the second move in the solution list.
- Practical plan: curate a compact starter pack from the export, stratified by rating and theme (mate, fork, pin, skewer, endgame). Keep source ID, rating, themes, and game URL in each record. Validate every FEN and full UCI line with `chess.js` before shipping.
- Attribution: show Lichess as the dataset source and link to the source puzzle/game where possible, even though CC0 does not require attribution.

The app now ships an expanded curated 100-puzzle subset selected from the official Lichess open database export, spanning approximately 473-3,062 puzzle rating and multiple tactical/endgame themes (mates-in-1/2, forks, pins, skewers, discoveries, deflection, smothered mates, Anastasia's mate, Arabian mate, Boden's mate, and pawn/rook endgames). The records retain the original puzzle ID, source FEN, forced opponent move, player-to-move FEN, solution UCI line, rating, tags, popularity, play count, and links to the Lichess puzzle and source game. Every source prelude and solution move is validated with `chess.js` in the app tests. The complete dataset is still not bundled.

The endgame library now exposes 47 curated puzzles tagged `endgame` as individual rated practice drills, alongside 9 interactive theoretical principle lessons (Lucena Position, Philidor Defense, Opposition, Square of the Pawn, Tarrasch Rule, Pawn Breakthrough, K+Q Box Mate, K+R Box Mate, and Queen vs Pawn on 7th). Opening cards launch side-selectable drills based on 12 validated model SAN lines; the app replies automatically with the next move from that line.

## Openings

### Lichess chess-openings dataset

- Source: [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings)
- License: CC0 public-domain dedication, stated in the repository's copyright section.
- Data: ECO code, opening name, representative PGN move line; generated files also provide UCI and EPD forms.
- Practical plan: import a selected subset of ECO names and lines as structured local data. Use move lines as recognition/reference content, not as a claim that one line is objectively best in every position.

### Lichess opening explorer

- Reference: [Lichess API: Opening Explorer](https://lichess.org/api#tag/Opening-Explorer)
- Can support future position-based statistics and master-game move exploration.
- It is a live API, not a bundled offline dataset. Follow its rate limits and review its API terms before using it as a core product dependency.

## Endgames and instructional references

### Public-domain-in-the-US reference books

- [Chess Fundamentals by José Raúl Capablanca, Project Gutenberg eBook 33870](https://www.gutenberg.org/ebooks/33870)
  - Project Gutenberg labels this edition public domain in the USA.
  - Useful topics include basic endgames, piece coordination, and practical conversion.
- [Chess Strategy by Edward Lasker, Project Gutenberg eBook 5614](https://www.gutenberg.org/ebooks/5614)
  - Project Gutenberg labels this edition public domain in the USA.
  - Useful as a historical reference for positional concepts and example positions.

Use these as research references for independently written explanations and validated positions. Do not copy modern copyrighted chess-book prose, diagrams, or annotated game collections. Public-domain status can differ by country; do not redistribute full book text or scans in a global release without checking the applicable rights and Project Gutenberg terms.

### Tablebases

- [Syzygy tablebase reference](https://syzygy-tables.info/)
- Exact tablebases can be used as a validation/research aid for supported endgames, but the public reference site is not a practical offline app dependency. Before bundling any tablebase files, verify the data distribution terms and storage footprint separately.
- A good first endgame product slice does not require tablebases: introduce authored king-and-pawn exercises, validate legal move lines with `chess.js`, and explain opposition, key squares, and the square of the pawn in original wording.

## Recommended first content step

1. Grow the curated pack beyond 33 items using filtered rating/theme samples from the Lichess export.
2. Keep the current shuffled, no-repeat rush behavior and test every imported line.
3. Keep metadata and attribution alongside every imported record.
4. Add beginner king-and-pawn endgame drills as original lessons, then expand the opening catalogue from the CC0 dataset.

## Product and legal hygiene

- Keep content provenance in the data records and this document.
- Do not claim exact user-facing ratings for hand-authored puzzles or AI opponents without calibration.
- Present the app as independent; avoid wording that implies endorsement by FIDE, Chess.com, or Lichess.
