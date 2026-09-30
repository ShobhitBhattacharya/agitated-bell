import { Chess, Square } from 'chess.js';
import { evaluateBoard, getEngineBestMove, evaluatePositionDeep } from './chessEngine';
import { PieceColor } from '../types/chess';

export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'missed_win';

export interface PlyAnalysis {
  ply: number;
  moveNumber: number;
  color: PieceColor;
  san: string;
  from: string;
  to: string;
  fenBefore: string;
  fenAfter: string;
  evalBefore: number;
  evalAfter: number;
  cpl: number;
  classification: MoveClassification;
  bestMoveSan: string;
  bestMoveUci?: { from: string; to: string; promotion?: string };
  bestMoveEval: number;
  explanation: string;
}

export interface KeyMoment {
  id: string;
  ply: number;
  moveNumber: number;
  color: PieceColor;
  fen: string;
  playedMoveSan: string;
  bestMoveSan: string;
  classification: MoveClassification;
  explanation: string;
}

export interface GameReviewReport {
  whiteAccuracy: number;
  blackAccuracy: number;
  whiteAcpl: number;
  blackAcpl: number;
  totalPlies: number;
  classificationsCount: {
    white: Record<MoveClassification, number>;
    black: Record<MoveClassification, number>;
  };
  plies: PlyAnalysis[];
  keyMoments: KeyMoment[];
  advantageGraph: Array<{
    ply: number;
    moveNumber: number;
    score: number;
    color: PieceColor;
    san: string;
    classification: MoveClassification;
  }>;
}

// Convert centipawn loss to CAPS Accuracy % (0..100)
export function calculateAccuracyFromAcpl(acpl: number): number {
  if (acpl <= 0) return 100;
  // Calibrated for centipawns: 20cp -> ~91%, 50cp -> ~80%, 150cp -> ~50%, 300cp -> ~25%
  const pawns = acpl / 100;
  const raw = 103.1668 * Math.exp(-0.4354 * pawns) - 3.1669;
  return Math.round(Math.max(0, Math.min(100, raw)) * 10) / 10;
}

export function classifyMove(
  cpl: number,
  isWinningBefore: boolean,
  isEqualAfter: boolean,
  isSacrifice: boolean,
  evalDelta: number
): { classification: MoveClassification; explanation: string } {
  // Check for missed win
  if (isWinningBefore && isEqualAfter && cpl > 150) {
    return {
      classification: 'missed_win',
      explanation: 'Missed an opportunity to secure a decisive winning advantage.',
    };
  }

  // Brilliant move: A sound sacrifice that increases or preserves winning advantage
  if (isSacrifice && cpl <= 15 && evalDelta >= 0) {
    return {
      classification: 'brilliant',
      explanation: 'A brilliant tactical sacrifice that unlocks a decisive attack or initiative.',
    };
  }

  // Blunder
  if (cpl > 220) {
    return {
      classification: 'blunder',
      explanation: 'A major blunder that severely damages your position or loses material.',
    };
  }

  // Mistake
  if (cpl > 90) {
    return {
      classification: 'mistake',
      explanation: 'A noticeable mistake that gives up significant positional ground.',
    };
  }

  // Inaccuracy
  if (cpl > 35) {
    return {
      classification: 'inaccuracy',
      explanation: 'A minor inaccuracy that lets the opponent equalize or gain slight pressure.',
    };
  }

  // Great move
  if (cpl <= 5 && evalDelta > 50) {
    return {
      classification: 'great',
      explanation: 'A great tactical find that punishes the opponent’s previous inaccuracies.',
    };
  }

  // Best move
  if (cpl <= 15) {
    return {
      classification: 'best',
      explanation: 'The top recommended engine move in this position.',
    };
  }

  // Good move
  return {
    classification: 'good',
    explanation: 'A solid move maintaining the positional evaluation.',
  };
}

