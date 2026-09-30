import React, { useMemo, useState } from 'react';
import {
  X,
  History,
  Trophy,
  Search,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  getArchivedGames,
  deleteArchivedGame,
  getArchiveStats,
  ArchivedGame,
} from '../utils/gameArchive';

interface GameArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReview: (game: ArchivedGame) => void;
}

export const GameArchiveModal: React.FC<GameArchiveModalProps> = ({
  isOpen,
  onClose,
  onOpenReview,
}) => {
  const [games, setGames] = useState<ArchivedGame[]>(getArchivedGames);
  const [query, setQuery] = useState('');

  const stats = useMemo(() => getArchiveStats(), [games]);

  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) =>
        g.whiteName.toLowerCase().includes(q) ||
        g.blackName.toLowerCase().includes(q) ||
        (g.openingName && g.openingName.toLowerCase().includes(q)) ||
        (g.openingEco && g.openingEco.toLowerCase().includes(q)) ||
        g.result.includes(q)
    );
  }, [games, query]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteArchivedGame(id)) {
      setGames(getArchivedGames());
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Match Archive"
    >
      <div className="mx-auto max-w-4xl rounded-xl border border-[#3b4334] bg-[#1a1e18] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#2e3529] px-4 py-3 sm:px-6 bg-[#21261f]">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[#b2ca7c]" />
            <h2 className="text-base font-extrabold text-white">Match History & Performance</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-[#2d3428] hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-[#374032] bg-[#222820] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Matches
              </span>
              <div className="mt-1 text-2xl font-black text-white">{stats.totalGames}</div>
            </div>
            <div className="rounded-lg border border-[#374032] bg-[#222820] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Win Rate
              </span>
              <div className="mt-1 text-2xl font-black text-[#b2ca7c]">{stats.winRate}%</div>
            </div>
            <div className="rounded-lg border border-[#374032] bg-[#222820] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Record (W/L/D)
              </span>
              <div className="mt-1 text-lg font-bold text-white">
                {stats.wins} / {stats.losses} / {stats.draws}
              </div>
            </div>
            <div className="rounded-lg border border-[#374032] bg-[#222820] p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Favorite Opening
              </span>
              <div className="mt-1 text-xs font-bold text-neutral-200 truncate" title={stats.favoriteOpening}>
                {stats.favoriteOpening}
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-lg border border-[#374032] bg-[#222820] px-3 py-2">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search matches by opponent, opening, or result..."
              className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          {/* Match list */}
          {filteredGames.length > 0 ? (
            <div className="space-y-2.5">
              {filteredGames.map((game) => {
                const isWin =
                  (game.result === '1-0' && game.playerColor === 'w') ||
                  (game.result === '0-1' && game.playerColor === 'b');
                const isDraw = game.result === '1/2-1/2';
                const resultColor = isDraw
                  ? 'bg-neutral-500/20 text-neutral-300 border-neutral-500/40'
                  : isWin
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40';

                const formattedDate = new Date(game.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      onOpenReview(game);
                      onClose();
                    }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#32392d] bg-[#20251e] p-3.5 hover:bg-[#282f25] hover:border-[#46533f] cursor-pointer transition shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${resultColor}`}>
                        {game.result}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {game.whiteName} vs {game.blackName}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            ({game.mode})
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#9db879]">
                          <span>{game.openingName || 'Standard Opening'}</span>
                          {game.openingEco && <span>({game.openingEco})</span>}
                          <span className="text-neutral-500">• {game.movesCount} plies</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2d3429]">
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenReview(game);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 rounded bg-[#b2ca7c] px-2.5 py-1 text-xs font-bold text-[#1b201a] hover:bg-[#c4d894] transition"
                        >
                          <Sparkles className="h-3 w-3" />
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(game.id, e)}
                          title="Delete game record"
                          className="rounded p-1 text-neutral-500 hover:text-rose-400 hover:bg-[#2d3429] transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-1">
              <p>No completed games in your archive yet.</p>
              <p className="text-[11px] text-neutral-500">
                Finished games will automatically be saved here with full Game Review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
