import React from 'react';
import {
  Volume2,
  Eye,
  Sun,
  Download,
  BookmarkPlus,
} from 'lucide-react';

interface AccessibilityProps {
  isAudioFirst: boolean;
  onToggleAudioFirst: (val: boolean) => void;
  isLargeText: boolean;
  onToggleLargeText: (val: boolean) => void;
  isHighContrast: boolean;
  onToggleHighContrast: (val: boolean) => void;
  onPreserveSign: () => void;
  onExportHeritageJSON: () => void;
}

export const AccessibilityBar: React.FC<AccessibilityProps> = ({
  isAudioFirst,
  onToggleAudioFirst,
  isLargeText,
  onToggleLargeText,
  isHighContrast,
  onToggleHighContrast,
  onPreserveSign,
  onExportHeritageJSON,
}) => {
  return (
    <div className="bg-space-950/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
      {/* Accessibility Toggles */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>ಸುಲಭ ಲಭ್ಯತೆ (Accessibility):</span>
        </span>

        {/* Audio First Toggle */}
        <button
          onClick={() => onToggleAudioFirst(!isAudioFirst)}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
            isAudioFirst
              ? 'bg-rajyotsava-gold text-space-950 font-bold border-rajyotsava-gold shadow-glow-gold'
              : 'bg-space-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
          aria-label="Toggle Audio-First Mode for low-vision users"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>ಧ್ವನಿ-ಪ್ರಥಮ (Audio-First Mode)</span>
        </button>

        {/* Large Text Toggle */}
        <button
          onClick={() => onToggleLargeText(!isLargeText)}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
            isLargeText
              ? 'bg-space-800 text-white font-bold border-cyan-400'
              : 'bg-space-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
          aria-label="Toggle Large Text Size"
        >
          <span className="font-bold">A+</span>
          <span>ದೊಡ್ಡ ಅಕ್ಷರ (Large Text)</span>
        </button>

        {/* High Contrast */}
        <button
          onClick={() => onToggleHighContrast(!isHighContrast)}
          className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
            isHighContrast
              ? 'bg-space-800 text-rajyotsava-gold font-bold border-rajyotsava-gold'
              : 'bg-space-900 border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
          aria-label="Toggle High Contrast Mode"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ (High Contrast)</span>
        </button>
      </div>

      {/* Stretch Feature 10: Preserve Kannada Button & JSON Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPreserveSign}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-rajyotsava-crimson to-rose-700 hover:brightness-110 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all border border-rose-500/40"
          title="Save this signboard or inscription photo to the community heritage preservation gallery"
          aria-label="Preserve Kannada Signboard"
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>ಕನ್ನಡ ಸಂರಕ್ಷಿಸಿ (Preserve Kannada)</span>
        </button>

        <button
          onClick={onExportHeritageJSON}
          className="p-1.5 rounded-lg bg-space-900 hover:bg-space-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
          title="Export community preserved signs as GeoJSON / JSON archive"
          aria-label="Export Heritage JSON"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
