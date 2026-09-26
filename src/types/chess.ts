import { Square, PieceSymbol, Color } from 'chess.js';

export type PieceColor = Color;
export type PieceType = PieceSymbol;

export type GameMode = 'vs-ai' | 'pass-and-play' | 'sandbox';
export type AiDifficulty = 'easy' | 'medium' | 'hard' | 'master';
export type BoardTheme = 'chesscom' | 'wood' | 'slate' | 'midnight' | 'glass';
export type PlayerColorChoice = 'w' | 'b' | 'random';

export type GameTermination =
  | 'in_progress'
  | 'checkmate'
  | 'stalemate'
  | 'threefold_repetition'
  | 'fifty_move_rule'
  | 'insufficient_material'
  | 'timeout'
  | 'resignation'
  | 'draw_agreement';

export interface MoveHistoryItem {
  ply: number;
  moveNumber: number;
  san: string;
  from: Square;
  to: Square;
  piece: PieceType;
  color: PieceColor;
  captured?: PieceType;
  promotion?: PieceType;
  fen: string;
  whiteTimeRemaining?: number;
  blackTimeRemaining?: number;
}

export interface TimeControl {
  id: string;
  label: string;
  category: 'Bullet' | 'Blitz' | 'Rapid' | 'Classical' | 'Untimed';
  initialSeconds: number;
  incrementSeconds: number;
}

export interface GameSettings {
  mode: GameMode;
  aiDifficulty: AiDifficulty;
  playerColorChoice: PlayerColorChoice;
  timeControl: TimeControl;
  boardTheme: BoardTheme;
  soundEnabled: boolean;
  showLegalMoves: boolean;
  showEvaluationBar: boolean;
  autoFlipPassAndPlay: boolean;
}

export interface EvaluationResult {
  score: number; // in centipawns (positive = White advantage, negative = Black advantage)
  mateIn?: number; // moves to mate if forced
  bestMove?: { from: Square; to: Square; promotion?: string };
  depth: number;
}
