import { describe, expect, it } from 'vitest';
import { Chess } from 'chess.js';
import { detectBoardThreats } from '../utils/threatRadar';

describe('Threat Radar Engine', () => {
  it('detects zero threats in the initial starting position for White and Black', () => {
    const chess = new Chess();
    const whiteThreats = detectBoardThreats(chess, 'w', 'easy');
    expect(whiteThreats.hasThreats).toBe(false);
    expect(whiteThreats.threats).toHaveLength(0);
    expect(whiteThreats.arrows).toHaveLength(0);

    const blackThreats = detectBoardThreats(chess, 'b', 'easy');
    expect(blackThreats.hasThreats).toBe(false);
    expect(blackThreats.threats).toHaveLength(0);
  });

  it('detects an undefended hanging knight in Easy mode with arrows and warning text', () => {
    const chess = new Chess();
    // 1. e4 d5 2. Nf3 dxe4 (White knight on f3 was attacked, if White moves it to an undefended square e5)
    chess.move('e4');
    chess.move('d5');
    chess.move('Nf3');
    chess.move('dxe4');
    chess.move('Ne5'); // White knight on e5
    // Black plays Qd5, attacking White knight on e5 while e5 has 0 white defenders
    chess.move('Qd5');

    const result = detectBoardThreats(chess, 'w', 'easy');
    expect(result.hasThreats).toBe(true);
    expect(result.hangingCount).toBeGreaterThanOrEqual(1);

    const knightThreat = result.threats.find((t) => t.square === 'e5');
    expect(knightThreat).toBeDefined();
    expect(knightThreat?.severity).toBe('hanging');
    expect(knightThreat?.isDefended).toBe(false);

    // In Easy mode, arrow from d5 to e5 should be present
    expect(result.arrows.length).toBeGreaterThan(0);
    const arrow = result.arrows.find((a) => a.from === 'd5' && a.to === 'e5');
    expect(arrow).toBeDefined();
    expect(result.highlights['e5']).toBeDefined();
    expect(result.summaryText).toContain('undefended piece');
  });

  it('detects a high-value piece attacked by a lower-value piece (vulnerable queen)', () => {
    const chess = new Chess();
    // 1. e4 e5 2. Qh5 (Queen on h5) 2... g6 (Pawn on g6 attacks queen on h5)
    chess.move('e4');
    chess.move('e5');
    chess.move('Qh5');
    chess.move('g6');

    const result = detectBoardThreats(chess, 'w', 'easy');
    expect(result.hasThreats).toBe(true);

    const queenThreat = result.threats.find((t) => t.square === 'h5');
    expect(queenThreat).toBeDefined();
    expect(['hanging', 'vulnerable']).toContain(queenThreat?.severity);
  });

  it('restricts arrows in Hard mode to keep master calculation challenging', () => {
    const chess = new Chess();
    chess.move('e4');
    chess.move('d5');
    chess.move('Nf3');
    chess.move('dxe4');
    chess.move('Ne5');
    chess.move('Qd5');

    const hardResult = detectBoardThreats(chess, 'w', 'hard');
    expect(hardResult.hasThreats).toBe(true);
    // Hard mode highlights the threatened square
    expect(hardResult.highlights['e5']).toBeDefined();
    // But does NOT draw spoiler attack arrows
    expect(hardResult.arrows).toHaveLength(0);
    expect(hardResult.summaryText).toContain('Radar:');
  });
});
