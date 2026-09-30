import { Chess, Square, Color, PieceSymbol } from 'chess.js';
import { PieceColor } from '../types/chess';
import { BoardArrow } from '../components/ChessBoard';

export type ThreatSeverity = 'hanging' | 'vulnerable';

export interface ThreatItem {
  square: Square;
  pieceType: PieceSymbol;
  pieceColor: PieceColor;
  severity: ThreatSeverity;
  isDefended: boolean;
  attackerSquares: Square[];
  description: string;
}

export interface ThreatRadarResult {
  hasThreats: boolean;
  threats: ThreatItem[];
  hangingCount: number;
  vulnerableCount: number;
  highlights: Partial<Record<Square, string>>;
  arrows: BoardArrow[];
  summaryText: string;
}

const PIECE_NAMES: Record<PieceSymbol, string> = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

/**
 * Scans the chessboard for threatened friendly pieces.
 * In 'easy' mode, full attack vector arrows and explanatory summaries are provided.
 * In 'hard' mode, only minimal square indicator highlights are produced without spoiler arrows.
 */
export function detectBoardThreats(
  chess: Chess,
  playerColor: PieceColor,
  mode: 'easy' | 'hard' = 'easy'
): ThreatRadarResult {
  const oppColor: PieceColor = playerColor === 'w' ? 'b' : 'w';

  // Build a board representation where opponent has the turn to inspect all potential enemy attacking moves
  let oppMoves: Array<{ from: Square; to: Square; piece: PieceSymbol }> = [];
  try {
    const currentFen = chess.fen();
    const fenParts = currentFen.split(' ');
    fenParts[1] = oppColor; // set turn to opponent
    // Reset en passant square if switching sides might invalidate it
    fenParts[3] = '-';
    const oppChess = new Chess(fenParts.join(' '));
    oppMoves = oppChess.moves({ verbose: true }).map((m) => ({
      from: m.from as Square,
      to: m.to as Square,
      piece: m.piece as PieceSymbol,
    }));
  } catch {
    // If turn-flipped FEN is rejected (e.g. king check constraints), fall back to standard move inspection
    try {
      if (chess.turn() === oppColor) {
        oppMoves = chess.moves({ verbose: true }).map((m) => ({
          from: m.from as Square,
          to: m.to as Square,
          piece: m.piece as PieceSymbol,
        }));
      }
    } catch {
      oppMoves = [];
    }
  }

  const threats: ThreatItem[] = [];
  const highlights: Partial<Record<Square, string>> = {};
  const arrows: BoardArrow[] = [];

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  for (const f of files) {
    for (const r of ranks) {
      const sq = `${f}${r}` as Square;
      const piece = chess.get(sq);
      if (!piece || piece.color !== playerColor || piece.type === 'k') {
        continue;
      }

      // Check if attacked by opponent
      const isAttacked = chess.isAttacked(sq, oppColor as Color);
      if (!isAttacked) {
        continue;
      }

      // Check if defended by friendly pieces
      const isDefended = chess.isAttacked(sq, playerColor as Color);

      // Identify which opponent pieces attack this square
      const directAttackers = oppMoves.filter((m) => m.to === sq);
      const attackerSquares = Array.from(new Set(directAttackers.map((m) => m.from)));

      // Check if any attacker has a lower material value than the defending piece
      const targetVal = PIECE_VALUES[piece.type];
      const hasLowerValuedAttacker = directAttackers.some(
        (atk) => PIECE_VALUES[atk.piece] < targetVal
      );

      let severity: ThreatSeverity;
      if (!isDefended) {
        severity = 'hanging';
      } else if (hasLowerValuedAttacker) {
        severity = 'vulnerable';
      } else {
        // Defended and only attacked by equal or higher value pieces:
        // Skip from threat radar to avoid false positive alarms on normal trades
        continue;
      }

      const pieceName = PIECE_NAMES[piece.type];
      let description = '';
      if (severity === 'hanging') {
        description = `Your ${pieceName} on ${sq} is hanging undefended!`;
      } else {
        description = `Your ${pieceName} on ${sq} is attacked by a lower-value piece!`;
      }

      threats.push({
        square: sq,
        pieceType: piece.type,
        pieceColor: piece.color,
        severity,
        isDefended,
        attackerSquares,
        description,
      });

      // Highlight styling
      if (mode === 'easy') {
        // Red for hanging, amber for vulnerable
        highlights[sq] = severity === 'hanging' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(245, 158, 11, 0.4)';

        // Draw attack arrows from each attacker to the victim
        for (const atkSq of attackerSquares) {
          arrows.push({
            from: atkSq,
            to: sq,
            color: severity === 'hanging' ? '#ef4444' : '#f59e0b',
          });
        }
      } else {
        // Hard mode: subtle minimal indicator without spoiler arrows
        highlights[sq] = severity === 'hanging' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(251, 146, 60, 0.25)';
      }
    }
  }

  const hangingCount = threats.filter((t) => t.severity === 'hanging').length;
  const vulnerableCount = threats.filter((t) => t.severity === 'vulnerable').length;
  const hasThreats = threats.length > 0;

  let summaryText = 'Position secure — no hanging pieces.';
  if (hasThreats) {
    if (mode === 'easy') {
      const parts: string[] = [];
      if (hangingCount > 0) parts.push(`${hangingCount} undefended piece${hangingCount > 1 ? 's' : ''}`);
      if (vulnerableCount > 0) parts.push(`${vulnerableCount} vulnerable piece${vulnerableCount > 1 ? 's' : ''}`);
      summaryText = `Threat Radar: ${parts.join(', ')} detected!`;
    } else {
      summaryText = `Radar: ${threats.length} threat${threats.length > 1 ? 's' : ''} detected.`;
    }
  }

  return {
    hasThreats,
    threats,
    hangingCount,
    vulnerableCount,
    highlights,
    arrows,
    summaryText,
  };
}
