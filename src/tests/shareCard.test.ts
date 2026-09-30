import { describe, it, expect, vi } from 'vitest';
import { parseFenToBoard, renderShareCardToCanvas } from '../utils/shareCard';

describe('shareCard utility', () => {
  it('parses standard initial FEN to an 8x8 board', () => {
    const board = parseFenToBoard();
    expect(board.length).toBe(8);
    expect(board[0].length).toBe(8);
    // Rank 8 pieces
    expect(board[0]).toEqual(['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']);
    // Rank 7 pawns
    expect(board[1]).toEqual(['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']);
    // Rank 2 white pawns
    expect(board[6]).toEqual(['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']);
    // Rank 1 white pieces
    expect(board[7]).toEqual(['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']);
  });

  it('correctly expands numeric empty spaces in custom FEN', () => {
    // 1. e4 e5
    const fen = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2';
    const board = parseFenToBoard(fen);
    expect(board[3][4]).toBe('p'); // e5
    expect(board[4][4]).toBe('P'); // e4
    expect(board[3][0]).toBeNull(); // a5 is empty
  });

  it('renders without error when canvas 2d context is provided', () => {
    const mockCtx = {
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillText: vi.fn(),
      strokeText: vi.fn(),
      measureText: vi.fn(() => ({ width: 40 })),
    };

    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement;

    renderShareCardToCanvas(mockCanvas, {
      whiteName: 'Magnus',
      blackName: 'Hikaru',
      whiteAccuracy: 94.2,
      blackAccuracy: 91.5,
      result: '1-0',
      openingName: 'Sicilian Defense',
      movesCount: 38,
    });

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.width).toBe(700);
    expect(mockCanvas.height).toBe(840);
    expect(mockCtx.fillRect).toHaveBeenCalled();
    expect(mockCtx.fillText).toHaveBeenCalled();
  });
});
