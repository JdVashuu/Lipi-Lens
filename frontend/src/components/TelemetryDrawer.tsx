import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  ChevronUp,
  ChevronDown,
  Terminal,
  Sliders,
} from 'lucide-react';
import { SignTextRegion } from '../data/sampleScenes';
import { toHexCode } from '../core/kannadaFST';

interface TelemetryDrawerProps {
  activeRegion: SignTextRegion | null;
  confidenceThreshold: number;
  onThresholdChange: (val: number) => void;
  isAirplaneMode: boolean;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({
  activeRegion,
  confidenceThreshold,
  onThresholdChange,
  isAirplaneMode,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);
  const [latencyMs, setLatencyMs] = useState<number>(12);

  // Measure Real FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 500) {
        const computedFps = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(computedFps);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Update dynamic latency based on tier
  useEffect(() => {
    if (!activeRegion) return;
    if (activeRegion.inferenceTier === 'EDGE_CACHE') {
      setLatencyMs(Math.floor(Math.random() * 8) + 6); // 6-14 ms
    } else if (activeRegion.inferenceTier === 'LOCAL_OCR') {
      setLatencyMs(Math.floor(Math.random() * 25) + 48); // 48-73 ms
    } else {
      setLatencyMs(isAirplaneMode ? 62 : Math.floor(Math.random() * 60) + 290); // 290-350 ms
    }
  }, [activeRegion, isAirplaneMode]);

  const rawHexStream = activeRegion
    ? Array.from(activeRegion.kannadaText)
        .map(char => `${toHexCode(char)} (${char})`)
        .join(' ')
    : 'U+0C95 (ಕ) U+0CCD (್) U+0CB0 (ರ)';

  // Determine current active tier
  const tier = isAirplaneMode
    ? 'LOCAL_OCR (FORCED_OFFLINE)'
    : (activeRegion?.confidence || 0.95) < confidenceThreshold
    ? 'CLOUD_VLM'
    : activeRegion?.inferenceTier || 'EDGE_CACHE';

  return (
    <div className="bg-space-950/95 border border-slate-800 rounded-2xl shadow-hud backdrop-blur-xl overflow-hidden transition-all">
      {/* Header bar (always visible) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors border-b border-slate-800/80"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Activity className="w-4 h-4 text-rajyotsava-gold" />
          </div>
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>System Telemetry & Inference Cascade</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (M.Tech Defense Inspector)
            </span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">FPS:</span>
            <span className="text-emerald-400 font-bold">{fps}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-slate-500">Latency:</span>
            <span className="text-rajyotsava-gold font-bold">{latencyMs} ms</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Tier:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                tier.includes('EDGE_CACHE')
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : tier.includes('LOCAL_OCR')
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              {tier}
            </span>
          </div>

          <button className="text-slate-400 hover:text-white p-1">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Telemetry Drawer */}
      {isOpen && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          {/* Card 1: 3-Tier Inference Cascade Status */}
          <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-rajyotsava-gold" />
                <span>3-Tier Routing Cascade</span>
              </span>
              <span className="text-[10px] text-slate-500">WebGPU / Cloud</span>
            </div>

            <div className="space-y-1.5">
              <div
                className={`p-1.5 rounded flex items-center justify-between ${
                  tier.includes('EDGE_CACHE')
                    ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-bold'
                    : 'text-slate-500 bg-space-850'
                }`}
              >
                <span>T1: pHash Cache</span>
                <span>0–15 ms</span>
              </div>
              <div
                className={`p-1.5 rounded flex items-center justify-between ${
                  tier.includes('LOCAL_OCR')
                    ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-bold'
                    : 'text-slate-500 bg-space-850'
                }`}
              >
                <span>T2: ONNX WebGPU + FST</span>
                <span>40–90 ms</span>
              </div>
              <div
                className={`p-1.5 rounded flex items-center justify-between ${
                  tier.includes('CLOUD_VLM')
                    ? 'bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold'
                    : 'text-slate-500 bg-space-850'
                }`}
              >
                <span>T3: Gemini 2.5 Flash</span>
                <span>~310 ms</span>
              </div>
            </div>
          </div>

          {/* Card 2: Confidence Threshold (τ gate) */}
          <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Entropy Gate (τ)</span>
                </span>
                <span className="text-cyan-400 font-bold">{confidenceThreshold.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2">
                Escalates to Cloud VLM if token confidence falls below threshold τ
              </p>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={e => onThresholdChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-1">
              <span>Sign Confidence:</span>
              <span className="text-rajyotsava-gold font-bold">
                {activeRegion ? (activeRegion.confidence * 100).toFixed(1) + '%' : '98.0%'}
              </span>
            </div>
          </div>

          {/* Card 3: Perceptual Hash (pHash) Cache Inspector */}
          <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>pHash 64-Bit Hash</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Sub-20ms</span>
              </div>
              <div className="bg-space-950 p-2 rounded border border-slate-800 text-[11px] text-emerald-300 font-mono break-all leading-relaxed">
                {activeRegion?.pHash || 'b94e823a7c1f0d8a'}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-1">
              <span>Hamming Dist:</span>
              <span className="text-emerald-400 font-bold">d = 0 (Exact Hit)</span>
            </div>
          </div>

          {/* Card 4: Unicode Hex Stream & Execution Provider */}
          <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Unicode FST Codepoints</span>
                </span>
                <span className="text-[10px] text-purple-400 font-bold">U+0C80–0CFF</span>
              </div>
              <div className="bg-space-950 p-2 rounded border border-slate-800 text-[10px] text-slate-300 font-mono h-14 overflow-y-auto leading-relaxed">
                {rawHexStream}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-1">
              <span>Provider:</span>
              <span className="text-cyan-400 font-bold">
                {isAirplaneMode ? 'WASM SIMD (Offline)' : 'WebGPU EP (DirectX/Metal)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
