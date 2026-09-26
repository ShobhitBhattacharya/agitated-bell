import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { AdaptiveTrainerPrompt } from '../utils/studyTools';

interface AdaptiveTrainerProps {
  prompt: AdaptiveTrainerPrompt | null;
  onLoadLesson: () => void;
}

export const AdaptiveTrainer: React.FC<AdaptiveTrainerProps> = ({ prompt, onLoadLesson }) => {
  if (!prompt) return null;

  return (
    <div className="rounded-xl border border-[#81b64c]/40 bg-[#182217] p-3 shadow-lg shadow-[#81b64c]/10">
      <div className="flex items-center gap-2 text-sm font-bold text-[#d9f7a1]">
        <BrainCircuit className="w-4 h-4 text-[#81b64c]" />
        AI Trainer Insight
      </div>

      <div className="mt-2 text-base font-bold text-white">{prompt.title}</div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-300">{prompt.message}</p>

      <div className="mt-3 rounded-lg border border-[#81b64c]/30 bg-[#1f2d1e] p-2 text-[11px] text-neutral-200">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#d9f7a1]">
          <Sparkles className="w-3.5 h-3.5" />
          Drill suggestion
        </div>
        <p className="mt-1">{prompt.suggestedPractice}</p>
      </div>

      <button
        onClick={onLoadLesson}
        className="mt-3 w-full rounded-lg bg-[#81b64c] px-3 py-2 text-xs font-bold text-white hover:bg-[#92c957] transition"
      >
        Practice this pattern
      </button>
    </div>
  );
};
