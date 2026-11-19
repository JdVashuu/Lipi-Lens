import React, { useState, useMemo } from 'react';
import {
  Scan,
  Sparkles,
  Plane,
  Layers,
  MapPin,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SAMPLE_SCENES, SampleScene, SignTextRegion } from './data/sampleScenes';
import { ARCanvas, ARDisplayMode } from './components/ARCanvas';
import { AksharaXRayTree } from './components/AksharaXRayTree';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { BengaluruMap } from './components/BengaluruMap';
import { parseKannadaText, WordAnalysis } from './core/kannadaFST';

export const App: React.FC = () => {
  // Current Scene
  const [currentScene, setCurrentScene] = useState<SampleScene>(SAMPLE_SCENES[0]);
  const [selectedRegion, setSelectedRegion] = useState<SignTextRegion>(SAMPLE_SCENES[0].regions[0]);

  // Display and Feature Modes
  const [displayMode, setDisplayMode] = useState<ARDisplayMode>('ENGLISH');
  const [shilashasanaFilter, setShilashasanaFilter] = useState<boolean>(false);
  const [isAirplaneMode, setIsAirplaneMode] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);

  // Active Tab: AR_STUDIO or GEOSPATIAL_HEATMAP
  const [activeTab, setActiveTab] = useState<'AR_STUDIO' | 'GEOSPATIAL_MAP'>('AR_STUDIO');

  // Defense Cheat-Sheet Modal
  const [showDefenseModal, setShowDefenseModal] = useState<boolean>(false);

  // Compute Unicode FST analysis for currently selected region's Kannada text
  const currentFSTAnalysis: WordAnalysis = useMemo(() => {
    const text = selectedRegion ? selectedRegion.kannadaText : currentScene.regions[0].kannadaText;
    const analyses = parseKannadaText(text);
    return analyses[0] || {
      word: text,
      aksharas: [],
      ipa: '',
      transliteration: '',
    };
  }, [selectedRegion, currentScene]);

  // Handle scene change
  const handleSelectScene = (scene: SampleScene) => {
    setCurrentScene(scene);
    setSelectedRegion(scene.regions[0]);
    if (scene.id === 'shilashasana') {
      setShilashasanaFilter(true);
    } else {
      setShilashasanaFilter(false);
    }
  };

  const handleSelectSceneById = (sceneId: string) => {
    const found = SAMPLE_SCENES.find(s => s.id === sceneId);
    if (found) {
      handleSelectScene(found);
      setActiveTab('AR_STUDIO');
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-50 bg-space-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rajyotsava-crimson to-rajyotsava-gold flex items-center justify-center text-space-950 font-black text-xl font-kannada shadow-glow-gold">
              ಲಿ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>LipiLens-X</span>
                  <span className="font-kannada text-rajyotsava-gold font-bold">(ಲಿಪಿ ಲೆನ್ಸ್-X)</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rajyotsava-gold/15 text-rajyotsava-gold border border-rajyotsava-gold/30">
                  v2.0 WebGPU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Edge-Native Spatial AR & Neuro-Symbolic Kannada Script Intelligence
              </p>
            </div>
          </div>

          {/* Quick Action Toggles */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Switcher: AR Studio vs Map */}
            <div className="bg-space-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setActiveTab('AR_STUDIO')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'AR_STUDIO'
                    ? 'bg-space-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scan className="w-3.5 h-3.5 text-rajyotsava-gold" />
                <span>Spatial AR</span>
              </button>
              <button
                onClick={() => setActiveTab('GEOSPATIAL_MAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'GEOSPATIAL_MAP'
                    ? 'bg-space-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Linguistic Map</span>
              </button>
            </div>

            {/* Shilashasana Filter Toggle */}
            <button
              onClick={() => setShilashasanaFilter(!shilashasanaFilter)}
              title="Enhance low-contrast historical stone inscriptions"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                shilashasanaFilter
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/60 shadow-glow-cyan'
                  : 'bg-space-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Shilashasana Mode</span>
            </button>

            {/* Airplane Mode (Offline Stress Test Toggle) */}
            <button
              onClick={() => setIsAirplaneMode(!isAirplaneMode)}
              title="Test 100% offline edge processing on device"
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
                isAirplaneMode
                  ? 'bg-emerald-500 text-space-950 border-emerald-400 shadow-glow-cyan'
                  : 'bg-space-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{isAirplaneMode ? 'Offline Active' : 'Airplane Mode'}</span>
            </button>

            {/* M.Tech Defense Q&A Modal Trigger */}
            <button
              onClick={() => setShowDefenseModal(true)}
              className="p-2 rounded-xl bg-space-900 border border-slate-800 text-slate-400 hover:text-white hover:border-rajyotsava-gold transition-colors"
              title="Judge Q&A Defense Cheat Sheet"
            >
              <HelpCircle className="w-4 h-4 text-rajyotsava-gold" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-1 flex flex-col gap-5">
        {activeTab === 'AR_STUDIO' ? (
          <>
            {/* Benchmark Scenes Ribbon */}
            <div className="bg-space-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-rajyotsava-gold" />
                  <span>Benchmark Signboards:</span>
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {SAMPLE_SCENES.map(scene => {
                  const isActive = currentScene.id === scene.id;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => handleSelectScene(scene)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-space-800 text-rajyotsava-gold border-rajyotsava-gold shadow-glow-gold/30 font-bold'
                          : 'bg-space-850/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-kannada text-sm">{scene.kannadaTitle.split(' ')[0]}</span>
                      <span>{scene.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* AR Warping Text Mode Switcher */}
              <div className="bg-space-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 w-full md:w-auto">
                <button
                  onClick={() => setDisplayMode('KANNADA')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    displayMode === 'KANNADA'
                      ? 'bg-space-800 text-rajyotsava-gold font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Kannada
                </button>
                <button
                  onClick={() => setDisplayMode('TRANSLITERATION')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    displayMode === 'TRANSLITERATION'
                      ? 'bg-space-800 text-cyan-400 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Phonetic
                </button>
                <button
                  onClick={() => setDisplayMode('ENGLISH')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    displayMode === 'ENGLISH'
                      ? 'bg-gradient-to-r from-rajyotsava-gold to-amber-500 text-space-950 font-bold shadow-glow-gold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AR Hijack (English)
                </button>
              </div>
            </div>

            {/* Core Split View: Spatial AR Viewport + Region Inspection */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Spatial AR Canvas (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <ARCanvas
                  currentScene={currentScene}
                  displayMode={displayMode}
                  shilashasanaFilter={shilashasanaFilter}
                  onSelectRegion={region => setSelectedRegion(region)}
                  selectedRegionId={selectedRegion?.id}
                  isAirplaneMode={isAirplaneMode}
                />

                {/* Cultural & Linguistic Context Card */}
                {selectedRegion && (
                  <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-rajyotsava-gold" />
                        <span>Cultural & Etymological Context (ಜ್ಞಾನ ದೀಪ)</span>
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                        {currentScene.location}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedRegion.culturalNote}
                    </p>

                    {selectedRegion.sandhiNote && (
                      <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] font-mono text-rajyotsava-gold flex items-center gap-2">
                        <span className="text-slate-500">Grammar Note:</span>
                        <span>{selectedRegion.sandhiNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Detected Regions & Akshara X-Ray (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Detected Regions List */}
                <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="font-bold flex items-center gap-1.5">
                      <Scan className="w-3.5 h-3.5 text-rajyotsava-crimson" />
                      <span>Detected Text Polygons:</span>
                    </span>
                    <span className="text-rajyotsava-gold font-bold">
                      {currentScene.regions.length} Segments
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentScene.regions.map(region => {
                      const isSelected = selectedRegion?.id === region.id;
                      return (
                        <div
                          key={region.id}
                          onClick={() => setSelectedRegion(region)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-space-850 border-rajyotsava-gold shadow-glow-gold/20'
                              : 'bg-space-950/50 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-lg font-bold font-kannada text-white">
                              {region.kannadaText}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                region.inferenceTier === 'EDGE_CACHE'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : region.inferenceTier === 'LOCAL_OCR'
                                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {region.inferenceTier}
                            </span>
                          </div>

                          <div className="text-xs font-mono text-slate-400">
                            {region.transliteration}
                          </div>

                          <div className="text-xs font-semibold text-rajyotsava-gold mt-1">
                            {region.englishTranslation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Hint Card */}
                <div className="bg-space-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-rajyotsava-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200 block mb-0.5">Judge Tip: Interactive 3D Perspective</span>
                    Adjust the <span className="text-rajyotsava-gold">Pitch & Yaw</span> sliders or drag the corner pins to watch the translated text lock onto the signboard in 3D!
                  </div>
                </div>
              </div>
            </div>

            {/* Neuro-Symbolic Akshara X-Ray Component */}
            <AksharaXRayTree analysis={currentFSTAnalysis} />
          </>
        ) : (
          /* Geospatial Linguistic Heatmap Tab */
          <BengaluruMap
            onSelectSceneById={handleSelectSceneById}
            currentSceneId={currentScene.id}
          />
        )}

        {/* System Telemetry HUD Drawer (Always Docked at Bottom) */}
        <TelemetryDrawer
          activeRegion={selectedRegion}
          confidenceThreshold={confidenceThreshold}
          onThresholdChange={setConfidenceThreshold}
          isAirplaneMode={isAirplaneMode}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) • Built for Kannada Rajyotsava Hackathon • Edge-Native Spatial AR & Unicode FST Deconstructor
      </footer>

      {/* M.Tech Judge Defense Cheat Sheet Modal */}
      {showDefenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-space-900 border border-rajyotsava-gold/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rajyotsava-gold" />
                <h3 className="text-base font-bold text-white">
                  Judge Defense Cheat Sheet (M.Tech Ready)
                </h3>
              </div>
              <button
                onClick={() => setShowDefenseModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="bg-space-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-rajyotsava-gold text-sm mb-1">
                  1. "Why not just use Google Lens?"
                </h4>
                <p className="text-slate-300">
                  Google Lens is a consumer black-box translator: it fails completely offline on moving BMTC buses, doesn't teach the script, cannot decompose Kannada <em>ottaksharas</em> or <em>sandhi</em> grammar for learners, and lacks specialized epigraphical filters for weathered <em>Shilashasana</em> stone monuments.
                </p>
              </div>

              <div className="bg-space-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-rajyotsava-gold text-sm mb-1">
                  2. "How do you handle Kannada's 49 base characters and thousands of conjuncts?"
                </h4>
                <p className="text-slate-300">
                  Instead of forcing a neural classifier to memorize thousands of visual conjunct classes, we decouple <strong>visual glyph detection</strong> from <strong>linguistic structure</strong> using a deterministic Unicode Finite-State Transducer (`U+0C80–U+0CFF`).
                </p>
              </div>

              <div className="bg-space-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-rajyotsava-gold text-sm mb-1">
                  3. "What happens on low-end Android phones without WebGPU?"
                </h4>
                <p className="text-slate-300">
                  ONNX Runtime Web automatically falls back from the WebGPU execution provider to <strong>WASM SIMD</strong> threads, dropping frame sampling from 30 FPS to 5 FPS keyframe tracking while keeping the spatial UI responsive.
                </p>
              </div>

              <div className="bg-space-950 p-3.5 rounded-xl border border-slate-800">
                <h4 className="font-bold text-rajyotsava-gold text-sm mb-1">
                  4. "What is the 3-Tier Inference Cascade?"
                </h4>
                <p className="text-slate-300">
                  <strong>Tier 1 (0–15ms):</strong> Perceptual hash (`pHash`) check against cache.<br />
                  <strong>Tier 2 (40–90ms):</strong> Edge GPU Indic OCR + Unicode FST decomposition.<br />
                  <strong>Tier 3 (Fallback):</strong> Cloud VLM (Gemini 2.5 Flash) triggered only when token confidence &lt; 0.85.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDefenseModal(false)}
                className="px-4 py-2 rounded-xl bg-rajyotsava-gold text-space-950 font-bold text-xs shadow-glow-gold hover:brightness-110"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
