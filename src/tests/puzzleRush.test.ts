import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { getPuzzlePool, puzzleRushPuzzles } from '../utils/puzzleRush';

describe('Puzzle Rush catalogue', () => {
  it('contains legal positions and complete legal solution lines', () => {
    for (const puzzle of puzzleRushPuzzles) {
      const sourcePosition = new Chess(puzzle.sourceFen);
      const prelude = puzzle.opponentMove;
      const opponentMove = sourcePosition.move({
        from: prelude.slice(0, 2),
        to: prelude.slice(2, 4),
        promotion: prelude[4] ?? 'q',
      });
      expect(opponentMove, `${puzzle.id} has an illegal opponent prelude`).not.toBeNull();
      expect(sourcePosition.fen(), `${puzzle.id} has an incorrect player position FEN`).toBe(puzzle.fen);

      const chess = new Chess(puzzle.fen);
      expect(chess.isGameOver(), `${puzzle.id} starts after the game ended`).toBe(false);
      for (const uci of puzzle.solution) {
        const move = chess.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci[4] ?? 'q',
        });
        expect(move, `${puzzle.id} has illegal move ${uci}`).not.toBeNull();
      }
      expect(puzzle.source).toBe('Lichess CC0');
      expect(puzzle.sourceUrl).toContain(puzzle.id);
    }
  });

  it('provides varied puzzles near each starting rating', () => {
    expect(getPuzzlePool(800).length).toBeGreaterThanOrEqual(10);
    expect(getPuzzlePool(1400).length).toBeGreaterThanOrEqual(8);
    expect(getPuzzlePool(2400).length).toBeGreaterThanOrEqual(6);
    expect(getPuzzlePool(800).every((puzzle) => puzzle.rating < 1200)).toBe(true);
  });
});
