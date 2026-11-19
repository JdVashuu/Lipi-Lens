import { describe, it, expect, beforeAll } from 'vitest';
import { computeHomography, homographyToCSSMatrix3D, Quad, rotateQuad3D } from '../core/homography';
import { computeCanvasDHash, computeHammingDistance } from '../core/dhash';
import { applyCLAHEContrast } from '../core/clahe';

beforeAll(() => {
  if (typeof globalThis.ImageData === 'undefined') {
    // @ts-ignore
    globalThis.ImageData = class ImageData {
      width: number;
      height: number;
      data: Uint8ClampedArray;
      constructor(data: Uint8ClampedArray, w: number, h: number) {
        this.data = data;
        this.width = w;
        this.height = h;
      }
    };
  }
});

describe('Computer Vision & Geometry Math Tests', () => {
  it('computes 3x3 homography matrix and converts to valid CSS matrix3d', () => {
    const srcW = 200;
    const srcH = 100;
    const quad: Quad = [
      { x: 10, y: 10 },
      { x: 220, y: 15 },
      { x: 210, y: 120 },
      { x: 5, y: 105 },
    ];

    const h = computeHomography(srcW, srcH, quad);
    expect(h.length).toBe(9);
    expect(h[8]).toBeCloseTo(1.0, 5); // Normalized h22

    const matrix3d = homographyToCSSMatrix3D(h);
    expect(matrix3d).toMatch(/^matrix3d\(/);
    expect(matrix3d).toContain(',');
  });

  it('rotates quadrilateral in 3D with pitch, yaw, and roll', () => {
    const baseQuad: Quad = [
      { x: 50, y: 50 },
      { x: 250, y: 50 },
      { x: 250, y: 150 },
      { x: 50, y: 150 },
    ];
    const center = { x: 150, y: 100 };

    const rotated = rotateQuad3D(baseQuad, 10, 15, -5, center);
    expect(rotated.length).toBe(4);
    // Perspective distortion causes right edge to be different than left edge
    expect(rotated[0].x).not.toBe(baseQuad[0].x);
    expect(rotated[1].x).not.toBe(baseQuad[1].x);
  });

  it('computes 64-bit dHash and exact Hamming distance', () => {
    // Generate synthetic mock ImageData (16x16 pixels)
    const w = 16, h = 16;
    const buffer = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < buffer.length; i += 4) {
      // Create a gradient: left dark, right bright
      const col = (i / 4) % w;
      buffer[i] = col * 16;
      buffer[i + 1] = col * 16;
      buffer[i + 2] = col * 16;
      buffer[i + 3] = 255;
    }
    const imgData = new ImageData(buffer, w, h);

    const hash1 = computeCanvasDHash(imgData);
    expect(hash1.length).toBe(16); // 16 hex chars = 64 bits

    // Self-distance should be 0
    expect(computeHammingDistance(hash1, hash1)).toBe(0);

    // Inverted hash distance should be high
    const dist = computeHammingDistance('0000000000000000', 'ffffffffffffffff');
    expect(dist).toBe(64);
  });

  it('applies CLAHE contrast enhancement without NaN or out-of-bounds pixels', () => {
    const w = 10, h = 10;
    const buffer = new Uint8ClampedArray(w * h * 4);
    for (let i = 0; i < buffer.length; i += 4) {
      buffer[i] = 120;
      buffer[i + 1] = 120;
      buffer[i + 2] = 120;
      buffer[i + 3] = 255;
    }
    const imgData = new ImageData(buffer, w, h);
    const result = applyCLAHEContrast(imgData, { clipLimit: 2.0 });

    expect(result.width).toBe(w);
    expect(result.height).toBe(h);
    expect(result.data.length).toBe(buffer.length);

    for (let i = 0; i < result.data.length; i++) {
      expect(result.data[i]).toBeGreaterThanOrEqual(0);
      expect(result.data[i]).toBeLessThanOrEqual(255);
      expect(isNaN(result.data[i])).toBe(false);
    }
  });
});
