import { describe, it, expect } from 'vitest';
import { Chess } from 'chess.js';
import { evaluateBoard, getBestMove } from '../utils/chessEngine';

describe('FIDE Rules and Chess Logic Verification', () => {
  it('correctly detects Fool\'s Mate (Checkmate - FIDE Rule 1.2)', () => {
    const chess = new Chess();
    chess.move('f3');
    chess.move('e5');
    chess.move('g4');
    chess.move('Qh4#');

    expect(chess.isCheckmate()).toBe(true);
    expect(chess.turn()).toBe('w'); // White has been checkmated
  });

  it('correctly detects Stalemate (FIDE Rule 5.2.1)', () => {
    // Known stalemate position: Black king on a8, White queen on c7, White king on c6
    const stalemateFen = 'k7/2Q5/2K5/8/8/8/8/8 b - - 0 1';
    const chess = new Chess(stalemateFen);

    expect(chess.isStalemate()).toBe(true);
    expect(chess.isCheckmate()).toBe(false);
    expect(chess.isDraw()).toBe(true);
  });

  it('correctly detects Insufficient Material (FIDE Rule 9.6)', () => {
    // King vs King
    const kvkFen = '8/8/4k3/8/8/4K3/8/8 w - - 0 1';
    const chess = new Chess(kvkFen);
    expect(chess.isInsufficientMaterial()).toBe(true);
    expect(chess.isDraw()).toBe(true);

    // King + Knight vs King
    const knvkFen = '8/8/4k3/8/8/4KN2/8/8 w - - 0 1';
    const chess2 = new Chess(knvkFen);
    expect(chess2.isInsufficientMaterial()).toBe(true);
    expect(chess2.isDraw()).toBe(true);
  });

  it('correctly handles En Passant capture and board update', () => {
    const chess = new Chess();
    chess.move('e4');
    chess.move('a6');
    chess.move('e5');
    chess.move('d5'); // Black advances pawn two squares adjacent to e5

    const legalMoves = chess.moves({ verbose: true });
    const enPassantMove = legalMoves.find((m) => m.from === 'e5' && m.to === 'd6');
    expect(enPassantMove).toBeDefined();
    expect(enPassantMove?.flags.includes('e')).toBe(true);

    chess.move('exd6');
    expect(chess.get('d5')).toBeFalsy(); // captured pawn removed
    expect(chess.get('d6')?.type).toBe('p');
    expect(chess.get('d6')?.color).toBe('w');
  });

  it('correctly enforces Castling restrictions (cannot castle through check)', () => {
    // White king on e1, rooks on a1 and h1, Black queen attacking f1 square
    const castleCheckFen = 'r3k2r/8/8/8/8/5q2/8/R3K2R w KQkq - 0 1';
    const chess = new Chess(castleCheckFen);
    const moves = chess.moves({ verbose: true });

    // Kingside castling O-O would pass through f1 which is attacked
    const canCastleKingside = moves.some((m) => m.san === 'O-O');
    expect(canCastleKingside).toBe(false);
  });

  it('correctly performs Pawn Promotion to Queen, Rook, Bishop, and Knight', () => {
    // White pawn on a7 about to promote
    const promoFen = '8/P7/8/8/8/8/8/4K2k w - - 0 1';
    const chess = new Chess(promoFen);

    const moves = chess.moves({ verbose: true });
    const promotions = moves.filter((m) => m.from === 'a7' && m.to === 'a8');
    expect(promotions.length).toBe(4); // q, r, b, n
    expect(promotions.map((p) => p.promotion).sort()).toEqual(['b', 'n', 'q', 'r']);

    // Execute promotion to Queen
    chess.move({ from: 'a7', to: 'a8', promotion: 'q' });
    expect(chess.get('a8')?.type).toBe('q');
    expect(chess.get('a8')?.color).toBe('w');
  });

  it('correctly evaluates positions and computes AI moves across difficulty levels', () => {
    const chess = new Chess();
    const score = evaluateBoard(chess);
    expect(Math.abs(score)).toBeLessThan(50); // Starting position is balanced

    // Easy AI move
    const easyMove = getBestMove(chess, 'easy');
    expect(easyMove).toBeDefined();
    expect(easyMove?.move.from).toBeDefined();

    // Medium AI move
    const medMove = getBestMove(chess, 'medium');
    expect(medMove).toBeDefined();
    expect(medMove?.depth).toBe(3);

    // Hard AI move
    const hardMove = getBestMove(chess, 'hard');
    expect(hardMove).toBeDefined();
    expect(hardMove?.depth).toBe(4);
  }, 15000);
});
