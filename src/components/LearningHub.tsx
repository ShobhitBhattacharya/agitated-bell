import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  Crown,
  Flame,
  GraduationCap,
  Layers3,
  Play,
  Swords,
  Timer,
  History,
  Compass,
  Target,
  Bot,
  Users,
  Sparkles,
} from 'lucide-react';
import { AiDifficulty } from '../types/chess';

interface LearningHubProps {
  onStartGame: (difficulty: AiDifficulty) => void;
  onStartPuzzleRush: (rating: number) => void;
  onOpenLibrary: (library: 'openings' | 'endgames') => void;
  onOpenArchive?: () => void;
  onOpenAnalysis?: () => void;
  onOpenVisionTrainer?: () => void;
  onOpenBotSelector?: () => void;
  onOpenSandbox?: () => void;
  onOpenMultiplayer?: () => void;
}

const opponents: { difficulty: AiDifficulty; name: string; elo: number; style: string; color: string }[] = [
  { difficulty: 'easy', name: 'Milo', elo: 800, style: 'Learning', color: 'border-emerald-700/70' },
  { difficulty: 'medium', name: 'Ada', elo: 1400, style: 'Club player', color: 'border-sky-700/70' },
  { difficulty: 'hard', name: 'Magnus', elo: 1800, style: 'Advanced', color: 'border-amber-700/70' },
  { difficulty: 'master', name: 'The Captain', elo: 2100, style: 'Expert', color: 'border-rose-800/70' },
];

const rushLevels = [
  { rating: 800, label: 'Starter', range: 'Target ~800' },
  { rating: 1400, label: 'Club', range: 'Target ~1,400' },
  { rating: 2400, label: 'Advanced', range: 'Target ~2,400' },
];

