import React from 'react';
import { PieceType, PieceColor } from '../types/chess';
import { ChessPieceIcon } from '../utils/pieces';

interface PromotionModalProps {
  color: PieceColor;
  isOpen: boolean;
  onSelect: (piece: PieceType) => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  isOpen,
  onSelect,
  onCancel,
}) => {
  if (!isOpen) return null;

  const pieces: { type: PieceType; name: string }[] = [
    { type: 'q', name: 'Queen' },
    { type: 'n', name: 'Knight' },
    { type: 'r', name: 'Rook' },
    { type: 'b', name: 'Bishop' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-pop-in"
      onClick={onCancel}
    >
      <div
        className="bg-[#262421] border border-[#3d3a34] rounded-xl p-5 shadow-2xl max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-white mb-2">Promote Pawn</h3>
        <p className="text-xs text-neutral-400 mb-5">
          Select a piece to replace your advancing pawn (FIDE Rule 3.7.e)
        </p>

        <div className="grid grid-cols-4 gap-3">
          {pieces.map(({ type, name }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#302e2b] hover:bg-[#3d3a34] active:bg-[#81b64c] transition border border-transparent hover:border-[#81b64c]/40 group"
              title={name}
            >
              <div className="w-14 h-14 group-hover:scale-110 transition-transform">
                <ChessPieceIcon type={type} color={color} />
              </div>
              <span className="text-xs font-semibold text-neutral-300 group-hover:text-white mt-1">
                {name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="mt-5 text-xs text-neutral-400 hover:text-neutral-200 transition py-1 px-3 rounded hover:bg-neutral-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
