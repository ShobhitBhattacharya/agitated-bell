import React, { useEffect, useRef, useState } from 'react';
import { X, Share2, Copy, Check, Download } from 'lucide-react';
import { renderShareCardToCanvas } from '../utils/shareCard';

export interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  whiteName: string;
  blackName: string;
  whiteAccuracy?: number;
  blackAccuracy?: number;
  result: string;
  openingName?: string;
  movesCount: number;
  fen?: string;
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
  fen,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'graphic' | 'text'>('graphic');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    renderShareCardToCanvas(canvasRef.current, {
      whiteName,
      blackName,
      whiteAccuracy,
      blackAccuracy,
      result,
      openingName,
      movesCount,
      fen,
    });
  }, [isOpen, whiteName, blackName, whiteAccuracy, blackAccuracy, result, openingName, movesCount, fen]);

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

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `chess-master-${(whiteName || 'white').toLowerCase()}-vs-${(blackName || 'black').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-white">
          <Share2 className="w-5 h-5 text-[#81b64c]" />
          <h3 className="text-lg font-black">Share Match Card</h3>
        </div>

        {/* View Mode Switcher */}
        <div className="flex rounded-lg border border-[#312e2b] bg-[#1a1917] p-1">
          <button
            type="button"
            onClick={() => setActiveTab('graphic')}
            className={`flex-1 rounded py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'graphic'
                ? 'bg-[#81b64c] text-[#1b201a] shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>High-Res PNG Card</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex-1 rounded py-1.5 text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'text'
                ? 'bg-[#81b64c] text-[#1b201a] shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Quick Summary</span>
          </button>
        </div>

        {/* High-Resolution Graphic Card Canvas Container */}
        <div
          className={`flex flex-col items-center justify-center rounded-xl border border-[#312e2b] bg-[#161a15] p-2 shadow-inner ${
            activeTab === 'graphic' ? 'block' : 'hidden'
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full max-w-[340px] h-auto rounded-lg shadow-xl border border-[#31362e]"
          />
          <span className="mt-2 text-[10px] text-neutral-400">
            Previewing 700×840px high-resolution PNG card
          </span>
        </div>

        {/* Visual Quick Summary Card */}
        {activeTab === 'text' && (
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
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleDownloadCard}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-[#1a1f16] font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Downloaded PNG!' : 'Download PNG Card'}</span>
          </button>
          <button
            onClick={handleCopyText}
            className="py-2.5 px-4 rounded-xl border border-[#3f4738] bg-[#222720] hover:bg-[#2b3228] text-white font-extrabold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#81b64c]" /> : <Copy className="w-4 h-4 text-neutral-400" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
