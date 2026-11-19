import React, { useState } from 'react';
import {
  History,
  Sparkles,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { HERITAGE_MILESTONES, ARCHAIC_GLYPHS, HeritageMilestone } from '../data/heritageTimeline';
import { ttsEngine } from '../core/ttsEngine';

export const HeritageTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState<HeritageMilestone>(HERITAGE_MILESTONES[2]); // Default Begur stone
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Split slider 0-100%
  const [showSources, setShowSources] = useState<boolean>(false);
  const [selectedGlyph, setSelectedGlyph] = useState<string | null>(null);

  const playQuoteAudio = (text: string) => {
    ttsEngine.speakWordWithAlignment(text, [], { rate: 0.85 });
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-5 shadow-hud flex flex-col gap-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-rajyotsava-gold" />
            <h3 className="text-base font-bold text-white">
              ಕನ್ನಡ ಯುಗಗಳು | Kannada Through the Ages (1,500+ Years)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            From the 5th-century Halmidi stone to modern classical Kannada. Dates documented as "widely cited as".
          </p>
        </div>

        <button
          onClick={() => setShowSources(!showSources)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700 bg-space-950 text-slate-300 hover:text-white hover:border-rajyotsava-gold transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-rajyotsava-gold" />
          <span>{showSources ? 'ಉಲ್ಲೇಖಗಳನ್ನು ಮುಚ್ಚಿ (Hide Sources)' : 'ಉಲ್ಲೇಖಗಳು (Sources Panel)'}</span>
        </button>
      </div>

      {/* Sources Collapsible Panel */}
      {showSources && (
        <div className="bg-space-950/90 border border-rajyotsava-gold/30 rounded-xl p-4 text-xs space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-rajyotsava-gold font-bold block mb-1">
            Epigraphical & Scholarly Sources (ಐತಿಹಾಸಿಕ ಉಲ್ಲೇಖಗಳು)
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong>Epigraphia Carnatica</strong>, Vols. IX, X, XV, Ed. Benjamin Lewis Rice & Mysore Archaeological Dept.</li>
            <li><strong>Archaeological Survey of Mysore</strong>, Annual Reports (1936, 1941) on Halmidi and Begur Hero Stones.</li>
            <li><strong>Kavirajamarga of King Nrupatunga Amoghavarsha I</strong>, Ed. K. Krishnamoorthy & Sahitya Akademi.</li>
            <li><strong>Intach Bengaluru Heritage Cell</strong>, Documentation of Bengaluru Inscription Stones.</li>
          </ul>
        </div>
      )}

      {/* Interactive Milestone Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {HERITAGE_MILESTONES.map((m) => {
          const isSelected = selectedMilestone.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMilestone(m)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all flex flex-col items-start gap-0.5 min-w-[170px] ${
                isSelected
                  ? 'bg-space-850 text-rajyotsava-gold border-rajyotsava-gold shadow-glow-gold/25 font-bold'
                  : 'bg-space-950/70 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-cyan-400">{m.century}</span>
              <span className="font-kannada text-sm text-white">{m.titleKannada}</span>
              <span className="text-[10px] text-slate-400 truncate w-full">{m.titleEnglish.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Milestone Deep-Dive Card */}
      <div className="bg-space-850 border border-slate-700/80 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rajyotsava-crimson/20 text-rajyotsava-crimson border border-rajyotsava-crimson/30">
                {selectedMilestone.linguisticStage}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {selectedMilestone.widelyCitedDate}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white font-kannada">
              {selectedMilestone.titleKannada} • <span className="font-sans text-base text-slate-200">{selectedMilestone.titleEnglish}</span>
            </h4>
          </div>

          <div className="text-xs font-mono text-cyan-300">
            {selectedMilestone.dynasty}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedMilestone.significance}
        </p>

        {/* Historic Inscription Quote Box */}
        <div className="bg-space-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              ಮೂಲ ಶಾಸನ ವಾಕ್ಯ (Original Epigraphical Text)
            </span>
            <button
              onClick={() => playQuoteAudio(selectedMilestone.sampleInscriptionKannada)}
              className="px-2.5 py-1 rounded bg-space-800 hover:bg-space-700 text-[11px] text-rajyotsava-gold flex items-center gap-1 border border-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>ಕೇಳಿ (Hear)</span>
            </button>
          </div>

          <div className="text-xl font-bold font-kannada text-rajyotsava-gold">
            "{selectedMilestone.sampleInscriptionKannada}"
          </div>

          <div className="text-xs font-mono text-cyan-300">
            /{selectedMilestone.transliteration}/
          </div>

          <div className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
            Translation: {selectedMilestone.meaning}
          </div>
        </div>
      </div>

      {/* Shilashasana Mode: Interactive Before / After Split Slider for Begur Stone */}
      <div className="bg-space-850 border border-slate-700/80 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-bold text-white">
              ಶಿಲಾಶಾಸನ ವಿಶ್ಲೇಷಣೆ | Shilashasana Mode: Contrast Relief Slider (Begur Stone 890 CE)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/40">
            CLAHE + 3D Bas-Relief Embossing
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Drag the slider horizontally to compare raw weathered granite vs. CLAHE contrast-enhanced inscription carvings.
        </p>

        {/* Visual Split Screen Viewport */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-800 select-none">
          {/* Base Layer: Weathered Raw Stone */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-stone-900 to-slate-800 p-6 flex flex-col justify-center items-center text-center opacity-70">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest block mb-2">
              Raw Weathered Granite (ಮೂಲ ಶಿಲೆ)
            </span>
            <span className="text-2xl font-bold font-kannada text-slate-400 blur-[0.4px]">
              ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್ ಬೆಟ್ಟದೊಳ್ ಕಾದಿ ಸತ್ತಂ
            </span>
          </div>

          {/* Top Layer: CLAHE Enhanced Relief (Clipped by slider percentage) */}
          <div
            className="absolute inset-0 bg-gradient-to-tr from-amber-950 via-stone-900 to-yellow-950 p-6 flex flex-col justify-center items-center text-center border-r-2 border-rajyotsava-gold shadow-2xl"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <span className="text-[11px] font-mono text-rajyotsava-gold uppercase tracking-widest block mb-2 font-bold drop-shadow">
              CLAHE + Relief Enhanced (ಹೆಚ್ಚಿಸಿದ ಸ್ಪಷ್ಟತೆ)
            </span>
            <span className="text-2xl font-black font-kannada text-rajyotsava-gold drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)]">
              ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್ ಬೆಟ್ಟದೊಳ್ ಕಾದಿ ಸತ್ತಂ
            </span>
          </div>

          {/* Slider Handle */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          {/* Visual Indicator Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-rajyotsava-gold pointer-events-none z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-space-950 border-2 border-rajyotsava-gold flex items-center justify-center text-[10px] text-rajyotsava-gold font-bold">
              ⇄
            </div>
          </div>
        </div>
      </div>

      {/* Halegannada Archaic Glyph Mapping Table */}
      <div className="bg-space-850 border border-slate-700/80 rounded-xl p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white">
            ಹಳಗನ್ನಡ ಅಪೂರ್ವ ಅಕ್ಷರಗಳು | Halegannada Archaic Glyphs & Modern Equivalents
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ARCHAIC_GLYPHS.map((glyph) => (
            <div
              key={glyph.unicode}
              onClick={() => setSelectedGlyph(glyph.unicode === selectedGlyph ? null : glyph.unicode)}
              className="bg-space-950 border border-slate-800 hover:border-cyan-400/50 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-extrabold font-kannada text-cyan-300">
                    {glyph.archaicGlyph}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {glyph.unicode}
                  </span>
                </div>

                <div className="text-xs font-bold text-white mb-1">
                  {glyph.kannadaName}
                </div>
                <div className="text-[11px] text-slate-300 font-mono mb-2">
                  Modern Equivalent: <span className="text-rajyotsava-gold font-bold text-sm">{glyph.modernEquivalent}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {glyph.historicalContext}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex justify-between">
                <span>Example: {glyph.exampleWord}</span>
                <span className="text-cyan-300">{glyph.exampleTransliteration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
