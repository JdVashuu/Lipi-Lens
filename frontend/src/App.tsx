import React, { useState, useMemo, useEffect } from 'react';
import {
  Scan,
  Sparkles,
  Plane,
  Layers,
  MapPin,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  History,
  Heart,
  BookmarkCheck,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SAMPLE_SCENES, SampleScene, SignTextRegion } from './data/sampleScenes';
import { ARCanvas, ARDisplayMode } from './components/ARCanvas';
import { AksharaXRayTree } from './components/AksharaXRayTree';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { KannadaKali } from './components/KannadaKali';
import { HeritageTimeline } from './components/HeritageTimeline';
import { KarnatakaUnityMap } from './components/KarnatakaUnityMap';
import { KanglishConverter } from './components/KanglishConverter';
import { AccessibilityBar } from './components/AccessibilityBar';
import { parseKannadaText, WordAnalysis } from './core/kannadaFST';
import { saveJournalEntry } from './core/lipiJournal';

export type MainTab = 'SCAN_AR' | 'KANNADA_KALI' | 'HERITAGE_TIMELINE' | 'UNITY_MAP' | 'KANGLISH';

export const App: React.FC = () => {
  // Navigation & Scene
  const [activeTab, setActiveTab] = useState<MainTab>('SCAN_AR');
  const [currentScene, setCurrentScene] = useState<SampleScene>(SAMPLE_SCENES[0]);
  const [selectedRegion, setSelectedRegion] = useState<SignTextRegion>(SAMPLE_SCENES[0].regions[0]);

  // View & Filter States
  const [displayMode, setDisplayMode] = useState<ARDisplayMode>('ENGLISH');
  const [shilashasanaFilter, setShilashasanaFilter] = useState<boolean>(false);
  const [isAirplaneMode, setIsAirplaneMode] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);

  // Accessibility States
  const [isAudioFirst, setIsAudioFirst] = useState<boolean>(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Akshara X-Ray Modal Word Target
  const [modalWord, setModalWord] = useState<string | null>(null);

  // Defense Cheat Sheet Modal
  const [showDefenseModal, setShowDefenseModal] = useState<boolean>(false);

  // Preserve Notification
  const [preserveSuccess, setPreserveSuccess] = useState<string | null>(null);

  // Compute FST Analysis for currently selected region
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

  // Audio-First Readout when region changes
  useEffect(() => {
    if (isAudioFirst && selectedRegion) {
      const msg = `${selectedRegion.kannadaText}. Meaning: ${selectedRegion.englishTranslation}`;
      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis?.speak(utterance);
    }
  }, [selectedRegion, isAudioFirst]);

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
      setActiveTab('SCAN_AR');
    }
  };

  const handleSaveToJournal = () => {
    if (!selectedRegion) return;
    saveJournalEntry({
      word: selectedRegion.kannadaText,
      transliteration: selectedRegion.transliteration,
      englishMeaning: selectedRegion.englishTranslation,
      sourceSignboard: currentScene.title,
    });
    setPreserveSuccess(`"${selectedRegion.kannadaText}" ದಿನಚರಿಗೆ ಸೇರಿಸಲಾಗಿದೆ (Saved to Lipi Journal!)`);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 }, colors: ['#FACC15', '#E11D48'] });
    setTimeout(() => setPreserveSuccess(null), 3500);
  };

  const handlePreserveSign = () => {
    handleSaveToJournal();
  };

  const handleExportHeritageJSON = () => {
    const payload = {
      archive: 'LipiLens-X Kannada Community Heritage Archive',
      exportedAt: new Date().toISOString(),
      currentLocation: currentScene.location,
      sign: selectedRegion,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lipilens_heritage_${currentScene.id}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans ${isLargeText ? 'text-base' : 'text-sm'} ${isHighContrast ? 'contrast-125' : ''}`}>
      {/* Occasion & Problem Statement Global Banner (Visible in every demo screen) */}
      <div className="bg-gradient-to-r from-rajyotsava-crimson via-red-900 to-amber-600 text-white px-4 py-1.5 text-xs flex items-center justify-between border-b border-rajyotsava-gold/40 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="font-bold font-kannada bg-black/30 px-2 py-0.5 rounded text-rajyotsava-gold">
            💛❤️ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು (Happy Kannada Rajyotsava)
          </span>
          <span className="text-white/90 hidden sm:inline">
            • ಲಿಪಿ ಲೆನ್ಸ್ / Lipi Lens: "Read the city. Connect with 1,500+ years of Kannada."
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-yellow-200 shrink-0">
          <span>೧ ನವೆಂಬರ್ ಏಕೀಕರಣ ದಿನ (1 Nov 1956)</span>
        </div>
      </div>

      {/* Main Bilingual Application Header */}
      <header className="sticky top-0 z-40 bg-space-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rajyotsava-crimson via-red-600 to-rajyotsava-gold flex items-center justify-center text-space-950 font-black text-xl font-kannada shadow-glow-gold">
              ಲಿ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="font-kannada text-rajyotsava-gold font-bold">ಲಿಪಿ ಲೆನ್ಸ್</span>
                  <span className="text-slate-400">|</span>
                  <span>Lipi Lens</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rajyotsava-gold/15 text-rajyotsava-gold border border-rajyotsava-gold/30">
                  WebGPU v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                ನಗರವನ್ನು ಓದಿ • ೧,೫೦೦+ ವರ್ಷಗಳ ಕನ್ನಡವನ್ನು ಅರಿಯಿರಿ (Read the city. Connect with heritage.)
              </p>
            </div>
          </div>

          {/* Bilingual Primary Tabs */}
          <nav className="flex items-center gap-1 bg-space-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('SCAN_AR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'SCAN_AR'
                  ? 'bg-space-800 text-rajyotsava-gold font-bold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>೧. ಸ್ಕ್ಯಾನರ್ (Scan & AR)</span>
            </button>

            <button
              onClick={() => setActiveTab('KANNADA_KALI')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'KANNADA_KALI'
                  ? 'bg-space-800 text-cyan-400 font-bold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>೨. ಕನ್ನಡ ಕಲಿ (Learn)</span>
            </button>

            <button
              onClick={() => setActiveTab('HERITAGE_TIMELINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'HERITAGE_TIMELINE'
                  ? 'bg-space-800 text-purple-400 font-bold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>೩. ಯುಗಗಳು (Ages)</span>
            </button>

            <button
              onClick={() => setActiveTab('UNITY_MAP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'UNITY_MAP'
                  ? 'bg-space-800 text-emerald-400 font-bold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>೪. ಏಕೀಕರಣ (Unity Map)</span>
            </button>

            <button
              onClick={() => setActiveTab('KANGLISH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'KANGLISH'
                  ? 'bg-space-800 text-pink-400 font-bold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>೫. ಕಾಂಗ್ಲಿಷ್ (Kanglish)</span>
            </button>
          </nav>

          {/* Quick Toggles: Shilashasana, Airplane Mode, Defense Guide */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShilashasanaFilter(!shilashasanaFilter)}
              title="ಶಿಲಾಶಾಸನ ಕಾಂಟ್ರಾಸ್ಟ್ ಫಿಲ್ಟರ್ (CLAHE Epigraphical Filter)"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all ${
                shilashasanaFilter
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/60 shadow-glow-cyan'
                  : 'bg-space-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ಶಿಲಾಶಾಸನ (Shilashasana)</span>
            </button>

            <button
              onClick={() => setIsAirplaneMode(!isAirplaneMode)}
              title="೧೦೦% ಆಫ್‌ಲೈನ್ ಸಾಧನ ಪರೀಕ್ಷೆ (100% Offline Edge Mode)"
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 border transition-all ${
                isAirplaneMode
                  ? 'bg-emerald-500 text-space-950 border-emerald-400 shadow-glow-cyan'
                  : 'bg-space-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Plane className="w-3.5 h-3.5" />
              <span>{isAirplaneMode ? 'Offline Edge' : 'Airplane'}</span>
            </button>

            <button
              onClick={() => setShowDefenseModal(true)}
              className="p-2 rounded-xl bg-space-900 border border-slate-800 text-slate-400 hover:text-white hover:border-rajyotsava-gold transition-colors"
              title="ನ್ಯಾಯಾಧೀಶರ ಮಾರ್ಗದರ್ಶಿ (Judge Defense Cheat Sheet)"
            >
              <HelpCircle className="w-4 h-4 text-rajyotsava-gold" />
            </button>
          </div>
        </div>
      </header>

      {/* Preservation Success Toast */}
      {preserveSuccess && (
        <div className="bg-emerald-950 border border-emerald-500/60 text-emerald-300 px-4 py-2 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan">
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>{preserveSuccess}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto w-full p-4 flex-1 flex flex-col gap-5">
        {/* Accessibility & Heritage Contribution Ribbon */}
        <AccessibilityBar
          isAudioFirst={isAudioFirst}
          onToggleAudioFirst={setIsAudioFirst}
          isLargeText={isLargeText}
          onToggleLargeText={setIsLargeText}
          isHighContrast={isHighContrast}
          onToggleHighContrast={setIsHighContrast}
          onPreserveSign={handlePreserveSign}
          onExportHeritageJSON={handleExportHeritageJSON}
        />

        {/* TAB 1: Scan & Understand (Spatial AR Core) */}
        {activeTab === 'SCAN_AR' && (
          <>
            {/* Gallery of 8 Demo Benchmark Signs */}
            <div className="bg-space-900/90 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Layers className="w-3.5 h-3.5 text-rajyotsava-gold" />
                  <span>೮ ಮಾದರಿ ಫಲಕಗಳು | Gallery of 8 Benchmark Demo Signs:</span>
                </span>
                <span className="text-rajyotsava-gold">{SAMPLE_SCENES.length} Scenes Available</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {SAMPLE_SCENES.map((scene, idx) => {
                  const isActive = currentScene.id === scene.id;
                  return (
                    <button
                      key={scene.id}
                      onClick={() => handleSelectScene(scene)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all flex items-center gap-2 ${
                        isActive
                          ? 'bg-space-850 text-rajyotsava-gold border-rajyotsava-gold shadow-glow-gold/30 font-bold'
                          : 'bg-space-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-space-800 text-[10px] font-mono flex items-center justify-center text-slate-400">
                        {idx + 1}
                      </span>
                      <span className="font-kannada text-sm">{scene.kannadaTitle.split(' ')[0]}</span>
                      <span className="text-slate-400 font-sans text-[11px] truncate">{scene.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 flex-wrap gap-2">
                <div className="text-xs text-slate-400 font-mono">
                  {currentScene.location}
                </div>

                <div className="bg-space-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    onClick={() => setDisplayMode('KANNADA')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      displayMode === 'KANNADA'
                        ? 'bg-space-800 text-rajyotsava-gold font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ಕನ್ನಡ (Original)
                  </button>
                  <button
                    onClick={() => setDisplayMode('TRANSLITERATION')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      displayMode === 'TRANSLITERATION'
                        ? 'bg-space-800 text-cyan-400 font-bold shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ಉಚ್ಚಾರಣೆ (Phonetic)
                  </button>
                  <button
                    onClick={() => setDisplayMode('ENGLISH')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      displayMode === 'ENGLISH'
                        ? 'bg-gradient-to-r from-rajyotsava-gold to-amber-500 text-space-950 font-bold shadow-glow-gold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AR ಹೈಜಾಕ್ (English)
                  </button>
                </div>
              </div>
            </div>

            {/* Split View: AR Viewport & Detected Regions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: 3D AR Canvas (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <ARCanvas
                  currentScene={currentScene}
                  displayMode={displayMode}
                  shilashasanaFilter={shilashasanaFilter}
                  onSelectRegion={region => setSelectedRegion(region)}
                  selectedRegionId={selectedRegion?.id}
                  isAirplaneMode={isAirplaneMode}
                  onOpenXRayModal={word => setModalWord(word)}
                />

                {/* Cultural & Linguistic Context Card */}
                {selectedRegion && (
                  <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-rajyotsava-gold" />
                        <span>ಜ್ಞಾನ ದೀಪ | Cultural & Etymological Context</span>
                      </span>
                      <button
                        onClick={handleSaveToJournal}
                        className="px-2.5 py-1 rounded-lg bg-rajyotsava-gold/15 text-rajyotsava-gold hover:bg-rajyotsava-gold/25 border border-rajyotsava-gold/30 text-xs font-mono flex items-center gap-1 transition-all"
                      >
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>ದಿನಚರಿಗೆ ಸೇರಿಸಿ (Save to Journal)</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedRegion.culturalNote}
                    </p>

                    {selectedRegion.sandhiNote && (
                      <div className="mt-1 pt-2 border-t border-slate-800 text-[11px] font-mono text-rajyotsava-gold flex items-center gap-2">
                        <span className="text-slate-500 font-sans">ವ್ಯಾಕರಣ (Grammar):</span>
                        <span>{selectedRegion.sandhiNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Detected Regions List (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-space-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                    <span className="font-bold flex items-center gap-1.5 text-white">
                      <Scan className="w-3.5 h-3.5 text-rajyotsava-crimson" />
                      <span>ಗುರುತಿಸಿದ ಪಠ್ಯ (Detected Text):</span>
                    </span>
                    <span className="text-rajyotsava-gold font-bold">
                      {currentScene.regions.length} Segments
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentScene.regions.map(region => {
                      const isSelected = selectedRegion?.id === region.id;
                      return (
                        <div
                          key={region.id}
                          onClick={() => setSelectedRegion(region)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-space-850 border-rajyotsava-gold shadow-glow-gold/20'
                              : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
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

                {/* Judge Stage Tip */}
                <div className="bg-space-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Sparkles className="w-4 h-4 text-rajyotsava-gold" />
                    <span>ನ್ಯಾಯಾಧೀಶರ ವೇದಿಕೆ ಸುಳಿವು (Stage Tip)</span>
                  </div>
                  <p className="leading-relaxed">
                    Adjust the <strong className="text-rajyotsava-gold">Pitch & Yaw sliders</strong> or drag the 4 corner pins. Observe the English translation perspective-warp directly to the physical sign at 60 FPS!
                  </p>
                </div>
              </div>
            </div>

            {/* In-Line Akshara X-Ray Component */}
            <AksharaXRayTree analysis={currentFSTAnalysis} />
          </>
        )}

        {/* TAB 2: Kannada Kali (Spaced Repetition & 50-Word Challenge) */}
        {activeTab === 'KANNADA_KALI' && (
          <KannadaKali onOpenXRay={(word) => setModalWord(word)} />
        )}

        {/* TAB 3: Heritage Timeline (1,500+ Years & Shilashasana) */}
        {activeTab === 'HERITAGE_TIMELINE' && (
          <HeritageTimeline />
        )}

        {/* TAB 4: Karnataka Unity Map */}
        {activeTab === 'UNITY_MAP' && (
          <KarnatakaUnityMap onLoadScene={handleSelectSceneById} />
        )}

        {/* TAB 5: Kanglish to Kannada Welcoming Converter */}
        {activeTab === 'KANGLISH' && (
          <KanglishConverter onOpenXRay={(word) => setModalWord(word)} />
        )}

        {/* Real Measured Telemetry HUD Drawer (Always visible at bottom) */}
        <TelemetryDrawer
          activeRegion={selectedRegion}
          confidenceThreshold={confidenceThreshold}
          onThresholdChange={setConfidenceThreshold}
          isAirplaneMode={isAirplaneMode}
          onToggleAirplaneMode={setIsAirplaneMode}
        />
      </main>

      {/* Floating Akshara X-Ray Modal if triggered */}
      {modalWord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full">
            <AksharaXRayTree targetWord={modalWord} onClose={() => setModalWord(null)} />
          </div>
        </div>
      )}

      {/* M.Tech Judge Defense Cheat Sheet Modal */}
      {showDefenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-space-900 border border-rajyotsava-gold/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rajyotsava-gold" />
                <h3 className="text-base font-bold text-white">
                  ನ್ಯಾಯಾಧೀಶರ ಮಾರ್ಗದರ್ಶಿ | Judge Defense Cheat Sheet (M.Tech Ready)
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
                  <strong>Tier 1 (0–15ms):</strong> Perceptual hash (`pHash`) check against local cache.<br />
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
                ಅರ್ಥವಾಯಿತು (Got It)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Mandatory Closing Line */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-400 font-mono flex flex-col gap-1 items-center justify-center">
        <div className="font-kannada text-rajyotsava-gold font-bold text-sm">
          "The language lives on in those who can read it. Lipi Lens helps every Kannadiga, old and new, read their city."
        </div>
        <div className="text-[11px] text-slate-500">
          ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ದಿನಾಚರಣೆಯ ಕೊಡುಗೆ • Lipi Lens (ಲಿಪಿ ಲೆನ್ಸ್)
        </div>
      </footer>
    </div>
  );
};

export default App;
