import React, { useState } from 'react';
import {
  GameSettings,
  GameMode,
  AiDifficulty,
  BoardTheme,
  PlayerColorChoice,
  TimeControl,
} from '../types/chess';
import { X, Check, Bot, Users, Edit3, Volume2, Sparkles, SlidersHorizontal, Shield, ShieldAlert } from 'lucide-react';

interface GameSettingsModalProps {
  isOpen: boolean;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onLoadCustomFen: (fen: string) => boolean;
  onClose: () => void;
}

export const TIME_CONTROL_PRESETS: TimeControl[] = [
  { id: 'bullet_1', label: '1 min', category: 'Bullet', initialSeconds: 60, incrementSeconds: 0 },
  { id: 'blitz_3', label: '3 min', category: 'Blitz', initialSeconds: 180, incrementSeconds: 0 },
  { id: 'blitz_5_3', label: '5 | 3', category: 'Blitz', initialSeconds: 300, incrementSeconds: 3 },
  { id: 'rapid_10', label: '10 min', category: 'Rapid', initialSeconds: 600, incrementSeconds: 0 },
  { id: 'rapid_15_10', label: '15 | 10', category: 'Rapid', initialSeconds: 900, incrementSeconds: 10 },
  { id: 'untimed', label: 'Untimed', category: 'Untimed', initialSeconds: 0, incrementSeconds: 0 },
];

export const BOARD_THEMES: { id: BoardTheme; name: string; light: string; dark: string }[] = [
  { id: 'chesscom', name: 'Chess.com Green', light: '#ebecd0', dark: '#779556' },
  { id: 'wood', name: 'Classic Wood', light: '#f0d9b5', dark: '#b58863' },
  { id: 'slate', name: 'Modern Slate', light: '#dee3e6', dark: '#8ca2ad' },
  { id: 'midnight', name: 'Midnight Navy', light: '#9faec2', dark: '#3e4f65' },
  { id: 'glass', name: 'Tournament', light: '#d1d5db', dark: '#4b5563' },
];

