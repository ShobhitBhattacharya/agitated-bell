import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, Trophy, Sparkles, Award } from 'lucide-react';
import { PieceColor } from '../types/chess';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  whiteName: string;
  blackName: string;
  whiteAccuracy?: number;
  blackAccuracy?: number;
  result: string;
  openingName?: string;
  movesCount: number;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  whiteName,
  blackName,
  whiteAccuracy,
  blackAccuracy,
  result,
  openingName,
  movesCount,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `♟️ Chess Master Match Summary
${whiteName} (${whiteAccuracy !== undefined ? whiteAccuracy + '%' : '—'}) vs ${blackName} (${blackAccuracy !== undefined ? blackAccuracy + '%' : '—'})
Result: ${result} in ${movesCount} moves
Opening: ${openingName || 'Standard Game'}
Play now on Chess Master!`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-white">
          <Share2 className="w-5 h-5 text-[#81b64c]" />
          <h3 className="text-lg font-black">Share Game Card</h3>
        </div>

        {/* Visual Share Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1c1f19] via-[#21251e] to-[#171a15] border-2 border-[#81b64c]/40 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#81b64c]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Branding */}
          <div className="flex items-center justify-between border-b border-[#312e2b] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#81b64c] flex items-center justify-center text-white text-xs font-black">
                ♞
              </div>
              <span className="text-xs font-extrabold text-white tracking-wide uppercase">
                Chess Master
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#312e2b] text-[#81b64c] border border-[#81b64c]/30 uppercase">
              {result}
            </span>
          </div>

          {/* Players & Accuracy */}
          <div className="grid grid-cols-2 gap-4 py-1">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-neutral-400">White</span>
              <div className="text-sm font-extrabold text-white truncate">{whiteName}</div>
              {whiteAccuracy !== undefined && (
                <div className="text-xl font-black text-[#81b64c]">{whiteAccuracy}%</div>
              )}
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[11px] font-bold text-neutral-400">Black</span>
              <div className="text-sm font-extrabold text-white truncate">{blackName}</div>
              {blackAccuracy !== undefined && (
                <div className="text-xl font-black text-amber-400">{blackAccuracy}%</div>
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="pt-2 border-t border-[#312e2b] flex items-center justify-between text-[11px] text-neutral-400">
            <span>{openingName || 'Custom Line'}</span>
            <span>{movesCount} Moves</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 pt-1">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
