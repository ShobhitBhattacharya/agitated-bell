import React, { useState } from 'react';
import {
  RotateCcw,
  Undo2,
  Redo2,
  ArrowUpDown,
  Flag,
  Handshake,
  Volume2,
  VolumeX,
  Settings,
} from 'lucide-react';

interface GameControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  soundEnabled: boolean;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  onDrawOffer: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  canUndo,
  canRedo,
  soundEnabled,
  onNewGame,
  onUndo,
  onRedo,
  onFlipBoard,
  onResign,
  onDrawOffer,
  onToggleSound,
  onOpenSettings,
}) => {
  const [confirmResign, setConfirmResign] = useState(false);
  const [confirmDraw, setConfirmDraw] = useState(false);

  const handleResignClick = () => {
    if (confirmResign) {
      onResign();
      setConfirmResign(false);
    } else {
      setConfirmResign(true);
      setTimeout(() => setConfirmResign(false), 3000);
    }
  };

  const handleDrawClick = () => {
    if (confirmDraw) {
      onDrawOffer();
      setConfirmDraw(false);
    } else {
      setConfirmDraw(true);
      setTimeout(() => setConfirmDraw(false), 3000);
    }
  };

  return (
    <div className="flex flex-col space-y-2 bg-[#21201d] p-3 rounded-xl border border-[#312e2b]">
      {/* Primary actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onNewGame}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-[#81b64c] hover:bg-[#92c957] active:bg-[#72a342] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg bg-[#312e2b] hover:bg-[#3d3a34] active:bg-[#47443e] text-neutral-200 font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <Settings className="w-4 h-4 text-[#81b64c]" />
          <span>Settings</span>
        </button>
      </div>

      {/* Secondary toolbar */}
      <div className="grid grid-cols-5 gap-1.5 pt-1 border-t border-[#312e2b]">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#262421] hover:bg-[#312e2b] disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition group"
          title="Takeback / Undo move"
        >
          <Undo2 className="w-4 h-4 group-hover:text-white" />
          <span className="text-[10px] mt-1 text-neutral-400">Undo</span>
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#262421] hover:bg-[#312e2b] disabled:opacity-30 disabled:pointer-events-none text-neutral-300 transition group"
          title="Redo move"
        >
          <Redo2 className="w-4 h-4 group-hover:text-white" />
          <span className="text-[10px] mt-1 text-neutral-400">Redo</span>
        </button>

        {/* Flip Board */}
        <button
          onClick={onFlipBoard}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#262421] hover:bg-[#312e2b] text-neutral-300 transition group"
          title="Flip board orientation"
        >
          <ArrowUpDown className="w-4 h-4 group-hover:text-white" />
          <span className="text-[10px] mt-1 text-neutral-400">Flip</span>
        </button>

        {/* Offer Draw */}
        <button
          onClick={handleDrawClick}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition group ${
            confirmDraw
              ? 'bg-amber-800 text-amber-200 animate-pulse'
              : 'bg-[#262421] hover:bg-[#312e2b] text-neutral-300'
          }`}
          title={confirmDraw ? 'Click again to confirm draw' : 'Offer mutual draw'}
        >
          <Handshake className="w-4 h-4 group-hover:text-white" />
          <span className="text-[10px] mt-1">
            {confirmDraw ? 'Confirm?' : 'Draw'}
          </span>
        </button>

        {/* Resign */}
        <button
          onClick={handleResignClick}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition group ${
            confirmResign
              ? 'bg-red-800 text-red-100 animate-pulse'
              : 'bg-[#262421] hover:bg-[#312e2b] text-neutral-300'
          }`}
          title={confirmResign ? 'Click again to confirm resignation' : 'Resign game'}
        >
          <Flag className="w-4 h-4 group-hover:text-white" />
          <span className="text-[10px] mt-1">
            {confirmResign ? 'Confirm?' : 'Resign'}
          </span>
        </button>
      </div>

      {/* Sound toggle row */}
      <div className="flex items-center justify-between px-2 pt-1 text-xs text-neutral-400">
        <span className="text-[11px]">Audio Effects</span>
        <button
          onClick={onToggleSound}
          className="flex items-center space-x-1 hover:text-white transition"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#81b64c]" />
              <span className="text-[11px] text-[#81b64c]">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] text-neutral-500">Muted</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