export const LearningHub: React.FC<LearningHubProps> = ({
  onStartGame,
  onStartPuzzleRush,
  onOpenLibrary,
  onOpenArchive,
  onOpenAnalysis,
  onOpenVisionTrainer,
  onOpenBotSelector,
  onOpenSandbox,
  onOpenMultiplayer,
}) => {
  const [selectedRushRating, setSelectedRushRating] = useState(800);

  return (
    <div className="min-h-screen bg-[#171916] text-[#eceee7]">
      <header className="border-b border-[#343a32] bg-[#1e221d]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#a9c56b] text-[#20251b]">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold tracking-wide text-white">Chess Master</div>
              <div className="text-xs text-[#aeb5a5]">Play better, one decision at a time</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {onOpenMultiplayer && (
              <button
                type="button"
                onClick={onOpenMultiplayer}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#81b64c]/40 bg-[#81b64c]/20 px-3 py-1.5 text-xs font-bold text-[#92c957] hover:bg-[#81b64c]/30 transition shadow-xs"
              >
                <Users className="h-3.5 w-3.5" />
                <span>Play Friend</span>
              </button>
            )}
            {onOpenSandbox && (
              <button
                type="button"
                onClick={onOpenSandbox}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/40 bg-amber-950/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/40 transition shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Board Sandbox</span>
              </button>
            )}
            {onOpenVisionTrainer && (
              <button
                type="button"
                onClick={onOpenVisionTrainer}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/40 bg-amber-950/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-900/40 transition shadow-xs"
              >
                <Target className="h-3.5 w-3.5 text-amber-400" />
                <span>Vision Trainer</span>
              </button>
            )}
            {onOpenAnalysis && (
              <button
                type="button"
                onClick={onOpenAnalysis}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#3b4334] bg-[#222720] px-3 py-1.5 text-xs font-bold text-[#dce2d4] hover:bg-[#2e352b] transition shadow-xs"
              >
                <Compass className="h-3.5 w-3.5 text-sky-400" />
                <span>Analysis Board</span>
              </button>
            )}
            {onOpenArchive && (
              <button
                type="button"
                onClick={onOpenArchive}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#3b4334] bg-[#222720] px-3 py-1.5 text-xs font-bold text-[#dce2d4] hover:bg-[#2e352b] transition shadow-xs"
              >
                <History className="h-3.5 w-3.5 text-[#b2ca7c]" />
                <span>Match History</span>
              </button>
            )}
            <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#abb3a3] sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#a9c56b]" />
              Study room
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pt-12">
        <section className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#b2ca7c]">
              <span className="h-px w-8 bg-[#b2ca7c]" />
              Your chess practice
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Make your next move
              <span className="block text-[#b2ca7c]">a better one.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#b5bcb0] sm:text-base">
              Play a rated-feel game, sharpen your tactics, or study the ideas behind the position.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-[#373d35] bg-[#373d35]">
            <div className="bg-[#222720] p-3 text-center">
              <div className="text-xl font-extrabold text-white">4</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[#aeb5a5]">AI levels</div>
            </div>
            <div className="bg-[#222720] p-3 text-center">
              <div className="text-xl font-extrabold text-white">2</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[#aeb5a5]">Study paths</div>
            </div>
            <div className="bg-[#222720] p-3 text-center">
              <div className="text-xl font-extrabold text-white">Rush</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[#aeb5a5]">Timed tactics</div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="relative overflow-hidden rounded-lg border border-[#596345] bg-[#283126] p-5 sm:p-7">
            <div className="absolute -right-6 -top-10 select-none font-serif text-[190px] leading-none text-[#b0ca7a]/[0.07]" aria-hidden="true">♞</div>
            <div className="relative max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c5db98]">
                <Flame className="h-4 w-4" />
                Puzzle Rush
              </div>
              <h2 className="mt-3 text-2xl font-bold text-white">How many can you solve?</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#c2cbb8]">
                Race the clock, solve tactical positions, and build a streak. Pick a starting level.
              </p>
              <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Puzzle starting level">
                {rushLevels.map((level) => (
                  <button
                    key={level.rating}
                    type="button"
                    aria-pressed={selectedRushRating === level.rating}
                    onClick={() => setSelectedRushRating(level.rating)}
                    className={`rounded-md border px-3 py-2 text-left transition ${selectedRushRating === level.rating ? 'border-[#b2ca7c] bg-[#b2ca7c] text-[#20251b]' : 'border-[#52604a] bg-[#20271f] text-[#e0e7d7] hover:border-[#b2ca7c]'}`}
                  >
                    <span className="block text-xs font-bold">{level.label}</span>
                    <span className="mt-0.5 block text-[10px] opacity-75">{level.range}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onStartPuzzleRush(selectedRushRating)}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#b2ca7c] px-4 py-3 text-sm font-extrabold text-[#20251b] transition hover:bg-[#c4d894]"
              >
                <Timer className="h-4 w-4" /> Start Puzzle Rush <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </article>

          <article className="rounded-lg border border-[#373d35] bg-[#222720] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b2ca7c]">
                  <Swords className="h-4 w-4" /> Play the computer
                </div>
                <h2 className="mt-2 text-xl font-bold text-white">Choose your opponent</h2>
              </div>
              <div className="flex items-center gap-2">
                {onOpenBotSelector && (
                  <button
                    type="button"
                    onClick={onOpenBotSelector}
                    className="inline-flex items-center gap-1.5 rounded-md border border-amber-600/40 bg-amber-950/40 px-2.5 py-1 text-xs font-bold text-amber-300 hover:bg-amber-900/50 transition shadow-xs"
                    title="Select Bot Personality"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>Bots</span>
                  </button>
                )}
                <Brain className="h-7 w-7 text-[#6f7e63]" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {opponents.map((opponent) => (
                <button
                  key={opponent.difficulty}
                  type="button"
                  onClick={() => onStartGame(opponent.difficulty)}
                  className={`group rounded-md border ${opponent.color} bg-[#1b201b] p-3 text-left transition hover:bg-[#2c3429]`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{opponent.name}</span>
                    <ChevronRight className="h-4 w-4 text-[#aeb5a5] transition group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-1 text-xs text-[#aeb5a5]">~{opponent.elo} ELO</div>
                  <div className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#8f9b86]">{opponent.style}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] leading-5 text-[#8f998a]">
              <Play className="h-3.5 w-3.5 shrink-0" /> Ratings are approximate strength bands, not official ratings.
            </div>
          </article>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#b2ca7c]">Build your understanding</div>
              <h2 className="mt-1 text-xl font-bold text-white">Study library</h2>
            </div>
            <GraduationCap className="h-6 w-6 text-[#7f8d72]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => onOpenLibrary('openings')}
              className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-[#859b67] hover:bg-[#282f26]"
            >
              <span className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#374333] text-[#c1d795]"><BookOpen className="h-5 w-5" /></span>
                <span>
                  <span className="block text-base font-bold text-white">Opening library</span>
                  <span className="mt-1 block text-sm text-[#aeb5a5]">Plans, key moves, and ideas for both colors.</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => onOpenLibrary('endgames')}
              className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-[#859b67] hover:bg-[#282f26]"
            >
              <span className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#3a3e36] text-[#e0c38a]"><Layers3 className="h-5 w-5" /></span>
                <span>
                  <span className="block text-base font-bold text-white">Endgame library</span>
                  <span className="mt-1 block text-sm text-[#aeb5a5]">King activity, pawn races, and conversion.</span>
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
            </button>
            {onOpenSandbox && (
              <button
                type="button"
                onClick={onOpenSandbox}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-amber-500/60 hover:bg-[#282720]"
              >
                <span className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-950/60 border border-amber-600/30 text-amber-400">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-white">Board Sandbox & Odds</span>
                    <span className="mt-1 block text-sm text-[#aeb5a5]">Piece palette, Knight/Rook handicap, & drills.</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
              </button>
            )}
            {onOpenMultiplayer && (
              <button
                type="button"
                onClick={onOpenMultiplayer}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-[#81b64c]/60 hover:bg-[#202720]"
              >
                <span className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#81b64c]/20 border border-[#81b64c]/30 text-[#92c957]">
                    <Users className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-white">Play with a Friend</span>
                    <span className="mt-1 block text-sm text-[#aeb5a5]">Live P2P room code matches • Zero backend lag.</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
              </button>
            )}
            {onOpenAnalysis && (
              <button
                type="button"
                onClick={onOpenAnalysis}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-sky-500/60 hover:bg-[#20272b]"
              >
                <span className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-sky-950/60 border border-sky-600/30 text-sky-400">
                    <Compass className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-white">Analysis Sandbox</span>
                    <span className="mt-1 block text-sm text-[#aeb5a5]">Deep engine minimax eval & PGN import.</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
              </button>
            )}
            {onOpenVisionTrainer && (
              <button
                type="button"
                onClick={onOpenVisionTrainer}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-5 text-left transition hover:border-amber-500/60 hover:bg-[#282720]"
              >
                <span className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-950/60 border border-amber-600/30 text-amber-400">
                    <Target className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-base font-bold text-white">Coordinate Vision</span>
                    <span className="mt-1 block text-sm text-[#aeb5a5]">30s drill to master board squares & notation.</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#aeb5a5] transition group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </section>

        <footer className="mt-10 flex flex-col gap-2 border-t border-[#343a32] pt-4 text-[11px] text-[#838d7d] sm:flex-row sm:items-center sm:justify-between">
          <span>Chess Master · Practice built around the ideas behind the moves</span>
          <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> Lichess puzzle examples are CC0</span>
        </footer>
      </main>
    </div>
  );
};
