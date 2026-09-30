import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import {
  validateFen,
  buildFen,
  HANDICAP_PRESETS,
  ENDGAME_PRESETS,
  ALL_PRESETS,
  getPresetById,
} from '../utils/positionSandbox';

describe('Position Sandbox & Handicap Odds', () => {
  describe('validateFen', () => {
    it('approves standard starting FEN', () => {
      const result = validateFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects empty or malformed strings', () => {
      expect(validateFen('').isValid).toBe(false);
      expect(validateFen('not-a-fen').isValid).toBe(false);
      expect(validateFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP w KQkq - 0 1').isValid).toBe(false);
    });

    it('rejects positions with missing kings', () => {
      // Missing white king
      const noWhiteKing = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1';
      const res1 = validateFen(noWhiteKing);
      expect(res1.isValid).toBe(false);
      expect(res1.error).toContain('Missing White King');

      // Missing black king
      const noBlackKing = 'rnbq1bnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const res2 = validateFen(noBlackKing);
      expect(res2.isValid).toBe(false);
      expect(res2.error).toContain('Missing Black King');
    });

    it('rejects positions with multiple kings of the same color', () => {
      const twoWhiteKings = 'rnbqkbnr/pppppppp/8/8/8/4K3/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const res = validateFen(twoWhiteKings);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Found 2 White Kings');
    });

    it('rejects pawns on 1st or 8th ranks', () => {
      const pawnOnRank8 = 'Pnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const res1 = validateFen(pawnOnRank8);
      expect(res1.isValid).toBe(false);
      expect(res1.error).toContain('Pawns cannot exist on the 8th rank');

      const pawnOnRank1 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKB1p w KQkq - 0 1';
      const res2 = validateFen(pawnOnRank1);
      expect(res2.isValid).toBe(false);
      expect(res2.error).toContain('Pawns cannot exist on the 1st rank');
    });

    it('rejects illegal positions where opponent king is in check on player turn', () => {
      // White to move, but Black King on e8 is attacked by White Queen on e7
      const illegalOpponentInCheck = '4k3/4Q3/8/8/8/8/8/4K3 w - - 0 1';
      const res = validateFen(illegalOpponentInCheck);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('check');
    });
  });

  describe('buildFen', () => {
    it('correctly constructs FEN with castling and turn flags', () => {
      const fen = buildFen(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
        'w',
        { K: true, Q: false, k: true, q: false },
        '-',
        0,
        1
      );
      expect(fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w Kk - 0 1');
    });

    it('handles empty castling rights with hyphen', () => {
      const fen = buildFen(
        '4k3/8/8/8/8/8/8/4K3',
        'b',
        { K: false, Q: false, k: false, q: false },
        'e3',
        4,
        12
      );
      expect(fen).toBe('4k3/8/8/8/8/8/8/4K3 b - e3 4 12');
    });
  });

  describe('Handicap Presets', () => {
    it('all handicap presets are valid FENs', () => {
      for (const preset of HANDICAP_PRESETS) {
        const val = validateFen(preset.fen);
        expect(val.isValid, `Preset ${preset.id} failed validation: ${val.error}`).toBe(true);
      }
    });

    it('Knight Odds White gives up Nb1', () => {
      const knightOdds = getPresetById('knight-odds-white')!;
      expect(knightOdds).toBeDefined();
      const chess = new Chess(knightOdds.fen);
      expect(chess.get('b1')).toBeFalsy();
      expect(chess.get('g1')?.type).toBe('n');
      expect(chess.get('b8')?.type).toBe('n');
    });

    it('Rook Odds White gives up Ra1 and keeps kingside castling', () => {
      const rookOdds = getPresetById('rook-odds-white')!;
      expect(rookOdds).toBeDefined();
      const chess = new Chess(rookOdds.fen);
      expect(chess.get('a1')).toBeFalsy();
      expect(chess.get('h1')?.type).toBe('r');
      // castling rights should be Kkq (no White Q castling)
      expect(rookOdds.fen.split(' ')[2]).toBe('Kkq');
    });

    it('Queen Odds White starts without Queen', () => {
      const queenOdds = getPresetById('queen-odds-white')!;
      expect(queenOdds).toBeDefined();
      const chess = new Chess(queenOdds.fen);
      expect(chess.get('d1')).toBeFalsy();
      expect(chess.get('e1')?.type).toBe('k');
    });

    it('Pawn & Move Odds Black starts without f7 pawn', () => {
      const pawnMove = getPresetById('pawn-and-move')!;
      expect(pawnMove).toBeDefined();
      const chess = new Chess(pawnMove.fen);
      expect(chess.get('f7')).toBeFalsy();
      expect(chess.get('e7')?.type).toBe('p');
    });
  });

  describe('Endgame Presets', () => {
    it('all endgame presets are valid FENs', () => {
      for (const preset of ENDGAME_PRESETS) {
        const val = validateFen(preset.fen);
        expect(val.isValid, `Endgame ${preset.id} failed: ${val.error}`).toBe(true);
      }
    });

    it('Lucena position has White pawn on 7th rank ready to bridge', () => {
      const lucena = getPresetById('lucena-position')!;
      expect(lucena).toBeDefined();
      const chess = new Chess(lucena.fen);
      expect(chess.get('b7')?.type).toBe('p');
      expect(chess.get('b8')?.type).toBe('k');
    });

    it('retrieves preset by ID accurately', () => {
      expect(getPresetById('lucena-position')?.category).toBe('endgame');
      expect(getPresetById('knight-odds-white')?.category).toBe('handicap');
      expect(getPresetById('unknown-id')).toBeUndefined();
    });
  });
});
