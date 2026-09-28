import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { getTheoryLessonsByCategory } from '../utils/studyTools';
import { getEndgameDrills } from '../utils/studyDrills';

describe('opening and endgame study drills', () => {
  it('keeps every opening model line legal from the initial position', () => {
    for (const lesson of getTheoryLessonsByCategory('opening')) {
      const chess = new Chess();
      for (const san of lesson.keyMoves) {
        expect(() => chess.move(san), `${lesson.id} model move ${san}`).not.toThrow();
      }
    }
  });

  it('provides rated endgame drills with source links and legal solution lines', () => {
    const drills = getEndgameDrills();
    expect(drills.length).toBeGreaterThan(5);

    for (const puzzle of drills) {
      expect(puzzle.sourceUrl).toContain(puzzle.id);
      expect(puzzle.rating).toBeGreaterThan(0);
      const playerPosition = new Chess(puzzle.fen);
      for (const uci of puzzle.solution) {
        expect(() => playerPosition.move({
          from: uci.slice(0, 2),
          to: uci.slice(2, 4),
          promotion: uci[4] ?? 'q',
        }), `${puzzle.id} solution move ${uci}`).not.toThrow();
      }
    }
  });
});
