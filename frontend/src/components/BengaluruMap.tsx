import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Sparkles } from 'lucide-react';

interface MapPoint {
  id: string;
  name: string;
  kannadaName: string;
  type: 'TRANSIT_HUB' | 'CULINARY_HUB' | 'URBAN_CIVIC' | 'HERITAGE_EPIGRAPHY';
  coords: { x: number; y: number }; // normalized 0-100 on Bengaluru map
  sceneId: string;
  scriptType: 'Pure Kannada' | 'Kanglish Bilingual' | 'Halegannada (Old Kannada)';
  scanCount: number;
  recentSign: string;
  description: string;
}

const BENGALURU_POINTS: MapPoint[] = [
  {
    id: 'majestic',
    name: 'Kempegowda Bus Station (Majestic)',
    kannadaName: 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ',
    type: 'TRANSIT_HUB',
    coords: { x: 44, y: 48 },
    sceneId: 'bmtc-bus',
    scriptType: 'Pure Kannada',
    scanCount: 1420,
    recentSign: 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ - ಮೆಜೆಸ್ಟಿಕ್',
    description: 'Busiest transit interchange in Karnataka connecting city and interstate bus services.',
  },
  {
    id: 'malleshwaram',
    name: 'Malleshwaram 8th Cross (Darshini)',
    kannadaName: 'ಮಲ್ಲೇಶ್ವರಂ ೮ನೇ ಕ್ರಾಸ್',
    type: 'CULINARY_HUB',
    coords: { x: 42, y: 35 },
    sceneId: 'darshini-menu',
    scriptType: 'Pure Kannada',
    scanCount: 980,
    recentSign: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್ • ಮಸಾಲೆ ದೋಸೆ',
    description: 'Iconic traditional neighborhood famed for vintage Darshinis and classical markets.',
  },
  {
    id: 'mg-road',
    name: 'MG Road / Brigade Road',
    kannadaName: 'ಎಂ.ಜಿ. ರಸ್ತೆ',
    type: 'URBAN_CIVIC',
    coords: { x: 58, y: 52 },
    sceneId: 'traffic-sign',
    scriptType: 'Kanglish Bilingual',
    scanCount: 1850,
    recentSign: 'ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ • ನೋ ಪಾರ್ಕಿಂಗ್',
    description: 'Central commercial district featuring code-mixed urban traffic and retail signage.',
  },
  {
    id: 'begur-shasana',
    name: 'Begur Hero Stone (Shilashasana)',
    kannadaName: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಶಾಸನ',
    type: 'HERITAGE_EPIGRAPHY',
    coords: { x: 62, y: 82 },
    sceneId: 'shilashasana',
    scriptType: 'Halegannada (Old Kannada)',
    scanCount: 310,
    recentSign: 'ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್ (ಕ್ರಿ.ಶ. ೮೯೦)',
    description: 'Western Ganga-era hero stone documenting the oldest recorded mention of "Bengaluru".',
  },
  {
    id: 'vidhana-soudha',
    name: 'Vidhana Soudha & High Court',
    kannadaName: 'ವಿಧಾನ ಸೌಧ',
    type: 'URBAN_CIVIC',
    coords: { x: 50, y: 46 },
    sceneId: 'traffic-sign',
    scriptType: 'Pure Kannada',
    scanCount: 650,
    recentSign: 'ಸರ್ಕಾರದ ಕೆಲಸ ದೇವರ ಕೆಲಸ',
    description: 'Seat of Karnataka State Legislature built in Neo-Dravidian architecture.',
  },
  {
    id: 'kr-market',
    name: 'Krishna Rajendra Market',
    kannadaName: 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ',
    type: 'TRANSIT_HUB',
    coords: { x: 45, y: 58 },
    sceneId: 'bmtc-bus',
    scriptType: 'Pure Kannada',
    scanCount: 1120,
    recentSign: 'ಹೂವಿನ ಮಾರುಕಟ್ಟೆ (Flower Market)',
    description: 'Historic wholesale trading hub established during Krishnaraja Wadiyar IV era.',
  },
];

interface BengaluruMapProps {
  onSelectSceneById: (sceneId: string) => void;
  currentSceneId: string;
}

