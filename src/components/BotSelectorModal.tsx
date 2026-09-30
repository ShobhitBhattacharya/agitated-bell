import React from 'react';
import { Bot, Swords, X, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { BOT_LIST, BotPersonality, BotPersonalityId } from '../utils/botPersonalities';

interface BotSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBotId: BotPersonalityId;
  onSelectBot: (bot: BotPersonality) => void;
}

export const BotSelectorModal: React.FC<BotSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedBotId,
  onSelectBot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#21201d] border border-[#312e2b] rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#81b64c] flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">Select AI Bot Opponent</h2>
            <p className="text-xs text-neutral-400">Choose a distinct chess personality and tactical playstyle</p>
          </div>
        </div>

        {/* Bot Cards List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {BOT_LIST.map((bot) => {
            const isSelected = selectedBotId === bot.id;

            return (
              <div
                key={bot.id}
                onClick={() => {
                  onSelectBot(bot);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition cursor-pointer relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-[#2b2723] border-[#81b64c] shadow-md'
                    : 'bg-[#1a1916] border-[#312e2b] hover:bg-[#252320] hover:border-neutral-600'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="text-4xl select-none p-1.5 rounded-xl bg-[#262420] border border-[#38352e] shrink-0">
                    {bot.avatar}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white">{bot.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bot.colorBadge}`}>
                        {bot.title}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">~{bot.rating} ELO</span>
                    </div>

                    <p className="text-xs text-neutral-300 font-medium leading-relaxed">{bot.bio}</p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        Repertoire:
                      </span>
                      {bot.openings.map((op, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#2e2b26] text-neutral-300 border border-[#3b3731]"
                        >
                          {op}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-[#81b64c] text-white shadow-md'
                      : 'bg-[#2e2b26] text-neutral-300 group-hover:bg-[#81b64c] group-hover:text-white'
                  }`}
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Active Bot' : 'Challenge'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
