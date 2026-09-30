import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, GitBranch, Sparkles, Target } from 'lucide-react';
import { OpeningPlaystyle, TheoryLesson } from '../utils/studyTools';

interface TheoryTrainerProps {
  lessons: TheoryLesson[];
  activeLessonId: string | null;
  selectedCategory: 'opening' | 'checkmate-pattern';
  progress: number;
  currentMoves: string[];
  lessonTargetMove?: string | null;
  lessonSolved?: boolean;
  onSelectLesson: (id: string) => void;
  onLoadLessonPosition?: () => void;
}

const PLAYSTYLE_OPTIONS: { label: string; value: 'All' | OpeningPlaystyle }[] = [
  { label: 'All Styles', value: 'All' },
  { label: '⚔️ Aggressive', value: 'Aggressive / Tactical' },
  { label: '🛡️ Defensive', value: 'Solid / Defensive' },
  { label: '♟️ Positional', value: 'Positional / Strategic' },
  { label: '⚡ Dynamic', value: 'Dynamic / Counterattacking' },
];

export const TheoryTrainer: React.FC<TheoryTrainerProps> = ({
  lessons,
  activeLessonId,
  selectedCategory,
  progress,
  currentMoves,
  lessonTargetMove,
  lessonSolved,
  onSelectLesson,
  onLoadLessonPosition,
}) => {
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<'All' | OpeningPlaystyle>('All');
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);

  const filteredLessons = useMemo(() => {
    if (selectedCategory !== 'opening' || selectedPlaystyle === 'All') return lessons;
    return lessons.filter((l) => l.playstyle === selectedPlaystyle);
  }, [lessons, selectedCategory, selectedPlaystyle]);

  const activeLesson = useMemo(() => {
    const found = lessons.find((lesson) => lesson.id === activeLessonId);
    if (found) return found;
    return filteredLessons[0] ?? lessons[0] ?? null;
  }, [lessons, activeLessonId, filteredLessons]);

  const activeVariation = useMemo(() => {
    if (!selectedVariationId || !activeLesson?.variations) return null;
    return activeLesson.variations.find((v) => v.id === selectedVariationId) ?? null;
  }, [selectedVariationId, activeLesson]);

  const displayedMoves = activeVariation ? activeVariation.moves : (activeLesson?.keyMoves ?? []);
  const currentLessonProgress = Math.min(progress, displayedMoves.length);
  const progressPercent = displayedMoves.length > 0
    ? (currentLessonProgress / displayedMoves.length) * 100
    : 0;

  return (
    <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <BookOpen className="w-4 h-4 text-[#81b64c]" />
          Chess Theory Trainer
        </div>
        {activeLesson && (
          <div className="flex items-center gap-1.5">
            {activeLesson.playstyle && (
              <span className="rounded bg-neutral-800 border border-neutral-700/80 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-300">
                {activeLesson.playstyle}
              </span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#81b64c]">
              {activeLesson.difficulty}
            </span>
          </div>
        )}
      </div>

      {/* Playstyle Filter Buttons */}
      {selectedCategory === 'opening' && (
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#81b64c]">
            Filter by Playstyle
          </div>
          <div className="flex flex-wrap gap-1">
            {PLAYSTYLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSelectedPlaystyle(opt.value);
                  setSelectedVariationId(null);
                  if (opt.value !== 'All') {
                    const match = lessons.find((l) => l.playstyle === opt.value);
                    if (match) onSelectLesson(match.id);
                  }
                }}
                className={`rounded px-2 py-0.5 text-[11px] font-semibold transition ${
                  selectedPlaystyle === opt.value
                    ? 'bg-[#81b64c] text-[#1b201a] font-bold shadow'
                    : 'bg-[#1a1917] text-neutral-400 border border-[#312e2b] hover:text-white hover:border-[#4d4a45]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-0.5">
        {filteredLessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => {
              setSelectedVariationId(null);
              onSelectLesson(lesson.id);
            }}
            className={`rounded-lg border p-2 text-left transition ${
              activeLesson?.id === lesson.id
                ? 'border-[#81b64c] bg-[#312e2b] text-white'
                : 'border-[#312e2b] bg-[#1a1917] text-neutral-300 hover:border-[#4d4a45]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#81b64c]">{lesson.category}</span>
              {lesson.eco && <span className="text-[9px] text-neutral-400 font-mono">{lesson.eco}</span>}
            </div>
            <div className="mt-1 text-sm font-semibold truncate">{lesson.name}</div>
            {lesson.playstyle && (
              <div className="mt-0.5 text-[10px] text-neutral-400 truncate">{lesson.playstyle}</div>
            )}
          </button>
        ))}
      </div>

      {activeLesson && (
        <div className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#81b64c]">
              <Target className="w-3.5 h-3.5" />
              Lesson focus
            </div>
            <div className="text-[10px] text-neutral-400">
              {currentLessonProgress}/{activeLesson.keyMoves.length} moves known
            </div>
          </div>

          <div className="mt-3 text-lg font-bold text-white">{activeLesson.name}</div>
          <div className="mt-1 text-xs text-neutral-400">{activeLesson.summary}</div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-400">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#2b2723] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#81b64c] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              <Sparkles className="w-3.5 h-3.5 text-[#81b64c]" />
              Objective
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">{activeLesson.objective}</p>
          </div>

          {/* Variations Selector */}
          {activeLesson.variations && activeLesson.variations.length > 0 && (
            <div className="mt-3 space-y-1.5 rounded-lg border border-[#312e2b] bg-[#22201d] p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#81b64c]">
                <GitBranch className="w-3.5 h-3.5" />
                <span>Explore Variations ({activeLesson.variations.length})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedVariationId(null)}
                  className={`rounded px-2 py-0.5 text-xs font-semibold transition ${
                    selectedVariationId === null
                      ? 'bg-[#81b64c] text-[#1b201a] font-bold'
                      : 'bg-[#1a1917] text-neutral-300 border border-[#312e2b] hover:bg-[#2d2a26]'
                  }`}
                >
                  Main Best Line
                </button>
                {activeLesson.variations.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariationId(v.id)}
                    className={`rounded px-2 py-0.5 text-xs font-semibold transition flex items-center gap-1 ${
                      selectedVariationId === v.id
                        ? 'bg-[#81b64c] text-[#1b201a] font-bold'
                        : 'bg-[#1a1917] text-neutral-300 border border-[#312e2b] hover:bg-[#2d2a26]'
                    }`}
                  >
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>

              {activeVariation && (
                <div className="mt-2 space-y-1 rounded bg-[#1a1917] p-2 border border-[#312e2b]">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>{activeVariation.name}</span>
                    <span className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-semibold text-[#81b64c]">
                      {activeVariation.playstyle}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#81b64c] font-semibold">What this does for your gameplay:</div>
                  <p className="text-xs text-neutral-300 leading-relaxed">{activeVariation.playerBenefit}</p>
                </div>
              )}
            </div>
          )}

          {/* Player Benefit callout for Main Line */}
          {!activeVariation && activeLesson.playerBenefit && (
            <div className="mt-3 rounded-lg border border-[#312e2b] bg-[#22201d] p-2.5 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#81b64c]">
                Why choose this opening (Player Advantage):
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {activeLesson.playerBenefit}
              </p>
            </div>
          )}

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#81b64c]" />
              Key ideas
            </div>
            <ul className="space-y-1 text-xs text-neutral-300">
              {activeLesson.keyIdeas.map((idea) => (
                <li key={idea}>• {idea}</li>
              ))}
            </ul>
          </div>

          <div className="mt-3 text-[11px] text-neutral-400">
            <span className="font-semibold text-neutral-300">
              {activeVariation ? `${activeVariation.name} Line:` : 'Sequence:'}
            </span>{' '}
            {displayedMoves.join(' • ')}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400">
            <span className="font-semibold text-neutral-300">Current board:</span>{' '}
            {currentMoves.length > 0 ? currentMoves.join(' • ') : 'No moves yet'}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-[#312e2b] bg-[#1a1917] p-2">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400">Lesson target</div>
              <div className="mt-1 text-sm font-semibold text-white">{lessonTargetMove ?? '—'}</div>
            </div>
            <button
              onClick={onLoadLessonPosition}
              className="rounded-lg bg-[#81b64c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#92c957]"
            >
              {lessonSolved ? 'Replay drill' : 'Load drill'}
            </button>
          </div>

          {lessonSolved && (
            <div className="mt-2 rounded-lg border border-[#81b64c]/50 bg-[#81b64c]/10 px-2 py-1.5 text-xs font-semibold text-[#d4f4a4]">
              Great job — you found the key move in this lesson.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
