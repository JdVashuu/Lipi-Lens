import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Sparkles,
  Volume2,
  Flag,
} from 'lucide-react';
import { KARNATAKA_REGIONS, KarnatakaRegion } from '../data/karnatakaMap';
import { ttsEngine } from '../core/ttsEngine';

interface KarnatakaUnityMapProps {
  onLoadScene: (sceneId: string) => void;
}

export const KarnatakaUnityMap: React.FC<KarnatakaUnityMapProps> = ({ onLoadScene }) => {
  const [selectedRegion, setSelectedRegion] = useState<KarnatakaRegion>(KARNATAKA_REGIONS[0]);

  const playDialectAudio = (text: string) => {
    ttsEngine.speakWordWithAlignment(text, [], { rate: 0.85 });
  };

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-5 shadow-hud flex flex-col gap-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-rajyotsava-crimson" />
            <h3 className="text-base font-bold text-white">
              ಕರ್ನಾಟಕ ಏಕೀಕರಣ ನಕ್ಷೆ | Karnataka Unity Map (1 Nov 1956)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Celebrating the unification of 5 historic linguistic territories into one Kannada homeland. Tap regions & demo pins.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rajyotsava-gold/15 text-rajyotsava-gold border border-rajyotsava-gold/30 self-start md:self-auto flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>೫ ಐತಿಹಾಸಿಕ ಪ್ರಾಂತ್ಯಗಳು (5 Historic Regions)</span>
        </span>
      </div>

      {/* Main Map & Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Stylized Vector Map of Karnataka (7 cols) */}
        <div className="lg:col-span-7 bg-space-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between relative min-h-[460px] overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Region Tabs at Top of Map */}
          <div className="flex items-center gap-1.5 flex-wrap z-10 mb-3">
            {KARNATAKA_REGIONS.map(reg => {
              const isSelected = selectedRegion.id === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                    isSelected
                      ? 'bg-space-850 text-white font-bold border-rajyotsava-gold shadow-glow-gold/20'
                      : 'bg-space-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: reg.color }} />
                  <span>{reg.nameKannada.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* SVG Map of Karnataka Regions & Interactive Pins */}
          <div className="relative w-full h-[360px] flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {/* Region 1: Kittur Karnataka (Top-Left / Northwest) */}
              <path
                d="M 22,22 L 52,18 L 48,48 L 18,48 Z"
                fill={selectedRegion.id === 'kittur-karnataka' ? '#E11D4866' : '#E11D4822'}
                stroke="#E11D48"
                strokeWidth={selectedRegion.id === 'kittur-karnataka' ? '1.5' : '0.8'}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => setSelectedRegion(KARNATAKA_REGIONS[1])}
              />
              <text x="32" y="34" fill="#FCA5A5" fontSize="3.5" fontWeight="bold" pointerEvents="none">
                ಕಿತ್ತೂರು (Kittur)
              </text>

              {/* Region 2: Kalyana Karnataka (Top-Right / Northeast) */}
              <path
                d="M 52,18 L 84,18 L 80,48 L 48,48 Z"
                fill={selectedRegion.id === 'kalyana-karnataka' ? '#06B6D466' : '#06B6D422'}
                stroke="#06B6D4"
                strokeWidth={selectedRegion.id === 'kalyana-karnataka' ? '1.5' : '0.8'}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => setSelectedRegion(KARNATAKA_REGIONS[2])}
              />
              <text x="60" y="34" fill="#67E8F9" fontSize="3.5" fontWeight="bold" pointerEvents="none">
                ಕಲ್ಯಾಣ (Kalyana)
              </text>

              {/* Region 3: Karavali / Coastal (West strip) */}
              <path
                d="M 16,48 L 26,48 L 32,74 L 18,74 Z"
                fill={selectedRegion.id === 'karavali' ? '#10B98166' : '#10B98122'}
                stroke="#10B981"
                strokeWidth={selectedRegion.id === 'karavali' ? '1.5' : '0.8'}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => setSelectedRegion(KARNATAKA_REGIONS[3])}
              />
              <text x="18" y="62" fill="#6EE7B7" fontSize="3.2" fontWeight="bold" pointerEvents="none">
                ಕರಾವಳಿ
              </text>

              {/* Region 4: Old Mysore (South-Central & East) */}
              <path
                d="M 26,48 L 80,48 L 74,86 L 36,86 L 32,74 Z"
                fill={selectedRegion.id === 'old-mysore' ? '#FACC1566' : '#FACC1522'}
                stroke="#FACC15"
                strokeWidth={selectedRegion.id === 'old-mysore' ? '1.5' : '0.8'}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => setSelectedRegion(KARNATAKA_REGIONS[0])}
              />
              <text x="48" y="66" fill="#FDE047" fontSize="4" fontWeight="bold" pointerEvents="none">
                ಹಳೆ ಮೈಸೂರು (Mysore)
              </text>

              {/* Region 5: Kodagu (Southwest hill pocket) */}
              <path
                d="M 24,74 L 36,74 L 34,86 L 24,86 Z"
                fill={selectedRegion.id === 'kodagu' ? '#F59E0B66' : '#F59E0B22'}
                stroke="#F59E0B"
                strokeWidth={selectedRegion.id === 'kodagu' ? '1.5' : '0.8'}
                className="cursor-pointer transition-all hover:opacity-90"
                onClick={() => setSelectedRegion(KARNATAKA_REGIONS[4])}
              />
              <text x="25" y="80" fill="#FCD34D" fontSize="2.8" fontWeight="bold" pointerEvents="none">
                ಕೊಡಗು
              </text>

              {/* Kaveri & Krishna River lines */}
              <path d="M 28,78 Q 45,74 72,82" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" strokeDasharray="1,1" />
              <path d="M 22,28 Q 50,22 82,24" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.8" strokeDasharray="1,1" />
            </svg>

            {/* Interactive Demo Scan Pins */}
            {selectedRegion.demoPins.map(pin => (
              <button
                key={pin.id}
                onClick={() => {
                  onLoadScene(pin.sceneId);
                }}
                aria-label={`Load ${pin.nameEnglish} signboard into 3D AR Scanner`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all hover:scale-125 z-20"
                style={{ left: `${pin.coords.x}%`, top: `${pin.coords.y}%` }}
              >
                <div className="w-7 h-7 rounded-full bg-rajyotsava-gold text-space-950 border-2 border-white shadow-glow-gold flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4 fill-space-950" />
                </div>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded bg-space-900 border border-rajyotsava-gold text-[10px] font-mono text-rajyotsava-gold whitespace-nowrap shadow-lg">
                  {pin.nameKannada.split(' ')[0]} ⚡
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2 z-10">
            <span>Tap gold pins to load signboards into 3D AR Scanner</span>
            <span className="text-cyan-400">1 Nov 1956 State Reorganisation</span>
          </div>
        </div>

        {/* Right Column: Regional Dialect & Word Cards (5 cols) */}
        <div className="lg:col-span-5 bg-space-850 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rajyotsava-gold" />
                <span>ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ಶೈಲಿ (Regional Dialect)</span>
              </span>
              <span className="text-rajyotsava-gold font-bold">
                {selectedRegion.districts.length} Districts
              </span>
            </div>

            <h4 className="text-xl font-extrabold font-kannada text-white mb-0.5">
              {selectedRegion.nameKannada}
            </h4>
            <div className="text-xs text-slate-300 font-sans mb-3">
              {selectedRegion.nameEnglish} • {selectedRegion.historicalSource}
            </div>

            {/* Regional Greeting Box with Audio */}
            <div className="bg-space-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1.5 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                  ಸ್ಥಳೀಯ ಆಡುಮಾತು (Everyday Dialect Greeting)
                </span>
                <button
                  onClick={() => playDialectAudio(selectedRegion.dialectGreetingKannada)}
                  className="px-2 py-0.5 rounded bg-space-800 text-[10px] text-rajyotsava-gold border border-slate-700 flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>ಧ್ವನಿ (Hear)</span>
                </button>
              </div>

              <div className="text-base font-bold font-kannada text-rajyotsava-gold">
                "{selectedRegion.dialectGreetingKannada}"
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                /{selectedRegion.dialectGreetingTrans}/
              </div>
              <div className="text-[11px] text-slate-300 italic">
                {selectedRegion.dialectGreetingEnglish}
              </div>
            </div>

            {/* Regional Word Cards */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                ವಿಶಿಷ್ಟ ಸ್ಥಳೀಯ ಪದಗಳು (Signature Regional Words):
              </span>

              {selectedRegion.regionalWordCards.map((card, cIdx) => (
                <div key={cIdx} className="bg-space-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold font-kannada text-white">
                        {card.wordKannada}
                      </span>
                      <span className="text-xs font-mono text-cyan-400">
                        /{card.transliteration}/
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 mt-0.5">
                      {card.englishMeaning}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {card.dialectContext}
                    </div>
                  </div>

                  <button
                    onClick={() => playDialectAudio(card.wordKannada)}
                    className="p-2 rounded-lg bg-space-950 text-slate-400 hover:text-rajyotsava-gold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action: Load primary pin */}
          {selectedRegion.demoPins[0] && (
            <button
              onClick={() => onLoadScene(selectedRegion.demoPins[0].sceneId)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-rajyotsava-gold to-amber-500 text-space-950 shadow-glow-gold hover:brightness-110 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load {selectedRegion.demoPins[0].nameKannada} into 3D AR Scanner</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
