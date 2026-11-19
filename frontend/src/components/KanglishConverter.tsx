import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Heart,
  Search,
} from 'lucide-react';
import { KANGLISH_DICTIONARY, lookupKanglish, KanglishMapping } from '../core/kanglish';
import { ttsEngine } from '../core/ttsEngine';

interface KanglishConverterProps {
  onOpenXRay: (word: string) => void;
}

export const KanglishConverter: React.FC<KanglishConverterProps> = ({ onOpenXRay }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<KanglishMapping[]>(KANGLISH_DICTIONARY);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setResults(lookupKanglish(term));
  };

  const playAudio = (text: string) => {
    ttsEngine.speakWordWithAlignment(text, [], { rate: 0.85 });
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-5 shadow-hud flex flex-col gap-5 text-slate-100">
      {/* Welcoming Banner */}
      <div className="bg-gradient-to-r from-rajyotsava-gold/15 via-space-850 to-rajyotsava-crimson/20 border border-rajyotsava-gold/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rajyotsava-gold/20 flex items-center justify-center text-rajyotsava-gold border border-rajyotsava-gold/40">
            <Heart className="w-5 h-5 fill-rajyotsava-gold text-rajyotsava-gold" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>ಕಾಂಗ್ಲಿಷ್ ನಿಂದ ಕನ್ನಡ | Kanglish to Kannada</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                ಸಂತಸದಿಂದ ಕಲಿಯಿರಿ (Welcome!)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Type Roman-script phrases like "bisi bele bath" or "swalpa adjust maadi" to see the beautiful native script.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-rajyotsava-gold bg-space-950/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          "ಕನ್ನಡ ಕಲಿಯಲು ಪ್ರೀತಿ ಸಾಕು"
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Type Kanglish (e.g. 'namma metro', 'oota aayitha', 'masale dose', 'adjust maadi')..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-space-950 border border-slate-800 focus:border-rajyotsava-gold text-sm text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* Suggested Quick Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-mono text-slate-400">Quick Try:</span>
        {['swalpa adjust maadi', 'bisi bele bath', 'namma metro', 'oota aayitha', 'kannada gothilla'].map(chip => (
          <button
            key={chip}
            onClick={() => handleSearch(chip)}
            className="px-2.5 py-1 rounded-lg text-xs bg-space-850 hover:bg-space-800 border border-slate-800 hover:border-rajyotsava-gold/40 text-slate-300 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="bg-space-850 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between gap-3 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 font-bold">"{item.romanQuery}"</span>
                <span className="text-[10px] bg-space-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.category}
                </span>
              </div>

              {/* Native Kannada Display */}
              <div className="flex items-baseline gap-2 my-1">
                <h4 className="text-2xl font-black font-kannada text-rajyotsava-gold">
                  {item.kannadaScript}
                </h4>
              </div>

              <div className="text-xs font-mono text-slate-400 mb-1">
                /{item.transliterationISO}/
              </div>

              <div className="text-xs text-white font-medium mb-1.5">
                {item.englishMeaning}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.culturalNote}
              </p>
            </div>

            {/* Actions: Audio & X-Ray */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-1">
              <button
                onClick={() => playAudio(item.kannadaScript)}
                className="px-2.5 py-1 rounded bg-space-950 hover:bg-space-800 text-xs font-semibold text-rajyotsava-gold flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>ಉಚ್ಚಾರಣೆ (Speak)</span>
              </button>

              <button
                onClick={() => onOpenXRay(item.kannadaScript.split(' ')[0])}
                className="px-2.5 py-1 rounded bg-rajyotsava-gold/15 hover:bg-rajyotsava-gold/25 text-xs font-semibold text-rajyotsava-gold flex items-center gap-1.5 border border-rajyotsava-gold/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ಅಕ್ಷರ X-Ray</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
