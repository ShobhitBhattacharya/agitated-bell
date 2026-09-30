import { Chess } from 'chess.js';
import { PieceColor } from '../types/chess';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface CastlingRights {
  K: boolean; // White kingside
  Q: boolean; // White queenside
  k: boolean; // Black kingside
  q: boolean; // Black queenside
}

export interface PositionPreset {
  id: string;
  name: string;
  category: 'handicap' | 'endgame';
  description: string;
  fen: string;
  giver?: PieceColor;
  oddsPiece?: string;
  ratingDiff?: string;
  recommendedColor: PieceColor;
  tag: string;
}

/**
 * Validates a FEN string against FIDE chess rules:
 * 1. Must parse properly with 6 space-separated tokens
 * 2. Exactly one White King ('K') and one Black King ('k')
 * 3. No pawns on rank 1 or rank 8
 * 4. The side NOT to move cannot be currently in check (an illegal state in chess)
 * 5. Must be loadable into chess.js engine
 */
export function validateFen(fen: string): ValidationResult {
  const trimmed = fen.trim();
  if (!trimmed) {
    return { isValid: false, error: 'FEN string is empty.' };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length < 1) {
    return { isValid: false, error: 'Malformed FEN string.' };
  }

  const boardPart = parts[0];
  const ranks = boardPart.split('/');
  if (ranks.length !== 8) {
    return { isValid: false, error: `Expected 8 board ranks, but found ${ranks.length}.` };
  }

  // Count kings
  let whiteKings = 0;
  let blackKings = 0;
  for (const char of boardPart) {
    if (char === 'K') whiteKings++;
    if (char === 'k') blackKings++;
  }

  if (whiteKings === 0) {
    return { isValid: false, error: 'Missing White King. A valid chess position must have exactly one White King.' };
  }
  if (whiteKings > 1) {
    return { isValid: false, error: `Found ${whiteKings} White Kings. Exactly one White King is allowed.` };
  }
  if (blackKings === 0) {
    return { isValid: false, error: 'Missing Black King. A valid chess position must have exactly one Black King.' };
  }
  if (blackKings > 1) {
    return { isValid: false, error: `Found ${blackKings} Black Kings. Exactly one Black King is allowed.` };
  }

  // Check 1st rank (index 7) and 8th rank (index 0) for pawns
  const rank8 = ranks[0];
  const rank1 = ranks[7];
  if (rank8.includes('p') || rank8.includes('P')) {
    return { isValid: false, error: 'Pawns cannot exist on the 8th rank.' };
  }
  if (rank1.includes('p') || rank1.includes('P')) {
    return { isValid: false, error: 'Pawns cannot exist on the 1st rank.' };
  }

  // Load into Chess.js
  try {
    const c = new Chess(trimmed);

    // Verify side not to move is not in check
    // If turn is 'w', black just moved; if black's king is attacked, it's illegal.
    const turn = c.turn();
    const otherColor = turn === 'w' ? 'b' : 'w';
    
    // Check if the opponent king is attacked: we can test by setting turn to otherColor and checking inCheck()
    const partsCopy = [...parts];
    partsCopy[1] = otherColor;
    // ensure at least 4 parts
    while (partsCopy.length < 4) partsCopy.push('-');
    if (partsCopy.length < 6) {
      if (partsCopy.length === 4) partsCopy.push('0', '1');
      else if (partsCopy.length === 5) partsCopy.push('1');
    }
    const flippedFen = partsCopy.join(' ');
    try {
      const flipped = new Chess(flippedFen);
      if (flipped.inCheck()) {
        const notMoving = turn === 'w' ? 'Black' : 'White';
        return {
          isValid: false,
          error: `${notMoving}'s King is in check, but it is not their turn to move (illegal state).`,
        };
      }
    } catch {
      // If flipped fen has trouble, fallback
    }

    return { isValid: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid chess position.';
    return { isValid: false, error: `Invalid position: ${message}` };
  }
}

/**
 * Builds a standardized FEN string from individual components.
 */
export function buildFen(
  piecePlacement: string,
  turn: 'w' | 'b',
  castling: CastlingRights,
  epSquare: string = '-',
  halfMoves: number = 0,
  fullMoves: number = 1
): string {
  let castlingStr = '';
  if (castling.K) castlingStr += 'K';
  if (castling.Q) castlingStr += 'Q';
  if (castling.k) castlingStr += 'k';
  if (castling.q) castlingStr += 'q';
  if (!castlingStr) castlingStr = '-';

  const cleanEp = epSquare && epSquare !== '' ? epSquare : '-';
  return `${piecePlacement} ${turn} ${castlingStr} ${cleanEp} ${halfMoves} ${fullMoves}`;
}

export const HANDICAP_PRESETS: PositionPreset[] = [
  {
    id: 'knight-odds-white',
    name: 'Knight Odds (White gives Nb1)',
    category: 'handicap',
    description: 'White plays without the b1 knight. Standard club handicap when White is rated ~300 Elo higher than Black.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/R1BQKBNR w KQkq - 0 1',
    giver: 'w',
    oddsPiece: 'Knight (Nb1)',
    ratingDiff: '+300 Elo',
    recommendedColor: 'b',
    tag: 'Club Favorite',
  },
  {
    id: 'knight-odds-black',
    name: 'Knight Odds (Black gives Nb8)',
    category: 'handicap',
    description: 'Black plays without the b8 knight. You play as White with extra piece material from the first move.',
    fen: 'r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    giver: 'b',
    oddsPiece: 'Knight (Nb8)',
    ratingDiff: '-300 Elo',
    recommendedColor: 'w',
    tag: 'Attacking Training',
  },
  {
    id: 'rook-odds-white',
    name: 'Rook Odds (White gives Ra1)',
    category: 'handicap',
    description: 'White plays without the a1 rook. Kingside castling is preserved. Standard when White is ~500-600 Elo higher.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1',
    giver: 'w',
    oddsPiece: 'Rook (Ra1)',
    ratingDiff: '+500 Elo',
    recommendedColor: 'b',
    tag: 'Heavy Odds',
  },
  {
    id: 'rook-odds-black',
    name: 'Rook Odds (Black gives Ra8)',
    category: 'handicap',
    description: 'Black plays without the a8 rook. Test your conversion technique with a full 5-point material lead.',
    fen: '1nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQk - 0 1',
    giver: 'b',
    oddsPiece: 'Rook (Ra8)',
    ratingDiff: '-500 Elo',
    recommendedColor: 'w',
    tag: 'Conversion Drill',
  },
  {
    id: 'queen-odds-white',
    name: 'Queen Odds (White gives Qd1)',
    category: 'handicap',
    description: 'White plays without a Queen (9 points down). Historic master vs beginner handicap.',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNB1KBNR w KQkq - 0 1',
    giver: 'w',
    oddsPiece: 'Queen (Qd1)',
    ratingDiff: '+800+ Elo',
    recommendedColor: 'b',
    tag: 'Ultimate Odds',
  },
  {
    id: 'pawn-and-move',
    name: 'Pawn & Move Odds (Black without f7)',
    category: 'handicap',
    description: 'Black gives up the f7 pawn, opening up the king diagonal immediately for White attack.',
    fen: 'rnbqkbnr/ppppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    giver: 'b',
    oddsPiece: 'Pawn (f7)',
    ratingDiff: '-200 Elo',
    recommendedColor: 'w',
    tag: 'Tactical Pressure',
  },
  {
    id: 'the-exchange-odds',
    name: 'The Exchange Odds (Ra1 for Nb8)',
    category: 'handicap',
    description: 'White starts down an exchange (White gives a1 rook for Black b8 knight). Sharp imbalances from ply 1.',
    fen: 'r1bqkbnr/pppppppp/8/8/8/8/PPPPPPPP/1NBQKBNR w Kkq - 0 1',
    giver: 'w',
    oddsPiece: 'Exchange (R for N)',
    ratingDiff: '+200 Elo',
    recommendedColor: 'b',
    tag: 'Imbalance Drill',
  },
];

export const ENDGAME_PRESETS: PositionPreset[] = [
  {
    id: 'lucena-position',
    name: 'Lucena Position (Building a Bridge)',
    category: 'endgame',
    description: 'The cornerstone of rook endgames. White builds a bridge with Rf4 to shield the king and queen the pawn.',
    fen: '1K1k4/1P1r4/8/8/8/8/8/2R5 w - - 0 1',
    recommendedColor: 'w',
    tag: 'Rook Endgame',
  },
  {
    id: 'philidor-defense',
    name: 'Philidor Position (3rd Rank Defense)',
    category: 'endgame',
    description: 'The fundamental drawing technique against a passed pawn. Hold the 6th/3rd rank then check from behind.',
    fen: '4k3/4r3/8/8/4P3/8/8/4K1R1 w - - 0 1',
    recommendedColor: 'w',
    tag: 'Rook Endgame',
  },
  {
    id: 'queen-vs-pawn-7th',
    name: 'Queen vs Pawn on 7th Rank',
    category: 'endgame',
    description: 'White Queen must pin and block the advanced c-pawn while marching the king to assist in checkmate.',
    fen: '8/8/8/8/3QK3/8/k1p5/8 w - - 0 1',
    recommendedColor: 'w',
    tag: 'Queen Endgame',
  },
  {
    id: 'king-pawn-opposition',
    name: 'King & Pawn Key Opposition',
    category: 'endgame',
    description: 'Direct vertical opposition drill. Take control of the key squares in front of the pawn to ensure promotion.',
    fen: '8/8/8/4k3/8/4K3/4P3/8 w - - 0 1',
    recommendedColor: 'w',
    tag: 'Pawn Endgame',
  },
  {
    id: 'bishop-knight-mate',
    name: 'Bishop & Knight Checkmate',
    category: 'endgame',
    description: 'Coordinate King, Bishop, and Knight using the famous W-manoeuvre to force the enemy King into the right corner.',
    fen: '8/8/8/4k3/8/8/4B3/4K1N1 w - - 0 1',
    recommendedColor: 'w',
    tag: 'Minor Piece Mate',
  },
];

export const ALL_PRESETS: PositionPreset[] = [...HANDICAP_PRESETS, ...ENDGAME_PRESETS];

export function getPresetById(id: string): PositionPreset | undefined {
  return ALL_PRESETS.find((p) => p.id === id);
}
