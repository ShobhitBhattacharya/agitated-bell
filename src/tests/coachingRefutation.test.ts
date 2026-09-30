import { describe, it, expect } from 'vitest';
import {
  calculatePerformanceRating,
  computeRefutation,
  analyzeGame,
} from '../utils/gameReview';

describe('Coaching Suite: Performance Rating & Refutation Coach', () => {
  describe('calculatePerformanceRating', () => {
    it('rates master-level precision (>95% accuracy, <20 ACPL) as Grandmaster / Master', () => {
      const res = calculatePerformanceRating(97.5, 12);
      expect(res.elo).toBeGreaterThanOrEqual(2400);
      expect(res.tier).toBe('Grandmaster');
    });

    it('rates solid club play (~80% accuracy, ~45 ACPL) around ~1600-1800 Expert / Club Player', () => {
      const res = calculatePerformanceRating(82, 45);
      expect(res.elo).toBeGreaterThanOrEqual(1500);
      expect(res.elo).toBeLessThan(2300);
      expect(['Expert', 'Club Player']).toContain(res.tier);
    });

    it('rates lower accuracy and high ACPL appropriately as Novice or Intermediate', () => {
      const res = calculatePerformanceRating(50, 150);
      expect(res.elo).toBeLessThanOrEqual(1300);
      expect(['Novice', 'Intermediate']).toContain(res.tier);
    });
  });

  describe('computeRefutation', () => {
    it('detects punishing moves when opponent blunders into immediate checkmate', () => {
      // 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6?? (fen after 3... Nf6)
      // Position where White can deliver checkmate with Qxf7#
      const fenAfterBlunder = 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 2 4';
      const refutation = computeRefutation(fenAfterBlunder, 'b');

      expect(refutation).toBeDefined();
      expect(refutation?.punishingMoveSan).toBe('Qxf7#');
      expect(refutation?.explanation).toContain('checkmate');
    });

    it('detects punishment winning an undefended piece', () => {
      // Position where a queen or piece is hanging
      // e.g. White plays a blunder leaving Queen on d4 hanging to opponent's pawn or knight
      // 1. e4 e5 2. d4 exd4 3. c3? (leaves d4 pawn or allows dxc3)
      const fen = 'rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq - 0 3';
      const refutation = computeRefutation(fen, 'w');
      expect(refutation).toBeDefined();
      expect(refutation?.punishingMoveSan).toBeTruthy();
    });
  });

  describe('analyzeGame with refutations and performance ratings', () => {
    it('embeds performance ratings and refutations into the completed report', () => {
      const scholarsMate = ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'];
      const report = analyzeGame(scholarsMate);

      expect(report.whitePerformance).toBeDefined();
      expect(report.whitePerformance.elo).toBeGreaterThan(1000);
      expect(report.blackPerformance).toBeDefined();

      // Black's 3... Nf6 blunder should have a refutation
      const blunderMoment = report.keyMoments.find((km) => km.color === 'b');
      expect(blunderMoment).toBeDefined();
      expect(blunderMoment?.refutation).toBeDefined();
      expect(blunderMoment?.refutation?.punishingMoveSan).toBe('Qxf7#');
    });
  });
});
