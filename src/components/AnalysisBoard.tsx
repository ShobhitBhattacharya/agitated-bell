import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import {
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Upload,
  Download,
  Settings2,
  Trash2,
  Play,
  ArrowRight,
  Brain,
  Lightbulb,
  X,
  Compass,
} from 'lucide-react';
import { ChessBoard, BoardArrow } from './ChessBoard';
import { EvaluationBar } from './EvaluationBar';
import { PieceColor, PieceType, BoardTheme } from '../types/chess';
import { getEngineBestMove, evaluateBoard, evaluatePositionDeep } from '../utils/chessEngine';
import { ChessPieceIcon } from '../utils/pieces';

interface AnalysisBoardProps {
  initialFen?: string;
  initialMoves?: string[];
  initialPgn?: string;
  onExit: () => void;
  boardTheme?: BoardTheme;
}

interface MoveHistoryNode {
  san: string;
  from: Square;
  to: Square;
  fen: string;
}

export const AnalysisBoard: React.FC<AnalysisBoardProps> = ({
  initialFen,
  initialMoves,
  initialPgn,
  onExit,
  boardTheme = 'chesscom',
}) => {
  const [chess] = useState<Chess>(() => {
    const c = new Chess();
    if (initialFen) {
      try {
        c.load(initialFen);
      } catch {
        c.reset();
      }
    } else if (initialPgn) {
      try {
        c.loadPgn(initialPgn);
      } catch {
        c.reset();
      }
    }
    return c;
  });

  const [currentFen, setCurrentFen] = useState<string>(chess.fen());
  const [orientation, setOrientation] = useState<PieceColor>('w');
  const [history, setHistory] = useState<MoveHistoryNode[]>(() => {
    // If moves provided, preload them
    if (initialMoves && initialMoves.length > 0) {
      const temp = new Chess();
      const nodes: MoveHistoryNode[] = [];
      for (const m of initialMoves) {
        try {
          const res = temp.move(m);
          if (res) {
            nodes.push({ san: res.san, from: res.from as Square, to: res.to as Square, fen: temp.fen() });
          }
        } catch {
          break;
        }
      }
      return nodes;
    }
    return [];
  });
  const [currentPly, setCurrentPly] = useState<number>(history.length);

  // Board Editor Setup Mode State
  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [selectedPalettePiece, setSelectedPalettePiece] = useState<{ type: PieceType; color: PieceColor } | null>({
    type: 'p',
    color: 'w',
  });
  const [editorTurn, setEditorTurn] = useState<PieceColor>('w');
  const [castlingRights, setCastlingRights] = useState({
    whiteKingSide: true,
    whiteQueenSide: true,
    blackKingSide: true,
    blackQueenSide: true,
  });

  // Import / Export Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importInput, setImportInput] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Toast feedback
  const [copiedType, setCopiedType] = useState<'fen' | 'pgn' | null>(null);

  // Engine Suggestion State
  const [showEngineArrow, setShowEngineArrow] = useState<boolean>(true);

  // Engine evaluation calculation (debounced and async to eliminate 200-400ms piece placement lag)
  interface EngineAnalysisResult {
    score: number;
    bestMove: { from: string; to: string; promotion?: string } | null;
    bestMoveSan: string;
    explanation: string;
    isCalculating?: boolean;
  }

  const [engineAnalysis, setEngineAnalysis] = useState<EngineAnalysisResult>(() => {
    const tempChess = new Chess(currentFen);
    let initialScore = 0;
    if (tempChess.isGameOver()) {
      if (tempChess.isCheckmate()) {
        initialScore = tempChess.turn() === 'w' ? -10000 : 10000;
      }
    } else {
      initialScore = evaluateBoard(tempChess);
    }
    return {
      score: initialScore,
      bestMove: null,
      bestMoveSan: '',
      explanation: tempChess.isGameOver()
        ? (tempChess.isCheckmate()
          ? `Checkmate! ${tempChess.turn() === 'w' ? 'Black' : 'White'} wins.`
          : 'Game ended in a draw.')
        : `Position evaluation: ${initialScore > 0 ? '+' : ''}${(initialScore / 100).toFixed(1)}.`,
      isCalculating: false,
    };
  });

  useEffect(() => {
    const tempChess = new Chess(currentFen);
    if (tempChess.isGameOver()) {
      let score = 0;
      if (tempChess.isCheckmate()) {
        score = tempChess.turn() === 'w' ? -10000 : 10000;
      }
      setEngineAnalysis({
        score,
        bestMove: null,
        bestMoveSan: '',
        explanation: tempChess.isCheckmate()
          ? `Checkmate! ${tempChess.turn() === 'w' ? 'Black' : 'White'} wins.`
          : 'Game ended in a draw.',
        isCalculating: false,
      });
      return;
    }

    // Quick static score immediately so eval bar updates with zero lag
    const quickScore = evaluateBoard(tempChess);
    setEngineAnalysis((prev) => ({
      ...prev,
      score: quickScore,
      isCalculating: true,
    }));

    // Debounce deep depth-3 minimax and depth-2 search by 120ms
    // so piece drops, drags, and arrow key scrubbing remain at 60 FPS
    const timer = setTimeout(() => {
      try {
        const evalChess = new Chess(currentFen);
        if (evalChess.isGameOver()) return;

        const best = getEngineBestMove(evalChess, 3);
        const score = evaluatePositionDeep(evalChess, 2);

        let bestMoveSan = '';
        if (best?.move) {
          try {
            const legal = evalChess.moves({ verbose: true });
            const found = legal.find((m) => m.from === best.move.from && m.to === best.move.to);
            bestMoveSan = found ? found.san : `${best.move.from}-${best.move.to}`;
          } catch {
            bestMoveSan = `${best.move.from}-${best.move.to}`;
          }
        }

        const turnName = evalChess.turn() === 'w' ? 'White' : 'Black';
        let explanation = `Position evaluation: ${score > 0 ? '+' : ''}${(score / 100).toFixed(1)}.`;
        if (bestMoveSan) {
          explanation += ` Engine suggests ${bestMoveSan} for ${turnName}.`;
        }

        setEngineAnalysis({
          score,
          bestMove: best?.move ?? null,
          bestMoveSan,
          explanation,
          isCalculating: false,
        });
      } catch {
        setEngineAnalysis((prev) => ({ ...prev, isCalculating: false }));
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [currentFen]);

  // Sync to target ply
  const jumpToPly = useCallback(
    (targetPly: number) => {
      if (targetPly < 0 || targetPly > history.length) return;
      const targetFen = targetPly === 0 ? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : history[targetPly - 1].fen;
      chess.load(targetFen);
      setCurrentFen(targetFen);
      setCurrentPly(targetPly);
    },
    [chess, history]
  );

  // Make move in sandbox
  const handleMove = useCallback(
    (from: Square, to: Square, promotion?: PieceType): boolean => {
      try {
        const move = chess.move({
          from,
          to,
          promotion: promotion || 'q',
        });
        if (!move) return false;

        const newFen = chess.fen();
        setCurrentFen(newFen);

        const newHistory = history.slice(0, currentPly);
        newHistory.push({
          san: move.san,
          from,
          to,
          fen: newFen,
        });

        setHistory(newHistory);
        setCurrentPly(newHistory.length);
        return true;
      } catch {
        return false;
      }
    },
    [chess, history, currentPly]
  );

  // Board Editor: Place/Remove piece on square click
  const handleEditorSquareClick = (square: Square) => {
    if (!isEditorMode) return;

    if (!selectedPalettePiece) {
      // Clear square (trash/eraser mode)
      chess.remove(square);
    } else {
      chess.put({ type: selectedPalettePiece.type, color: selectedPalettePiece.color }, square);
    }
    setCurrentFen(chess.fen());
  };

  // Apply Board Editor Setup
  const handleApplyEditorSetup = () => {
    // Ensure both kings exist on board
    let whiteKing = false;
    let blackKing = false;
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p?.type === 'k') {
          if (p.color === 'w') whiteKing = true;
          if (p.color === 'b') blackKing = true;
        }
      }
    }

    if (!whiteKing || !blackKing) {
      alert('A valid chess position must contain both a White King and a Black King.');
      return;
    }

    // Build castling rights string
    let castling = '';
    if (castlingRights.whiteKingSide) castling += 'K';
    if (castlingRights.whiteQueenSide) castling += 'Q';
    if (castlingRights.blackKingSide) castling += 'k';
    if (castlingRights.blackQueenSide) castling += 'q';
    if (!castling) castling = '-';

    const currentParts = chess.fen().split(' ');
    const newFen = `${currentParts[0]} ${editorTurn} ${castling} - 0 1`;

    try {
      chess.load(newFen);
      setCurrentFen(chess.fen());
      setHistory([]);
      setCurrentPly(0);
      setIsEditorMode(false);
    } catch {
      alert('Position is invalid (e.g. king in check while opponent to move). Please adjust pieces.');
    }
  };

  // Reset to initial standard game
  const handleResetBoard = () => {
    chess.reset();
    setCurrentFen(chess.fen());
    setHistory([]);
    setCurrentPly(0);
    setIsEditorMode(false);
  };

  // Clear all pieces
  const handleClearBoard = () => {
    chess.clear();
    setCurrentFen(chess.fen());
  };

  // Import FEN or PGN
  const handleImport = () => {
    setImportError(null);
    const trimmed = importInput.trim();
    if (!trimmed) return;

    // Try FEN first
    try {
      const temp = new Chess();
      temp.load(trimmed);
      chess.load(trimmed);
      setCurrentFen(chess.fen());
      setHistory([]);
      setCurrentPly(0);
      setIsImportModalOpen(false);
      setImportInput('');
      return;
    } catch {
      // Not a pure FEN, try PGN
    }

    try {
      const tempPgn = new Chess();
      tempPgn.loadPgn(trimmed);
      chess.loadPgn(trimmed);
      setCurrentFen(chess.fen());

      // Parse moves history
      const moves = tempPgn.history({ verbose: true });
      const nodes: MoveHistoryNode[] = [];
      const runner = new Chess();
      for (const m of moves) {
        runner.move(m);
        nodes.push({ san: m.san, from: m.from as Square, to: m.to as Square, fen: runner.fen() });
      }
      setHistory(nodes);
      setCurrentPly(nodes.length);
      setIsImportModalOpen(false);
      setImportInput('');
    } catch {
      setImportError('Invalid FEN position or PGN notation. Please verify the format.');
    }
  };

  // Copy FEN
  const handleCopyFen = () => {
    navigator.clipboard.writeText(currentFen);
    setCopiedType('fen');
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Copy PGN
  const handleCopyPgn = () => {
    navigator.clipboard.writeText(chess.pgn() || 'No moves');
    setCopiedType('pgn');
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditorMode || isImportModalOpen) return;
      if (e.key === 'ArrowLeft') {
        jumpToPly(currentPly - 1);
      } else if (e.key === 'ArrowRight') {
        jumpToPly(currentPly + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPly, isEditorMode, isImportModalOpen, jumpToPly]);

  // Construct engine suggestion arrows
  const arrows = useMemo<BoardArrow[]>(() => {
    if (!showEngineArrow || !engineAnalysis.bestMove || isEditorMode) return [];
    return [
      {
        from: engineAnalysis.bestMove.from as Square,
        to: engineAnalysis.bestMove.to as Square,
        color: '#3b82f6', // High-visibility royal blue for engine suggestion
      },
    ];
  }, [showEngineArrow, engineAnalysis.bestMove, isEditorMode]);

  const lastMove = useMemo(() => {
    if (currentPly === 0 || history.length === 0) return null;
    const current = history[currentPly - 1];
    return current ? { from: current.from, to: current.to } : null;
  }, [currentPly, history]);

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
          <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              Analysis & Board Sandbox
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#312e2b] text-[#3b82f6] border border-[#3b82f6]/30 uppercase">
                Engine V2
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Deep Minimax • Visual Setup • PGN & FEN Tools</p>
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
            <span>Exit Sandbox</span>
          </button>
        </div>
      </header>

      {/* Main Sandbox Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] xl:grid-cols-[auto_380px] gap-6 items-start justify-center">
        {/* Left Column: Board + Eval Bar */}
        <div className="flex flex-col items-center w-full max-w-[660px] mx-auto space-y-3">
          {/* Board Editor Mode Banner */}
          {isEditorMode && (
            <div className="w-full p-3 rounded-xl bg-sky-950/60 border border-sky-600/40 flex items-center justify-between text-xs text-sky-200">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-sky-400" />
                <span>
                  <strong>Board Setup Mode:</strong> Select a piece from the palette below and click any square to place it.
                </span>
              </div>
              <button
                onClick={handleApplyEditorSetup}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition"
              >
                Done
              </button>
            </div>
          )}

          <div className="w-full flex space-x-2 sm:space-x-3 items-stretch justify-center">
            {/* Live Evaluation Bar */}
            {!isEditorMode && (
              <div className="h-auto">
                <EvaluationBar
                  score={engineAnalysis.score}
                  isCheckmate={chess.isCheckmate()}
                  winner={chess.isCheckmate() ? (chess.turn() === 'w' ? 'b' : 'w') : null}
                  orientation={orientation}
                />
              </div>
            )}

            {/* Chess Board */}
            <div className="flex-1 max-w-[600px]">
              <ChessBoard
                chess={chess}
                orientation={orientation}
                theme={boardTheme}
                interactive={!isEditorMode}
                showLegalMoves={!isEditorMode}
                lastMove={lastMove}
                onMove={handleMove}
                onRequestPromotion={(from, to) => handleMove(from, to, 'q')}
                customArrows={arrows}
                onSquareClick={isEditorMode ? handleEditorSquareClick : undefined}
                onFreePieceMove={
                  isEditorMode
                    ? (from, to) => {
                        const p = chess.remove(from);
                        if (p) {
                          chess.put(p, to);
                          setCurrentFen(chess.fen());
                        }
                      }
                    : undefined
                }
              />
            </div>
          </div>

          {/* Piece Palette in Editor Mode */}
          {isEditorMode && (
            <div className="w-full p-3 rounded-xl bg-[#21201d] border border-[#312e2b] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300">Piece Palette</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearBoard}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-700/50 text-rose-300 hover:bg-rose-900/50 text-[11px] font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Board
                  </button>
                  <button
                    onClick={handleResetBoard}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Standard Board
                  </button>
                </div>
              </div>

              {/* Pieces Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                {palettePieces.map((p, idx) => {
                  const isSelected =
                    selectedPalettePiece !== null &&
                    selectedPalettePiece.type === p.type &&
                    selectedPalettePiece.color === p.color;
                  return (
                    <button
                      key={`${p.color}-${p.type}-${idx}`}
                      onClick={() => setSelectedPalettePiece(p)}
                      className={`h-11 rounded-lg flex items-center justify-center transition border ${
                        isSelected
                          ? 'bg-sky-600/30 border-sky-400 scale-105 shadow-md'
                          : 'bg-[#2b2723] hover:bg-[#36322b] border-[#3d3831]'
                      }`}
                    >
                      <div className="w-7 h-7">
                        <ChessPieceIcon type={p.type} color={p.color} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Eraser / Clear square tool */}
              <div className="flex items-center justify-between pt-1 border-t border-[#312e2b]">
                <button
                  onClick={() => setSelectedPalettePiece(null)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    selectedPalettePiece === null
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                      : 'bg-[#2a2824] border-[#36322b] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eraser (Click square to remove piece)</span>
                </button>

                <div className="flex items-center gap-3 text-xs text-neutral-300">
                  <span className="font-semibold">Turn:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="turn"
                      checked={editorTurn === 'w'}
                      onChange={() => setEditorTurn('w')}
                    />
                    <span>White</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="turn"
                      checked={editorTurn === 'b'}
                      onChange={() => setEditorTurn('b')}
                    />
                    <span>Black</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Board Navigation Controls */}
          {!isEditorMode && (
            <div className="w-full flex items-center justify-between p-2 rounded-xl bg-[#21201d] border border-[#312e2b]">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => jumpToPly(0)}
                  disabled={currentPly === 0}
                  className="p-2 rounded-lg hover:bg-[#312e2b] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 transition"
                  title="First move"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => jumpToPly(currentPly - 1)}
                  disabled={currentPly === 0}
                  className="p-2 rounded-lg hover:bg-[#312e2b] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 transition"
                  title="Previous move (←)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => jumpToPly(currentPly + 1)}
                  disabled={currentPly === history.length}
                  className="p-2 rounded-lg hover:bg-[#312e2b] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 transition"
                  title="Next move (→)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => jumpToPly(history.length)}
                  disabled={currentPly === history.length}
                  className="p-2 rounded-lg hover:bg-[#312e2b] disabled:opacity-30 disabled:hover:bg-transparent text-neutral-300 transition"
                  title="Latest move"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-semibold text-neutral-400">
                Move {currentPly} / {history.length}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditorMode(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#2b2723] hover:bg-[#36322b] text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Open Board Editor palette"
                >
                  <Settings2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Setup Board</span>
                </button>
                <button
                  onClick={handleResetBoard}
                  className="p-1.5 rounded-lg bg-[#2b2723] hover:bg-[#36322b] text-neutral-400 hover:text-white transition"
                  title="Reset to Starting Position"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Engine Analysis & Move Tree */}
        <div className="w-full space-y-4">
          {/* Engine Analysis Card */}
          <div className="p-4 rounded-2xl bg-[#21201d] border border-[#312e2b] space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className={`w-4 h-4 ${engineAnalysis.isCalculating ? 'text-amber-400 animate-pulse' : 'text-[#3b82f6]'}`} />
                <span className="text-xs font-extrabold text-white tracking-wide uppercase">
                  Engine Evaluation
                </span>
                {engineAnalysis.isCalculating && (
                  <span className="text-[10px] text-amber-400 font-semibold animate-pulse">
                    evaluating...
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label className="flex items-center gap-1.5 text-[11px] text-neutral-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showEngineArrow}
                    onChange={(e) => setShowEngineArrow(e.target.checked)}
                    className="accent-[#3b82f6] rounded"
                  />
                  <span>Show Engine Arrow</span>
                </label>
              </div>
            </div>

            {/* Score & Best Move display */}
            <div className="p-3 rounded-xl bg-[#161512] border border-[#2b2723] flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Evaluation
                </div>
                <div className="text-2xl font-black text-white">
                  {chess.isCheckmate()
                    ? `# Checkmate`
                    : `${engineAnalysis.score > 0 ? '+' : ''}${(engineAnalysis.score / 100).toFixed(2)}`}
                </div>
              </div>
              {engineAnalysis.bestMoveSan && (
                <div className="text-right">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Recommended Move
                  </div>
                  <div className="text-xl font-extrabold text-[#3b82f6] flex items-center justify-end gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span>{engineAnalysis.bestMoveSan}</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-[#2b2723]/50 p-2.5 rounded-lg border border-[#312e2b]">
              {engineAnalysis.explanation}
            </p>
          </div>

          {/* Move History Tree */}
          <div className="p-4 rounded-2xl bg-[#21201d] border border-[#312e2b] space-y-3 shadow-lg flex flex-col h-64 sm:h-72">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white tracking-wide uppercase">
                Move List ({history.length} Plies)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#2b2723] hover:bg-[#36322b] text-[11px] font-semibold text-neutral-300 flex items-center gap-1 transition"
                  title="Import PGN or FEN"
                >
                  <Upload className="w-3 h-3 text-[#81b64c]" />
                  <span>Import</span>
                </button>
                <button
                  onClick={handleCopyPgn}
                  className="px-2 py-1 rounded bg-[#2b2723] hover:bg-[#36322b] text-[11px] font-semibold text-neutral-300 flex items-center gap-1 transition"
                  title="Copy PGN notation"
                >
                  {copiedType === 'pgn' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>PGN</span>
                </button>
                <button
                  onClick={handleCopyFen}
                  className="px-2 py-1 rounded bg-[#2b2723] hover:bg-[#36322b] text-[11px] font-semibold text-neutral-300 flex items-center gap-1 transition"
                  title="Copy current FEN string"
                >
                  {copiedType === 'fen' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>FEN</span>
                </button>
              </div>
            </div>

            {/* Moves Grid */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 font-mono text-xs">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 text-xs text-center px-4">
                  <Lightbulb className="w-6 h-6 mb-1 opacity-50" />
                  <span>Make moves on the board or click Import to load a PGN.</span>
                </div>
              ) : (
                <div className="grid grid-cols-[36px_1fr_1fr] gap-x-2 gap-y-1 items-center">
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, moveIdx) => {
                    const whitePlyIdx = moveIdx * 2;
                    const blackPlyIdx = moveIdx * 2 + 1;
                    const whiteMove = history[whitePlyIdx];
                    const blackMove = history[blackPlyIdx];

                    return (
                      <React.Fragment key={moveIdx}>
                        <span className="text-neutral-500 text-right pr-1 select-none font-bold">
                          {moveIdx + 1}.
                        </span>
                        {whiteMove ? (
                          <button
                            onClick={() => jumpToPly(whitePlyIdx + 1)}
                            className={`text-left px-2 py-1 rounded transition ${
                              currentPly === whitePlyIdx + 1
                                ? 'bg-[#3b82f6] text-white font-bold'
                                : 'hover:bg-[#2b2723] text-neutral-200'
                            }`}
                          >
                            {whiteMove.san}
                          </button>
                        ) : (
                          <span />
                        )}
                        {blackMove ? (
                          <button
                            onClick={() => jumpToPly(blackPlyIdx + 1)}
                            className={`text-left px-2 py-1 rounded transition ${
                              currentPly === blackPlyIdx + 1
                                ? 'bg-[#3b82f6] text-white font-bold'
                                : 'hover:bg-[#2b2723] text-neutral-200'
                            }`}
                          >
                            {blackMove.san}
                          </button>
                        ) : (
                          <span />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsImportModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-white">
              <Upload className="w-5 h-5 text-[#81b64c]" />
              <h3 className="text-lg font-extrabold">Import PGN or FEN</h3>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Paste standard PGN notation or a FEN position string below. The sandbox will immediately load the game tree and position.
            </p>

            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="e.g. 1. e4 e5 2. Nf3 Nc6... or rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              rows={5}
              className="w-full p-3 rounded-xl bg-[#161512] border border-[#312e2b] text-neutral-200 text-xs font-mono focus:outline-hidden focus:border-[#81b64c] resize-none"
            />

            {importError && (
              <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-lg">
                {importError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2b2723] hover:bg-[#36322b] text-neutral-300 text-xs font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-2 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white text-xs font-bold transition"
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
