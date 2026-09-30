import React, { useState, useMemo, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import {
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Play,
  ArrowRight,
  Compass,
  X,
  Swords,
  Shield,
  HelpCircle,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { ChessBoard } from './ChessBoard';
import { PieceColor, PieceType, BoardTheme, AiDifficulty } from '../types/chess';
import { ChessPieceIcon } from '../utils/pieces';
import {
  validateFen,
  buildFen,
  HANDICAP_PRESETS,
  ENDGAME_PRESETS,
  PositionPreset,
} from '../utils/positionSandbox';

interface PositionSandboxProps {
  onPlayVsAi: (fen: string, playerColor: PieceColor, difficulty: AiDifficulty) => void;
  onOpenAnalysis: (fen: string) => void;
  onExit: () => void;
  boardTheme?: BoardTheme;
}

export const PositionSandbox: React.FC<PositionSandboxProps> = ({
  onPlayVsAi,
  onOpenAnalysis,
  onExit,
  boardTheme = 'chesscom',
}) => {
  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(chess.fen());
  const [orientation, setOrientation] = useState<PieceColor>('w');

  // Selected piece from palette: null means Eraser mode
  const [selectedPalettePiece, setSelectedPalettePiece] = useState<{
    type: PieceType;
    color: PieceColor;
  } | null>({ type: 'p', color: 'w' });

  // Board settings
  const [turn, setTurn] = useState<PieceColor>('w');
  const [castling, setCastling] = useState({
    K: true,
    Q: true,
    k: true,
    q: true,
  });
  const [epSquare, setEpSquare] = useState<string>('-');

  // Match launch settings
  const [selectedDifficulty, setSelectedDifficulty] = useState<AiDifficulty>('medium');
  const [selectedPlayerColor, setSelectedPlayerColor] = useState<PieceColor>('w');

  // Preset tab
  const [presetTab, setPresetTab] = useState<'handicap' | 'endgame'>('handicap');
  const [activePreset, setActivePreset] = useState<PositionPreset | null>(null);

  // Copy FEN feedback
  const [copiedFen, setCopiedFen] = useState<boolean>(false);

  // Import FEN modal
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [importInput, setImportInput] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Sync FEN state
  const syncFenFromBoard = useCallback(
    (newTurn = turn, newCastling = castling, newEp = epSquare) => {
      const board = chess.board();
      // Generate piece placement part
      const rankStrings: string[] = [];
      for (let r = 0; r < 8; r++) {
        let emptyCount = 0;
        let rankStr = '';
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (!piece) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              rankStr += emptyCount;
              emptyCount = 0;
            }
            rankStr += piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase();
          }
        }
        if (emptyCount > 0) {
          rankStr += emptyCount;
        }
        rankStrings.push(rankStr);
      }
      const piecesPart = rankStrings.join('/');
      const constructed = buildFen(piecesPart, newTurn, newCastling, newEp, 0, 1);
      setFen(constructed);
    },
    [chess, turn, castling, epSquare]
  );

  // Validate FEN in real-time
  const validation = useMemo(() => validateFen(fen), [fen]);

  // Handle clicking square on board
  const handleSquareClick = (square: Square) => {
    if (!selectedPalettePiece) {
      // Eraser mode: remove piece
      chess.remove(square);
    } else {
      // If putting a king, remove any existing king of the same color to avoid duplicate kings
      if (selectedPalettePiece.type === 'k') {
        const board = chess.board();
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.type === 'k' && p.color === selectedPalettePiece.color) {
              const file = String.fromCharCode(97 + c);
              const rank = String(8 - r);
              chess.remove(`${file}${rank}` as Square);
            }
          }
        }
      }
      chess.put({ type: selectedPalettePiece.type, color: selectedPalettePiece.color }, square);
    }
    syncFenFromBoard();
  };

  // Handle free dragging/dropping piece on board
  const handleFreePieceMove = (from: Square, to: Square) => {
    const piece = chess.remove(from);
    if (piece) {
      chess.put(piece, to);
      syncFenFromBoard();
    }
  };

  // Turn toggle
  const handleTurnChange = (newTurn: PieceColor) => {
    setTurn(newTurn);
    syncFenFromBoard(newTurn, castling, epSquare);
  };

  // Castling toggle
  const handleCastlingChange = (key: keyof typeof castling) => {
    const updated = { ...castling, [key]: !castling[key] };
    setCastling(updated);
    syncFenFromBoard(turn, updated, epSquare);
  };

  // Reset standard board
  const handleResetStandard = () => {
    chess.reset();
    setTurn('w');
    setCastling({ K: true, Q: true, k: true, q: true });
    setEpSquare('-');
    setActivePreset(null);
    setFen(chess.fen());
  };

  // Clear board
  const handleClearBoard = () => {
    chess.clear();
    setCastling({ K: false, Q: false, k: false, q: false });
    setEpSquare('-');
    setActivePreset(null);
    syncFenFromBoard(turn, { K: false, Q: false, k: false, q: false }, '-');
  };

  // Load a preset
  const handleLoadPreset = (preset: PositionPreset) => {
    try {
      chess.load(preset.fen);
      const parts = preset.fen.split(' ');
      setTurn((parts[1] as PieceColor) || 'w');
      const castlingStr = parts[2] || '-';
      setCastling({
        K: castlingStr.includes('K'),
        Q: castlingStr.includes('Q'),
        k: castlingStr.includes('k'),
        q: castlingStr.includes('q'),
      });
      setEpSquare(parts[3] || '-');
      setFen(chess.fen());
      setActivePreset(preset);
      setSelectedPlayerColor(preset.recommendedColor);
    } catch {
      // Ignore if load fails
    }
  };

  // Copy FEN
  const handleCopyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  // Import FEN
  const handleImportSubmit = () => {
    setImportError(null);
    const trimmed = importInput.trim();
    const val = validateFen(trimmed);
    if (!val.isValid) {
      setImportError(val.error || 'Invalid FEN notation.');
      return;
    }

    try {
      chess.load(trimmed);
      const parts = trimmed.split(' ');
      setTurn((parts[1] as PieceColor) || 'w');
      const castlingStr = parts[2] || '-';
      setCastling({
        K: castlingStr.includes('K'),
        Q: castlingStr.includes('Q'),
        k: castlingStr.includes('k'),
        q: castlingStr.includes('q'),
      });
      setEpSquare(parts[3] || '-');
      setFen(chess.fen());
      setActivePreset(null);
      setIsImportOpen(false);
      setImportInput('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid FEN format.';
      setImportError(msg);
    }
  };

  const palettePieces: { type: PieceType; color: PieceColor }[] = [
    { type: 'k', color: 'w' },
    { type: 'q', color: 'w' },
    { type: 'r', color: 'w' },
    { type: 'b', color: 'w' },
    { type: 'n', color: 'w' },
    { type: 'p', color: 'w' },
    { type: 'k', color: 'b' },
    { type: 'q', color: 'b' },
    { type: 'r', color: 'b' },
    { type: 'b', color: 'b' },
    { type: 'n', color: 'b' },
    { type: 'p', color: 'b' },
  ];

  return (
    <div className="min-h-screen bg-[#161512] text-neutral-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <header className="h-14 border-b border-[#2b2723] bg-[#21201d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Swords className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              Board Sandbox & Handicap Odds
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#312e2b] text-amber-400 border border-amber-500/30 uppercase">
                Editor
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Custom FEN Setup • Knight & Rook Odds • Endgame Drills</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOrientation((o) => (o === 'w' ? 'b' : 'w'))}
            className="px-2.5 py-1.5 rounded-lg border border-[#312e2b] bg-[#2a2824] hover:bg-[#36332e] text-xs font-semibold text-neutral-300 transition"
            title="Flip Board Orientation"
          >
            Flip ({orientation.toUpperCase()})
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-[#312e2b] hover:bg-[#3d3a34] text-xs font-bold text-white transition flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Return to Hub</span>
          </button>
        </div>
      </header>

      {/* Main Sandbox Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] xl:grid-cols-[auto_420px] gap-6 items-start justify-center">
        {/* Left Column: Board + Palette + Board Options */}
        <div className="flex flex-col items-center w-full max-w-[620px] mx-auto space-y-3">
          {/* Active Preset Banner (if loaded) */}
          {activePreset && (
            <div className="w-full p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-3 animate-fade-in shadow-xs">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{activePreset.name}</span>
                  {activePreset.ratingDiff && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono">
                      {activePreset.ratingDiff}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-amber-100/80 leading-relaxed">
                  {activePreset.description}
                </p>
              </div>
              <button
                onClick={() => setActivePreset(null)}
                className="text-amber-400 hover:text-white shrink-0 p-1"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Validation Alert Banner */}
          {!validation.isValid ? (
            <div className="w-full p-3 rounded-xl bg-rose-950/70 border border-rose-600/50 flex items-start gap-2.5 text-xs text-rose-200 animate-shake">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <strong className="block text-rose-300 font-bold">Position Not Playable</strong>
                <span>{validation.error}</span>
              </div>
            </div>
          ) : (
            <div className="w-full px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-600/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Position is legal and ready to play or analyze</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-900/40 px-1.5 py-0.5 rounded text-emerald-300 font-bold">
                {turn === 'w' ? 'White to move' : 'Black to move'}
              </span>
            </div>
          )}

          {/* Chess Board */}
          <div className="w-full flex justify-center">
            <ChessBoard
              chess={chess}
              orientation={orientation}
              theme={boardTheme}
              interactive={false}
              showLegalMoves={false}
              onMove={() => false}
              onRequestPromotion={() => {}}
              onSquareClick={handleSquareClick}
              onFreePieceMove={handleFreePieceMove}
            />
          </div>

          {/* Piece Palette */}
          <div className="w-full p-3 rounded-xl bg-[#21201d] border border-[#312e2b] space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Piece Palette
                </span>
                <span className="text-[11px] text-neutral-400 hidden sm:inline">
                  (Click or drag to place onto squares)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearBoard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-700/50 text-rose-300 hover:bg-rose-900/50 text-[11px] font-semibold transition"
                  title="Remove all pieces from the board"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
                <button
                  onClick={handleResetStandard}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a2824] hover:bg-[#36332e] border border-[#3d3831] text-neutral-200 text-[11px] font-semibold transition"
                  title="Reset to 32 pieces standard opening setup"
                >
                  <RotateCcw className="w-3 h-3" />
                  Standard
                </button>
              </div>
            </div>

            {/* Pieces Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {palettePieces.map((p, idx) => {
                const isSelected =
                  selectedPalettePiece !== null &&
                  selectedPalettePiece.type === p.type &&
                  selectedPalettePiece.color === p.color;
                return (
                  <button
                    key={`${p.color}-${p.type}-${idx}`}
                    type="button"
                    onClick={() => setSelectedPalettePiece(p)}
                    className={`h-11 rounded-lg flex items-center justify-center transition border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-md text-amber-300'
                        : 'bg-[#2b2723] hover:bg-[#36322b] border-[#3d3831]'
                    }`}
                    title={`Select ${p.color === 'w' ? 'White' : 'Black'} ${p.type.toUpperCase()}`}
                  >
                    <div className="w-7 h-7">
                      <ChessPieceIcon type={p.type} color={p.color} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Eraser Tool */}
            <div className="flex items-center justify-between pt-2 border-t border-[#312e2b]">
              <button
                type="button"
                onClick={() => setSelectedPalettePiece(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  selectedPalettePiece === null
                    ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-xs'
                    : 'bg-[#2a2824] border-[#36322b] text-neutral-400 hover:text-white'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eraser (Click any square to remove)</span>
              </button>

              <div className="text-[11px] text-neutral-400">
                Active tool:{' '}
                <strong className="text-white">
                  {selectedPalettePiece
                    ? `${selectedPalettePiece.color === 'w' ? 'White' : 'Black'} ${selectedPalettePiece.type.toUpperCase()}`
                    : 'Eraser'}
                </strong>
              </div>
            </div>
          </div>

          {/* Board Options: Turn & Castling Rights */}
          <div className="w-full p-3.5 rounded-xl bg-[#21201d] border border-[#312e2b] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Side to Move */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-300 block">Side to Move:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTurnChange('w')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    turn === 'w'
                      ? 'bg-white text-neutral-900 border-white shadow-sm'
                      : 'bg-[#2a2824] border-[#36322b] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-600 inline-block" />
                  White to Move
                </button>
                <button
                  type="button"
                  onClick={() => handleTurnChange('b')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    turn === 'b'
                      ? 'bg-neutral-800 text-white border-neutral-600 shadow-sm'
                      : 'bg-[#2a2824] border-[#36322b] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-500 inline-block" />
                  Black to Move
                </button>
              </div>
            </div>

            {/* Castling Availability */}
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-300 block">Castling Rights:</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-[#1b1a18] p-1.5 rounded-lg border border-[#312e2b] text-neutral-300 hover:border-neutral-500">
                  <input
                    type="checkbox"
                    checked={castling.K}
                    onChange={() => handleCastlingChange('K')}
                    className="rounded accent-[#81b64c]"
                  />
                  <span>White O-O (K)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#1b1a18] p-1.5 rounded-lg border border-[#312e2b] text-neutral-300 hover:border-neutral-500">
                  <input
                    type="checkbox"
                    checked={castling.Q}
                    onChange={() => handleCastlingChange('Q')}
                    className="rounded accent-[#81b64c]"
                  />
                  <span>White O-O-O (Q)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#1b1a18] p-1.5 rounded-lg border border-[#312e2b] text-neutral-300 hover:border-neutral-500">
                  <input
                    type="checkbox"
                    checked={castling.k}
                    onChange={() => handleCastlingChange('k')}
                    className="rounded accent-[#81b64c]"
                  />
                  <span>Black O-O (k)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-[#1b1a18] p-1.5 rounded-lg border border-[#312e2b] text-neutral-300 hover:border-neutral-500">
                  <input
                    type="checkbox"
                    checked={castling.q}
                    onChange={() => handleCastlingChange('q')}
                    className="rounded accent-[#81b64c]"
                  />
                  <span>Black O-O-O (q)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Presets */}
        <div className="flex flex-col space-y-4 w-full">
          {/* FEN Box & Actions */}
          <div className="p-4 rounded-xl bg-[#21201d] border border-[#312e2b] space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Current Position FEN
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2a2824] hover:bg-[#36332e] border border-[#3d3831] text-neutral-300 text-xs font-medium transition"
                  title="Import or paste external FEN"
                >
                  <Upload className="w-3 h-3" />
                  Import
                </button>
                <button
                  type="button"
                  onClick={handleCopyFen}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#81b64c] hover:bg-[#92c957] text-white text-xs font-bold transition shadow-xs"
                  title="Copy FEN to clipboard"
                >
                  {copiedFen ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedFen ? 'Copied!' : 'Copy FEN'}</span>
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#141311] border border-[#2b2723] font-mono text-xs text-neutral-300 break-all select-all">
              {fen}
            </div>
          </div>

          {/* Action: Play vs AI from this Position */}
          <div className="p-4 rounded-xl bg-[#21201d] border border-[#312e2b] space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-[#81b64c]">
                  <Play className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-white">Play vs AI from this Position</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#81b64c] bg-[#81b64c]/10 border border-[#81b64c]/30 px-2 py-0.5 rounded">
                Custom Match
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Player Color Choice */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Your Color:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPlayerColor('w')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition ${
                      selectedPlayerColor === 'w'
                        ? 'bg-neutral-200 text-neutral-900 border-white'
                        : 'bg-[#2a2824] border-[#36322b] text-neutral-400'
                    }`}
                  >
                    White ♔
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlayerColor('b')}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition ${
                      selectedPlayerColor === 'b'
                        ? 'bg-neutral-800 text-white border-neutral-500'
                        : 'bg-[#2a2824] border-[#36322b] text-neutral-400'
                    }`}
                  >
                    Black ♚
                  </button>
                </div>
              </div>

              {/* Bot Difficulty */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Opponent Level:
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as AiDifficulty)}
                  className="w-full py-1.5 px-2 rounded-lg bg-[#2a2824] border border-[#36322b] text-white text-xs font-semibold focus:outline-hidden focus:border-[#81b64c]"
                >
                  <option value="easy">Easy (Milo ~800)</option>
                  <option value="medium">Medium (Ada ~1400)</option>
                  <option value="hard">Hard (Magnus ~1800)</option>
                  <option value="master">Master (Captain ~2100)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                disabled={!validation.isValid}
                onClick={() => onPlayVsAi(fen, selectedPlayerColor, selectedDifficulty)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-md ${
                  validation.isValid
                    ? 'bg-[#81b64c] hover:bg-[#92c957] text-white cursor-pointer'
                    : 'bg-[#2a2824] text-neutral-500 border border-[#36322b] cursor-not-allowed'
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>Start Match vs AI</span>
              </button>

              <button
                type="button"
                disabled={!validation.isValid}
                onClick={() => onOpenAnalysis(fen)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border ${
                  validation.isValid
                    ? 'bg-[#2a2824] hover:bg-[#36332e] border-sky-600/40 text-sky-400 hover:text-sky-300 cursor-pointer'
                    : 'bg-[#2a2824] text-neutral-500 border-[#36322b] cursor-not-allowed'
                }`}
              >
                <Compass className="w-4 h-4 text-sky-400" />
                <span>Open in Analysis</span>
              </button>
            </div>
          </div>

          {/* Preset Library: Handicap Odds & Master Endgames */}
          <div className="p-4 rounded-xl bg-[#21201d] border border-[#312e2b] space-y-3 shadow-md flex-1">
            <div className="flex items-center justify-between border-b border-[#312e2b] pb-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Preset Library
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPresetTab('handicap')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    presetTab === 'handicap'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Handicap Odds
                </button>
                <button
                  type="button"
                  onClick={() => setPresetTab('endgame')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    presetTab === 'endgame'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Master Endgames
                </button>
              </div>
            </div>

            {/* Presets List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {(presetTab === 'handicap' ? HANDICAP_PRESETS : ENDGAME_PRESETS).map((p) => {
                const isActive = activePreset?.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleLoadPreset(p)}
                    className={`w-full text-left p-3 rounded-lg border transition space-y-1 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                        : 'bg-[#1a1917] hover:bg-[#252320] border-[#312e2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white text-xs">{p.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#2b2723] text-neutral-300 shrink-0">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {p.description}
                    </p>
                    {p.ratingDiff && (
                      <div className="pt-1 flex items-center justify-between text-[10px] text-amber-400/90 font-medium">
                        <span>Expected Handicap: {p.ratingDiff}</span>
                        <span>Play as {p.recommendedColor === 'w' ? 'White' : 'Black'}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Import FEN Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-pop-in">
          <div className="bg-[#24211d] border border-[#3d3831] rounded-2xl p-5 sm:p-6 shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#81b64c]" />
                Load Custom FEN
              </h3>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              Paste any valid Forsyth-Edwards Notation (FEN) string to load onto the board.
            </p>

            <textarea
              rows={3}
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="e.g. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              className="w-full p-2.5 rounded-xl bg-[#171614] border border-[#3b3630] font-mono text-xs text-neutral-200 focus:outline-hidden focus:border-[#81b64c]"
            />

            {importError && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-600/40 text-xs text-rose-300">
                {importError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-3 py-2 rounded-xl bg-[#312e2b] hover:bg-[#3d3a34] text-xs font-semibold text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-2 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white text-xs font-bold"
              >
                Load Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