export function analyzeGame(
  moves: string[] | Array<{ from: string; to: string; san: string; promotion?: string }>,
  initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
): GameReviewReport {
  const chess = new Chess(initialFen);
  const plies: PlyAnalysis[] = [];
  const whiteCpls: number[] = [];
  const blackCpls: number[] = [];

  const emptyClassCounts = (): Record<MoveClassification, number> => ({
    brilliant: 0,
    great: 0,
    best: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    missed_win: 0,
  });

  const classificationsCount = {
    white: emptyClassCounts(),
    black: emptyClassCounts(),
  };

  const keyMoments: KeyMoment[] = [];

  for (let i = 0; i < moves.length; i++) {
    const rawMove = moves[i];
    const fenBefore = chess.fen();
    const color = chess.turn();
    const moveNumber = Math.floor(i / 2) + 1;

    // Evaluate position before move
    const evalBefore = evaluateBoard(chess);

    // Find engine's recommended best move in this position using deterministic depth 2 search
    const bestMoveRes = getEngineBestMove(chess, 2);
    const bestMoveUci = bestMoveRes?.move;
    const bestMoveEval = bestMoveRes?.score ?? evalBefore;

    // Convert best move to SAN for display
    let bestMoveSan = '';
    if (bestMoveUci) {
      try {
        const legal = chess.moves({ verbose: true });
        const found = legal.find(
          (m) => m.from === bestMoveUci.from && m.to === bestMoveUci.to
        );
        bestMoveSan = found ? found.san : `${bestMoveUci.from}-${bestMoveUci.to}`;
      } catch {
        bestMoveSan = `${bestMoveUci.from}-${bestMoveUci.to}`;
      }
    }

    // Play actual move
    let playedMoveObj;
    if (typeof rawMove === 'string') {
      playedMoveObj = chess.move(rawMove);
    } else {
      playedMoveObj = chess.move({
        from: rawMove.from as Square,
        to: rawMove.to as Square,
        promotion: rawMove.promotion,
      });
    }

    if (!playedMoveObj) {
      break;
    }

    const fenAfter = chess.fen();
    let evalAfter = evaluatePositionDeep(chess, 1);
    if (chess.isCheckmate()) {
      evalAfter = color === 'w' ? 10000 : -10000;
    }

    const isTopEngineMove =
      bestMoveUci !== undefined &&
      playedMoveObj.from === bestMoveUci.from &&
      playedMoveObj.to === bestMoveUci.to &&
      (!bestMoveUci.promotion || playedMoveObj.promotion === bestMoveUci.promotion);

    // Calculate CPL (Centipawn Loss from moving player's perspective)
    let cpl = 0;
    let evalDelta = 0;
    if (chess.isCheckmate() || isTopEngineMove) {
      cpl = 0;
      evalDelta = color === 'w' ? evalAfter - evalBefore : evalBefore - evalAfter;
    } else if (color === 'w') {
      // White wants higher score
      cpl = Math.max(0, bestMoveEval - evalAfter);
      evalDelta = evalAfter - evalBefore;
    } else {
      // Black wants lower (more negative) score
      cpl = Math.max(0, evalAfter - bestMoveEval);
      evalDelta = evalBefore - evalAfter;
    }

    // Cap CPL at 1000 to prevent runaway checkmate penalties from skewing average
    const clampedCpl = Math.min(1000, cpl);

    if (color === 'w') {
      whiteCpls.push(clampedCpl);
    } else {
      blackCpls.push(clampedCpl);
    }

    const isWinningBefore =
      color === 'w' ? evalBefore > 350 : evalBefore < -350;
    const isEqualAfter = Math.abs(evalAfter) < 120;
    const isSacrifice =
      playedMoveObj.captured !== undefined &&
      ['q', 'r', 'b', 'n'].includes(playedMoveObj.piece);

    const { classification, explanation } = classifyMove(
      clampedCpl,
      isWinningBefore,
      isEqualAfter,
      isSacrifice,
      evalDelta
    );

    if (color === 'w') {
      classificationsCount.white[classification]++;
    } else {
      classificationsCount.black[classification]++;
    }

    const plyRecord: PlyAnalysis = {
      ply: i + 1,
      moveNumber,
      color,
      san: playedMoveObj.san,
      from: playedMoveObj.from,
      to: playedMoveObj.to,
      fenBefore,
      fenAfter,
      evalBefore,
      evalAfter,
      cpl: clampedCpl,
      classification,
      bestMoveSan,
      bestMoveUci,
      bestMoveEval,
      explanation,
    };

    plies.push(plyRecord);

    // If inaccuracy, mistake, or blunder, add to Key Moments
    if (
      classification === 'mistake' ||
      classification === 'blunder' ||
      classification === 'missed_win'
    ) {
      keyMoments.push({
        id: `km-${i + 1}`,
        ply: i + 1,
        moveNumber,
        color,
        fen: fenBefore,
        playedMoveSan: playedMoveObj.san,
        bestMoveSan,
        classification,
        explanation,
      });
    }
  }

  // Calculate ACPLs
  const whiteAcpl =
    whiteCpls.length > 0
      ? Math.round(
          (whiteCpls.reduce((acc, v) => acc + v, 0) / whiteCpls.length) * 10
        ) / 10
      : 0;
  const blackAcpl =
    blackCpls.length > 0
      ? Math.round(
          (blackCpls.reduce((acc, v) => acc + v, 0) / blackCpls.length) * 10
        ) / 10
      : 0;

  const whiteAccuracy = calculateAccuracyFromAcpl(whiteAcpl);
  const blackAccuracy = calculateAccuracyFromAcpl(blackAcpl);

  const advantageGraph = plies.map((p) => ({
    ply: p.ply,
    moveNumber: p.moveNumber,
    score: p.evalAfter,
    color: p.color,
    san: p.san,
    classification: p.classification,
  }));

  return {
    whiteAccuracy,
    blackAccuracy,
    whiteAcpl,
    blackAcpl,
    totalPlies: plies.length,
    classificationsCount,
    plies,
    keyMoments,
    advantageGraph,
  };
}
