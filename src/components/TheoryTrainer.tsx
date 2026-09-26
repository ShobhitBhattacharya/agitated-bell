import React from 'react';
import { BookOpen, CheckCircle2, Sparkles, Target } from 'lucide-react';
import { TheoryLesson } from '../utils/studyTools';

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
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0] ?? null;
  const currentLessonProgress = Math.min(progress, activeLesson?.keyMoves.length ?? 0);
  const progressPercent = activeLesson
    ? (currentLessonProgress / activeLesson.keyMoves.length) * 100
    : 0;

  return (
    <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <BookOpen className="w-4 h-4 text-[#81b64c]" />
          Chess Theory Trainer
        </div>
        {activeLesson && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#81b64c]">
            {activeLesson.difficulty}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className={`rounded-lg border p-2 text-left transition ${
              activeLesson?.id === lesson.id
                ? 'border-[#81b64c] bg-[#312e2b] text-white'
                : 'border-[#312e2b] bg-[#1a1917] text-neutral-300 hover:border-[#4d4a45]'
            }`}
          >
            <div className="text-[11px] font-bold uppercase text-[#81b64c]">{lesson.category}</div>
            <div className="mt-1 text-sm font-semibold">{lesson.name}</div>
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
            <span className="font-semibold text-neutral-300">Sequence:</span> {activeLesson.keyMoves.join(' • ')}
          </div>

          <div className="mt-3 text-[11px] text-neutral-400">
            <span className="font-semibold text-neutral-300">Current board:</span> {currentMoves.length > 0 ? currentMoves.join(' • ') : 'No moves yet'}
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
