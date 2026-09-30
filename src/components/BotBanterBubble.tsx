import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { BotPersonality } from '../utils/botPersonalities';

interface BotBanterBubbleProps {
  bot: BotPersonality;
  message: string | null;
  onDismiss: () => void;
}

export const BotBanterBubble: React.FC<BotBanterBubbleProps> = ({
  bot,
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div className="w-full flex items-center justify-start animate-fade-in my-1 z-10">
      <div className="relative max-w-md bg-[#25221e] border border-[#3b362e] text-neutral-200 p-2.5 sm:p-3 rounded-2xl rounded-tl-xs shadow-xl flex items-start gap-2.5 text-xs">
        <span className="text-xl select-none shrink-0">{bot.avatar}</span>
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-extrabold text-white text-[11px]">{bot.name}</span>
            <span className="text-[9px] font-bold text-neutral-500 uppercase">{bot.title}</span>
          </div>
          <p className="text-neutral-300 leading-snug font-medium italic">"{message}"</p>
        </div>
        <button
          onClick={onDismiss}
          className="absolute top-1.5 right-1.5 p-1 text-neutral-500 hover:text-neutral-300 transition"
          title="Dismiss message"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
