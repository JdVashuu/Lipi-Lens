/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Canvas Scene & Texture Generator
 * Renders all 8 authentic benchmark signboards with exact visual styling:
 * 1. BMTC Bus Board
 * 2. Namma Metro Sign (Purple/Green underground line)
 * 3. Darshini Hotel Menu (Rosewood & brass studs)
 * 4. Regulatory Traffic Sign (Green & white highway reflectivity)
 * 5. Traditional Shop Board (Mysore silk crimson & gold)
 * 6. Begur Hero Stone Inscription (Ganga dynasty 890 CE granite slab)
 * 7. Kannada Rajyotsava Celebration Banner (State flag red/yellow)
 * 8. Municipal Street Name Board (Kuvempu Road amber yellow/black)
 */

import { SampleScene } from '../data/sampleScenes';

export interface RenderOptions {
  showOriginalText?: boolean;
  shilashasanaFilter?: boolean;
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
    case 'METRO':
      renderMetroScene(ctx, width, height);
      break;
    case 'DARSHINI':
      renderDarshiniScene(ctx, width, height);
      break;
    case 'STREET':
      renderStreetScene(ctx, width, height);
      break;
    case 'SHOP':
      renderShopScene(ctx, width, height);
      break;
    case 'SHILASHASANA':
      renderShilashasanaScene(ctx, width, height);
      break;
    case 'BANNER':
      renderBannerScene(ctx, width, height);
      break;
    case 'STREET_BOARD':
      renderStreetBoardScene(ctx, width, height);
      break;
    default:
      renderBMTCScene(ctx, width, height);
  }

  // Draw original Kannada text if enabled
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

/** 1. BMTC Bus */
function renderBMTCScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const busGrad = ctx.createLinearGradient(0, 0, 0, h);
  busGrad.addColorStop(0, '#0B1528');
  busGrad.addColorStop(0.3, '#10243E');
  busGrad.addColorStop(1, '#08101E');
  ctx.fillStyle = busGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  const glassGrad = ctx.createLinearGradient(50, 50, w - 50, h - 50);
  glassGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
  glassGrad.addColorStop(0.4, 'rgba(30, 41, 59, 0.7)');
  glassGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.85)');
  glassGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
  ctx.fillStyle = glassGrad;
  ctx.fillRect(40, 40, w - 80, h - 80);

  ctx.fillStyle = '#090D16';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(100, 60, w - 200, 320, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(250, 204, 21, 0.03)';
  for (let y = 70; y < 370; y += 12) {
    ctx.fillRect(110, y, w - 220, 2);
  }

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('BMTC VAJRA • ROUTE 201-G / KA-57-F-1984', 120, 85);
}

/** 2. Namma Metro Sign */
function renderMetroScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, w, h);

  // Metro station granite tiles
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  // Metro Signboard Box
  const mx = 90, my = 50, mw = w - 180, mh = 340;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(mx + 8, my + 8, mw, mh);

  // Purple / Green line dual gradient
  const metroGrad = ctx.createLinearGradient(mx, my, mx + mw, my);
  metroGrad.addColorStop(0, '#3B0764');
  metroGrad.addColorStop(0.5, '#4C1D95');
  metroGrad.addColorStop(1, '#064E3B');
  ctx.fillStyle = metroGrad;
  ctx.beginPath();
  ctx.roundRect(mx, my, mw, mh, 16);
  ctx.fill();

  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 3;
  ctx.stroke();

  // BMRCL Logo / Header
  ctx.fillStyle = '#F8FAFC';
  ctx.font = '800 14px "JetBrains Mono", monospace';
  ctx.fillText('NAMMA METRO (BMRCL) • PURPLE & GREEN LINE INTERCHANGE', mx + 30, my + 45);

  // Metro line color stripes
  ctx.fillStyle = '#A855F7';
  ctx.fillRect(mx + 30, my + 60, mw - 60, 4);
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(mx + 30, my + 66, mw - 60, 4);
}

/** 3. Darshini Hotel Menu */
function renderDarshiniScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, w, h);

  const boardX = 80, boardY = 50, boardW = w - 160, boardH = h - 90;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(boardX + 8, boardY + 10, boardW, boardH);

  const woodGrad = ctx.createLinearGradient(boardX, boardY, boardX + boardW, boardY + boardH);
  woodGrad.addColorStop(0, '#5C240A');
  woodGrad.addColorStop(0.5, '#78350F');
  woodGrad.addColorStop(1, '#451A03');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(boardX, boardY, boardW, boardH);

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 3;
  ctx.strokeRect(boardX + 12, boardY + 12, boardW - 24, boardH - 24);

  ctx.fillStyle = '#FEF08A';
  ctx.font = '800 22px "Noto Sans Kannada", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ಶ್ರೀ ಕೃಷ್ಣ ಭವನ - ತಿಂಡಿ ದರ ಪಟ್ಟಿ', w / 2, boardY + 45);
  ctx.textAlign = 'start';
}

/** 4. Traffic Sign */
function renderStreetScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#475569';
  ctx.fillRect(w / 2 - 12, 0, 24, h);

  const signX = 100, signY = 60, signW = w - 200, signH = 370;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(signX + 6, signY + 8, signW, signH, 18);
  ctx.fill();

  const greenGrad = ctx.createLinearGradient(signX, signY, signX + signW, signY + signH);
  greenGrad.addColorStop(0, '#047857');
  greenGrad.addColorStop(0.5, '#065F46');
  greenGrad.addColorStop(1, '#064E3B');
  ctx.fillStyle = greenGrad;
  ctx.beginPath();
  ctx.roundRect(signX, signY, signW, signH, 18);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(signX + 12, signY + 12, signW - 24, signH - 24, 12);
  ctx.stroke();
}

