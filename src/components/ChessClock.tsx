import React from 'react';
import { PieceColor } from '../types/chess';
import { Clock } from 'lucide-react';

interface ChessClockProps {
  color: PieceColor;
  timeRemainingSeconds: number; // in seconds
  isActive: boolean;
  incrementSeconds: number;
  isUntimed: boolean;
  playerName: string;
  playerTitle?: string;
  rating?: string | number;
}

export const ChessClock: React.FC<ChessClockProps> = ({
  color,
  timeRemainingSeconds,
  isActive,
  incrementSeconds,
  isUntimed,
  playerName,
  playerTitle,
  rating,
}) => {
  const isLowTime = !isUntimed && timeRemainingSeconds <= 20;

  // Format time display
  const formatTime = (totalSeconds: number): string => {
    if (isUntimed) return '∞';
    if (totalSeconds <= 0) return '0:00';

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // If under 10 seconds, show tenths of a second if fractional, or mm:ss
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 ${
        isActive
          ? 'bg-[#2b2723] border-[#81b64c] shadow-[0_0_12px_rgba(129,182,76,0.25)]'
          : 'bg-[#21201d] border-[#312e2b]'
      }`}
    >
      {/* Player info */}
      <div className="flex items-center space-x-2">
        <div
          className={`w-3.5 h-3.5 rounded-full border ${
            color === 'w'
              ? 'bg-white border-neutral-300'
              : 'bg-[#1a1a1a] border-neutral-600'
          }`}
        />
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            {playerTitle && (
              <span className="text-[10px] font-extrabold uppercase px-1 py-0.2 rounded bg-[#b23330] text-white">
                {playerTitle}
              </span>
            )}
            <span className="text-sm font-semibold text-neutral-200 truncate max-w-[120px] sm:max-w-[180px]">
              {playerName}
            </span>
            {rating && (
              <span className="text-xs text-neutral-500 font-mono">({rating})</span>
            )}
          </div>
          {incrementSeconds > 0 && !isUntimed && (
            <span className="text-[10px] text-neutral-400">+{incrementSeconds}s inc</span>
          )}
        </div>
      </div>

      {/* Clock display */}
      <div
        className={`flex items-center space-x-1.5 px-3 py-1 rounded font-mono font-bold text-base sm:text-lg transition-colors ${
          isLowTime
            ? 'bg-red-950/60 text-red-400 border border-red-800 animate-pulse'
            : isActive
            ? 'bg-[#181512] text-white border border-neutral-700'
            : 'bg-[#181512]/60 text-neutral-400 border border-neutral-800'
        }`}
      >
        <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-[#81b64c]' : 'text-neutral-500'}`} />
        <span>{formatTime(timeRemainingSeconds)}</span>
      </div>
    </div>
  );
};
