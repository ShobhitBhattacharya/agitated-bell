import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Play, Search, Sparkles } from 'lucide-react';
import { getKnowledgeTopicsByCategory } from '../utils/chessKnowledgeBase';
import { getTheoryLessonsByCategory } from '../utils/studyTools';
import { PuzzleRushPuzzle } from '../utils/puzzleRush';
import { getEndgameDrills } from '../utils/studyDrills';
import { StudyDrill } from './StudyDrill';

interface StudyLibraryProps {
  library: 'openings' | 'endgames';
  onExit: () => void;
}

export const StudyLibrary: React.FC<StudyLibraryProps> = ({ library, onExit }) => {
  const [query, setQuery] = useState('');
  const [activeDrill, setActiveDrill] = useState<
    | { kind: 'opening'; title: string; moves: string[] }
    | { kind: 'endgame'; title: string; puzzle: PuzzleRushPuzzle }
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
        }))
      : getKnowledgeTopicsByCategory('endgame').map((topic) => ({
          id: topic.id,
          title: topic.title,
          label: 'Endgame principles',
          summary: topic.summary,
          ideas: topic.keyIdeas,
          moves: topic.practicalExamples,
          objective: topic.whyItMatters,
        }));
    const normalized = query.trim().toLowerCase();
    return normalized
      ? source.filter((item) => `${item.title} ${item.summary} ${item.ideas.join(' ')}`.toLowerCase().includes(normalized))
      : source;
  }, [isOpenings, query]);
  const endgameDrills = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return getEndgameDrills().filter((puzzle) =>
      !normalized || `${puzzle.theme} ${puzzle.themes.join(' ')} ${puzzle.rating}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#171916] text-[#eceee7]">
      <header className="border-b border-[#343a32] bg-[#1e221d]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
          <button onClick={onExit} className="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-[#dce2d4] hover:bg-[#30372d]">
            <ArrowLeft className="h-4 w-4" /> Practice hub
          </button>
          <div className="text-sm font-bold text-white">Study library</div>
          <BookOpen className="h-5 w-5 text-[#b2ca7c]" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-[#343a32] pb-6 sm:flex-row sm:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#b2ca7c]">Theory and plans</div>
            <h1 className="mt-2 text-3xl font-extrabold text-white">{isOpenings ? 'Opening library' : 'Endgame library'}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#aeb5a5]">
              {isOpenings ? 'Explore practical opening ideas, model move orders, and what each setup is trying to achieve.' : 'Study the principles that turn simplified positions into clear plans and results.'}
            </p>
          </div>
          <label className="flex w-full items-center gap-2 rounded-md border border-[#454c40] bg-[#222720] px-3 py-2 sm:max-w-xs">
            <Search className="h-4 w-4 text-[#9da596]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#798171]" placeholder="Search this library" aria-label="Search library" />
          </label>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-[#373d35] bg-[#222720] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">{item.label}</div>
                  <h2 className="mt-2 text-lg font-bold text-white">{item.title}</h2>
                </div>
                <Sparkles className="mt-1 h-4 w-4 shrink-0 text-[#9db879]" />
              </div>
              <p className="mt-3 text-sm leading-6 text-[#bac1b4]">{item.summary}</p>
              <div className="mt-4 border-t border-[#373d35] pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9da596]">Why it works</div>
                <p className="mt-1 text-xs leading-5 text-[#c6ccbf]">{item.objective}</p>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-[#abb4a4]">
                {item.ideas.map((idea) => <li key={idea} className="flex gap-2"><span className="text-[#b2ca7c]">•</span>{idea}</li>)}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-3 rounded-md bg-[#1a1f19] px-3 py-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#929b89]">{isOpenings ? 'Model line' : 'Practical idea'}</span>
                <span className="text-right text-xs font-semibold text-[#e0e6d8]">{item.moves.join(' · ')}</span>
              </div>
              {isOpenings && (
                <button
                  type="button"
                  onClick={() => setActiveDrill({ kind: 'opening', title: item.title, moves: item.moves })}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#b2ca7c] px-3 py-2 text-xs font-extrabold text-[#20251b] hover:bg-[#c4d894]"
                >
                  <Play className="h-3.5 w-3.5" /> Practice this line
                </button>
              )}
            </article>
          ))}
        </div>
        {items.length === 0 && <p className="py-12 text-center text-sm text-[#9da596]">No topics match that search.</p>}
        {isOpenings && <div className="mt-6 flex items-center gap-2 text-xs text-[#85907e]"><ArrowRight className="h-3.5 w-3.5" /> Opening names and ECO ranges follow standard chess references.</div>}
        {!isOpenings && (
          <section className="mt-10 border-t border-[#343a32] pt-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#b2ca7c]">Position practice</div>
              <h2 className="mt-1 text-xl font-bold text-white">Endgame drills</h2>
              <p className="mt-2 text-sm text-[#aeb5a5]">Play from real, rated endgame positions. The opponent's forced reply follows your move.</p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {endgameDrills.map((puzzle) => (
                <article key={puzzle.id} className="flex items-center justify-between gap-4 rounded-lg border border-[#373d35] bg-[#222720] p-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#b2ca7c]">{puzzle.themes.filter((theme) => theme !== 'endgame' && theme !== 'short' && theme !== 'long').join(' · ') || 'Endgame tactics'}</div>
                    <div className="mt-1 text-sm font-bold text-white">{puzzle.rating} rated puzzle</div>
                    <div className="mt-1 text-[11px] text-[#929b89]">{puzzle.plays.toLocaleString()} plays · Lichess CC0</div>
                  </div>
                  <button type="button" onClick={() => setActiveDrill({ kind: 'endgame', title: puzzle.theme, puzzle })}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#60704e] px-3 py-2 text-xs font-bold text-[#dce7c9] hover:bg-[#30372d]">
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
          openingMoves={activeDrill.kind === 'opening' ? activeDrill.moves : undefined}
          puzzle={activeDrill.kind === 'endgame' ? activeDrill.puzzle : undefined}
          onClose={() => setActiveDrill(null)}
        />
      )}
    </div>
  );
};
