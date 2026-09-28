import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import {
  GameSettings,
  PieceColor,
  PieceType,
  GameTermination,
  MoveHistoryItem,
  AiDifficulty,
} from './types/chess';
import { ChessBoard } from './components/ChessBoard';
import { ChessClock } from './components/ChessClock';
import { CapturedPieces } from './components/CapturedPieces';
import { EvaluationBar } from './components/EvaluationBar';
import { MoveHistory } from './components/MoveHistory';
import { GameControls } from './components/GameControls';
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { GameSettingsModal, TIME_CONTROL_PRESETS } from './components/GameSettingsModal';
import { soundEngine } from './utils/audio';
import { evaluateBoard, getBestMove } from './utils/chessEngine';
import { PIECE_VALUES } from './utils/evalTables';
import {
  detectOpeningFromMoves,
  detectMatePatternFromMoves,
  getTheoryLessonById,
  getTheoryLessonsByCategory,
  getLessonProgress,
  getLessonTargetMove,
  createLessonPositionFEN,
  getAdaptiveTrainerPrompt,
  TheoryLesson,
} from './utils/studyTools';
import { Bot, Swords, Sparkles, Loader2, Info, BookOpen, Target, House } from 'lucide-react';
import { TheoryTrainer } from './components/TheoryTrainer';
import { AdaptiveTrainer } from './components/AdaptiveTrainer';
import { KnowledgeBasePanel } from './components/KnowledgeBasePanel';
import { StudyRoadmap } from './components/StudyRoadmap';
import { StudyProgressCard } from './components/StudyProgressCard';
import { LearningHub } from './components/LearningHub';
import { PuzzleRush } from './components/PuzzleRush';
import { StudyLibrary } from './components/StudyLibrary';
import {
  KnowledgeCategory,
  getKnowledgeTopicById,
  getNextStudyTopic,
} from './utils/chessKnowledgeBase';
import {
  getStudyStreakDays,
  loadStudyProgress,
  markStudyTopicCompleted,
  saveStudyProgress,
} from './utils/progressStorage';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const App: React.FC = () => {
  // Game Settings
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'vs-ai',
    aiDifficulty: 'medium',
    playerColorChoice: 'w',
    timeControl: TIME_CONTROL_PRESETS[3], // Rapid 10 min
    boardTheme: 'chesscom',
    soundEnabled: true,
    showLegalMoves: true,
    showEvaluationBar: true,
    autoFlipPassAndPlay: false,
  });

  // Effective Player Color in vs-ai
  const [playerColor, setPlayerColor] = useState<PieceColor>('w');

  // Board Orientation
  const [boardOrientation, setBoardOrientation] = useState<PieceColor>('w');

  // Chess Instance
  const [chess] = useState<Chess>(() => new Chess());
  const [fen, setFen] = useState<string>(INITIAL_FEN);

  // Move History
  const [history, setHistory] = useState<MoveHistoryItem[]>([]);
  const [currentPly, setCurrentPly] = useState<number>(0);

  // Redo Stack
  const [redoStack, setRedoStack] = useState<MoveHistoryItem[]>([]);

  // Last Move
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);

  // Game Status
  const [termination, setTermination] = useState<GameTermination>('in_progress');
  const [winner, setWinner] = useState<PieceColor | null>(null);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);

  // Promotion Dialog State
  const [promotionPending, setPromotionPending] = useState<{ from: Square; to: Square } | null>(null);

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Clocks State (in seconds)
  const [whiteTime, setWhiteTime] = useState<number>(settings.timeControl.initialSeconds);
  const [blackTime, setBlackTime] = useState<number>(settings.timeControl.initialSeconds);

  // AI Thinking State
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Evaluation Score (centipawns)
  const [evalScore, setEvalScore] = useState<number>(0);

  // Toast / Copy notification
  const [copiedType, setCopiedType] = useState<'pgn' | 'fen' | null>(null);
  const [selectedTheoryLessonId, setSelectedTheoryLessonId] = useState<string>('scholars-mate');
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<KnowledgeCategory>('opening-principles');
  const [selectedKnowledgeTopicId, setSelectedKnowledgeTopicId] = useState<string>('develop-first');
  const [studyProgress, setStudyProgress] = useState(loadStudyProgress);
  const completedStudyTopics = studyProgress.completedTopicIds;
  const studyStreakDays = useMemo(() => getStudyStreakDays(studyProgress.activityDates), [studyProgress.activityDates]);
  const [lessonChallenge, setLessonChallenge] = useState<{ lessonId: string; targetMove: string } | null>(null);
  const [activeView, setActiveView] = useState<'hub' | 'game' | 'puzzles' | 'openings' | 'endgames'>('hub');
  const [puzzleRushRating, setPuzzleRushRating] = useState(800);

  useEffect(() => {
    saveStudyProgress(studyProgress);
  }, [studyProgress]);

  // Worker Reference
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef<number>(0);
  const executeMoveRef = useRef<(from: Square, to: Square, promotion?: PieceType) => boolean>(() => false);
  const aiWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Setup Web Worker for AI
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('./workers/chessAi.worker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (e) => {
        const { requestId, bestMove } = e.data;
        if (requestId === requestIdRef.current) {
          if (aiWatchdogRef.current) {
            clearTimeout(aiWatchdogRef.current);
            aiWatchdogRef.current = null;
          }
          setIsAiThinking(false);
          if (bestMove) {
            executeMoveRef.current(
              bestMove.from as Square,
              bestMove.to as Square,
              bestMove.promotion as PieceType
            );
          }
        }
      };
      workerRef.current.onerror = () => {
        workerRef.current = null;
        setIsAiThinking(false);
      };
    } catch {
      console.warn('Web Worker initialization failed, falling back to main thread calculation.');
      workerRef.current = null;
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Update sound engine mute state
  useEffect(() => {
    soundEngine.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Check Game Termination according to FIDE rules
  const checkGameStatus = useCallback(
    (currentChess: Chess): { ended: boolean; termination: GameTermination; winner: PieceColor | null } => {
      if (currentChess.isCheckmate()) {
        const winningColor = currentChess.turn() === 'w' ? 'b' : 'w';
        return { ended: true, termination: 'checkmate', winner: winningColor };
      }
      if (currentChess.isStalemate()) {
        return { ended: true, termination: 'stalemate', winner: null };
      }
      if (currentChess.isThreefoldRepetition()) {
        return { ended: true, termination: 'threefold_repetition', winner: null };
      }
      if (currentChess.isInsufficientMaterial()) {
        return { ended: true, termination: 'insufficient_material', winner: null };
      }
      if (currentChess.isDraw()) {
        return { ended: true, termination: 'fifty_move_rule', winner: null };
      }
      return { ended: false, termination: 'in_progress', winner: null };
    },
    []
  );

  // Reset / Start New Game
  const startNewGame = useCallback(
    (customFen?: string) => {
      const startFen = customFen || INITIAL_FEN;
      chess.load(startFen);
      setFen(chess.fen());
      setHistory([]);
      setCurrentPly(0);
      setRedoStack([]);
      setLastMove(null);
      setTermination('in_progress');
      setWinner(null);
      setIsGameOverModalOpen(false);
      setPromotionPending(null);
      setIsAiThinking(false);

      // Determine human player color in vs-ai mode
      let actualPlayerColor: PieceColor = 'w';
      if (settings.mode === 'vs-ai') {
        if (settings.playerColorChoice === 'random') {
          actualPlayerColor = Math.random() < 0.5 ? 'w' : 'b';
        } else {
          actualPlayerColor = settings.playerColorChoice;
        }
      }
      setPlayerColor(actualPlayerColor);
      setBoardOrientation(settings.mode === 'vs-ai' ? actualPlayerColor : 'w');

      // Reset Clocks
      setWhiteTime(settings.timeControl.initialSeconds);
      setBlackTime(settings.timeControl.initialSeconds);

      // Compute initial evaluation
      setEvalScore(evaluateBoard(chess));
    },
    [chess, settings.mode, settings.playerColorChoice, settings.timeControl]
  );

  // Trigger New Game whenever game mode or time control changes
  useEffect(() => {
    startNewGame();
  }, [settings.mode, settings.timeControl]);

  // Execute Move
  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceType): boolean => {
      if (termination !== 'in_progress') return false;

      try {
        const move = chess.move({
          from,
          to,
          promotion: promotion || 'q',
        });

        if (!move) return false;

        const newFen = chess.fen();
        setFen(newFen);
        setLastMove({ from, to });
        setRedoStack([]);

        // Sound effect triggers
        if (chess.inCheck()) {
          soundEngine.playCheck();
        } else if (move.flags.includes('k') || move.flags.includes('q')) {
          soundEngine.playCastle();
        } else if (move.captured) {
          soundEngine.playCapture();
        } else if (promotion) {
          soundEngine.playPromote();
        } else {
          soundEngine.playMove();
        }

        // Add increment to the player who just moved
        const movedColor = move.color;
        if (settings.timeControl.incrementSeconds > 0) {
          if (movedColor === 'w') {
            setWhiteTime((t) => t + settings.timeControl.incrementSeconds);
          } else {
            setBlackTime((t) => t + settings.timeControl.incrementSeconds);
          }
        }

        // Update history
        const newHistoryItem: MoveHistoryItem = {
          ply: history.length + 1,
          moveNumber: Math.floor(history.length / 2) + 1,
          san: move.san,
          from,
          to,
          piece: move.piece,
          color: move.color,
          captured: move.captured,
          promotion,
          fen: newFen,
          whiteTimeRemaining: whiteTime,
          blackTimeRemaining: blackTime,
        };

        const updatedHistory = [...history, newHistoryItem];
        setHistory(updatedHistory);
        setCurrentPly(updatedHistory.length);

        // Update Evaluation Bar
        const currentEval = evaluateBoard(chess);
        setEvalScore(currentEval);

        // Check FIDE game termination
        const status = checkGameStatus(chess);
        if (status.ended) {
          setTermination(status.termination);
          setWinner(status.winner);
          setIsGameOverModalOpen(true);
          const didPlayerWin = settings.mode === 'vs-ai' ? status.winner === playerColor : status.winner !== null;
          soundEngine.playGameOver(didPlayerWin);
          return true;
        }

        // Auto-flip for Pass & Play if enabled
        if (settings.mode === 'pass-and-play' && settings.autoFlipPassAndPlay) {
          setBoardOrientation(chess.turn());
        }

        return true;
      } catch (err) {
        console.error('Invalid move:', err);
        return false;
      }
    },
    [
      chess,
      termination,
      history,
      whiteTime,
      blackTime,
      settings.timeControl.incrementSeconds,
      settings.mode,
      settings.autoFlipPassAndPlay,
      checkGameStatus,
      playerColor,
    ]
  );

  executeMoveRef.current = executeMove;

  // Trigger AI Move when appropriate
  useEffect(() => {
    if (
      settings.mode !== 'vs-ai' ||
      termination !== 'in_progress' ||
      chess.turn() === playerColor ||
      isAiThinking ||
      currentPly !== history.length
    ) {
      return;
    }

    setIsAiThinking(true);
    const reqId = ++requestIdRef.current;

    // Small delay for natural human-like pacing (300-600ms)
    const timer = setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.postMessage({
          fen: chess.fen(),
          difficulty: settings.aiDifficulty,
          requestId: reqId,
        });

        aiWatchdogRef.current = setTimeout(() => {
          if (requestIdRef.current !== reqId) return;
          requestIdRef.current += 1;
          workerRef.current?.terminate();
          workerRef.current = null;
          const res = getBestMove(chess, settings.aiDifficulty);
          setIsAiThinking(false);
          if (res) {
            executeMoveRef.current(res.move.from, res.move.to, res.move.promotion as PieceType);
          }
        }, 5000);
      } else {
        // Fallback synchronous
        const res = getBestMove(chess, settings.aiDifficulty);
        setIsAiThinking(false);
        if (res) {
          executeMoveRef.current(res.move.from, res.move.to, res.move.promotion as PieceType);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [
    settings.mode,
    settings.aiDifficulty,
    termination,
    chess,
    playerColor,
    currentPly,
    history.length,
    fen,
  ]);

  // Chess Clock Interval
  useEffect(() => {
    if (termination !== 'in_progress' || settings.timeControl.category === 'Untimed') {
      return;
    }

    const interval = setInterval(() => {
      const activeColor = chess.turn();
      if (activeColor === 'w') {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTermination('timeout');
            setWinner('b');
            setIsGameOverModalOpen(true);
            soundEngine.playGameOver(playerColor === 'b');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTermination('timeout');
            setWinner('w');
            setIsGameOverModalOpen(true);
            soundEngine.playGameOver(playerColor === 'w');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [termination, settings.timeControl.category, chess, playerColor]);

  // Handle Promotion Selection
  const handlePromotionSelect = (piece: PieceType) => {
    if (!promotionPending) return;
    executeMove(promotionPending.from, promotionPending.to, piece);
    setPromotionPending(null);
  };

  // Undo Move
  const handleUndo = () => {
    if (history.length === 0 || isAiThinking) return;

    // In vs-ai, undo 2 moves so it's back to the player's turn; in pass-and-play, undo 1 move
    const steps = settings.mode === 'vs-ai' && history.length >= 2 ? 2 : 1;

    for (let i = 0; i < steps; i++) {
      chess.undo();
    }

    const popped = history.slice(history.length - steps);
    setRedoStack((prev) => [...popped.reverse(), ...prev]);

    const newHistory = history.slice(0, history.length - steps);
    setHistory(newHistory);
    setCurrentPly(newHistory.length);
    setFen(chess.fen());
    setTermination('in_progress');
    setWinner(null);
    setEvalScore(evaluateBoard(chess));

    const prevMove = newHistory[newHistory.length - 1];
    setLastMove(prevMove ? { from: prevMove.from, to: prevMove.to } : null);
  };

  // Redo Move
  const handleRedo = () => {
    if (redoStack.length === 0 || isAiThinking) return;

    const steps = settings.mode === 'vs-ai' && redoStack.length >= 2 ? 2 : 1;
    for (let i = 0; i < steps; i++) {
      const nextMove = redoStack[i];
      if (nextMove) {
        chess.move({ from: nextMove.from, to: nextMove.to, promotion: nextMove.promotion || 'q' });
      }
    }

    const reapplied = redoStack.slice(0, steps);
    setRedoStack((prev) => prev.slice(steps));

    const newHistory = [...history, ...reapplied];
    setHistory(newHistory);
    setCurrentPly(newHistory.length);
    setFen(chess.fen());
    setEvalScore(evaluateBoard(chess));

    const last = newHistory[newHistory.length - 1];
    setLastMove(last ? { from: last.from, to: last.to } : null);
  };

  // Select Ply in Move History (Board review)
  const handleSelectPly = (targetPly: number) => {
    if (targetPly === currentPly) return;

    // Replay from scratch to target ply
    const tempChess = new Chess();
    for (let i = 0; i < targetPly; i++) {
      const item = history[i];
      tempChess.move({ from: item.from, to: item.to, promotion: item.promotion || 'q' });
    }

    setFen(tempChess.fen());
    setCurrentPly(targetPly);
    const item = history[targetPly - 1];
    setLastMove(item ? { from: item.from, to: item.to } : null);
    setEvalScore(evaluateBoard(tempChess));
  };

  // Resignation
  const handleResign = () => {
    if (termination !== 'in_progress') return;
    const resigningColor = settings.mode === 'vs-ai' ? playerColor : chess.turn();
    const winningColor = resigningColor === 'w' ? 'b' : 'w';
    setTermination('resignation');
    setWinner(winningColor);
    setIsGameOverModalOpen(true);
    soundEngine.playGameOver(settings.mode === 'vs-ai' ? false : true);
  };

  // Draw Offer
  const handleDrawOffer = () => {
    if (termination !== 'in_progress') return;
    setTermination('draw_agreement');
    setWinner(null);
    setIsGameOverModalOpen(true);
    soundEngine.playGameOver(false);
  };

  // Copy PGN
  const handleCopyPgn = () => {
    try {
      const pgn = chess.pgn();
      navigator.clipboard.writeText(pgn || 'No moves yet');
      setCopiedType('pgn');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // ignore
    }
  };

  // Copy FEN
  const handleCopyFen = () => {
    try {
      navigator.clipboard.writeText(chess.fen());
      setCopiedType('fen');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // ignore
    }
  };

  // Load Custom FEN
  const handleLoadCustomFen = (customFen: string): boolean => {
    try {
      const test = new Chess(customFen);
      if (test) {
        startNewGame(customFen);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Compute Captured Pieces accurately by counting remaining pieces on board
  const { whiteCaptured, blackCaptured, materialAdvantage } = useMemo(() => {
    const board = chess.board();
    const currentCounts: Record<PieceColor, Record<PieceType, number>> = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    };

    let whiteMaterial = 0;
    let blackMaterial = 0;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          currentCounts[piece.color][piece.type] = (currentCounts[piece.color][piece.type] || 0) + 1;
          const val = PIECE_VALUES[piece.type] || 0;
          if (piece.color === 'w') whiteMaterial += val;
          else blackMaterial += val;
        }
      }
    }

    const initialPieces: Record<PieceType, number> = {
      p: 8,
      n: 2,
      b: 2,
      r: 2,
      q: 1,
      k: 1,
    };

    // Pieces captured by White (missing Black pieces)
    const whiteCapturedPieces: PieceType[] = [];
    (Object.keys(initialPieces) as PieceType[]).forEach((type) => {
      const missing = Math.max(0, initialPieces[type] - currentCounts.b[type]);
      for (let i = 0; i < missing; i++) whiteCapturedPieces.push(type);
    });

    // Pieces captured by Black (missing White pieces)
    const blackCapturedPieces: PieceType[] = [];
    (Object.keys(initialPieces) as PieceType[]).forEach((type) => {
      const missing = Math.max(0, initialPieces[type] - currentCounts.w[type]);
      for (let i = 0; i < missing; i++) blackCapturedPieces.push(type);
    });

    const diff = (whiteMaterial - blackMaterial) / 100;

    return {
      whiteCaptured: whiteCapturedPieces,
      blackCaptured: blackCapturedPieces,
      materialAdvantage: diff,
    };
  }, [fen]);

  // Is board interactive (cannot move during AI turn, when reviewing past plies, or when game ended)
  const isInteractive =
    termination === 'in_progress' &&
    currentPly === history.length &&
    (!isAiThinking || settings.mode !== 'vs-ai') &&
    (settings.mode !== 'vs-ai' || chess.turn() === playerColor);

  // Top and bottom player configurations based on board orientation
  const isWhiteBottom = boardOrientation === 'w';

  const bottomPlayerColor: PieceColor = isWhiteBottom ? 'w' : 'b';
  const topPlayerColor: PieceColor = isWhiteBottom ? 'b' : 'w';

  const bottomTime = isWhiteBottom ? whiteTime : blackTime;
  const topTime = isWhiteBottom ? blackTime : whiteTime;

  const bottomCaptured = isWhiteBottom ? whiteCaptured : blackCaptured;
  const topCaptured = isWhiteBottom ? blackCaptured : whiteCaptured;

  const bottomAdvantage = isWhiteBottom ? Math.max(0, materialAdvantage) : Math.max(0, -materialAdvantage);
  const topAdvantage = isWhiteBottom ? Math.max(0, -materialAdvantage) : Math.max(0, materialAdvantage);

  const getPlayerDetails = (color: PieceColor) => {
    if (settings.mode === 'vs-ai') {
      if (color === playerColor) {
        return { name: 'You', title: undefined, rating: '1500' };
      }
      const diffLabels: Record<AiDifficulty, { name: string; title: string; rating: string }> = {
        easy: { name: 'Stockfish Lite', title: 'BOT', rating: '800' },
        medium: { name: 'Stockfish Junior', title: 'BOT', rating: '1400' },
        hard: { name: 'Stockfish Master', title: 'BOT', rating: '1800' },
        master: { name: 'Grandmaster AI', title: 'GM', rating: '2200' },
      };
      return diffLabels[settings.aiDifficulty];
    }
    return {
      name: color === 'w' ? 'White' : 'Black',
      title: undefined,
      rating: undefined,
    };
  };

  const topDetails = getPlayerDetails(topPlayerColor);
  const bottomDetails = getPlayerDetails(bottomPlayerColor);

  const theoryLessons = useMemo(
    () => [...getTheoryLessonsByCategory('opening'), ...getTheoryLessonsByCategory('checkmate-pattern')],
    []
  );

  const activeTheoryLesson = useMemo<TheoryLesson | null>(() => {
    const byId = getTheoryLessonById(selectedTheoryLessonId);
    return byId ?? theoryLessons[0] ?? null;
  }, [selectedTheoryLessonId, theoryLessons]);

  const theoryProgress = useMemo(() => {
    if (!activeTheoryLesson) return 0;
    return getLessonProgress(activeTheoryLesson, history.map((item) => item.san));
  }, [activeTheoryLesson, history]);

  const studyContext = useMemo(() => {
    const moveSequence = history.map((item) => item.san);
    return {
      opening: detectOpeningFromMoves(moveSequence),
      matePattern: detectMatePatternFromMoves(moveSequence),
    };
  }, [history]);

  const adaptivePrompt = useMemo(() => {
    const moveSequence = history.map((item) => item.san);
    return getAdaptiveTrainerPrompt(moveSequence);
  }, [history]);

  const currentKnowledgeTopic = useMemo(
    () => getKnowledgeTopicById(selectedKnowledgeTopicId) ?? getKnowledgeTopicById('develop-first'),
    [selectedKnowledgeTopicId]
  );

  const nextStudyTopic = useMemo(
    () => getNextStudyTopic(selectedKnowledgeTopicId),
    [selectedKnowledgeTopicId]
  );

  const handleAdvanceStudyTopic = useCallback(() => {
    setStudyProgress((progress) => markStudyTopicCompleted(progress, selectedKnowledgeTopicId));
    if (nextStudyTopic) setSelectedKnowledgeTopicId(nextStudyTopic.id);
  }, [nextStudyTopic, selectedKnowledgeTopicId]);

  const lessonSolved = useMemo(() => {
    if (!lessonChallenge || history.length === 0) return false;
    return history[history.length - 1]?.san === lessonChallenge.targetMove;
  }, [lessonChallenge, history]);

  const handleLoadLessonPosition = useCallback(() => {
    if (!activeTheoryLesson) return;

    const lessonFen = createLessonPositionFEN(activeTheoryLesson);
    const targetMove = getLessonTargetMove(activeTheoryLesson);
    if (!targetMove) return;

    setLessonChallenge({ lessonId: activeTheoryLesson.id, targetMove });
    startNewGame(lessonFen);
  }, [activeTheoryLesson, startNewGame]);

  const handleAdaptivePromptLoad = useCallback(() => {
    if (!adaptivePrompt) return;
    const lesson = getTheoryLessonById(adaptivePrompt.lessonId);
    if (!lesson) return;
    setSelectedTheoryLessonId(lesson.id);
    const lessonFen = createLessonPositionFEN(lesson);
    const targetMove = getLessonTargetMove(lesson);
    if (!targetMove) return;

    setLessonChallenge({ lessonId: lesson.id, targetMove });
    startNewGame(lessonFen);
  }, [adaptivePrompt, startNewGame]);

  const handleStartGame = useCallback((difficulty: AiDifficulty) => {
    setSettings((current) => ({ ...current, mode: 'vs-ai', aiDifficulty: difficulty }));
    setActiveView('game');
    startNewGame();
  }, [startNewGame]);

  if (activeView === 'hub') {
    return (
      <LearningHub
        onStartGame={handleStartGame}
        onStartPuzzleRush={(rating) => {
          setPuzzleRushRating(rating);
          setActiveView('puzzles');
        }}
        onOpenLibrary={setActiveView}
      />
    );
  }

  if (activeView === 'puzzles') {
    return <PuzzleRush startingRating={puzzleRushRating} onExit={() => setActiveView('hub')} />;
  }

  if (activeView === 'openings' || activeView === 'endgames') {
    return <StudyLibrary library={activeView} onExit={() => setActiveView('hub')} />;
  }

  return (
    <div className="min-h-screen bg-[#161512] text-neutral-200 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#2b2723] bg-[#21201d] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center shadow-md">
            <span className="text-xl">♞</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none flex items-center gap-2">
              Chess Master
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#312e2b] text-[#81b64c] border border-[#81b64c]/30 uppercase">
                FIDE & Chess.com
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Official Rules • Precision Engine</p>
          </div>
        </div>

        {/* Current status info / AI thinking indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveView('hub')}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-[#312e2b] hover:text-white"
            title="Return to practice hub"
          >
            <House className="h-3.5 w-3.5" />
            Hub
          </button>
          {isAiThinking && (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#81b64c]/10 border border-[#81b64c]/40 text-[#81b64c] text-xs font-semibold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI is calculating...</span>
            </div>
          )}

          {currentPly !== history.length && (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Info className="w-3.5 h-3.5" />
              <span>Reviewing Move {currentPly}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[auto_1fr] xl:grid-cols-[auto_360px] gap-4 sm:gap-6 items-start justify-center">
        {/* Left Column: Evaluation Bar + Board Area */}
        <div className="flex flex-col items-center w-full max-w-[660px] mx-auto space-y-2">
          {/* Top Player Card (Opponent) */}
          <div className="w-full space-y-1">
            <ChessClock
              color={topPlayerColor}
              timeRemainingSeconds={topTime}
              isActive={chess.turn() === topPlayerColor && termination === 'in_progress'}
              incrementSeconds={settings.timeControl.incrementSeconds}
              isUntimed={settings.timeControl.category === 'Untimed'}
              playerName={topDetails.name}
              playerTitle={topDetails.title}
              rating={topDetails.rating}
            />
            <CapturedPieces
              captured={topCaptured}
              opponentColor={topPlayerColor === 'w' ? 'b' : 'w'}
              materialAdvantage={topAdvantage}
            />
          </div>

          {/* Board + Evaluation Bar Container */}
          <div className="w-full flex space-x-2 sm:space-x-3 items-stretch justify-center">
            {/* Live Evaluation Bar (Chess.com Style) */}
            {settings.showEvaluationBar && (
              <div className="h-auto">
                <EvaluationBar
                  score={evalScore}
                  isCheckmate={termination === 'checkmate'}
                  winner={winner}
                  orientation={boardOrientation}
                />
              </div>
            )}

            {/* Chess Board */}
            <div className="flex-1 flex justify-center">
              <ChessBoard
                chess={chess}
                orientation={boardOrientation}
                theme={settings.boardTheme}
                interactive={isInteractive}
                showLegalMoves={settings.showLegalMoves}
                lastMove={lastMove}
                onMove={executeMove}
                onRequestPromotion={(from, to) => setPromotionPending({ from, to })}
              />
            </div>
          </div>

          {/* Bottom Player Card (You / Current) */}
          <div className="w-full space-y-1">
            <CapturedPieces
              captured={bottomCaptured}
              opponentColor={bottomPlayerColor === 'w' ? 'b' : 'w'}
              materialAdvantage={bottomAdvantage}
            />
            <ChessClock
              color={bottomPlayerColor}
              timeRemainingSeconds={bottomTime}
              isActive={chess.turn() === bottomPlayerColor && termination === 'in_progress'}
              incrementSeconds={settings.timeControl.incrementSeconds}
              isUntimed={settings.timeControl.category === 'Untimed'}
              playerName={bottomDetails.name}
              playerTitle={bottomDetails.title}
              rating={bottomDetails.rating}
            />
          </div>
        </div>

        {/* Right Column: Move History & Controls Panel */}
        <div className="flex flex-col space-y-4 w-full h-full max-h-[660px]">
          {/* Controls Bar */}
          <GameControls
            canUndo={history.length > 0 && !isAiThinking}
            canRedo={redoStack.length > 0 && !isAiThinking}
            soundEnabled={settings.soundEnabled}
            onNewGame={() => startNewGame()}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onFlipBoard={() => setBoardOrientation((c) => (c === 'w' ? 'b' : 'w'))}
            onResign={handleResign}
            onDrawOffer={handleDrawOffer}
            onToggleSound={() =>
              setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
            }
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Theory Coach */}
          <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <BookOpen className="w-4 h-4 text-[#81b64c]" />
              Theory Coach
            </div>

            <div className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#81b64c] mb-2">
                <Target className="w-3.5 h-3.5" />
                Opening
              </div>
              {studyContext.opening ? (
                <>
                  <div className="font-semibold text-white">{studyContext.opening.name}</div>
                  <div className="text-[11px] text-neutral-400">ECO: {studyContext.opening.eco}</div>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{studyContext.opening.summary}</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-neutral-400">
                    {studyContext.opening.keyIdeas.map((idea) => (
                      <li key={idea}>• {idea}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-xs text-neutral-400">
                  Play a few moves to detect an opening pattern and learn its strategic ideas.
                </p>
              )}
            </div>

            <div className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-3">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#81b64c] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Checkmate Pattern
              </div>
              {studyContext.matePattern ? (
                <>
                  <div className="font-semibold text-white">{studyContext.matePattern.name}</div>
                  <div className="text-[11px] text-neutral-400">{studyContext.matePattern.theme}</div>
                  <p className="mt-2 text-xs text-neutral-300 leading-relaxed">{studyContext.matePattern.summary}</p>
                  <div className="mt-2 text-[11px] text-neutral-400">
                    Key moves: {studyContext.matePattern.keyMoves.join(' • ')}
                  </div>
                </>
              ) : (
                <p className="text-xs text-neutral-400">
                  Search for classic mating motifs such as Fool’s Mate or Scholar’s Mate.
                </p>
              )}
            </div>
          </div>

          <AdaptiveTrainer prompt={adaptivePrompt} onLoadLesson={handleAdaptivePromptLoad} />

          <StudyRoadmap
            activeTopicId={selectedKnowledgeTopicId}
            completedTopicIds={completedStudyTopics}
            onSelectTopic={setSelectedKnowledgeTopicId}
          />

          <KnowledgeBasePanel
            selectedCategory={selectedKnowledgeCategory}
            onSelectCategory={setSelectedKnowledgeCategory}
          />

          {currentKnowledgeTopic && (
            <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-white">Current concept</div>
                (
                  <button
                    onClick={handleAdvanceStudyTopic}
                    className="rounded-lg bg-[#81b64c] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#92c957]"
                  >
                    {completedStudyTopics.includes(selectedKnowledgeTopicId)
                      ? nextStudyTopic ? 'Next topic' : 'Completed'
                      : nextStudyTopic ? 'Complete & next' : 'Complete topic'}
                  </button>
                )
              </div>
              <div className="text-base font-bold text-[#81b64c]">{currentKnowledgeTopic.title}</div>
              <p className="text-xs leading-relaxed text-neutral-300">{currentKnowledgeTopic.whyItMatters}</p>
            </div>
          )}

          <StudyProgressCard completedTopics={completedStudyTopics} streakDays={studyStreakDays} />

          <TheoryTrainer
            lessons={theoryLessons}
            activeLessonId={activeTheoryLesson?.id ?? null}
            selectedCategory="opening"
            progress={theoryProgress}
            currentMoves={history.map((item) => item.san)}
            lessonTargetMove={lessonChallenge?.targetMove ?? (activeTheoryLesson ? getLessonTargetMove(activeTheoryLesson) : null)}
            lessonSolved={lessonSolved}
            onSelectLesson={setSelectedTheoryLessonId}
            onLoadLessonPosition={handleLoadLessonPosition}
          />

          {/* Move History */}
          <div className="flex-1 min-h-[300px]">
            <MoveHistory
              history={history}
              currentPly={currentPly}
              onSelectPly={handleSelectPly}
              onCopyPgn={handleCopyPgn}
              onCopyFen={handleCopyFen}
              copiedType={copiedType}
            />
          </div>

          {/* FIDE Rule Quick Reference Footer */}
          <div className="p-3 rounded-xl bg-[#21201d] border border-[#312e2b] text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#81b64c]" />
              <span>FIDE & Chess.com Standards</span>
            </div>
            <p className="leading-tight">
              En passant, castling rights, pawn promotion, 50-move rule, threefold repetition, and
              insufficient material draws are fully validated.
            </p>
          </div>
        </div>
      </main>

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={promotionPending !== null}
        color={chess.turn()}
        onSelect={handlePromotionSelect}
        onCancel={() => setPromotionPending(null)}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        termination={termination}
        winner={winner}
        playerColor={playerColor}
        mode={settings.mode}
        onNewGame={() => startNewGame()}
        onClose={() => setIsGameOverModalOpen(false)}
      />

      {/* Settings Modal */}
      <GameSettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
        onLoadCustomFen={handleLoadCustomFen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
