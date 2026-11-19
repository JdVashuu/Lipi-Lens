/**
 * LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Canvas Scene & Texture Generator
 *
 * Renders high-fidelity physical signboards (BMTC bus, Darshini menu,
 * BBMP street sign, and Halegannada Stone Inscription) onto canvas.
 */

import { SampleScene } from '../data/sampleScenes';

export interface RenderOptions {
  showOriginalText?: boolean;
  shilashasanaFilter?: boolean; // CLAHE & edge enhancement
  claheStrength?: number;
}

export function renderSceneToCanvas(
  ctx: CanvasRenderingContext2D,
  scene: SampleScene,
  width: number,
  height: number,
  options: RenderOptions = {}
): void {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  switch (scene.bgRenderer) {
    case 'BMTC':
      renderBMTCScene(ctx, width, height);
      break;
    case 'DARSHINI':
      renderDarshiniScene(ctx, width, height);
      break;
    case 'STREET':
      renderStreetScene(ctx, width, height);
      break;
    case 'SHILASHASANA':
      renderShilashasanaScene(ctx, width, height);
      break;
  }

  // Draw original text if enabled
  if (options.showOriginalText !== false) {
    for (const region of scene.regions) {
      drawOriginalKannadaText(ctx, region);
    }
  }

  // Apply Shilashasana Filter if active
  if (options.shilashasanaFilter || scene.bgRenderer === 'SHILASHASANA') {
    if (options.shilashasanaFilter) {
      applyCLAHEAndReliefFilter(ctx, width, height, options.claheStrength || 1.4);
    }
  }

  ctx.restore();
}

/**
 * Renders a BMTC bus windshield with route signboard
 */
function renderBMTCScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Bus Body gradient (BMTC Navy Blue / Teal)
  const busGrad = ctx.createLinearGradient(0, 0, 0, h);
  busGrad.addColorStop(0, '#0B1528');
  busGrad.addColorStop(0.3, '#10243E');
  busGrad.addColorStop(1, '#08101E');
  ctx.fillStyle = busGrad;
  ctx.fillRect(0, 0, w, h);

  // Windshield frame
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Windshield glass tint
  const glassGrad = ctx.createLinearGradient(50, 50, w - 50, h - 50);
  glassGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
  glassGrad.addColorStop(0.4, 'rgba(30, 41, 59, 0.7)');
  glassGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.85)');
  glassGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(40, 40, w - 80, h - 80);

  // Destination Board Housing (Dark textured box)
  ctx.fillStyle = '#090D16';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(100, 60, w - 200, 320, 16);
  ctx.fill();
  ctx.stroke();

  // LED Grid texture inside housing
  ctx.fillStyle = 'rgba(250, 204, 21, 0.03)';
  for (let y = 70; y < 370; y += 12) {
    ctx.fillRect(110, y, w - 220, 2);
  }

  // Bus Fleet Number & Logo Accent
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('BMTC VAJRA • ROUTE 201-G / KA-57-F-1984', 120, 85);

  // Windshield glare / reflection streak
  ctx.save();
  ctx.rotate(-0.15);
  const glareGrad = ctx.createLinearGradient(-100, 0, w + 100, 0);
  glareGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
  glareGrad.addColorStop(0.45, 'rgba(255, 255, 255, 0.07)');
  glareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
  glareGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.04)');
  glareGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = glareGrad;
  ctx.fillRect(-200, 100, w * 1.5, 140);
  ctx.restore();
}

/**
 * Renders an authentic Bengaluru Darshini hotel tariff board
 */
function renderDarshiniScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Tile background (classic Darshini white ceramic tiles with grout)
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, w, h);

  // Darshini wall tiles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Polished Rosewood / Brass Board
  const boardX = 80;
  const boardY = 50;
  const boardW = w - 160;
  const boardH = h - 90;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(boardX + 8, boardY + 10, boardW, boardH);

  // Outer Wood Frame
  const woodGrad = ctx.createLinearGradient(boardX, boardY, boardX + boardW, boardY + boardH);
  woodGrad.addColorStop(0, '#5C240A');
  woodGrad.addColorStop(0.5, '#78350F');
  woodGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(boardX, boardY, boardW, boardH);

  // Brass inner border
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 3;
  ctx.strokeRect(boardX + 12, boardY + 12, boardW - 24, boardH - 24);

  // Board Header
  ctx.fillStyle = '#FEF08A';
  ctx.font = '800 22px "Noto Sans Kannada", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ಶ್ರೀ ಕೃಷ್ಣ ಭವನ - ತಿಂಡಿ ದರ ಪಟ್ಟಿ', w / 2, boardY + 45);

  // Divider line
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(boardX + 40, boardY + 60);
  ctx.lineTo(boardX + boardW - 40, boardY + 60);
  ctx.stroke();
  ctx.textAlign = 'start';

  // Brass Corner Studs
  const studs = [
    [boardX + 18, boardY + 18],
    [boardX + boardW - 18, boardY + 18],
    [boardX + 18, boardY + boardH - 18],
    [boardX + boardW - 18, boardY + boardH - 18],
  ];
  for (const [sx, sy] of studs) {
    ctx.fillStyle = '#FDE047';
    ctx.beginPath();
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

/**
 * Renders an official BBMP / Traffic Police green street sign
 */
function renderStreetScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Outdoor urban atmosphere background
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, w, h);

  // Signboard Post
  ctx.fillStyle = '#475569';
  ctx.fillRect(w / 2 - 12, 0, 24, h);
  ctx.fillStyle = '#64748B';
  ctx.fillRect(w / 2 - 12, 0, 6, h); // specular highlight on metal pipe

  // Metal Signboard Plate
  const signX = 100;
  const signY = 60;
  const signW = w - 200;
  const signH = 370;

  // Sign Drop shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(signX + 6, signY + 8, signW, signH, 18);
  ctx.fill();

  // Highway retro-reflective Green
  const greenGrad = ctx.createLinearGradient(signX, signY, signX + signW, signY + signH);
  greenGrad.addColorStop(0, '#047857');
  greenGrad.addColorStop(0.5, '#065F46');
  greenGrad.addColorStop(1, '#064E3B');
  ctx.fillStyle = greenGrad;
  ctx.beginPath();
  ctx.roundRect(signX, signY, signW, signH, 18);
  ctx.fill();

  // White retroreflective double border
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(signX + 12, signY + 12, signW - 24, signH - 24, 12);
  ctx.stroke();

  // Municipal Emblem Watermark
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(signX + signW - 60, signY + 60, 28, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = '700 10px monospace';
  ctx.fillText('BBMP', signX + signW - 74, signY + 64);

  // Rivets/Bolts
  const bolts = [
    [signX + 24, signY + 24],
    [signX + signW - 24, signY + 24],
    [signX + 24, signY + signH - 24],
    [signX + signW - 24, signY + signH - 24],
    [w / 2, signY + 24],
    [w / 2, signY + signH - 24],
  ];
  for (const [bx, by] of bolts) {
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/**
 * Renders an ancient weathered granite Shilashasana (Hero Stone / Begur Inscription)
 */
function renderShilashasanaScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Ancient temple niche background
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, w, h);

  // Granite Stone Slab coordinates
  const stoneX = 110;
  const stoneY = 40;
  const stoneW = w - 220;
  const stoneH = h - 70;

  // Heavy stone shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.beginPath();
  ctx.roundRect(stoneX + 12, stoneY + 16, stoneW, stoneH, 24);
  ctx.fill();

  // Granite textured gradient
  const stoneGrad = ctx.createLinearGradient(stoneX, stoneY, stoneX + stoneW, stoneY + stoneH);
  stoneGrad.addColorStop(0, '#4B5563');
  stoneGrad.addColorStop(0.3, '#374151');
  stoneGrad.addColorStop(0.7, '#1F2937');
  stoneGrad.addColorStop(1, '#111827');
  ctx.fillStyle = stoneGrad;
  ctx.beginPath();
  ctx.roundRect(stoneX, stoneY, stoneW, stoneH, 20);
  ctx.fill();

  // Natural granite stone speckles & erosion fissures
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 240; i++) {
    const rx = stoneX + (i * 37) % stoneW;
    const ry = stoneY + (i * 59) % stoneH;
    ctx.fillRect(rx, ry, (i % 4) + 1, (i % 3) + 1);
  }

  // Weathering fissure cracks
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stoneX + 80, stoneY + 20);
  ctx.lineTo(stoneX + 130, stoneY + 90);
  ctx.lineTo(stoneX + 110, stoneY + 180);
  ctx.lineTo(stoneX + 160, stoneY + 260);
  ctx.stroke();

  // Chiseled header relief
  ctx.fillStyle = '#9CA3AF';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('BEGUR HERO STONE • C. 890 CE • GANGA DYNASTY', stoneX + 30, stoneY + 40);

  // Sculpted Kalasa / Sun & Moon relief icons at top
  ctx.strokeStyle = '#6B7280';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(stoneX + stoneW - 60, stoneY + 40, 14, 0, Math.PI * 2);
  ctx.stroke(); // Sun emblem
  ctx.beginPath();
  ctx.arc(stoneX + stoneW - 100, stoneY + 40, 14, Math.PI * 0.2, Math.PI * 1.5);
  ctx.stroke(); // Crescent Moon emblem
}

/**
 * Draws the original Kannada text on the canvas based on region bounds
 */
function drawOriginalKannadaText(
  ctx: CanvasRenderingContext2D,
  region: { kannadaText: string; quad: { x: number; y: number }[]; textColor: string; fontCategory: string }
): void {
  const [p0, p1, p2, p3] = region.quad;
  const centerX = (p0.x + p1.x + p2.x + p3.x) / 4;
  const centerY = (p0.y + p1.y + p2.y + p3.y) / 4;
  const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  const width = Math.hypot(p1.x - p0.x, p1.y - p0.y);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  // Dynamic font sizing based on box width
  const fontSize = Math.max(16, Math.min(42, Math.floor(width / (region.kannadaText.length * 0.85))));
  ctx.font = `800 ${fontSize}px "Noto Sans Kannada", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Apply subtle drop-shadow or chiseled carve effect
  if (region.fontCategory === 'HERITAGE_STONE') {
    // Chiseled relief effect: dark shadow on top-left, lighter highlight on bottom-right
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillText(region.kannadaText, -1, -1);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillText(region.kannadaText, 1, 1);
    ctx.fillStyle = region.textColor;
    ctx.fillText(region.kannadaText, 0, 0);
  } else {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillText(region.kannadaText, 2, 2);
    ctx.fillStyle = region.textColor;
    ctx.fillText(region.kannadaText, 0, 0);
  }

  ctx.restore();
}

/**
 * CLAHE + Adaptive Threshold + Relief Filter for Shilashasana stone epigraphy
 */
function applyCLAHEAndReliefFilter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strength: number
): void {
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    // Fast local contrast enhancement and relief embossing
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      // Luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // High-contrast S-curve stretch (simulating CLAHE)
      let contrast = (lum - 128) * strength + 128;
      contrast = Math.max(0, Math.min(255, contrast));

      // Amber/Gold epigraphical enhancement tint
      d[i] = Math.min(255, contrast * 1.15);     // Red
      d[i + 1] = Math.min(255, contrast * 0.95); // Green
      d[i + 2] = Math.min(255, contrast * 0.65); // Blue
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Ignore canvas security errors if untrusted images
  }
}
