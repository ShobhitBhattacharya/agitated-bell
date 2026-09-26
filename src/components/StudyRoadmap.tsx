import React from 'react';
import { Route, CheckCircle2, ArrowRight } from 'lucide-react';
import { getStudyRoadmap, getKnowledgeTopicById } from '../utils/chessKnowledgeBase';

interface StudyRoadmapProps {
  activeTopicId?: string | null;
  onSelectTopic?: (id: string) => void;
}

export const StudyRoadmap: React.FC<StudyRoadmapProps> = ({
  activeTopicId,
  onSelectTopic,
}) => {
  const roadmap = getStudyRoadmap();
  const activeTopic = activeTopicId ? getKnowledgeTopicById(activeTopicId) : null;

  return (
    <div className="rounded-xl border border-[#312e2b] bg-[#21201d] p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <Route className="w-4 h-4 text-[#81b64c]" />
        Study Roadmap
      </div>

      <div className="space-y-2">
        {roadmap.map((topic, index) => {
          const isActive = activeTopic?.id === topic.id;
          const isCompleted = activeTopic ? roadmap.findIndex((item) => item.id === activeTopic.id) > index : false;

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic?.(topic.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border p-2 text-left transition ${
                isActive
                  ? 'border-[#81b64c] bg-[#312e2b] text-white'
                  : 'border-[#312e2b] bg-[#1a1917] text-neutral-300 hover:border-[#4d4a45]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#312e2b] text-[10px] font-bold text-[#81b64c]">
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                </div>
                <span className="text-xs font-semibold">{topic.title}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
