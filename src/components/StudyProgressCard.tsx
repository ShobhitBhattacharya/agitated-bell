import React from 'react';
import { Trophy, Flame, BookOpenCheck } from 'lucide-react';
import { getStudyProgress, getStudyStreak } from '../utils/chessKnowledgeBase';

interface StudyProgressCardProps {
  completedTopics: string[];
}

export const StudyProgressCard: React.FC<StudyProgressCardProps> = ({ completedTopics }) => {
  const progress = getStudyProgress(completedTopics);
  const streak = getStudyStreak(completedTopics);

  return (
    <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3">
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <BookOpenCheck className="w-4 h-4 text-[#81b64c]" />
        Study Progress
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <Trophy className="w-3.5 h-3.5 text-[#81b64c]" />
            Completion
          </div>
          <div className="mt-2 text-lg font-bold text-white">{progress.completed}/{progress.total}</div>
          <div className="text-[10px] text-neutral-400">{progress.percent}% mastered</div>
        </div>

        <div className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
            Streak
          </div>
          <div className="mt-2 text-lg font-bold text-white">{streak}</div>
          <div className="text-[10px] text-neutral-400">concepts completed</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-neutral-400">
          <span>Overall progress</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#2b2723] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#81b64c] transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