export const GameSettingsModal: React.FC<GameSettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onLoadCustomFen,
  onClose,
}) => {
  const [fenInput, setFenInput] = useState('');
  const [fenError, setFenError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyFen = () => {
    if (!fenInput.trim()) return;
    const success = onLoadCustomFen(fenInput.trim());
    if (success) {
      setFenError(null);
      setFenInput('');
      onClose();
    } else {
      setFenError('Invalid FEN position string. Please verify.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-pop-in"
      onClick={onClose}
    >
      <div
        className="bg-[#262421] border border-[#3d3a34] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#312e2b] bg-[#21201d]">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-[#81b64c]" />
            <h2 className="text-lg font-bold text-white">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-[#312e2b] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto text-sm">
          {/* Game Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Game Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onUpdateSettings({ mode: 'vs-ai' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${
                  settings.mode === 'vs-ai'
                    ? 'bg-[#312e2b] border-[#81b64c] text-white'
                    : 'bg-[#21201d] border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bot className="w-5 h-5 mb-1 text-[#81b64c]" />
                <span className="text-xs font-semibold">vs Computer</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ mode: 'pass-and-play' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${
                  settings.mode === 'pass-and-play'
                    ? 'bg-[#312e2b] border-[#81b64c] text-white'
                    : 'bg-[#21201d] border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Users className="w-5 h-5 mb-1 text-[#81b64c]" />
                <span className="text-xs font-semibold">Pass & Play</span>
              </button>

              <button
                onClick={() => onUpdateSettings({ mode: 'sandbox' })}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${
                  settings.mode === 'sandbox'
                    ? 'bg-[#312e2b] border-[#81b64c] text-white'
                    : 'bg-[#21201d] border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Edit3 className="w-5 h-5 mb-1 text-[#81b64c]" />
                <span className="text-xs font-semibold">Sandbox</span>
              </button>
            </div>
          </div>

          {/* AI Settings (if vs-ai) */}
          {settings.mode === 'vs-ai' && (
            <div className="space-y-4 p-3.5 rounded-xl bg-[#21201d] border border-[#312e2b]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Computer Difficulty
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: 'easy', label: 'Beginner', elo: '~800' },
                      { id: 'medium', label: 'Interm.', elo: '~1400' },
                      { id: 'hard', label: 'Advanced', elo: '~1800' },
                      { id: 'master', label: 'Master', elo: '~2100' },
                    ] as { id: AiDifficulty; label: string; elo: string }[]
                  ).map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => onUpdateSettings({ aiDifficulty: diff.id })}
                      className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition ${
                        settings.aiDifficulty === diff.id
                          ? 'bg-[#312e2b] border-[#81b64c] text-white'
                          : 'bg-[#1a1917] border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-xs font-bold">{diff.label}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{diff.elo}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Play As
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'w', label: 'White' },
                      { id: 'random', label: 'Random' },
                      { id: 'b', label: 'Black' },
                    ] as { id: PlayerColorChoice; label: string }[]
                  ).map((side) => (
                    <button
                      key={side.id}
                      onClick={() => onUpdateSettings({ playerColorChoice: side.id })}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                        settings.playerColorChoice === side.id
                          ? 'bg-[#312e2b] border-[#81b64c] text-white'
                          : 'bg-[#1a1917] border-transparent text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {side.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Time Control */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Time Control (FIDE & Chess.com Presets)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_CONTROL_PRESETS.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => onUpdateSettings({ timeControl: tc })}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition ${
                    settings.timeControl.id === tc.id
                      ? 'bg-[#312e2b] border-[#81b64c] text-white'
                      : 'bg-[#21201d] border-[#312e2b] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span className="text-xs font-bold">{tc.label}</span>
                  <span className="text-[10px] text-neutral-500">{tc.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Board Theme */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Board Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BOARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onUpdateSettings({ boardTheme: theme.id })}
                  className={`flex items-center space-x-2.5 p-2 rounded-lg border transition ${
                    settings.boardTheme === theme.id
                      ? 'bg-[#312e2b] border-[#81b64c] text-white'
                      : 'bg-[#21201d] border-[#312e2b] text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded flex overflow-hidden border border-neutral-700 shrink-0">
                    <div className="w-1/2 h-full" style={{ backgroundColor: theme.light }} />
                    <div className="w-1/2 h-full" style={{ backgroundColor: theme.dark }} />
                  </div>
                  <span className="text-xs font-semibold truncate">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-[#312e2b]">
            <label className="flex items-center justify-between cursor-pointer py-1.5 px-1 hover:bg-[#21201d] rounded-lg">
              <div className="flex items-center space-x-2">
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-300">Sound Effects</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#81b64c] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1.5 px-1 hover:bg-[#21201d] rounded-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-neutral-400" />
                <span className="text-xs text-neutral-300">Highlight Legal Moves</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showLegalMoves}
                onChange={(e) => onUpdateSettings({ showLegalMoves: e.target.checked })}
                className="w-4 h-4 accent-[#81b64c] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1.5 px-1 hover:bg-[#21201d] rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-neutral-400">±</span>
                <span className="text-xs text-neutral-300">Live Evaluation Bar</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showEvaluationBar}
                onChange={(e) => onUpdateSettings({ showEvaluationBar: e.target.checked })}
                className="w-4 h-4 accent-[#81b64c] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1.5 px-1 hover:bg-[#21201d] rounded-lg">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-xs text-neutral-300 font-medium">Blunder Shield</span>
                  <p className="text-[10px] text-neutral-500">Alert before hanging your Queen or mate-in-1</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={!!settings.blunderShield}
                onChange={(e) => onUpdateSettings({ blunderShield: e.target.checked })}
                className="w-4 h-4 accent-[#81b64c] cursor-pointer"
              />
            </label>

            {/* Threat Radar with Easy and Hard Modes */}
            <div className="py-2 px-1 hover:bg-[#21201d] rounded-lg space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <div>
                    <span className="text-xs text-neutral-300 font-medium">Threat Radar</span>
                    <p className="text-[10px] text-neutral-500">Detect hanging & vulnerable pieces in real-time</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.threatRadar}
                  onChange={(e) => onUpdateSettings({ threatRadar: e.target.checked })}
                  className="w-4 h-4 accent-rose-500 cursor-pointer"
                />
              </label>

              {settings.threatRadar && (
                <div className="ml-6 flex items-center gap-2 pt-1 border-t border-[#312e2b]">
                  <span className="text-[11px] text-neutral-400 font-semibold">Mode:</span>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ threatRadarDifficulty: 'easy' })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      settings.threatRadarDifficulty !== 'hard'
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#2b2723] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Easy (Arrows & Warnings)
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ threatRadarDifficulty: 'hard' })}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      settings.threatRadarDifficulty === 'hard'
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#2b2723] text-neutral-400 hover:text-white'
                    }`}
                  >
                    Hard (Subtle Dots Only)
                  </button>
                </div>
              )}
            </div>

            {settings.mode === 'pass-and-play' && (
              <label className="flex items-center justify-between cursor-pointer py-1.5 px-1 hover:bg-[#21201d] rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-300">Auto-flip board each turn</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFlipPassAndPlay}
                  onChange={(e) => onUpdateSettings({ autoFlipPassAndPlay: e.target.checked })}
                  className="w-4 h-4 accent-[#81b64c] cursor-pointer"
                />
              </label>
            )}
          </div>

          {/* Custom FEN Import */}
          <div className="pt-2 border-t border-[#312e2b]">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Load Position from FEN
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={fenInput}
                onChange={(e) => {
                  setFenInput(e.target.value);
                  setFenError(null);
                }}
                placeholder="e.g. rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
                className="flex-1 bg-[#1a1917] border border-[#312e2b] rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#81b64c]"
              />
              <button
                onClick={handleApplyFen}
                className="px-3 py-1.5 bg-[#81b64c] hover:bg-[#92c957] active:bg-[#72a342] text-white text-xs font-bold rounded-lg transition"
              >
                Load
              </button>
            </div>
            {fenError && <p className="text-[11px] text-red-400 mt-1">{fenError}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#312e2b] bg-[#21201d] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white font-bold text-xs shadow-md transition"
          >
            Apply & Play
          </button>
        </div>
      </div>
    </div>
  );
};
