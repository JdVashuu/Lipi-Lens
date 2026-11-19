import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Camera,
  Sliders,
  Scan,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { SampleScene, SignTextRegion } from '../data/sampleScenes';
import {
  Quad,
  Point2D,
  computeHomography,
  homographyToCSSMatrix3D,
  rotateQuad3D,
  sampleBorderColor,
} from '../core/homography';
import { renderSceneToCanvas } from '../core/sceneRenderer';

export type ARDisplayMode = 'KANNADA' | 'TRANSLITERATION' | 'ENGLISH' | 'MORPH_ALL';

interface ARCanvasProps {
  currentScene: SampleScene;
  displayMode: ARDisplayMode;
  shilashasanaFilter: boolean;
  onSelectRegion: (region: SignTextRegion) => void;
  selectedRegionId?: string;
  isAirplaneMode?: boolean;
}

export const ARCanvas: React.FC<ARCanvasProps> = ({
  currentScene,
  displayMode,
  shilashasanaFilter,
  onSelectRegion,
  selectedRegionId,
  isAirplaneMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 3D Perspective Controls (Pitch, Yaw, Roll)
  const [pitch, setPitch] = useState<number>(currentScene.defaultPitch);
  const [yaw, setYaw] = useState<number>(currentScene.defaultYaw);
  const [roll, setRoll] = useState<number>(currentScene.defaultRoll);

  // Camera Mode
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Interactive Pin Dragging
  const [draggingPin, setDraggingPin] = useState<{ regionId: string; cornerIndex: number } | null>(null);
  const [customQuads, setCustomQuads] = useState<Record<string, Quad>>({});

  // Reset 3D angles when scene changes
  useEffect(() => {
    setPitch(currentScene.defaultPitch);
    setYaw(currentScene.defaultYaw);
    setRoll(currentScene.defaultRoll);
    setCustomQuads({});
  }, [currentScene]);

  // Handle Live Camera Stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.warn('Camera access error:', err);
          setCameraError('Camera unavailable or permission denied. Reverting to benchmark scene.');
          setIsLiveCamera(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isLiveCamera]);

  // Main Canvas Render Loop
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = currentScene.canvasWidth;
    const h = currentScene.canvasHeight;
    canvas.width = w;
    canvas.height = h;

    if (isLiveCamera && videoRef.current && videoRef.current.readyState >= 2) {
      // Draw live video feed
      ctx.drawImage(videoRef.current, 0, 0, w, h);
    } else {
      // Draw synthetic high-fidelity benchmark scene
      renderSceneToCanvas(ctx, currentScene, w, h, {
        showOriginalText: displayMode === 'KANNADA',
        shilashasanaFilter,
        claheStrength: 1.5,
      });
    }

    // Draw Inpainting and Bounding Overlays
    const center: Point2D = { x: w / 2, y: h / 2 };

    for (const region of currentScene.regions) {
      const isSelected = region.id === selectedRegionId;
      const baseQuad = customQuads[region.id] || region.quad;
      const transformedQuad = rotateQuad3D(baseQuad, pitch, yaw, roll, center);

      // Inpainting Mask when in Translated / Transliteration mode
      if (displayMode !== 'KANNADA' && !isLiveCamera) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(transformedQuad[0].x, transformedQuad[0].y);
        ctx.lineTo(transformedQuad[1].x, transformedQuad[1].y);
        ctx.lineTo(transformedQuad[2].x, transformedQuad[2].y);
        ctx.lineTo(transformedQuad[3].x, transformedQuad[3].y);
        ctx.closePath();

        // Sample background fill
        const bgSample = sampleBorderColor(ctx, transformedQuad);
        ctx.fillStyle = region.backgroundColor || bgSample.css;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Draw AR Bounding Polygon Outline
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(transformedQuad[0].x, transformedQuad[0].y);
      ctx.lineTo(transformedQuad[1].x, transformedQuad[1].y);
      ctx.lineTo(transformedQuad[2].x, transformedQuad[2].y);
      ctx.lineTo(transformedQuad[3].x, transformedQuad[3].y);
      ctx.closePath();

      // Polygon styling
      if (isSelected) {
        ctx.strokeStyle = '#FACC15'; // Rajyotsava Gold
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = displayMode === 'KANNADA' ? 'rgba(250, 204, 21, 0.4)' : 'rgba(6, 182, 212, 0.6)';
        ctx.lineWidth = 1.8;
      }
      ctx.stroke();

      // Corner Calibration Pins
      for (let i = 0; i < 4; i++) {
        const pt = transformedQuad[i];
        ctx.fillStyle = isSelected ? '#E11D48' : '#FACC15';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0B0F19';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw Top HUD Chip (Tier + Confidence)
      const topX = (transformedQuad[0].x + transformedQuad[1].x) / 2;
      const topY = Math.min(transformedQuad[0].y, transformedQuad[1].y) - 8;

      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const label = `${region.inferenceTier} • ${(region.confidence * 100).toFixed(0)}%`;
      const textMetrics = ctx.measureText(label);
      const chipW = textMetrics.width + 14;

      ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
      ctx.beginPath();
      ctx.roundRect(topX - chipW / 2, topY - 14, chipW, 18, 4);
      ctx.fill();
      ctx.strokeStyle = region.inferenceTier === 'EDGE_CACHE' ? '#10B981' : region.inferenceTier === 'LOCAL_OCR' ? '#06B6D4' : '#E11D48';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.fillText(label, topX, topY);

      ctx.restore();
    }
  }, [currentScene, displayMode, shilashasanaFilter, pitch, yaw, roll, customQuads, selectedRegionId, isLiveCamera]);

  useEffect(() => {
    renderFrame();
  }, [renderFrame]);

  // Handle Dragging of Corner Pins
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = currentScene.canvasWidth / rect.width;
    const scaleY = currentScene.canvasHeight / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const center: Point2D = { x: currentScene.canvasWidth / 2, y: currentScene.canvasHeight / 2 };

    // Check if clicked near any corner pin
    for (const region of currentScene.regions) {
      const baseQuad = customQuads[region.id] || region.quad;
      const transformedQuad = rotateQuad3D(baseQuad, pitch, yaw, roll, center);

      for (let i = 0; i < 4; i++) {
        const pt = transformedQuad[i];
        const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
        if (dist <= 16) {
          setDraggingPin({ regionId: region.id, cornerIndex: i });
          onSelectRegion(region);
          return;
        }
      }

      // Check if clicked inside region polygon
      if (isPointInsideQuad({ x: clickX, y: clickY }, transformedQuad)) {
        onSelectRegion(region);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingPin) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = currentScene.canvasWidth / rect.width;
    const scaleY = currentScene.canvasHeight / rect.height;
    const newX = (e.clientX - rect.left) * scaleX;
    const newY = (e.clientY - rect.top) * scaleY;

    const region = currentScene.regions.find(r => r.id === draggingPin.regionId);
    if (!region) return;

    const currentQuad = customQuads[region.id] || [...region.quad] as Quad;
    const updatedQuad: Quad = [...currentQuad] as Quad;
    updatedQuad[draggingPin.cornerIndex] = { x: Math.round(newX), y: Math.round(newY) };

    setCustomQuads(prev => ({
      ...prev,
      [region.id]: updatedQuad,
    }));
  };

  const handleMouseUp = () => {
    setDraggingPin(null);
  };

  function isPointInsideQuad(pt: Point2D, quad: Quad): boolean {
    let inside = false;
    for (let i = 0, j = 3; i < 4; j = i++) {
      const xi = quad[i].x, yi = quad[i].y;
      const xj = quad[j].x, yj = quad[j].y;
      const intersect = ((yi > pt.y) !== (yj > pt.y)) && (pt.x < (xj - xi) * (pt.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  const center: Point2D = { x: currentScene.canvasWidth / 2, y: currentScene.canvasHeight / 2 };

  return (
    <div className="flex flex-col gap-3">
      {/* Visual Canvas Viewport Container */}
      <div
        ref={containerRef}
        className="relative bg-space-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl select-none"
        style={{ aspectRatio: `${currentScene.canvasWidth}/${currentScene.canvasHeight}` }}
      >
        {/* Hidden video element for webcam */}
        <video ref={videoRef} className="hidden" playsInline muted autoPlay />

        {/* Base 2D/3D Rendering Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Planar Homography Warped DOM Text Overlay Layer */}
        {displayMode !== 'KANNADA' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {currentScene.regions.map(region => {
              const baseQuad = customQuads[region.id] || region.quad;
              const transformedQuad = rotateQuad3D(baseQuad, pitch, yaw, roll, center);

              // Calculate canonical width & height
              const w = Math.hypot(transformedQuad[1].x - transformedQuad[0].x, transformedQuad[1].y - transformedQuad[0].y);
              const h = Math.hypot(transformedQuad[3].x - transformedQuad[0].x, transformedQuad[3].y - transformedQuad[0].y);

              // Compute 3x3 Projective Homography Matrix
              const homographyMatrix = computeHomography(w, h, transformedQuad);
              const cssMatrix3d = homographyToCSSMatrix3D(homographyMatrix);

              const displayText =
                displayMode === 'ENGLISH'
                  ? region.englishTranslation
                  : displayMode === 'TRANSLITERATION'
                  ? region.transliteration
                  : `${region.englishTranslation} (${region.transliteration})`;

              return (
                <div
                  key={region.id}
                  className="absolute top-0 left-0 flex items-center justify-center font-bold text-center px-2"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    transformOrigin: '0 0',
                    transform: cssMatrix3d,
                    color: region.textColor,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    fontSize: `${Math.max(13, Math.min(30, Math.floor(w / (displayText.length * 0.72))))}px`,
                    fontFamily: displayMode === 'TRANSLITERATION' ? '"JetBrains Mono", monospace' : 'Inter, sans-serif',
                  }}
                >
                  <span className="leading-tight drop-shadow-md">
                    {displayText}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Top-Right HUD Badge: Active Scene & Offline Status */}
        <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
          {isAirplaneMode && (
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 shadow-glow-cyan backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline Edge Mode (30 FPS)</span>
            </span>
          )}

          <span className="bg-space-950/80 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>Pitch: {pitch}° | Yaw: {yaw}° | Roll: {roll}°</span>
          </span>
        </div>

        {/* Top-Left Watermark */}
        <div className="absolute top-3 left-3 bg-space-950/80 border border-rajyotsava-gold/40 px-3 py-1 rounded-full text-xs font-bold text-rajyotsava-gold backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
          <Scan className="w-3.5 h-3.5 text-rajyotsava-crimson" />
          <span>LipiLens-X Spatial AR Engine</span>
        </div>

        {/* Live Camera Error Notification */}
        {cameraError && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 border border-red-500/50 text-red-200 text-xs p-2.5 rounded-lg">
            {cameraError}
          </div>
        )}
      </div>

      {/* Spatial 3D Sliders & Camera Controls */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <Sliders className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>3D Tilt:</span>
          </div>

          {/* Pitch Slider */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px]">Pitch</span>
            <input
              type="range"
              min="-25"
              max="25"
              value={pitch}
              onChange={e => setPitch(Number(e.target.value))}
              className="w-20 accent-rajyotsava-gold cursor-pointer"
            />
            <span className="w-6 font-mono text-slate-300">{pitch}°</span>
          </div>

          {/* Yaw Slider */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px]">Yaw</span>
            <input
              type="range"
              min="-30"
              max="30"
              value={yaw}
              onChange={e => setYaw(Number(e.target.value))}
              className="w-20 accent-rajyotsava-gold cursor-pointer"
            />
            <span className="w-6 font-mono text-slate-300">{yaw}°</span>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setPitch(currentScene.defaultPitch);
              setYaw(currentScene.defaultYaw);
              setRoll(currentScene.defaultRoll);
              setCustomQuads({});
            }}
            title="Reset 3D Perspective"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Camera Feed Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLiveCamera(!isLiveCamera)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border transition-all ${
              isLiveCamera
                ? 'bg-rajyotsava-crimson text-white border-rajyotsava-crimson shadow-glow-crimson'
                : 'bg-space-800 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isLiveCamera ? 'Stop Camera' : 'Live Camera AR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