/** 5. Shop Board (Mysore Silk & Sweets) */
function renderShopScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#18181B';
  ctx.fillRect(0, 0, w, h);

  const sx = 90, sy = 55, sw = w - 180, sh = 350;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(sx + 8, sy + 8, sw, sh);

  const silkGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
  silkGrad.addColorStop(0, '#701A75');
  silkGrad.addColorStop(0.5, '#831843');
  silkGrad.addColorStop(1, '#500724');
  ctx.fillStyle = silkGrad;
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, 14);
  ctx.fill();

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 4;
  ctx.strokeRect(sx + 10, sy + 10, sw - 20, sh - 20);

  ctx.fillStyle = '#FEF08A';
  ctx.font = '800 13px "JetBrains Mono", monospace';
  ctx.fillText('ESTD 1948 • CHICKPET / AVENUE ROAD, BENGALURU-560053', sx + 30, sy + 45);
}

/** 6. Begur Shilashasana Stone */
function renderShilashasanaScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, w, h);

  const stoneX = 110, stoneY = 40, stoneW = w - 220, stoneH = h - 70;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.beginPath();
  ctx.roundRect(stoneX + 12, stoneY + 16, stoneW, stoneH, 24);
  ctx.fill();

  const stoneGrad = ctx.createLinearGradient(stoneX, stoneY, stoneX + stoneW, stoneY + stoneH);
  stoneGrad.addColorStop(0, '#4B5563');
  stoneGrad.addColorStop(0.3, '#374151');
  stoneGrad.addColorStop(0.7, '#1F2937');
  stoneGrad.addColorStop(1, '#111827');
  ctx.fillStyle = stoneGrad;
  ctx.beginPath();
  ctx.roundRect(stoneX, stoneY, stoneW, stoneH, 20);
  ctx.fill();

  // Granite speckles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  for (let i = 0; i < 200; i++) {
    const rx = stoneX + (i * 37) % stoneW;
    const ry = stoneY + (i * 59) % stoneH;
    ctx.fillRect(rx, ry, (i % 4) + 1, (i % 3) + 1);
  }

  ctx.fillStyle = '#9CA3AF';
  ctx.font = '700 13px "JetBrains Mono", monospace';
  ctx.fillText('BEGUR HERO STONE • C. 890 CE • GANGA DYNASTY', stoneX + 30, stoneY + 40);
}

/** 7. Rajyotsava Celebration Banner */
function renderBannerScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, w, h);

  const bx = 80, by = 50, bw = w - 160, bh = 350;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(bx + 8, by + 10, bw, bh);

  // Karnataka Flag bicolour (Yellow top, Red bottom)
  const flagGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
  flagGrad.addColorStop(0, '#B91C1C');
  flagGrad.addColorStop(0.5, '#DC2626');
  flagGrad.addColorStop(1, '#991B1B');
  ctx.fillStyle = flagGrad;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 14);
  ctx.fill();

  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 4;
  ctx.strokeRect(bx + 10, by + 10, bw - 20, bh - 20);

  ctx.fillStyle = '#FEF08A';
  ctx.font = '800 14px "Noto Sans Kannada", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ ದಿನಾಚರಣೆ - ನವೆಂಬರ್ ೧', w / 2, by + 45);
  ctx.textAlign = 'start';
}

/** 8. Municipal Street Name Board */
function renderStreetBoardScene(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, w, h);

  const sx = 90, sy = 55, sw = w - 180, sh = 350;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(sx + 8, sy + 8, sw, sh);

  // Municipal Yellow board
  const streetGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy + sh);
  streetGrad.addColorStop(0, '#F59E0B');
  streetGrad.addColorStop(0.5, '#EAB308');
  streetGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = streetGrad;
  ctx.beginPath();
  ctx.roundRect(sx, sy, sw, sh, 14);
  ctx.fill();

  ctx.strokeStyle = '#0B0F19';
  ctx.lineWidth = 5;
  ctx.strokeRect(sx + 10, sy + 10, sw - 20, sh - 20);

  ctx.fillStyle = '#0B0F19';
  ctx.font = '800 13px "JetBrains Mono", monospace';
  ctx.fillText('ಬೃಹತ್ ಬೆಂಗಳೂರು ಮಹಾನಗರ ಪಾಲಿಕೆ (BBMP)', sx + 30, sy + 45);
}

/** Original text drawing */
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

  const fontSize = Math.max(16, Math.min(38, Math.floor(width / (region.kannadaText.length * 0.85))));
  ctx.font = `800 ${fontSize}px "Noto Sans Kannada", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (region.fontCategory === 'HERITAGE_STONE') {
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

/** Shilashasana CLAHE Filter */
function applyCLAHEAndReliefFilter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strength: number
): void {
  try {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      let contrast = (lum - 128) * strength + 128;
      contrast = Math.max(0, Math.min(255, contrast));

      d[i] = Math.min(255, contrast * 1.15);
      d[i + 1] = Math.min(255, contrast * 0.95);
      d[i + 2] = Math.min(255, contrast * 0.65);
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Ignore canvas security errors
  }
}
