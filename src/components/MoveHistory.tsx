import React, { useRef, useEffect } from 'react';
import { MoveHistoryItem } from '../types/chess';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

interface MoveHistoryProps {
  history: MoveHistoryItem[];
  currentPly: number; // 0 = start position, 1 = after 1st move, etc.
  onSelectPly: (ply: number) => void;
  onCopyPgn: () => void;
  onCopyFen: () => void;
  copiedType: 'pgn' | 'fen' | null;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({
  history,
  currentPly,
  onSelectPly,
  onCopyPgn,
  onCopyFen,
  copiedType,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into pairs (turns)
  const turns: { moveNumber: number; white?: MoveHistoryItem; black?: MoveHistoryItem }[] = [];
  for (let i = 0; i < history.length; i += 2) {
    turns.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1],
    });
  }

  // Scroll to bottom on new move if at latest
  useEffect(() => {
    if (scrollRef.current && currentPly === history.length) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, currentPly]);

  return (
    <div className="flex flex-col h-full bg-[#21201d] rounded-xl border border-[#312e2b] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#312e2b] bg-[#262421]">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#81b64c]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
            Move History
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onCopyPgn}
            className="flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded bg-[#312e2b] hover:bg-[#3d3a34] text-neutral-300 hover:text-white transition"
            title="Copy PGN to clipboard"
          >
            {copiedType === 'pgn' ? (
              <Check className="w-3 h-3 text-[#81b64c]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>PGN</span>
          </button>
          <button
            onClick={onCopyFen}
            className="flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded bg-[#312e2b] hover:bg-[#3d3a34] text-neutral-300 hover:text-white transition"
            title="Copy current FEN to clipboard"
          >
            {copiedType === 'fen' ? (
              <Check className="w-3 h-3 text-[#81b64c]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span>FEN</span>
          </button>
        </div>
      </div>

      {/* Move list */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 text-xs sm:text-sm font-mono space-y-0.5 select-none"
      >
        {turns.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-500 text-xs italic">
            Moves will appear here
          </div>
        ) : (
          turns.map((turn) => {
            const isWhiteActive = turn.white?.ply === currentPly;
            const isBlackActive = turn.black?.ply === currentPly;

            return (
              <div
                key={turn.moveNumber}
                className="grid grid-cols-[36px_1fr_1fr] items-center rounded py-0.5 px-1 hover:bg-[#282622] transition-colors"
              >
                {/* Move number */}
                <span className="text-neutral-500 font-bold text-right pr-2">
                  {turn.moveNumber}.
                </span>

                {/* White Move */}
                {turn.white ? (
                  <button
                    onClick={() => onSelectPly(turn.white!.ply)}
                    className={`text-left px-2 py-1 rounded font-semibold transition ${
                      isWhiteActive
                        ? 'bg-[#3d3a34] text-[#81b64c] font-bold shadow-xs'
                        : 'text-neutral-200 hover:bg-[#312e2b]'
                    }`}
                  >
                    {turn.white.san}
                  </button>
                ) : (
                  <div />
                )}

                {/* Black Move */}
                {turn.black ? (
                  <button
                    onClick={() => onSelectPly(turn.black!.ply)}
                    className={`text-left px-2 py-1 rounded font-semibold transition ${
                      isBlackActive
                        ? 'bg-[#3d3a34] text-[#81b64c] font-bold shadow-xs'
                        : 'text-neutral-200 hover:bg-[#312e2b]'
                    }`}
                  >
                    {turn.black.san}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Navigation playback controls */}
      <div className="flex items-center justify-around px-2 py-2 border-t border-[#312e2b] bg-[#262421]">
        <button
          onClick={() => onSelectPly(0)}
          disabled={currentPly === 0 || history.length === 0}
          className="p-1.5 rounded hover:bg-[#363430] active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition"
          title="Beginning of game"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectPly(Math.max(0, currentPly - 1))}
          disabled={currentPly === 0 || history.length === 0}
          className="p-1.5 rounded hover:bg-[#363430] active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition"
          title="Previous move"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectPly(Math.min(history.length, currentPly + 1))}
          disabled={currentPly === history.length || history.length === 0}
          className="p-1.5 rounded hover:bg-[#363430] active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition"
          title="Next move"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onSelectPly(history.length)}
          disabled={currentPly === history.length || history.length === 0}
          className="p-1.5 rounded hover:bg-[#363430] active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition"
          title="Current position"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
