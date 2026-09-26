import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameTermination, PieceColor, GameMode } from '../types/chess';
import { Trophy, Award, RotateCcw, X, Eye } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  termination: GameTermination;
  winner: PieceColor | null;
  playerColor: PieceColor;
  mode: GameMode;
  onNewGame: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  termination,
  winner,
  playerColor,
  mode,
  onNewGame,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Trigger celebration confetti if human player won vs AI or local game
    const isHumanWinner =
      (mode === 'vs-ai' && winner === playerColor) || (mode === 'pass-and-play' && winner !== null);

    if (isHumanWinner) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#81b64c', '#f7f769', '#ffffff', '#3b82f6'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, winner, playerColor, mode]);

  if (!isOpen) return null;

  // Title and subtitle description based on FIDE rule termination
  let title = 'Game Over';
  let subtitle = '';
  let icon = <Award className="w-12 h-12 text-[#81b64c]" />;

  if (winner) {
    const winnerName = winner === 'w' ? 'White' : 'Black';
    if (mode === 'vs-ai') {
      const playerWon = winner === playerColor;
      title = playerWon ? 'Victory!' : 'Defeat!';
      icon = playerWon ? (
        <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
      ) : (
        <Award className="w-12 h-12 text-neutral-400" />
      );
    } else {
      title = `${winnerName} Wins!`;
      icon = <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />;
    }

    switch (termination) {
      case 'checkmate':
        subtitle = `${winnerName} won by checkmate (FIDE Rule 1.2)`;
        break;
      case 'timeout':
        subtitle = `${winnerName} won on time (Flag fall)`;
        break;
      case 'resignation':
        subtitle = `${winnerName} won by resignation`;
        break;
      default:
        subtitle = `${winnerName} won the match`;
    }
  } else {
    title = 'Draw';
    icon = <Award className="w-12 h-12 text-neutral-400" />;

    switch (termination) {
      case 'stalemate':
        subtitle = 'Drawn by Stalemate (FIDE Rule 5.2.1: No legal moves available)';
        break;
      case 'threefold_repetition':
        subtitle = 'Drawn by Threefold Repetition (FIDE Rule 9.2: Identical position reached 3 times)';
        break;
      case 'fifty_move_rule':
        subtitle = 'Drawn by Fifty-Move Rule (FIDE Rule 9.3: 50 moves without pawn move or capture)';
        break;
      case 'insufficient_material':
        subtitle = 'Drawn by Insufficient Material (FIDE Rule 9.6: Checkmate impossible)';
        break;
      case 'draw_agreement':
        subtitle = 'Drawn by Mutual Agreement';
        break;
      default:
        subtitle = 'The game ended in a draw';
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-pop-in"
      onClick={onClose}
    >
      <div
        className="bg-[#262421] border border-[#3d3a34] rounded-2xl p-6 sm:p-8 shadow-2xl max-w-sm w-full text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close cross button to inspect board */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
          title="Review board position"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div className="flex justify-center mb-4">{icon}</div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{title}</h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-neutral-400 mb-6 px-2">{subtitle}</p>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onNewGame}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#81b64c] hover:bg-[#92c957] active:bg-[#72a342] text-white font-bold text-sm sm:text-base shadow-lg transition active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#312e2b] hover:bg-[#3d3a34] active:bg-[#47443e] text-neutral-300 font-semibold text-xs sm:text-sm transition"
          >
            <Eye className="w-4 h-4" />
            <span>Review Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
