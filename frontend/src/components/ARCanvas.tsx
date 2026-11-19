import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Camera,
  Sliders,
  Scan,
  ShieldCheck,
  Compass,
  Upload,
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
  onOpenXRayModal?: (word: string) => void;
}

export const ARCanvas: React.FC<ARCanvasProps> = ({
  currentScene,
  displayMode,
  shilashasanaFilter,
  onSelectRegion,
  selectedRegionId,
  isAirplaneMode,
  onOpenXRayModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 3D Perspective Controls (Pitch, Yaw, Roll)
  const [pitch, setPitch] = useState<number>(currentScene.defaultPitch);
  const [yaw, setYaw] = useState<number>(currentScene.defaultYaw);
  const [roll, setRoll] = useState<number>(currentScene.defaultRoll);

  // Camera & Custom Upload State
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Interactive Pin Dragging
  const [draggingPin, setDraggingPin] = useState<{ regionId: string; cornerIndex: number } | null>(null);
  const [customQuads, setCustomQuads] = useState<Record<string, Quad>>({});

  useEffect(() => {
    setPitch(currentScene.defaultPitch);
    setYaw(currentScene.defaultYaw);
    setRoll(currentScene.defaultRoll);
    setCustomQuads({});
    setUploadedImage(null);
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
          setCameraError('ಕ್ಯಾಮರಾ ಲಭ್ಯವಿಲ್ಲ (Camera unavailable). Switching back to benchmark scene.');
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

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setIsLiveCamera(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
      ctx.drawImage(videoRef.current, 0, 0, w, h);
    } else if (uploadedImage) {
      ctx.drawImage(uploadedImage, 0, 0, w, h);
    } else {
      renderSceneToCanvas(ctx, currentScene, w, h, {
        showOriginalText: displayMode === 'KANNADA',
        shilashasanaFilter,
        claheStrength: 1.5,
      });
    }

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

        const bgSample = sampleBorderColor(ctx, transformedQuad);
        ctx.fillStyle = region.backgroundColor || bgSample.css;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
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

      if (isSelected) {
        ctx.strokeStyle = '#FACC15'; // Rajyotsava Gold
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 14;
      } else {
        ctx.strokeStyle = displayMode === 'KANNADA' ? 'rgba(250, 204, 21, 0.45)' : 'rgba(6, 182, 212, 0.65)';
        ctx.lineWidth = 2;
      }
      ctx.stroke();

      // Corner Calibration Pins
      for (let i = 0; i < 4; i++) {
        const pt = transformedQuad[i];
        ctx.fillStyle = isSelected ? '#E11D48' : '#FACC15';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0B0F19';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Top HUD Chip (Tier + Confidence)
      const topX = (transformedQuad[0].x + transformedQuad[1].x) / 2;
      const topY = Math.min(transformedQuad[0].y, transformedQuad[1].y) - 8;

      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const label = `${region.inferenceTier} • ${(region.confidence * 100).toFixed(0)}%`;
      const textMetrics = ctx.measureText(label);
      const chipW = textMetrics.width + 16;

      ctx.fillStyle = 'rgba(11, 15, 25, 0.88)';
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
  }, [currentScene, displayMode, shilashasanaFilter, pitch, yaw, roll, customQuads, selectedRegionId, isLiveCamera, uploadedImage]);

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
        <video ref={videoRef} className="hidden" playsInline muted autoPlay />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

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

              const w = Math.hypot(transformedQuad[1].x - transformedQuad[0].x, transformedQuad[1].y - transformedQuad[0].y);
              const h = Math.hypot(transformedQuad[3].x - transformedQuad[0].x, transformedQuad[3].y - transformedQuad[0].y);

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
                  className="absolute top-0 left-0 flex items-center justify-center font-bold text-center px-2 pointer-events-auto cursor-pointer"
                  style={{
                    width: `${w}px`,
                    height: `${h}px`,
                    transformOrigin: '0 0',
                    transform: cssMatrix3d,
                    color: region.textColor,
                    textShadow: '0 2px 4px rgba(0,0,0,0.85)',
                    fontSize: `${Math.max(12, Math.min(30, Math.floor(w / (displayText.length * 0.72))))}px`,
                    fontFamily: displayMode === 'TRANSLITERATION' ? '"JetBrains Mono", monospace' : 'Inter, sans-serif',
                  }}
                  onClick={() => {
                    onSelectRegion(region);
                    onOpenXRayModal?.(region.kannadaText.split(' ')[0]);
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

        {/* Top-Right HUD Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 pointer-events-none">
          {isAirplaneMode && (
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 shadow-glow-cyan backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ಆಫ್‌ಲೈನ್ ಕ್ರಮ (60 FPS Edge)</span>
            </span>
          )}

          <span className="bg-space-950/85 text-slate-300 border border-slate-700/60 px-3 py-1 rounded-full text-xs font-mono backdrop-blur-md flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>P: {pitch}° | Y: {yaw}° | R: {roll}°</span>
          </span>
        </div>

        {/* Top-Left Watermark */}
        <div className="absolute top-3 left-3 bg-space-950/85 border border-rajyotsava-gold/40 px-3 py-1 rounded-full text-xs font-bold text-rajyotsava-gold backdrop-blur-md flex items-center gap-1.5 pointer-events-none">
          <Scan className="w-3.5 h-3.5 text-rajyotsava-crimson" />
          <span>ಲಿಪಿ ಲೆನ್ಸ್ | 3D Spatial AR</span>
        </div>

        {cameraError && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 border border-red-500/50 text-red-200 text-xs p-2.5 rounded-lg">
            {cameraError}
          </div>
        )}
      </div>

      {/* 3D Perspective Sliders & Input Source Controls */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Sliders */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono">
            <Sliders className="w-3.5 h-3.5 text-rajyotsava-gold" />
            <span>3D ತಿರುವು (Tilt):</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px]">Pitch</span>
            <input
              type="range"
              min="-25"
              max="25"
              value={pitch}
              onChange={e => setPitch(Number(e.target.value))}
              aria-label="3D Pitch rotation slider"
              className="w-16 accent-rajyotsava-gold cursor-pointer"
            />
            <span className="w-5 font-mono text-slate-300 text-[11px]">{pitch}°</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px]">Yaw</span>
            <input
              type="range"
              min="-30"
              max="30"
              value={yaw}
              onChange={e => setYaw(Number(e.target.value))}
              aria-label="3D Yaw rotation slider"
              className="w-16 accent-rajyotsava-gold cursor-pointer"
            />
            <span className="w-5 font-mono text-slate-300 text-[11px]">{yaw}°</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[10px]">Roll</span>
            <input
              type="range"
              min="-25"
              max="25"
              value={roll}
              onChange={e => setRoll(Number(e.target.value))}
              aria-label="3D Roll rotation slider"
              className="w-16 accent-rajyotsava-gold cursor-pointer"
            />
            <span className="w-5 font-mono text-slate-300 text-[11px]">{roll}°</span>
          </div>

          <button
            onClick={() => {
              setPitch(currentScene.defaultPitch);
              setYaw(currentScene.defaultYaw);
              setRoll(currentScene.defaultRoll);
              setCustomQuads({});
            }}
            title="ಮರುಹೊಂದಿಸಿ (Reset Perspective)"
            aria-label="Reset 3D perspective orientation"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Source Buttons (Camera, Upload) */}
        <div className="flex items-center gap-2">
          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-space-850 hover:bg-space-800 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
            title="ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ (Upload Custom Image)"
            aria-label="Upload custom signboard image"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>ಅಪ್‌ಲೋಡ್ (Upload)</span>
          </button>

          {/* Camera Button */}
          <button
            onClick={() => setIsLiveCamera(!isLiveCamera)}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 border transition-all ${
              isLiveCamera
                ? 'bg-rajyotsava-crimson text-white border-rajyotsava-crimson shadow-glow-crimson'
                : 'bg-space-800 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
            aria-label={isLiveCamera ? 'Stop Live Camera' : 'Start Live Camera AR Scanner'}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isLiveCamera ? 'ಕ್ಯಾಮರಾ ನಿಲ್ಲಿಸಿ' : 'ಕ್ಯಾಮರಾ AR (Live Camera)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
