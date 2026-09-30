import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Chess, Square, Move } from 'chess.js';
import {
  GameSettings,
  PieceColor,
  PieceType,
  GameTermination,
  MoveHistoryItem,
  AiDifficulty,
  TimeControl,
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
import { detectBoardThreats } from './utils/threatRadar';
import { PIECE_VALUES } from './utils/evalTables';
import {
  detectOpeningFromMoves,
  detectOpeningWithVariations,
  formatMoveSequence,
  detectMatePatternFromMoves,
  getTheoryLessonById,
  getTheoryLessonsByCategory,
  getLessonProgress,
  getLessonTargetMove,
  createLessonPositionFEN,
  getAdaptiveTrainerPrompt,
  TheoryLesson,
} from './utils/studyTools';
import { Bot, Swords, Sparkles, Loader2, Info, BookOpen, Target, House, GitBranch, History, Compass, Shield, ShieldAlert, Users, MessageSquare, Send, Radio, Check, Copy, X } from 'lucide-react';
import { TheoryTrainer } from './components/TheoryTrainer';
import { AdaptiveTrainer } from './components/AdaptiveTrainer';
import { KnowledgeBasePanel } from './components/KnowledgeBasePanel';
import { StudyRoadmap } from './components/StudyRoadmap';
import { StudyProgressCard } from './components/StudyProgressCard';
import { LearningHub } from './components/LearningHub';
import { PuzzleRush } from './components/PuzzleRush';
import { StudyLibrary } from './components/StudyLibrary';
import { GameReviewModal } from './components/GameReviewModal';
import { GameArchiveModal } from './components/GameArchiveModal';
import { AnalysisBoard } from './components/AnalysisBoard';
import { BotSelectorModal } from './components/BotSelectorModal';
import { BotBanterBubble } from './components/BotBanterBubble';
import { CoordinateTrainer } from './components/CoordinateTrainer';
import { SocialShareModal } from './components/SocialShareModal';
import { PositionSandbox } from './components/PositionSandbox';
import { MultiplayerModal } from './components/MultiplayerModal';
import {
  P2PMultiplayerManager,
  MultiplayerMessage,
  MovePayload,
  ChatPayload,
  ConnectionStatus,
} from './utils/p2pMultiplayer';
import {
  BotPersonalityId,
  getBotById,
  getRandomBanter,
} from './utils/botPersonalities';
import { saveGameToArchive, ArchivedGame } from './utils/gameArchive';
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
    threatRadar: false,
    threatRadarDifficulty: 'easy',
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
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [studyProgress, setStudyProgress] = useState(loadStudyProgress);
  const completedStudyTopics = studyProgress.completedTopicIds;
  const studyStreakDays = useMemo(() => getStudyStreakDays(studyProgress.activityDates), [studyProgress.activityDates]);
  const [lessonChallenge, setLessonChallenge] = useState<{ lessonId: string; targetMove: string } | null>(null);
  const [activeView, setActiveView] = useState<'hub' | 'game' | 'puzzles' | 'openings' | 'endgames' | 'analysis' | 'vision' | 'sandbox'>('hub');
  const [puzzleRushRating, setPuzzleRushRating] = useState(800);
  const [analysisParams, setAnalysisParams] = useState<{ moves?: string[]; fen?: string; pgn?: string } | null>(null);

  // Multiplayer P2P WebRTC State
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState<boolean>(false);
  const [multiplayerInitialRoom, setMultiplayerInitialRoom] = useState<string | undefined>(undefined);
  const [multiplayerOpponentName, setMultiplayerOpponentName] = useState<string>('Friend');
  const [isMultiplayerHost, setIsMultiplayerHost] = useState<boolean>(false);
  const [multiplayerRoomCode, setMultiplayerRoomCode] = useState<string | null>(null);
  const [multiplayerChatMessages, setMultiplayerChatMessages] = useState<ChatPayload[]>([]);
  const [isMultiplayerChatOpen, setIsMultiplayerChatOpen] = useState<boolean>(false);
  const [multiplayerChatDraft, setMultiplayerChatDraft] = useState<string>('');
  const [multiplayerDrawOffered, setMultiplayerDrawOffered] = useState<boolean>(false);
  const [multiplayerDisconnected, setMultiplayerDisconnected] = useState<boolean>(false);
  const multiplayerManagerRef = useRef<P2PMultiplayerManager | null>(null);
  const isLocalMultiplayerMoveRef = useRef<boolean>(true);

  // Check URL query parameters for room code on load (e.g. ?room=CM-8F2K)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      if (roomParam) {
        setMultiplayerInitialRoom(roomParam);
        setIsMultiplayerModalOpen(true);
      }
    } catch {
      // safe fallback
    }
  }, []);

  // Cleanup multiplayer manager on unmount
  useEffect(() => {
    return () => {
      multiplayerManagerRef.current?.destroy();
    };
  }, []);

  // Bot Personalities & Banter State
  const [selectedBotId, setSelectedBotId] = useState<BotPersonalityId>('elena');
  const [isBotSelectorOpen, setIsBotSelectorOpen] = useState<boolean>(false);
  const [botBanterMessage, setBotBanterMessage] = useState<string | null>(null);

  // Social Share Card State
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);

  // Blunder Shield State
  const [blunderWarning, setBlunderWarning] = useState<{
    from: Square;
    to: Square;
    promotion?: PieceType;
    message: string;
  } | null>(null);
  const blunderOverrideRef = useRef<boolean>(false);

  const handleOpenAnalysis = useCallback((moves?: string[], fen?: string, pgn?: string) => {
    setAnalysisParams({ moves, fen, pgn });
    setActiveView('analysis');
  }, []);

  // Game Review & Archive State
  const [isGameReviewOpen, setIsGameReviewOpen] = useState<boolean>(false);
  const [isGameArchiveOpen, setIsGameArchiveOpen] = useState<boolean>(false);
  const [reviewMoves, setReviewMoves] = useState<string[]>([]);
  const [reviewWhiteName, setReviewWhiteName] = useState<string>('White');
  const [reviewBlackName, setReviewBlackName] = useState<string>('Black');
  const [reviewResult, setReviewResult] = useState<string>('*');
  const [reviewPlayerColor, setReviewPlayerColor] = useState<PieceColor>('w');
  const hasArchivedGameRef = useRef<boolean>(false);

  const reviewFinalFen = useMemo(() => {
    if (reviewMoves.length === 0) return undefined;
    try {
      const c = new Chess();
      for (const m of reviewMoves) {
        c.move(m);
      }
      return c.fen();
    } catch {
      return undefined;
    }
  }, [reviewMoves]);

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

  const getPlayerDetails = useCallback(
    (color: PieceColor) => {
      if (settings.mode === 'vs-ai') {
        if (color === playerColor) {
          return { name: 'You', title: undefined, rating: '1500' };
        }
        const bot = getBotById(selectedBotId);
        return {
          name: bot.name,
          title: bot.title,
          rating: `${bot.rating}`,
        };
      }
      if (settings.mode === 'multiplayer') {
        if (color === playerColor) {
          return { name: 'You', title: undefined, rating: undefined };
        }
        return {
          name: multiplayerOpponentName || 'Friend',
          title: 'P2P',
          rating: 'Live',
        };
      }
      return {
        name: color === 'w' ? 'White' : 'Black',
        title: undefined,
        rating: undefined,
      };
    },
    [settings.mode, playerColor, selectedBotId, multiplayerOpponentName]
  );

  const archiveGame = useCallback(
    (term: GameTermination, win: PieceColor | null, movesList: MoveHistoryItem[] = history) => {
      if (hasArchivedGameRef.current || movesList.length === 0) return;
      hasArchivedGameRef.current = true;

      const movesSan = movesList.map((m) => m.san);
      const opening = detectOpeningWithVariations(movesSan);
      const whiteDetails = getPlayerDetails('w');
      const blackDetails = getPlayerDetails('b');

      let result: '1-0' | '0-1' | '1/2-1/2' = '1/2-1/2';
      if (win === 'w') result = '1-0';
      else if (win === 'b') result = '0-1';

      saveGameToArchive({
        whiteName: whiteDetails.name,
        blackName: blackDetails.name,
        playerColor,
        mode: settings.mode,
        result,
        termination: term,
        movesCount: movesSan.length,
        openingName: opening ? `${opening.opening.name}${opening.activeVariation ? ' - ' + opening.activeVariation.name : ''}` : undefined,
        openingEco: opening?.opening.eco,
        pgn: chess.pgn(),
        moves: movesSan,
      });
    },
    [history, chess, getPlayerDetails, playerColor, settings.mode]
  );

  const handleOpenCurrentReview = useCallback(() => {
    setIsGameOverModalOpen(false);
    const movesSan = history.map((h) => h.san);
    let res = '*';
    if (winner === 'w') res = '1-0';
    else if (winner === 'b') res = '0-1';
    else if (termination !== 'in_progress') res = '1/2-1/2';

    setReviewMoves(movesSan);
    setReviewWhiteName(getPlayerDetails('w').name);
    setReviewBlackName(getPlayerDetails('b').name);
    setReviewResult(res);
    setReviewPlayerColor(playerColor);
    setIsGameReviewOpen(true);
  }, [history, winner, termination, getPlayerDetails, playerColor]);

  const handleOpenArchivedReview = useCallback((game: ArchivedGame) => {
    setIsGameArchiveOpen(false);
    setReviewMoves(game.moves);
    setReviewWhiteName(game.whiteName);
    setReviewBlackName(game.blackName);
    setReviewResult(game.result);
    setReviewPlayerColor(game.playerColor);
    setIsGameReviewOpen(true);
  }, []);

  // Reset / Start New Game
  const startNewGame = useCallback(
    (customFen?: string) => {
      hasArchivedGameRef.current = false;
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
      setSelectedVariationId(null);

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

      // Reset Blunder Shield warning & trigger bot start banter
      setBlunderWarning(null);
      if (settings.mode === 'vs-ai') {
        const bot = getBotById(selectedBotId);
        setBotBanterMessage(getRandomBanter(bot.quotes.start));
      } else {
        setBotBanterMessage(null);
      }
    },
    [chess, settings.mode, settings.playerColorChoice, settings.timeControl, selectedBotId]
  );

  // Trigger New Game whenever game mode or time control changes
  useEffect(() => {
    startNewGame();
  }, [settings.mode, settings.timeControl]);

  // Execute Move
  const executeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceType): boolean => {
      if (termination !== 'in_progress') return false;

      // Blunder Shield: In vs-ai mode on player's turn, warn before hanging queen or checkmate
      if (
        settings.blunderShield &&
        settings.mode === 'vs-ai' &&
        chess.turn() === playerColor &&
        !blunderOverrideRef.current
      ) {
        try {
          const testChess = new Chess(chess.fen());
          const testMove = testChess.move({ from, to, promotion: promotion || 'q' });
          if (testMove) {
            const oppMoves = testChess.moves({ verbose: true });
            let mateIn1 = false;
            for (const om of oppMoves) {
              testChess.move(om);
              if (testChess.isCheckmate()) {
                mateIn1 = true;
                testChess.undo();
                break;
              }
              testChess.undo();
            }

            let blunderMsg: string | null = null;
            if (mateIn1) {
              blunderMsg = 'Allows an immediate checkmate for opponent!';
            } else {
              for (const om of oppMoves) {
                if (om.captured === 'q') {
                  blunderMsg = `Hangs your Queen on ${om.to}!`;
                  break;
                } else if (om.captured === 'r' && testMove.piece !== 'q') {
                  if (['p', 'n', 'b'].includes(om.piece)) {
                    blunderMsg = `Hangs your Rook to opponent's ${
                      om.piece === 'p' ? 'Pawn' : om.piece === 'n' ? 'Knight' : 'Bishop'
                    }!`;
                    break;
                  }
                }
              }
            }

            if (blunderMsg) {
              setBlunderWarning({
                from,
                to,
                promotion,
                message: blunderMsg,
              });
              return false;
            }
          }
        } catch {
          // ignore validation error
        }
      }

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

        // Bot banter reactions to moves during play
        if (settings.mode === 'vs-ai') {
          const bot = getBotById(selectedBotId);
          if (movedColor !== playerColor) {
            // Bot moved
            if (chess.inCheck()) {
              setBotBanterMessage(getRandomBanter(bot.quotes.onCheck));
            } else if (move.captured === 'q') {
              setBotBanterMessage(getRandomBanter(bot.quotes.onCaptureQueen));
            }
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

        // Broadcast move to P2P multiplayer peer
        if (settings.mode === 'multiplayer' && multiplayerManagerRef.current && isLocalMultiplayerMoveRef.current) {
          multiplayerManagerRef.current.send({
            type: 'move',
            payload: {
              from,
              to,
              promotion,
              san: move.san,
              whiteTime,
              blackTime,
            },
          });
        }

        // Update Evaluation Bar
        const currentEval = evaluateBoard(chess);
        setEvalScore(currentEval);

        // Check FIDE game termination
        const status = checkGameStatus(chess);
        if (status.ended) {
          setTermination(status.termination);
          setWinner(status.winner);
          setIsGameOverModalOpen(true);
          const didPlayerWin = (settings.mode === 'vs-ai' || settings.mode === 'multiplayer') ? status.winner === playerColor : status.winner !== null;
          soundEngine.playGameOver(didPlayerWin);
          archiveGame(status.termination, status.winner, updatedHistory);

          if (settings.mode === 'vs-ai') {
            const bot = getBotById(selectedBotId);
            if (status.winner === playerColor) {
              setBotBanterMessage(getRandomBanter(bot.quotes.onLoss));
            } else if (status.winner !== null) {
              setBotBanterMessage(getRandomBanter(bot.quotes.onWin));
            } else {
              setBotBanterMessage(getRandomBanter(bot.quotes.onDraw));
            }
          }

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
      settings.blunderShield,
      checkGameStatus,
      playerColor,
      selectedBotId,
      archiveGame,
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
          const fallbackDifficulty: AiDifficulty = settings.aiDifficulty === 'master' ? 'medium' : settings.aiDifficulty;
          const res = getBestMove(chess, fallbackDifficulty);
          setIsAiThinking(false);
          if (res) {
            executeMoveRef.current(res.move.from, res.move.to, res.move.promotion as PieceType);
          }
        }, 5000);
      } else {
        // Fallback synchronous (capped to prevent main thread blocking)
        const fallbackDifficulty: AiDifficulty = settings.aiDifficulty === 'master' ? 'medium' : settings.aiDifficulty;
        const res = getBestMove(chess, fallbackDifficulty);
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
            archiveGame('timeout', 'b');
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
            archiveGame('timeout', 'w');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [termination, settings.timeControl.category, chess, playerColor, archiveGame]);

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
    const resigningColor = (settings.mode === 'vs-ai' || settings.mode === 'multiplayer') ? playerColor : chess.turn();
    const winningColor = resigningColor === 'w' ? 'b' : 'w';
    setTermination('resignation');
    setWinner(winningColor);
    setIsGameOverModalOpen(true);
    soundEngine.playGameOver(settings.mode === 'pass-and-play' ? true : false);
    archiveGame('resignation', winningColor);

    if (settings.mode === 'multiplayer' && multiplayerManagerRef.current) {
      multiplayerManagerRef.current.send({
        type: 'resign',
        payload: { color: playerColor },
      });
    }
  };

  // Draw Offer
  const handleDrawOffer = () => {
    if (termination !== 'in_progress') return;
    if (settings.mode === 'multiplayer' && multiplayerManagerRef.current) {
      multiplayerManagerRef.current.send({
        type: 'draw_offer',
        payload: { fromColor: playerColor },
      });
      setMultiplayerChatMessages((prev) => [
        ...prev,
        { sender: 'System', text: 'You offered a draw to your opponent.', timestamp: Date.now() },
      ]);
      return;
    }
    setTermination('draw_agreement');
    setWinner(null);
    setIsGameOverModalOpen(true);
    soundEngine.playGameOver(false);
    archiveGame('draw_agreement', null);
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
    (settings.mode !== 'vs-ai' || chess.turn() === playerColor) &&
    (settings.mode !== 'multiplayer' || (chess.turn() === playerColor && !multiplayerDisconnected));

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
      openingWithVariations: detectOpeningWithVariations(moveSequence),
      matePattern: detectMatePatternFromMoves(moveSequence),
    };
  }, [history]);

  const adaptivePrompt = useMemo(() => {
    const moveSequence = history.map((item) => item.san);
    return getAdaptiveTrainerPrompt(moveSequence);
  }, [history]);

  const threatRadarData = useMemo(() => {
    if (!settings.threatRadar) return null;
    return detectBoardThreats(chess, playerColor, settings.threatRadarDifficulty || 'easy');
  }, [settings.threatRadar, settings.threatRadarDifficulty, chess, playerColor, fen]);

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

  const handleP2PMessage = useCallback(
    (msg: MultiplayerMessage) => {
      if (msg.type === 'move') {
        const payload = msg.payload as MovePayload;
        if (payload) {
          isLocalMultiplayerMoveRef.current = false;
          executeMove(payload.from, payload.to, payload.promotion);
          isLocalMultiplayerMoveRef.current = true;
          if (typeof payload.whiteTime === 'number') setWhiteTime(payload.whiteTime);
          if (typeof payload.blackTime === 'number') setBlackTime(payload.blackTime);
        }
      } else if (msg.type === 'chat') {
        const chat = msg.payload as ChatPayload;
        if (chat) {
          setMultiplayerChatMessages((prev) => [...prev, chat]);
        }
      } else if (msg.type === 'draw_offer') {
        setMultiplayerDrawOffered(true);
      } else if (msg.type === 'draw_accept') {
        setTermination('draw_agreement');
        setWinner(null);
        setIsGameOverModalOpen(true);
        soundEngine.playGameOver(false);
        archiveGame('draw_agreement', null);
      } else if (msg.type === 'draw_decline') {
        setMultiplayerDrawOffered(false);
        setMultiplayerChatMessages((prev) => [
          ...prev,
          { sender: 'System', text: 'Opponent declined the draw offer.', timestamp: Date.now() },
        ]);
      } else if (msg.type === 'resign') {
        setTermination('resignation');
        setWinner(playerColor);
        setIsGameOverModalOpen(true);
        soundEngine.playGameOver(true);
        archiveGame('resignation', playerColor);
      }
    },
    [executeMove, playerColor, archiveGame]
  );

  const handleMultiplayerGameReady = useCallback(
    (data: {
      manager: P2PMultiplayerManager;
      playerColor: PieceColor;
      timeControl: TimeControl;
      opponentName: string;
      isHost: boolean;
    }) => {
      multiplayerManagerRef.current = data.manager;
      setMultiplayerOpponentName(data.opponentName);
      setIsMultiplayerHost(data.isHost);
      setMultiplayerRoomCode(data.manager.getRoomCode());
      setMultiplayerDisconnected(false);
      setMultiplayerDrawOffered(false);
      setMultiplayerChatMessages([]);

      data.manager['events'].onMessage = (msg: MultiplayerMessage) => {
        handleP2PMessage(msg);
      };
      data.manager['events'].onStatusChange = (connStatus: ConnectionStatus) => {
        if (connStatus === 'disconnected' || connStatus === 'error') {
          setMultiplayerDisconnected(true);
        }
      };

      setSettings((prev) => ({
        ...prev,
        mode: 'multiplayer',
        timeControl: data.timeControl,
        playerColorChoice: data.playerColor,
      }));
      setPlayerColor(data.playerColor);
      setBoardOrientation(data.playerColor);
      setActiveView('game');
      startNewGame(INITIAL_FEN);
    },
    [handleP2PMessage, startNewGame]
  );

  const handleSendMultiplayerChat = useCallback(
    (textToSend?: string) => {
      const text = (textToSend || multiplayerChatDraft).trim();
      if (!text || !multiplayerManagerRef.current) return;
      const chat: ChatPayload = {
        sender: 'You',
        text,
        timestamp: Date.now(),
      };
      multiplayerManagerRef.current.send({
        type: 'chat',
        payload: {
          sender: isMultiplayerHost ? 'Host' : 'Guest',
          text,
          timestamp: Date.now(),
        },
      });
      setMultiplayerChatMessages((prev) => [...prev, chat]);
      setMultiplayerChatDraft('');
    },
    [multiplayerChatDraft, isMultiplayerHost]
  );

  const handleStartGame = useCallback((difficulty: AiDifficulty) => {
    setSettings((current) => ({ ...current, mode: 'vs-ai', aiDifficulty: difficulty }));
    setActiveView('game');
    startNewGame();
  }, [startNewGame]);

  if (activeView === 'hub') {
    return (
      <>
        <LearningHub
          onStartGame={handleStartGame}
          onStartPuzzleRush={(rating) => {
            setPuzzleRushRating(rating);
            setActiveView('puzzles');
          }}
          onOpenLibrary={setActiveView}
          onOpenArchive={() => setIsGameArchiveOpen(true)}
          onOpenAnalysis={() => handleOpenAnalysis()}
          onOpenVisionTrainer={() => setActiveView('vision')}
          onOpenBotSelector={() => setIsBotSelectorOpen(true)}
          onOpenSandbox={() => setActiveView('sandbox')}
          onOpenMultiplayer={() => setIsMultiplayerModalOpen(true)}
        />
        <MultiplayerModal
          isOpen={isMultiplayerModalOpen}
          onClose={() => setIsMultiplayerModalOpen(false)}
          onGameReady={handleMultiplayerGameReady}
          initialRoomCode={multiplayerInitialRoom}
        />
        <BotSelectorModal
          isOpen={isBotSelectorOpen}
          onClose={() => setIsBotSelectorOpen(false)}
          selectedBotId={selectedBotId}
          onSelectBot={(bot) => {
            setSelectedBotId(bot.id);
            setSettings((curr) => ({ ...curr, mode: 'vs-ai', aiDifficulty: bot.difficulty }));
            setBotBanterMessage(getRandomBanter(bot.quotes.start));
            setActiveView('game');
            startNewGame();
          }}
        />
        <GameArchiveModal
          isOpen={isGameArchiveOpen}
          onClose={() => setIsGameArchiveOpen(false)}
          onOpenReview={handleOpenArchivedReview}
        />
        <GameReviewModal
          isOpen={isGameReviewOpen}
          onClose={() => setIsGameReviewOpen(false)}
          moves={reviewMoves}
          whiteName={reviewWhiteName}
          blackName={reviewBlackName}
          result={reviewResult}
          playerColor={reviewPlayerColor}
          onOpenAnalysis={(m) => handleOpenAnalysis(m)}
          onOpenShare={() => setIsSocialShareOpen(true)}
        />
        <SocialShareModal
          isOpen={isSocialShareOpen}
          onClose={() => setIsSocialShareOpen(false)}
          whiteName={reviewWhiteName}
          blackName={reviewBlackName}
          result={reviewResult}
          movesCount={reviewMoves.length}
          fen={reviewFinalFen}
        />
      </>
    );
  }

  if (activeView === 'sandbox') {
    return (
      <PositionSandbox
        onPlayVsAi={(customFen, color, difficulty) => {
          setSettings((prev) => ({
            ...prev,
            mode: 'vs-ai',
            aiDifficulty: difficulty,
            playerColorChoice: color,
          }));
          setPlayerColor(color);
          setBoardOrientation(color);
          setActiveView('game');
          startNewGame(customFen);
        }}
        onOpenAnalysis={(customFen) => {
          handleOpenAnalysis(undefined, customFen);
        }}
        onExit={() => setActiveView('hub')}
        boardTheme={settings.boardTheme}
      />
    );
  }

  if (activeView === 'vision') {
    return <CoordinateTrainer onExit={() => setActiveView('hub')} boardTheme={settings.boardTheme} />;
  }

  if (activeView === 'puzzles') {
    return <PuzzleRush startingRating={puzzleRushRating} onExit={() => setActiveView('hub')} />;
  }

  if (activeView === 'openings' || activeView === 'endgames') {
    return <StudyLibrary library={activeView} onExit={() => setActiveView('hub')} />;
  }

  if (activeView === 'analysis') {
    return (
      <AnalysisBoard
        initialFen={analysisParams?.fen}
        initialMoves={analysisParams?.moves}
        initialPgn={analysisParams?.pgn}
        boardTheme={settings.boardTheme}
        onExit={() => setActiveView('hub')}
      />
    );
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
          <button
            onClick={() => setIsGameArchiveOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-[#312e2b] hover:text-white"
            title="View Match History & Review Past Games"
          >
            <History className="h-3.5 w-3.5 text-[#81b64c]" />
            History
          </button>
          <button
            onClick={() => handleOpenAnalysis()}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-[#312e2b] hover:text-white"
            title="Open Free Analysis Sandbox & Board Editor"
          >
            <Compass className="h-3.5 w-3.5 text-sky-400" />
            Analysis
          </button>
          <button
            onClick={() => setActiveView('sandbox')}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-[#312e2b] hover:text-white"
            title="Open Position Sandbox & Handicap Odds"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Sandbox
          </button>

          {/* Multiplayer status & Chat trigger */}
          {settings.mode === 'multiplayer' && (
            <>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#81b64c]/10 border border-[#81b64c]/30 text-xs font-mono text-[#92c957]">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#81b64c]" />
                <span>{multiplayerRoomCode || 'Multiplayer'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMultiplayerChatOpen((o) => !o)}
                className="relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:bg-[#312e2b] hover:text-white"
                title="Open In-Game Match Chat"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#81b64c]" />
                <span>Chat</span>
                {multiplayerChatMessages.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#81b64c] text-white text-[10px] font-extrabold flex items-center justify-center">
                    {multiplayerChatMessages.length}
                  </span>
                )}
              </button>
            </>
          )}

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
            {settings.mode === 'vs-ai' && topPlayerColor !== playerColor && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                  AI Opponent • {topDetails.title || 'BOT'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsBotSelectorOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition"
                  title="Switch Opponent Bot"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Switch Bot</span>
                </button>
              </div>
            )}
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
            {settings.mode === 'vs-ai' && (
              <BotBanterBubble
                bot={getBotById(selectedBotId)}
                message={botBanterMessage}
                onDismiss={() => setBotBanterMessage(null)}
              />
            )}
            <CapturedPieces
              captured={topCaptured}
              opponentColor={topPlayerColor === 'w' ? 'b' : 'w'}
              materialAdvantage={topAdvantage}
            />
          </div>

          {/* Multiplayer Draw Offer Alert */}
          {settings.mode === 'multiplayer' && multiplayerDrawOffered && (
            <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-amber-950/80 border border-amber-500/50 text-xs text-amber-200 animate-bounce shadow-md">
              <div className="flex items-center gap-2 font-bold">
                <Users className="w-4 h-4 text-amber-400" />
                <span>{multiplayerOpponentName} offered a draw!</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    multiplayerManagerRef.current?.send({ type: 'draw_accept' });
                    setTermination('draw_agreement');
                    setWinner(null);
                    setIsGameOverModalOpen(true);
                    soundEngine.playGameOver(false);
                    archiveGame('draw_agreement', null);
                    setMultiplayerDrawOffered(false);
                  }}
                  className="px-2.5 py-1 rounded bg-[#81b64c] hover:bg-[#92c957] text-white font-bold text-[11px] transition shadow-xs"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => {
                    multiplayerManagerRef.current?.send({ type: 'draw_decline' });
                    setMultiplayerDrawOffered(false);
                  }}
                  className="px-2.5 py-1 rounded bg-[#312e2b] hover:bg-[#3d3a34] text-neutral-300 font-semibold text-[11px] transition"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Multiplayer Disconnect Alert */}
          {settings.mode === 'multiplayer' && multiplayerDisconnected && (
            <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 shadow-md">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>{multiplayerOpponentName} disconnected from the match.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  multiplayerManagerRef.current?.destroy();
                  setActiveView('hub');
                }}
                className="px-2.5 py-1 rounded bg-[#312e2b] hover:bg-[#3d3a34] text-white font-bold text-[11px] transition"
              >
                Return to Hub
              </button>
            </div>
          )}

          {/* Threat Radar Alert Banner */}
          {settings.threatRadar && threatRadarData?.hasThreats && (
            <div className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 animate-fade-in shadow-xs">
              <div className="flex items-center gap-1.5 font-semibold truncate">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{threatRadarData.summaryText}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-900/60 border border-rose-600/40 text-rose-300 uppercase tracking-wider shrink-0 ml-2">
                {settings.threatRadarDifficulty === 'hard' ? 'Hard Radar' : 'Easy Radar'}
              </span>
            </div>
          )}

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
                customHighlights={threatRadarData?.highlights}
                customArrows={threatRadarData?.arrows}
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
            threatRadarEnabled={!!settings.threatRadar}
            threatRadarDifficulty={settings.threatRadarDifficulty || 'easy'}
            onToggleThreatRadar={() =>
              setSettings((s) => ({ ...s, threatRadar: !s.threatRadar }))
            }
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
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#81b64c] mb-2">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Opening Theory</span>
                </div>
                {studyContext.openingWithVariations && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      studyContext.openingWithVariations.playstyle === 'Aggressive / Tactical'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : studyContext.openingWithVariations.playstyle === 'Solid / Defensive'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : studyContext.openingWithVariations.playstyle === 'Positional / Strategic'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {studyContext.openingWithVariations.playstyle === 'Aggressive / Tactical' && '⚔️'}
                    {studyContext.openingWithVariations.playstyle === 'Solid / Defensive' && '🛡️'}
                    {studyContext.openingWithVariations.playstyle === 'Positional / Strategic' && '♟️'}
                    {studyContext.openingWithVariations.playstyle === 'Dynamic / Counterattacking' && '⚡'}
                    <span>{studyContext.openingWithVariations.playstyle}</span>
                  </span>
                )}
              </div>

              {studyContext.openingWithVariations ? (
                <div className="space-y-2.5">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-semibold text-white text-base">
                        {studyContext.openingWithVariations.opening.name}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {studyContext.openingWithVariations.opening.eco}
                      </span>
                    </div>

                    {studyContext.openingWithVariations.activeVariation && (
                      <div className="mt-1 inline-flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                        <span>Active Line:</span>
                        <span>{studyContext.openingWithVariations.activeVariation.name}</span>
                      </div>
                    )}

                    <p className="mt-1.5 text-xs text-neutral-300 leading-relaxed">
                      {studyContext.openingWithVariations.opening.summary}
                    </p>
                  </div>

                  {/* Player Benefit ("What this opening does for you") */}
                  <div className="rounded-md bg-[#242921] border border-[#3b4334] p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                      What this opening does for you
                    </div>
                    <p className="mt-1 text-xs text-[#dce2d4] leading-relaxed">
                      {studyContext.openingWithVariations.playerBenefit}
                    </p>
                  </div>

                  {/* Key Ideas */}
                  <ul className="space-y-1 text-[11px] text-neutral-400">
                    {studyContext.openingWithVariations.opening.keyIdeas.map((idea) => (
                      <li key={idea} className="flex items-start gap-1.5">
                        <span className="text-[#81b64c]">•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Recommended Best Line & Next Best Move */}
                  <div className="rounded-md bg-[#141613] border border-[#2b3127] p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Recommended Best Line ({studyContext.openingWithVariations.bestLine.length} plies)
                      </span>
                      {studyContext.openingWithVariations.nextBestMove && (
                        <span className="inline-flex items-center gap-1 rounded bg-[#81b64c]/20 px-2 py-0.5 text-[10px] font-extrabold text-[#92c957] border border-[#81b64c]/40 animate-pulse">
                          Next: {studyContext.openingWithVariations.nextBestMove}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-medium text-neutral-200 tracking-wide leading-relaxed break-words">
                      {formatMoveSequence(studyContext.openingWithVariations.bestLine)}
                    </div>
                  </div>

                  {/* Candidate Variations inside the game */}
                  {studyContext.openingWithVariations.candidateVariations.length > 0 && (
                    <div className="border-t border-[#2d3229] pt-2 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-[#81b64c]" />
                          Variations ({studyContext.openingWithVariations.candidateVariations.length})
                        </span>
                        <span className="text-[9px] text-neutral-500">Tap to inspect</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedVariationId(null)}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                            selectedVariationId === null
                              ? 'bg-[#81b64c] text-[#161815] font-bold shadow-sm'
                              : 'bg-[#242921] text-neutral-300 hover:bg-[#2d342a]'
                          }`}
                        >
                          Main Line
                        </button>
                        {studyContext.openingWithVariations.candidateVariations.map((v) => {
                          const isActive = studyContext.openingWithVariations?.activeVariation?.id === v.id;
                          const isSelected = selectedVariationId === v.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setSelectedVariationId(v.id)}
                              className={`px-2 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#81b64c] text-[#161815] font-bold shadow-sm'
                                  : isActive
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-[#242921] text-neutral-300 hover:bg-[#2d342a]'
                              }`}
                            >
                              {isActive && <span className="text-[10px]">●</span>}
                              {v.name}
                            </button>
                          );
                        })}
                      </div>

                      {selectedVariationId && (() => {
                        const v = studyContext.openingWithVariations?.candidateVariations.find((item) => item.id === selectedVariationId);
                        if (!v) return null;
                        return (
                          <div className="rounded bg-[#1e231b] border border-[#343d2f] p-2 text-xs space-y-1 mt-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white">{v.name} ({v.eco})</span>
                              <span className="text-[10px] text-[#9db879] font-medium">{v.playstyle}</span>
                            </div>
                            <p className="text-[11px] text-neutral-300">{v.playerBenefit}</p>
                            <div className="text-[11px] font-mono text-[#b2ca7c] bg-[#141712] p-1.5 rounded">
                              {formatMoveSequence(v.moves)}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-neutral-400">
                  Play a few moves to detect an opening pattern, its tactical playstyle, best line, and variations.
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
        onOpenReview={handleOpenCurrentReview}
        onOpenShare={() => setIsSocialShareOpen(true)}
      />

      {/* Game Review Modal */}
      <GameReviewModal
        isOpen={isGameReviewOpen}
        onClose={() => setIsGameReviewOpen(false)}
        moves={reviewMoves}
        whiteName={reviewWhiteName}
        blackName={reviewBlackName}
        result={reviewResult}
        playerColor={reviewPlayerColor}
        onOpenAnalysis={(m) => handleOpenAnalysis(m)}
        onOpenShare={() => setIsSocialShareOpen(true)}
      />

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
        whiteName={getPlayerDetails('w').name}
        blackName={getPlayerDetails('b').name}
        result={winner === 'w' ? '1-0' : winner === 'b' ? '0-1' : termination !== 'in_progress' ? '1/2-1/2' : '*'}
        movesCount={history.length}
        openingName={studyContext.openingWithVariations?.opening.name}
        fen={fen}
      />

      {/* Bot Selector Modal */}
      <BotSelectorModal
        isOpen={isBotSelectorOpen}
        onClose={() => setIsBotSelectorOpen(false)}
        selectedBotId={selectedBotId}
        onSelectBot={(bot) => {
          setSelectedBotId(bot.id);
          setSettings((curr) => ({ ...curr, mode: 'vs-ai', aiDifficulty: bot.difficulty }));
          setBotBanterMessage(getRandomBanter(bot.quotes.start));
          startNewGame();
        }}
      />

      {/* Blunder Shield Alert Modal */}
      {blunderWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-pop-in">
          <div className="bg-[#24211d] border-2 border-rose-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 mx-auto flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Blunder Shield Alert</h3>
              <p className="text-xs text-rose-300 font-bold mt-1">
                {blunderWarning.message}
              </p>
              <p className="text-[11px] text-neutral-400 mt-2">
                Your move leaves a major piece undefended or allows immediate mate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setBlunderWarning(null)}
                className="py-2.5 px-3 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white text-xs font-bold transition shadow-sm"
              >
                Retract Move
              </button>
              <button
                onClick={() => {
                  const warn = blunderWarning;
                  setBlunderWarning(null);
                  blunderOverrideRef.current = true;
                  executeMove(warn.from, warn.to, warn.promotion);
                  blunderOverrideRef.current = false;
                }}
                className="py-2.5 px-3 rounded-xl bg-[#312e2b] hover:bg-[#3d3a34] text-neutral-300 text-xs font-semibold transition"
              >
                Play Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Archive Modal */}
      <GameArchiveModal
        isOpen={isGameArchiveOpen}
        onClose={() => setIsGameArchiveOpen(false)}
        onOpenReview={handleOpenArchivedReview}
      />

      {/* Multiplayer Matchmaking & Invite Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerModalOpen}
        onClose={() => setIsMultiplayerModalOpen(false)}
        onGameReady={handleMultiplayerGameReady}
        initialRoomCode={multiplayerInitialRoom}
      />

      {/* In-Game Multiplayer Chat Drawer */}
      {isMultiplayerChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 rounded-2xl bg-[#21201d] border border-[#3d3831] shadow-2xl flex flex-col overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="p-3 bg-[#2a2824] border-b border-[#312e2b] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <MessageSquare className="w-4 h-4 text-[#81b64c]" />
              <span>Match Chat • {multiplayerOpponentName}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMultiplayerChatOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="p-3 h-52 overflow-y-auto space-y-2 text-xs flex flex-col">
            {multiplayerChatMessages.length === 0 ? (
              <div className="text-center text-neutral-400 my-auto text-[11px]">
                No messages yet. Say hello or send a quick chat! 👋
              </div>
            ) : (
              multiplayerChatMessages.map((msg, i) => {
                const isMe = msg.sender === 'You';
                const isSystem = msg.sender === 'System';
                if (isSystem) {
                  return (
                    <div key={i} className="text-center text-[10px] text-amber-300/80 italic py-0.5">
                      {msg.text}
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className={`max-w-[80%] rounded-xl px-3 py-1.5 leading-snug ${
                      isMe
                        ? 'ml-auto bg-[#81b64c] text-white font-medium'
                        : 'mr-auto bg-[#312e2b] text-neutral-200'
                    }`}
                  >
                    {!isMe && (
                      <div className="text-[10px] text-neutral-400 font-bold mb-0.5">
                        {msg.sender}
                      </div>
                    )}
                    <div>{msg.text}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Chat Chips */}
          <div className="px-3 py-1.5 border-t border-[#312e2b] bg-[#1a1917] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {['Hello! 👋', 'Good luck! 🍀', 'Nice move! 🎯', 'Oops! 😅', 'Good game! 🤝'].map((quick) => (
              <button
                key={quick}
                type="button"
                onClick={() => handleSendMultiplayerChat(quick)}
                className="px-2 py-0.5 rounded-full bg-[#2a2824] hover:bg-[#36332e] text-neutral-300 hover:text-white shrink-0 border border-[#3d3831] transition"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Input & Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMultiplayerChat();
            }}
            className="p-2.5 bg-[#21201d] border-t border-[#312e2b] flex items-center gap-2"
          >
            <input
              type="text"
              value={multiplayerChatDraft}
              onChange={(e) => setMultiplayerChatDraft(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#141311] border border-[#312e2b] text-xs text-white focus:outline-hidden focus:border-[#81b64c]"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-[#81b64c] hover:bg-[#92c957] text-white transition shrink-0"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

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
