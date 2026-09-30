import { describe, expect, it } from 'vitest';
import {
  analyzeGame,
  calculateAccuracyFromAcpl,
  classifyMove,
  MoveClassification,
} from '../utils/gameReview';

describe('Game Review Engine', () => {
  describe('calculateAccuracyFromAcpl', () => {
    it('returns 100% for 0 ACPL loss', () => {
      expect(calculateAccuracyFromAcpl(0)).toBe(100);
    });

    it('returns high accuracy for minor ACPL (~20cp)', () => {
      const acc = calculateAccuracyFromAcpl(20);
      expect(acc).toBeGreaterThan(80);
      expect(acc).toBeLessThanOrEqual(100);
    });

    it('returns lower accuracy for severe ACPL (~300cp)', () => {
      const acc = calculateAccuracyFromAcpl(300);
      expect(acc).toBeLessThan(40);
      expect(acc).toBeGreaterThanOrEqual(0);
    });
  });

  describe('classifyMove', () => {
    it('classifies small loss <= 15cp as best or good', () => {
      const res = classifyMove(10, false, false, false, 0);
      expect(['best', 'good']).toContain(res.classification);
    });

    it('classifies large loss >= 250cp as blunder', () => {
      const res = classifyMove(300, false, false, false, -300);
      expect(res.classification).toBe('blunder');
    });

    it('classifies lost winning advantage as missed_win', () => {
      // White was winning +500, played a move leaving evaluation equal
      const res = classifyMove(600, true, true, false, -600);
      expect(res.classification).toBe('missed_win');
    });

    it('classifies moderate loss ~100cp as mistake', () => {
      const res = classifyMove(120, false, false, false, -120);
      expect(res.classification).toBe('mistake');
    });
  });

  describe('analyzeGame', () => {
    it('analyzes Scholar\'s mate game accurately', () => {
      // 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6?? 4. Qxf7#
      const scholarsMate = ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'];
      const report = analyzeGame(scholarsMate);

      expect(report.totalPlies).toBe(7);
      expect(report.plies.length).toBe(7);
      expect(report.advantageGraph.length).toBe(7);

      // White won by checkmate, so White should have higher accuracy than Black
      expect(report.whiteAccuracy).toBeGreaterThan(report.blackAccuracy);

      // Verify that Nf6 blunder or mistake is detected in keyMoments
      const blunderKeyMoment = report.keyMoments.find((km) => km.ply === 6 || km.playedMoveSan === 'Nf6');
      expect(blunderKeyMoment).toBeDefined();

      // Last move should be Qxf7# with checkmate evaluation
      const lastPly = report.plies[6];
      expect(lastPly.san).toBe('Qxf7#');
      expect(lastPly.evalAfter).toBeGreaterThanOrEqual(9000);
    });

    it('handles empty moves list gracefully without crashing', () => {
      const report = analyzeGame([]);
      expect(report.totalPlies).toBe(0);
      expect(report.whiteAccuracy).toBe(100);
      expect(report.blackAccuracy).toBe(100);
      expect(report.plies).toHaveLength(0);
      expect(report.keyMoments).toHaveLength(0);
    });
  });
});
