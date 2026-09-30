import React from 'react';
import { PieceColor } from '../types/chess';

interface EvaluationBarProps {
  score: number; // in centipawns (positive = White ahead, negative = Black ahead)
  isCheckmate?: boolean;
  winner?: PieceColor | null;
  orientation?: PieceColor; // 'w' means White on bottom
}

export const EvaluationBar: React.FC<EvaluationBarProps> = React.memo(({
  score,
  isCheckmate = false,
  winner = null,
  orientation = 'w',
}) => {
  // Convert centipawns (-1000..+1000) to percentage height (0..100)
  // We use a sigmoid-like mapping similar to Lichess / Chess.com
  let whitePercentage = 50;

  if (isCheckmate) {
    whitePercentage = winner === 'w' ? 100 : 0;
  } else {
    // Sigmoid mapping: 2 / (1 + exp(-0.004 * centipawns)) - 1 mapped to 0..100
    const clampedScore = Math.max(-1500, Math.min(1500, score));
    const winProbability = 1 / (1 + Math.exp(-0.0035 * clampedScore));
    whitePercentage = Math.round(winProbability * 100);
    // Keep a minimal 3% slice visible at extremes unless checkmate
    whitePercentage = Math.max(3, Math.min(97, whitePercentage));
  }

  // If orientation is Black at bottom, invert percentage display
  const isWhiteBottom = orientation === 'w';
  const bottomBarPercentage = isWhiteBottom ? whitePercentage : 100 - whitePercentage;
  const bottomColorClass = isWhiteBottom ? 'bg-white' : 'bg-[#181512]';
  const topColorClass = isWhiteBottom ? 'bg-[#181512]' : 'bg-white';

  // Format score label
  let displayScore = '0.0';
  if (isCheckmate) {
    displayScore = winner === 'w' ? '+M' : '-M';
  } else {
    const pawnAdvantage = (score / 100).toFixed(1);
    displayScore = score > 0 ? `+${pawnAdvantage}` : score < 0 ? `${pawnAdvantage}` : '0.0';
  }

  return (
    <div
      className="relative w-7 sm:w-8 h-full rounded-md overflow-hidden flex flex-col shadow-inner border border-neutral-700/60 select-none"
      title={`Engine Evaluation: ${displayScore}`}
    >
      {/* Top half (opponent perspective) */}
      <div
        className={`${topColorClass} w-full transition-all duration-300 ease-out relative`}
        style={{ height: `${100 - bottomBarPercentage}%` }}
      >
        {/* If Black is slightly ahead and on top, or White is on top */}
        {!isWhiteBottom && score > 0 && (
          <span className="absolute top-1 left-0 right-0 text-center text-[10px] sm:text-xs font-bold font-mono text-[#181512]">
            {displayScore}
          </span>
        )}
        {isWhiteBottom && score < 0 && (
          <span className="absolute top-1 left-0 right-0 text-center text-[10px] sm:text-xs font-bold font-mono text-white">
            {displayScore}
          </span>
        )}
      </div>

      {/* Bottom half (current player perspective) */}
      <div
        className={`${bottomColorClass} w-full transition-all duration-300 ease-out relative`}
        style={{ height: `${bottomBarPercentage}%` }}
      >
        {isWhiteBottom && score >= 0 && (
          <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] sm:text-xs font-bold font-mono text-[#181512]">
            {displayScore}
          </span>
        )}
        {!isWhiteBottom && score <= 0 && (
          <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] sm:text-xs font-bold font-mono text-white">
            {displayScore}
          </span>
        )}
      </div>
    </div>
  );
});
