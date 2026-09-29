import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Play, Search, Sparkles, GitBranch } from 'lucide-react';
import {
  getTheoryLessonsByCategory,
  OpeningPlaystyle,
  OpeningVariation,
  formatMoveSequence,
} from '../utils/studyTools';
import { PuzzleRushPuzzle } from '../utils/puzzleRush';
import { getEndgameDrills, getEndgamePrincipleLessons } from '../utils/studyDrills';
import { StudyDrill } from './StudyDrill';

interface StudyLibraryProps {
  library: 'openings' | 'endgames';
  onExit: () => void;
}

export const StudyLibrary: React.FC<StudyLibraryProps> = ({ library, onExit }) => {
  const [query, setQuery] = useState('');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<OpeningPlaystyle | 'All'>('All');
  const [activeDrill, setActiveDrill] = useState<
    | {
        kind: 'opening';
        title: string;
        moves: string[];
        variations?: OpeningVariation[];
        initialVariationId?: string;
      }
    | {
        kind: 'endgame';
        title: string;
        puzzle?: PuzzleRushPuzzle;
        fen?: string;
        moves?: string[];
        explanation?: string;
      }
    | null
  >(null);
  const isOpenings = library === 'openings';

  const items = useMemo(() => {
    const source = isOpenings
      ? getTheoryLessonsByCategory('opening').map((lesson) => ({
          id: lesson.id,
          title: lesson.name,
          label: `${lesson.difficulty}${lesson.eco ? ` · ECO ${lesson.eco}` : ''}`,
          summary: lesson.summary,
          ideas: lesson.keyIdeas,
          moves: lesson.keyMoves,
          objective: lesson.objective,
          playstyle: lesson.playstyle,
          playerBenefit: lesson.playerBenefit,
          variations: lesson.variations ?? [],
          fen: undefined as string | undefined,
        }))
      : getEndgamePrincipleLessons().map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          label: `${lesson.difficulty} · ${lesson.concept}`,
          summary: lesson.summary,
          ideas: lesson.keyIdeas,
          moves: lesson.moves,
          objective: lesson.objective,
          playstyle: undefined as OpeningPlaystyle | undefined,
          playerBenefit: undefined as string | undefined,
          variations: [] as OpeningVariation[],
          fen: lesson.fen as string | undefined,
        }));

    const normalized = query.trim().toLowerCase();
    return source.filter((item) => {
      const matchesQuery =
        !normalized ||
        `${item.title} ${item.summary} ${item.ideas.join(' ')} ${item.playstyle ?? ''} ${
          item.playerBenefit ?? ''
        }`
          .toLowerCase()
          .includes(normalized);

      const matchesPlaystyle =
        !isOpenings ||
        selectedPlaystyle === 'All' ||
        item.playstyle === selectedPlaystyle;

      return matchesQuery && matchesPlaystyle;
    });
  }, [isOpenings, query, selectedPlaystyle]);

  const endgameDrills = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return getEndgameDrills().filter(
      (puzzle) =>
        !normalized ||
        `${puzzle.theme} ${puzzle.themes.join(' ')} ${puzzle.rating}`
          .toLowerCase()
          .includes(normalized)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#171916] text-[#eceee7]">
      <header className="border-b border-[#343a32] bg-[#1e221d]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[#dce2d4] hover:bg-[#30372d]"
          >
            <ArrowLeft className="h-4 w-4" /> Practice hub
          </button>
          <div className="text-sm font-bold text-white">Study library</div>
          <BookOpen className="h-5 w-5 text-[#b2ca7c]" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-[#343a32] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#b2ca7c]">
              Theory and plans
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-white">
              {isOpenings ? 'Opening library' : 'Endgame library'}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#aeb5a5]">
              {isOpenings
                ? 'Explore practical opening ideas, deep engine-proven lines (10–16 plies), player benefits, and branch variations.'
                : 'Study essential endgame techniques—from king opposition and passed pawns to rook principles—and practice them interactively.'}
            </p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-md border border-[#454c40] bg-[#222720] px-3 py-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-[#9da596]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#798171]"
              placeholder="Search by name, idea, or playstyle"
              aria-label="Search library"
            />
          </label>
        </div>

        {/* Playstyle Classification Filter Pills */}
        {isOpenings && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9da596] mr-1">
              Playstyle:
            </span>
            {(
              [
                'All',
                'Aggressive / Tactical',
                'Solid / Defensive',
                'Positional / Strategic',
                'Dynamic / Counterattacking',
              ] as const
            ).map((style) => {
              const allOpenings = getTheoryLessonsByCategory('opening');
              const count =
                style === 'All'
                  ? allOpenings.length
                  : allOpenings.filter((l) => l.playstyle === style).length;
              const isSelected = selectedPlaystyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => setSelectedPlaystyle(style)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition ${
                    isSelected
                      ? 'bg-[#b2ca7c] text-[#1b201a] shadow-sm'
                      : 'bg-[#222720] text-[#c6ccbf] border border-[#373d35] hover:bg-[#2b3228]'
                  }`}
                >
                  {style === 'Aggressive / Tactical' && '⚔️'}
                  {style === 'Solid / Defensive' && '🛡️'}
                  {style === 'Positional / Strategic' && '♟️'}
                  {style === 'Dynamic / Counterattacking' && '⚡'}
                  <span>{style === 'All' ? 'All Openings' : style}</span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-[#1b201a]/80' : 'text-[#85907e]'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-[#373d35] bg-[#222720] p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                        {item.label}
                      </span>
                      {item.playstyle && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            item.playstyle === 'Aggressive / Tactical'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : item.playstyle === 'Solid / Defensive'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : item.playstyle === 'Positional / Strategic'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          }`}
                        >
                          {item.playstyle === 'Aggressive / Tactical' && '⚔️'}
                          {item.playstyle === 'Solid / Defensive' && '🛡️'}
                          {item.playstyle === 'Positional / Strategic' && '♟️'}
                          {item.playstyle === 'Dynamic / Counterattacking' && '⚡'}
                          <span>{item.playstyle}</span>
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-xl font-bold text-white">{item.title}</h2>
                  </div>
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#9db879]" />
                </div>

                <p className="mt-3 text-sm leading-6 text-[#bac1b4]">{item.summary}</p>

                {/* What this opening does for you (Player Benefit) */}
                <div className="mt-4 rounded-md bg-[#191d17] border border-[#2d3428] p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                    {isOpenings ? 'What this opening does for you' : 'Why it works'}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#dce2d4]">
                    {item.playerBenefit || item.objective}
                  </p>
                </div>

                <ul className="mt-3 space-y-1 text-xs text-[#abb4a4]">
                  {item.ideas.map((idea) => (
                    <li key={idea} className="flex gap-2">
                      <span className="text-[#b2ca7c]">•</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>

                {/* Model Best Line */}
                <div className="mt-4 rounded-md bg-[#161a14] border border-[#2b3227] p-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#929b89]">
                    <span>{isOpenings ? `Best Line (${item.moves.length} plies)` : 'Technique moves'}</span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-[#e0e6d8] break-words leading-relaxed">
                    {isOpenings ? formatMoveSequence(item.moves) : item.moves.join(' · ')}
                  </div>
                </div>

                {/* Variations Preview (if any) */}
                {isOpenings && item.variations.length > 0 && (
                  <div className="mt-4 rounded-md bg-[#1c221a] border border-[#323c2d] p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                      <GitBranch className="h-3 w-3" />
                      <span>Key Variations ({item.variations.length})</span>
                    </div>
                    <div className="space-y-2">
                      {item.variations.map((v) => (
                        <div
                          key={v.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded bg-[#151913] p-2 text-xs border border-[#283124]"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{v.name}</span>
                              <span className="text-[10px] text-[#8fa372]">{v.eco}</span>
                              <span className="text-[10px] font-medium text-neutral-400">
                                · {v.playstyle}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-[#a4ad9d] line-clamp-1">
                              {v.playerBenefit}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveDrill({
                                kind: 'opening',
                                title: item.title,
                                moves: item.moves,
                                variations: item.variations,
                                initialVariationId: v.id,
                              })
                            }
                            className="inline-flex shrink-0 items-center gap-1 rounded bg-[#2b3526] px-2 py-1 text-[11px] font-bold text-[#b2ca7c] hover:bg-[#394732] transition"
                          >
                            <Play className="h-3 w-3" /> Practice
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() =>
                    isOpenings
                      ? setActiveDrill({
                          kind: 'opening',
                          title: item.title,
                          moves: item.moves,
                          variations: item.variations,
                        })
                      : setActiveDrill({
                          kind: 'endgame',
                          title: item.title,
                          fen: item.fen,
                          moves: item.moves,
                          explanation: item.summary,
                        })
                  }
                  className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-[#b2ca7c] px-4 py-2.5 text-xs font-extrabold text-[#20251b] hover:bg-[#c4d894] transition shadow"
                >
                  <Play className="h-3.5 w-3.5" />{' '}
                  {isOpenings ? 'Practice Best Line' : 'Practice this drill'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-12 text-center text-sm text-[#9da596]">No topics match that search or playstyle filter.</p>
        )}

        {isOpenings && (
          <div className="mt-6 flex items-center gap-2 text-xs text-[#85907e]">
            <ArrowRight className="h-3.5 w-3.5" /> Opening lines (10–16 plies) and ECO ranges follow tournament standards.
          </div>
        )}

        {!isOpenings && (
          <section className="mt-10 border-t border-[#343a32] pt-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#b2ca7c]">
                Tactical Endgame Puzzles
              </div>
              <h2 className="mt-1 text-xl font-bold text-white">Rated Endgame Positions</h2>
              <p className="mt-2 text-sm text-[#aeb5a5]">
                Solve real-game positions with forcing tactical motifs. The opponent's forced reply follows your move.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {endgameDrills.map((puzzle) => (
                <article
                  key={puzzle.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-4"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">
                      {puzzle.themes
                        .filter(
                          (theme) => theme !== 'endgame' && theme !== 'short' && theme !== 'long'
                        )
                        .join(' · ') || 'Endgame tactics'}
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">{puzzle.rating} rated puzzle</div>
                    <div className="mt-1 text-[11px] text-[#929b89]">
                      {puzzle.plays.toLocaleString()} plays · Lichess CC0
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDrill({ kind: 'endgame', title: puzzle.theme, puzzle })}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#60704e] px-3 py-2 text-xs font-bold text-[#dce7c9] hover:bg-[#30372d] transition"
                  >
                    <Play className="h-3.5 w-3.5" /> Practice
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {activeDrill && (
        <StudyDrill
          kind={activeDrill.kind}
          title={activeDrill.title}
          openingMoves={activeDrill.moves}
          variations={activeDrill.kind === 'opening' ? activeDrill.variations : undefined}
          initialVariationId={activeDrill.kind === 'opening' ? activeDrill.initialVariationId : undefined}
          initialFen={activeDrill.kind === 'endgame' ? activeDrill.fen : undefined}
          puzzle={activeDrill.kind === 'endgame' ? activeDrill.puzzle : undefined}
          explanation={activeDrill.kind === 'endgame' ? activeDrill.explanation : undefined}
          onClose={() => setActiveDrill(null)}
        />
      )}
    </div>
  );
};
