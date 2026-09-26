import React from 'react';
import { BookOpen, Lightbulb, Brain, ChevronRight } from 'lucide-react';
import { chessKnowledgeBase, KnowledgeCategory, getKnowledgeTopicsByCategory } from '../utils/chessKnowledgeBase';

interface KnowledgeBasePanelProps {
  selectedCategory?: KnowledgeCategory;
  onSelectCategory?: (category: KnowledgeCategory) => void;
}

const categoryLabels: Record<KnowledgeCategory, string> = {
  'opening-principles': 'Opening Principles',
  'positional-ideas': 'Positional Ideas',
  tactics: 'Tactics',
  endgame: 'Endgame',
  'checkmate-patterns': 'Checkmate Patterns',
};

export const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({
  selectedCategory = 'opening-principles',
  onSelectCategory,
}) => {
  const currentTopics = getKnowledgeTopicsByCategory(selectedCategory);

  return (
    <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <BookOpen className="w-4 h-4 text-[#81b64c]" />
        Chess Knowledge Base
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(categoryLabels) as KnowledgeCategory[]).map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory?.(category)}
            className={`rounded-lg border p-2 text-left text-[11px] font-bold uppercase tracking-wider transition ${
              selectedCategory === category
                ? 'border-[#81b64c] bg-[#312e2b] text-white'
                : 'border-[#312e2b] bg-[#1a1917] text-neutral-400 hover:border-[#4d4a45]'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {currentTopics.map((topic) => (
          <div key={topic.id} className="rounded-lg border border-[#312e2b] bg-[#1a1917] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-bold text-white">{topic.title}</div>
              <Lightbulb className="w-4 h-4 text-[#81b64c]" />
            </div>

            <p className="mt-2 text-xs leading-relaxed text-neutral-300">{topic.summary}</p>

            <div className="mt-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#81b64c]">
                <Brain className="w-3.5 h-3.5" />
                Why it matters
              </div>
              <p className="mt-1 text-xs text-neutral-300">{topic.whyItMatters}</p>
            </div>

            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Key ideas</div>
              <ul className="mt-1 space-y-1 text-xs text-neutral-300">
                {topic.keyIdeas.map((idea) => (
                  <li key={idea}>• {idea}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Practical examples</div>
              <ul className="mt-1 space-y-1 text-xs text-neutral-300">
                {topic.practicalExamples.map((example) => (
                  <li key={example}>• {example}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                <ChevronRight className="w-3.5 h-3.5" />
                Recommended reads
              </div>
              <div className="mt-1 text-[11px] text-neutral-300">
                {topic.recommendedBooks.join(' • ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