export const BengaluruMap: React.FC<BengaluruMapProps> = ({ onSelectSceneById, currentSceneId }) => {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint>(BENGALURU_POINTS[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredPoints = filterType === 'ALL'
    ? BENGALURU_POINTS
    : BENGALURU_POINTS.filter(p => p.type === filterType);

  return (
    <div className="bg-space-900 border border-slate-800 rounded-2xl p-5 shadow-hud flex flex-col gap-4">
      {/* Map Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-rajyotsava-gold" />
            <h3 className="text-base font-bold text-white">
              Linguistic Heatmap of Bengaluru (ನಗರ ಭಾಷಾ ನಕ್ಷೆ)
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Real-time geospatial distribution of scanned Kannada transit, culinary, and epigraphical signs
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'TRANSIT_HUB', 'CULINARY_HUB', 'HERITAGE_EPIGRAPHY'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                filterType === type
                  ? 'bg-rajyotsava-gold text-space-950 font-bold shadow-glow-gold'
                  : 'bg-space-850 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {type === 'ALL' ? 'All Hubs' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Map Viewport & Detail Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vector SVG Stylized Bengaluru Map */}
        <div className="lg:col-span-2 relative bg-space-950 border border-slate-800/80 rounded-xl overflow-hidden min-h-[380px] p-4 flex items-center justify-center">
          {/* Decorative Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* SVG Map of Bengaluru Urban Ring Roads & Lakes */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Outer Ring Road (ORR) curve */}
            <path
              d="M 20 50 C 20 20, 80 20, 80 50 C 80 80, 20 80, 20 50"
              fill="none"
              stroke="rgba(250, 204, 21, 0.12)"
              strokeWidth="0.8"
              strokeDasharray="2,2"
            />
            {/* Peripheral Ring Road */}
            <path
              d="M 12 50 C 12 10, 88 10, 88 50 C 88 90, 12 90, 12 50"
              fill="none"
              stroke="rgba(6, 182, 212, 0.08)"
              strokeWidth="0.6"
            />
            {/* Major Arterial Roads (MG Road, Bellary Rd, Hosur Rd) */}
            <line x1="44" y1="48" x2="85" y2="75" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="0.8" />
            <line x1="44" y1="48" x2="50" y2="10" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="0.8" />
            <line x1="44" y1="48" x2="15" y2="60" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="0.8" />
            {/* Ulsoor Lake representation */}
            <circle cx="56" cy="46" r="3.5" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
          </svg>

          {/* Interactive Landmark Pins */}
          {filteredPoints.map(point => {
            const isSelected = selectedPoint.id === point.id;
            const isCurrentScene = currentSceneId === point.sceneId;

            return (
              <button
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-10"
                style={{ left: `${point.coords.x}%`, top: `${point.coords.y}%` }}
              >
                {/* Heatmap pulse ring */}
                <div
                  className={`absolute -inset-2 rounded-full animate-ping opacity-30 ${
                    point.type === 'HERITAGE_EPIGRAPHY'
                      ? 'bg-purple-500'
                      : point.type === 'CULINARY_HUB'
                      ? 'bg-amber-500'
                      : 'bg-rajyotsava-gold'
                  }`}
                />

                {/* Pin Icon */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-rajyotsava-gold text-space-950 border-white shadow-glow-gold scale-110'
                      : isCurrentScene
                      ? 'bg-rajyotsava-crimson text-white border-rajyotsava-gold shadow-glow-crimson'
                      : 'bg-space-850 text-slate-300 border-slate-700 group-hover:border-rajyotsava-gold'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                {/* Label pill on hover or selection */}
                <span
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-space-900 border border-rajyotsava-gold text-rajyotsava-gold font-bold opacity-100'
                      : 'bg-space-950/80 text-slate-400 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {point.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Details Panel */}
        <div className="bg-space-850 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-rajyotsava-gold" />
                <span>Geospatial Node Details</span>
              </span>
              <span className="text-emerald-400 font-bold">
                {selectedPoint.scanCount} Sign Scans
              </span>
            </div>

            <h4 className="text-lg font-bold text-white mb-0.5">
              {selectedPoint.name}
            </h4>
            <div className="text-sm font-bold font-kannada text-rajyotsava-gold mb-3">
              {selectedPoint.kannadaName}
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                  Dominant Linguistic Category:
                </span>
                <span className="font-bold text-slate-200">
                  {selectedPoint.scriptType}
                </span>
              </div>

              <div className="bg-space-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">
                  Sample Signboard Text:
                </span>
                <span className="font-kannada font-bold text-rajyotsava-gold block text-sm">
                  {selectedPoint.recentSign}
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed pt-1">
                {selectedPoint.description}
              </p>
            </div>
          </div>

          {/* Action: Load Signboard into AR Canvas */}
          <button
            onClick={() => onSelectSceneById(selectedPoint.sceneId)}
            className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-gradient-to-r from-rajyotsava-gold to-amber-500 text-space-950 hover:brightness-110 shadow-glow-gold transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Signboard in Spatial AR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
