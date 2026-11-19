import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { AksharaNode, WordAnalysis, parseKannadaText } from '../core/kannadaFST';
import { ttsEngine } from '../core/ttsEngine';

interface AksharaXRayTreeProps {
  analysis?: WordAnalysis | null;
  targetWord?: string;
  onClose?: () => void;
}

export const AksharaXRayTree: React.FC<AksharaXRayTreeProps> = ({
  analysis: propAnalysis,
  targetWord,
  onClose,
}) => {
  const analysis: WordAnalysis | null = propAnalysis || (targetWord ? parseKannadaText(targetWord)[0] : null);

  const [selectedAksharaIndex, setSelectedAksharaIndex] = useState<number>(0);
  const [activeAudioIndex, setActiveAudioIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(0.9);

  useEffect(() => {
    if (analysis && analysis.aksharas.length > 0) {
      const firstValid = analysis.aksharas.findIndex(a => a.type !== 'WHITESPACE');
      setSelectedAksharaIndex(firstValid >= 0 ? firstValid : 0);
    }
  }, [analysis]);

  if (!analysis) return null;

  const validAksharas = analysis.aksharas.filter(a => a.type !== 'WHITESPACE' && a.type !== 'PUNCTUATION');
  const activeAkshara: AksharaNode | undefined = analysis.aksharas[selectedAksharaIndex] || validAksharas[0];

  const handlePlayAudio = (rate: number) => {
    setIsPlaying(true);
    setPlaybackRate(rate);
    ttsEngine.speakWordWithAlignment(analysis.word, analysis.aksharas, {
      rate,
      onAksharaStart: (_akshara, idx) => {
        setActiveAudioIndex(idx);
        setSelectedAksharaIndex(idx);
      },
      onComplete: () => {
        setIsPlaying(false);
        setActiveAudioIndex(null);
      },
    });
  };

  return (
    <div className="bg-space-900/95 backdrop-blur-xl border border-rajyotsava-gold/40 rounded-2xl p-5 shadow-hud text-slate-100 flex flex-col gap-5 relative overflow-hidden">
      {/* Decorative Kannada Watermark */}
      <div className="absolute right-4 -bottom-6 text-9xl font-black text-white/[0.02] pointer-events-none select-none font-kannada">
        {analysis.word.slice(0, 3)}
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rajyotsava-gold/20 flex items-center justify-center text-rajyotsava-gold border border-rajyotsava-gold/40 shadow-glow-gold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>ಅಕ್ಷರ ಎಕ್ಸ್-ರೇ | Akshara X-Ray Deconstructor</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rajyotsava-crimson/20 border border-rajyotsava-crimson/40 text-rajyotsava-crimson font-mono font-bold">
                Unicode FST U+0C80–U+0CFF
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic abugida morphology without LLM hallucinations. Mathematical equation decomposition.
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePlayAudio(0.5)}
            disabled={isPlaying}
            title="Slow-Motion Pronunciation (0.5x)"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 border transition-all ${
              isPlaying && playbackRate === 0.5
                ? 'bg-rajyotsava-gold text-space-950 font-bold border-rajyotsava-gold shadow-glow-gold'
                : 'bg-space-800 border-slate-700 text-slate-300 hover:border-rajyotsava-gold/50'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>0.5x Slow-Mo</span>
          </button>

          <button
            onClick={() => handlePlayAudio(0.9)}
            disabled={isPlaying}
            title="Normal Speed Kannada Pronunciation"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              isPlaying && playbackRate === 0.9
                ? 'bg-rajyotsava-gold text-space-950 font-bold border-rajyotsava-gold shadow-glow-gold'
                : 'bg-rajyotsava-gold/15 text-rajyotsava-gold border-rajyotsava-gold/40 hover:bg-rajyotsava-gold/25'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ಉಚ್ಚಾರಣೆ (Speak)</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white ml-2 text-sm p-1 rounded-md hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Target Word Display & Transliteration Banner */}
      <div className="bg-space-850/90 border border-slate-700/60 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
            Word Vector Analysis (ಪದ ವಿಶ್ಲೇಷಣೆ)
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold font-kannada text-rajyotsava-gold tracking-wide">
              {analysis.word}
            </span>
            <span className="text-base text-slate-300 font-mono italic">
              /{analysis.ipa || analysis.transliteration}/
            </span>
            <span className="text-xs text-rajyotsava-crimson font-mono bg-rajyotsava-crimson/10 px-2 py-0.5 rounded border border-rajyotsava-crimson/30">
              {analysis.transliteration}
            </span>
          </div>
        </div>

        {/* Sandhi Breakdown Pill if available */}
        {analysis.sandhiInfo && (
          <div className="bg-rajyotsava-crimson/10 border border-rajyotsava-crimson/30 rounded-lg p-2.5 max-w-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rajyotsava-crimson mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{analysis.sandhiInfo.kannadaType} ({analysis.sandhiInfo.type})</span>
            </div>
            <div className="text-xs font-mono text-slate-200">
              <span className="text-rajyotsava-gold font-bold">{analysis.sandhiInfo.split[0]}</span>
              {' + '}
              <span className="text-rajyotsava-gold font-bold">{analysis.sandhiInfo.split[1]}</span>
              {' → '}
              <span className="text-white font-bold">{analysis.word}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {analysis.sandhiInfo.rule} • {analysis.sandhiInfo.description}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Akshara Ribbon / Syllable Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>ಅಕ್ಷರ ಪಟ್ಟಿ (Select Grapheme Cluster):</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {validAksharas.length} Grapheme Clusters
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {analysis.aksharas.map((akshara, idx) => {
            const isSelected = selectedAksharaIndex === idx;
            const isAudioActive = activeAudioIndex === idx;
            const isPunct = akshara.type === 'PUNCTUATION' || akshara.type === 'WHITESPACE';

            if (isPunct) return null;

            return (
              <button
                key={akshara.id}
                onClick={() => setSelectedAksharaIndex(idx)}
                className={`group relative px-4 py-3 rounded-xl border transition-all flex flex-col items-center min-w-[70px] ${
                  isAudioActive
                    ? 'bg-rajyotsava-gold text-space-950 border-rajyotsava-gold shadow-glow-gold scale-105 z-10'
                    : isSelected
                    ? 'bg-space-800 border-rajyotsava-gold text-white shadow-glow-gold/40'
                    : 'bg-space-850/60 border-slate-700/60 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className={`text-2xl font-bold font-kannada transition-colors ${
                  isAudioActive ? 'text-space-950 font-black' : isSelected ? 'text-rajyotsava-gold' : 'text-slate-100'
                }`}>
                  {akshara.raw}
                </span>

                <span className={`text-[10px] font-mono mt-1 ${
                  isAudioActive ? 'text-space-900 font-bold' : 'text-slate-400'
                }`}>
                  {akshara.transliteration}
                </span>

                {akshara.ottaksharas.length > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center font-mono ${
                    isAudioActive ? 'bg-space-950 text-rajyotsava-gold' : 'bg-rajyotsava-crimson text-white'
                  }`}>
                    {akshara.ottaksharas.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep Akshara Decomposition Tree & Formation Equations */}
      {activeAkshara && (
        <div className="bg-space-850 border border-slate-700/80 rounded-xl p-4 flex flex-col gap-4">
          {/* Dual Equations: Kannada Script Formula + Full Unicode Code Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Clean Kannada Equation */}
            <div className="bg-space-950/80 border border-slate-800 rounded-lg p-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                ಅಕ್ಷರ ಸಂಯೋಗ ಸೂತ್ರ (Kannada Script Equation)
              </span>
              <div className="text-base font-kannada font-bold text-rajyotsava-gold">
                {activeAkshara.equationKannada}
              </div>
            </div>

            {/* Unicode Codepoints with Correct U+0CCB Long-O */}
            <div className="bg-space-950/80 border border-slate-800 rounded-lg p-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                ಯುನಿಕೋಡ್ ಸಂಕೇತ ಸೂತ್ರ (Unicode Formation Formula)
              </span>
              <div className="text-xs font-mono text-cyan-300 font-semibold overflow-x-auto whitespace-nowrap">
                {activeAkshara.formationFormula}
              </div>
            </div>
          </div>

          {/* Sub-Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Base Element */}
            <div className="bg-space-900/90 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>೧. ಮೂಲ ಧಾತು (Base Consonant)</span>
                  <span className="text-cyan-400 font-bold">{activeAkshara.baseUnicode}</span>
                </div>
                <div className="flex items-center gap-3 my-1">
                  <span className="text-3xl font-extrabold font-kannada text-cyan-300">
                    {activeAkshara.baseGlyph}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white font-kannada">
                      {activeAkshara.baseName}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      IPA: [{activeAkshara.phoneticIPA.replace(/[\[\]]/g, '')}]
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-1">
                Type: {activeAkshara.type}
              </div>
            </div>

            {/* 2. Ottaksharas (Conjuncts) */}
            <div className="bg-space-900/90 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>೨. ಒತ್ತಕ್ಷರ (Subscript Conjuncts)</span>
                  <span className="text-rajyotsava-crimson font-bold">
                    {activeAkshara.ottaksharas.length > 0 ? `${activeAkshara.ottaksharas.length} Ottu` : 'None'}
                  </span>
                </div>

                {activeAkshara.ottaksharas.length > 0 ? (
                  <div className="flex flex-col gap-1.5 my-1">
                    {activeAkshara.ottaksharas.map((otta, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 bg-space-800/80 p-1.5 rounded-lg border border-slate-700">
                        <span className="text-xl font-bold font-kannada text-rajyotsava-crimson">
                          {otta.glyph}
                        </span>
                        <div className="text-xs">
                          <span className="text-slate-200 font-bold font-kannada block">{otta.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{otta.unicode} + {otta.viramaCode} (ವಿರಾಮ)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 py-3 italic">
                    Pure single consonant (no subscript conjuncts)
                  </div>
                )}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-1">
                ವಿರಾಮ ಚಿಹ್ನೆ (Virama U+0CCD Joiner)
              </div>
            </div>

            {/* 3. Kagunita & Yogavaaha */}
            <div className="bg-space-900/90 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>೩. ಕಾಗುಣಿತ / ಯೋಗವಾಹ (Vowel Mod)</span>
                  <span className="text-emerald-400 font-bold">
                    {activeAkshara.vowelSign ? activeAkshara.vowelSign.unicode : 'Inherent a'}
                  </span>
                </div>

                <div className="my-1">
                  {activeAkshara.vowelSign ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-kannada text-emerald-400">
                        {activeAkshara.vowelSign.glyph}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-200 font-kannada">
                          {activeAkshara.vowelSign.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {activeAkshara.vowelSign.isLong ? 'ದೀರ್ಘ (2 Matras / Morae)' : 'ಹ್ರಸ್ವ (1 Matra)'}
                        </div>
                      </div>
                    </div>
                  ) : activeAkshara.viramaPresent ? (
                    <div className="text-xs font-mono text-amber-400 py-1">
                      Halant / Pollu (್) - Inherent vowel silenced
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 py-1">
                      Inherent short vowel <span className="font-mono text-emerald-400 font-bold">/ɐ/ (ಅ)</span>
                    </div>
                  )}

                  {activeAkshara.yogavaaha && (
                    <div className="mt-2 text-xs font-mono text-purple-300 bg-purple-950/40 p-1.5 rounded border border-purple-800/40">
                      {activeAkshara.yogavaaha.name} ({activeAkshara.yogavaaha.unicode})
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-2 border-t border-slate-800 pt-1">
                Acoustic Window: {activeAkshara.durationMs}ms
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
