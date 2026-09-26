import { Chess } from 'chess.js';
import { getBestMove } from '../utils/chessEngine';
import { AiDifficulty } from '../types/chess';

export interface WorkerRequest {
  fen: string;
  difficulty: AiDifficulty;
  requestId: number;
}

export interface WorkerResponse {
  requestId: number;
  bestMove: { from: string; to: string; promotion?: string } | null;
  score: number;
  depth: number;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { fen, difficulty, requestId } = e.data;
  try {
    const chess = new Chess(fen);
    const result = getBestMove(chess, difficulty);

    const response: WorkerResponse = {
      requestId,
      bestMove: result ? result.move : null,
      score: result ? result.score : 0,
      depth: result ? result.depth : 0,
    };

    self.postMessage(response);
  } catch (err) {
    self.postMessage({
      requestId,
      bestMove: null,
      score: 0,
      depth: 0,
      error: String(err),
    });
  }
};
