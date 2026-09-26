import React from 'react';
import { PieceType, PieceColor } from '../types/chess';
import { ChessPieceIcon } from '../utils/pieces';

interface CapturedPiecesProps {
  captured: PieceType[]; // Pieces captured BY this player (so they are of the OPPONENT's color)
  opponentColor: PieceColor;
  materialAdvantage: number; // positive if this player has material lead
}

const PIECE_SORT_ORDER: Record<PieceType, number> = {
  q: 1,
  r: 2,
  b: 3,
  n: 4,
  p: 5,
  k: 6,
};

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({
  captured,
  opponentColor,
  materialAdvantage,
}) => {
  const sorted = [...captured].sort(
    (a, b) => PIECE_SORT_ORDER[a] - PIECE_SORT_ORDER[b]
  );

  return (
    <div className="flex items-center space-x-1.5 h-6 min-h-[24px] px-1 select-none overflow-x-auto">
      {/* Captured piece icons */}
      <div className="flex items-center -space-x-1">
        {sorted.map((type, idx) => (
          <div
            key={`${type}-${idx}`}
            className="w-4 h-4 sm:w-5 sm:h-5 transition-transform hover:scale-125 hover:z-10"
          >
            <ChessPieceIcon type={type} color={opponentColor} />
          </div>
        ))}
      </div>

      {/* Material advantage badge */}
      {materialAdvantage > 0 && (
        <span className="text-[11px] font-bold text-neutral-400 font-mono ml-1">
          +{materialAdvantage}
        </span>
      )}
    </div>
  );
};
