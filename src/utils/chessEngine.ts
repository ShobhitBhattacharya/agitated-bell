import { Chess, Square, Move } from 'chess.js';
import {
  PIECE_VALUES,
  PAWN_TABLE,
  KNIGHT_TABLE,
  BISHOP_TABLE,
  ROOK_TABLE,
  QUEEN_TABLE,
  KING_MIDDLE_TABLE,
  KING_END_TABLE,
} from './evalTables';
import { AiDifficulty } from '../types/chess';

// Map square coordinates (e.g., 'e4') to 0..63 index
export function squareToIndex(square: Square): number {
  const file = square.charCodeAt(0) - 97; // 0..7 for a..h
  const rank = parseInt(square[1], 10) - 1; // 0..7 for 1..8
  return (7 - rank) * 8 + file;
}

// Get positional score from piece-square tables
function getPstScore(pieceType: string, index: number, isWhite: boolean, isEndgame: boolean): number {
  const tableIdx = isWhite ? index : 63 - index;
  switch (pieceType) {
    case 'p':
      return PAWN_TABLE[tableIdx];
    case 'n':
      return KNIGHT_TABLE[tableIdx];
    case 'b':
      return BISHOP_TABLE[tableIdx];
    case 'r':
      return ROOK_TABLE[tableIdx];
    case 'q':
      return QUEEN_TABLE[tableIdx];
    case 'k':
      return isEndgame ? KING_END_TABLE[tableIdx] : KING_MIDDLE_TABLE[tableIdx];
    default:
      return 0;
  }
}

// Evaluate board position from White's perspective (+: White advantage, -: Black advantage)
export function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -100000 : 100000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let whiteMaterial = 0;
  let blackMaterial = 0;
  let whitePositional = 0;
  let blackPositional = 0;

  let totalNonPawnMaterial = 0;

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] || 0;
      if (piece.type !== 'p' && piece.type !== 'k') {
        totalNonPawnMaterial += val;
      }
    }
  }

  const isEndgame = totalNonPawnMaterial < 1500;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const idx = r * 8 + c;
      const baseValue = PIECE_VALUES[piece.type] || 0;
      const isWhite = piece.color === 'w';
      const posValue = getPstScore(piece.type, idx, isWhite, isEndgame);

      if (isWhite) {
        whiteMaterial += baseValue;
        whitePositional += posValue;
      } else {
        blackMaterial += baseValue;
        blackPositional += posValue;
      }
    }
  }

  // Slight tempo advantage for the active side (+15 to +20 centipawns)
  const tempoBonus = chess.turn() === 'w' ? 15 : -15;

  const score = whiteMaterial + whitePositional - (blackMaterial + blackPositional) + tempoBonus;
  return score;
}

// Order moves to optimize Alpha-Beta pruning (captures first: MVV-LVA)
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    }
    if (a.promotion) {
      scoreA += 800;
    }
    if (b.captured) {
      scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    }
    if (b.promotion) {
      scoreB += 800;
    }

    return scoreB - scoreA;
  });
}

// Alpha-Beta Minimax search
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -100000 - depth : 100000 + depth;
  }
  if (chess.isDraw()) {
    return 0;
  }
  if (depth === 0) {
    return evaluateBoard(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
}

export interface BestMoveResult {
  move: { from: Square; to: Square; promotion?: string };
  score: number;
  depth: number;
}

// Find best move based on AI difficulty
export function getBestMove(chess: Chess, difficulty: AiDifficulty): BestMoveResult | null {
  const legalMoves = orderMoves(chess.moves({ verbose: true }));
  if (legalMoves.length === 0) return null;

  const isWhite = chess.turn() === 'w';

  // Easy mode (~800-1000 ELO): High blunder chance or random moves with simple captures
  if (difficulty === 'easy') {
    if (Math.random() < 0.35) {
      const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
      return {
        move: { from: randomMove.from, to: randomMove.to, promotion: randomMove.promotion },
        score: evaluateBoard(chess),
        depth: 1,
      };
    }
    // Otherwise depth 1 search
    let bestScore = isWhite ? -Infinity : Infinity;
    let selectedMove = legalMoves[0];

    for (const move of legalMoves) {
      chess.move(move);
      // add small random fuzz for natural play
      const score = evaluateBoard(chess) + (Math.random() * 40 - 20);
      chess.undo();

      if (isWhite && score > bestScore) {
        bestScore = score;
        selectedMove = move;
      } else if (!isWhite && score < bestScore) {
        bestScore = score;
        selectedMove = move;
      }
    }

    return {
      move: { from: selectedMove.from, to: selectedMove.to, promotion: selectedMove.promotion },
      score: bestScore,
      depth: 1,
    };
  }

  const depthMap: Record<AiDifficulty, number> = {
    easy: 1,
    medium: 3,
    hard: 4,
    master: 5,
  };

  const depth = depthMap[difficulty] || 3;
  let bestMove = legalMoves[0];
  let bestScore = isWhite ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of legalMoves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, alpha, beta, !isWhite);
    chess.undo();

    if (isWhite) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) break;
  }

  return {
    move: { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion },
    score: bestScore,
    depth,
  };
}

// Deterministic engine best move search without random fuzz (ideal for post-game analysis)
export function getEngineBestMove(chess: Chess, depth = 2): BestMoveResult | null {
  const legalMoves = orderMoves(chess.moves({ verbose: true }));
  if (legalMoves.length === 0) return null;

  const isWhite = chess.turn() === 'w';
  let bestMove = legalMoves[0];
  let bestScore = isWhite ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of legalMoves) {
    chess.move(move);
    const score = minimax(chess, depth - 1, alpha, beta, !isWhite);
    chess.undo();

    if (isWhite) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }
    if (beta <= alpha) break;
  }

  return {
    move: { from: bestMove.from, to: bestMove.to, promotion: bestMove.promotion },
    score: bestScore,
    depth,
  };
}

export function evaluatePositionDeep(chess: Chess, depth = 1): number {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -100000 : 100000;
  }
  if (chess.isDraw()) return 0;
  return minimax(chess, depth, -Infinity, Infinity, chess.turn() === 'w');
}

