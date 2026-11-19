import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  Layers,
  Flame,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  JournalEntry,
  getJournalEntries,
  updateLeitnerBox,
} from '../core/lipiJournal';
import {
  KANNADA_INDEPENDENT_VOWELS,
  KANNADA_CONSONANTS,
  parseKannadaText,
} from '../core/kannadaFST';
import { ttsEngine } from '../core/ttsEngine';

interface KannadaKaliProps {
  onOpenXRay: (word: string) => void;
}

export const KannadaKali: React.FC<KannadaKaliProps> = ({ onOpenXRay }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'FLASHCARDS' | 'ALPHABET_PATH' | 'JOURNAL'>('FLASHCARDS');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const totalWords = entries.length;
  const targetWords = 50;
  const progressPercent = Math.min(100, Math.round((totalWords / targetWords) * 100));

  const currentCard = entries[currentCardIndex] || entries[0];

  const handleCardResult = (remembered: boolean) => {
    if (!currentCard) return;
    updateLeitnerBox(currentCard.id, remembered);
    setEntries(getJournalEntries());
    setIsFlipped(false);

    if (remembered && currentCard.box === 4) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FACC15', '#E11D48', '#10B981'],
      });
    }

    if (currentCardIndex < entries.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const playWordAudio = (word: string) => {
    const analysis = parseKannadaText(word)[0];
    ttsEngine.speakWordWithAlignment(word, analysis?.aksharas || [], {
      rate: 0.85,
    });
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-5 shadow-hud flex flex-col gap-5 text-slate-100">
      {/* Header & Rajyotsava Challenge Banner */}
      <div className="bg-gradient-to-r from-rajyotsava-crimson/20 via-space-850 to-rajyotsava-gold/15 border border-rajyotsava-gold/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rajyotsava-gold/20 flex items-center justify-center text-rajyotsava-gold border border-rajyotsava-gold/40 shadow-glow-gold">
            <Flame className="w-6 h-6 text-rajyotsava-gold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                ಕನ್ನಡ ಕಲಿ | Kannada Kali: Learn While You Scan
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rajyotsava-crimson/20 text-rajyotsava-crimson border border-rajyotsava-crimson/40">
                ರಾಜ್ಯೋತ್ಸವ ಸವಾಲು (Challenge)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              "Learn 50 Kannada words this November by reading the city." Spaced-repetition Leitner flashcards.
            </p>
          </div>
        </div>

        {/* Challenge Progress Ring */}
        <div className="flex items-center gap-4 bg-space-950/80 px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rajyotsava-gold transition-all duration-500 ease-out"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-mono font-bold text-rajyotsava-gold">
              {progressPercent}%
            </span>
          </div>

          <div className="text-xs">
            <div className="font-bold text-white flex items-center gap-1">
              <span>{totalWords} / {targetWords}</span>
              <span className="text-slate-400 font-normal">ಪದಗಳು (Words)</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {targetWords - totalWords > 0 ? `${targetWords - totalWords} words left for Badge` : 'Challenge Complete! 🏆'}
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('FLASHCARDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'FLASHCARDS'
                ? 'bg-space-800 text-rajyotsava-gold font-bold border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ಫ್ಲ್ಯಾಶ್ ಕಾರ್ಡ್‌ಗಳು (Flashcards)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ALPHABET_PATH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'ALPHABET_PATH'
                ? 'bg-space-800 text-cyan-400 font-bold border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>ವರ್ಣಮಾಲೆ ಹಾದಿ (Alphabet Path)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('JOURNAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'JOURNAL'
                ? 'bg-space-800 text-emerald-400 font-bold border border-slate-700 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ಲಿಪಿ ದಿನಚರಿ (Lipi Journal)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Leitner Spaced Repetition (ಪೆಟ್ಟಿಗೆ ೧ - ೫)
        </div>
      </div>

      {/* Tab 1: Spaced-Repetition Flashcards */}
      {activeSubTab === 'FLASHCARDS' && currentCard && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-full max-w-md perspective">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`w-full min-h-[260px] p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative select-none ${
                isFlipped
                  ? 'bg-space-850 border-rajyotsava-gold/50 shadow-glow-gold/30'
                  : 'bg-space-850/90 border-slate-700 hover:border-slate-500 shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-rajyotsava-gold fill-rajyotsava-gold" />
                  <span>ಪೆಟ್ಟಿಗೆ (Box) {currentCard.box} / 5</span>
                </span>
                <span className="bg-space-950 px-2.5 py-0.5 rounded-full border border-slate-800 text-[10px]">
                  {currentCard.sourceSignboard}
                </span>
              </div>

              <div className="text-center my-6">
                {!isFlipped ? (
                  <div>
                    <h2 className="text-4xl font-extrabold font-kannada text-rajyotsava-gold mb-2 tracking-wide">
                      {currentCard.word}
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                      (Tap to reveal transliteration & meaning)
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="text-xl font-bold font-mono text-cyan-400 mb-1">
                      {currentCard.transliteration}
                    </div>
                    <div className="text-lg font-bold text-white mb-2">
                      {currentCard.englishMeaning}
                    </div>
                    <div className="text-2xl font-bold font-kannada text-rajyotsava-gold">
                      {currentCard.word}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playWordAudio(currentCard.word);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-space-950 hover:bg-space-800 border border-slate-700 text-xs font-semibold text-rajyotsava-gold flex items-center gap-1.5 transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ಧ್ವನಿ (Audio)</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenXRay(currentCard.word);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rajyotsava-gold/15 hover:bg-rajyotsava-gold/25 border border-rajyotsava-gold/30 text-xs font-semibold text-rajyotsava-gold flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ಅಕ್ಷರ X-Ray</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={() => handleCardResult(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/80 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>ಮತ್ತೆ ಕಲಿಯಿರಿ (Review Again)</span>
              </button>

              <button
                onClick={() => handleCardResult(true)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900/80 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-cyan"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ನೆನಪಿದೆ (Remembered!)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Alphabet Path */}
      {activeSubTab === 'ALPHABET_PATH' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rajyotsava-gold" />
              <h4 className="text-sm font-bold text-white">
                ೧. ಸ್ವರಗಳು (Independent Vowels - 14 Swaras)
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {Object.entries(KANNADA_INDEPENDENT_VOWELS).map(([glyph, info]) => (
                <div
                  key={glyph}
                  onClick={() => playWordAudio(glyph)}
                  className="bg-space-950 border border-slate-800 hover:border-rajyotsava-gold p-3 rounded-xl cursor-pointer transition-all flex flex-col items-center group"
                >
                  <span className="text-3xl font-bold font-kannada text-rajyotsava-gold group-hover:scale-110 transition-transform">
                    {glyph}
                  </span>
                  <span className="text-xs font-mono font-bold text-white mt-1">
                    /{info.trans}/
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {info.isLong ? 'ದೀರ್ಘ (2 Matras)' : 'ಹ್ರಸ್ವ (1 Matra)'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rajyotsava-crimson" />
              <h4 className="text-sm font-bold text-white">
                ೨. ವ್ಯಂಜನಗಳು (Consonants - 34 Vyanjanas)
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {Object.entries(KANNADA_CONSONANTS).slice(0, 25).map(([glyph, info]) => (
                <div
                  key={glyph}
                  onClick={() => playWordAudio(glyph)}
                  className="bg-space-950 border border-slate-800 hover:border-cyan-400 p-2.5 rounded-xl cursor-pointer transition-all flex flex-col items-center group"
                >
                  <span className="text-2xl font-bold font-kannada text-cyan-300 group-hover:scale-110 transition-transform">
                    {glyph}
                  </span>
                  <span className="text-xs font-mono font-bold text-white mt-1">
                    {info.trans}a
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5 text-center truncate w-full">
                    {info.varga.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Full Journal Table */}
      {activeSubTab === 'JOURNAL' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ನಿಮ್ಮ ಲಿಪಿ ಸಂಗ್ರಹ ({entries.length} Words Saved)</span>
            <span>Spaced-Repetition Box 1 (Daily) → Box 5 (Monthly)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-space-950 text-slate-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3">ಕನ್ನಡ ಪದ (Word)</th>
                  <th className="p-3">ಉಚ್ಚಾರಣೆ (Transliteration)</th>
                  <th className="p-3">ಅರ್ಥ (Meaning)</th>
                  <th className="p-3">ಮೂಲ (Signboard)</th>
                  <th className="p-3">ಪೆಟ್ಟಿಗೆ (Box)</th>
                  <th className="p-3 text-right">ಕ್ರಮಗಳು (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-space-850/60">
                {entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-space-800/50 transition-colors">
                    <td className="p-3 font-bold font-kannada text-lg text-rajyotsava-gold">
                      {entry.word}
                    </td>
                    <td className="p-3 font-mono text-cyan-300">
                      {entry.transliteration}
                    </td>
                    <td className="p-3 text-slate-200">
                      {entry.englishMeaning}
                    </td>
                    <td className="p-3 text-slate-400 text-[11px]">
                      {entry.sourceSignboard}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
                        Box {entry.box}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => playWordAudio(entry.word)}
                        className="p-1 rounded hover:bg-space-950 text-slate-400 hover:text-white"
                        title="Speak"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenXRay(entry.word)}
                        className="p-1 rounded hover:bg-space-950 text-rajyotsava-gold"
                        title="Akshara X-Ray"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
