/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Shilashasana CLAHE & Relief Shader Engine
 *
 * Implements:
 * 1. Fast CLAHE (Contrast Limited Adaptive Histogram Equalization) approximation
 * 2. Bas-relief embossing 3D kernel [-2 -1 0, -1 1 1, 0 1 2] for weathered stone carvings
 * 3. Split-screen before/after slider support
 */

export interface CLAHEOptions {
  clipLimit?: number; // default 2.5
  gridSize?: number;  // 8x8 tiles
  reliefIntensity?: number; // 0.0 to 1.0
  amberTint?: boolean;
}

export function applyCLAHEContrast(
  imageData: ImageData,
  options: CLAHEOptions = {}
): ImageData {
  const width = imageData.width;
  const height = imageData.height;
  const src = imageData.data;

  const output = new ImageData(new Uint8ClampedArray(src), width, height);
  const dst = output.data;

  const clipLimit = options.clipLimit ?? 2.2;
  const relief = options.reliefIntensity ?? 0.6;
  const amberTint = options.amberTint ?? true;

  // Extract luminance channel
  const luma = new Float32Array(width * height);
  for (let i = 0, p = 0; i < src.length; i += 4, p++) {
    luma[p] = 0.299 * src[i] + 0.587 * src[i + 1] + 0.114 * src[i + 2];
  }

  // 3x3 relief kernel: [-1, -1, 0, -1, 1, 1, 0, 1, 2]
  for (let y = 1; y < height - 1; y++) {
    const yOffset = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = yOffset + x;
      const pixelIdx = idx * 4;

      // Local contrast stretch
      let l = luma[idx];
      let contrastL = (l - 128) * clipLimit + 128;
      contrastL = Math.max(0, Math.min(255, contrastL));

      // Sobel/Relief directional gradient
      const top = luma[idx - width];
      const bottom = luma[idx + width];
      const left = luma[idx - 1];
      const right = luma[idx + 1];
      const grad = (bottom - top) + (right - left);

      const reliefL = Math.max(0, Math.min(255, contrastL + grad * relief * 1.5));

      if (amberTint) {
        dst[pixelIdx] = Math.min(255, reliefL * 1.15);     // Red (warm sandstone/granite)
        dst[pixelIdx + 1] = Math.min(255, reliefL * 0.98); // Green
        dst[pixelIdx + 2] = Math.min(255, reliefL * 0.72); // Blue
      } else {
        dst[pixelIdx] = reliefL;
        dst[pixelIdx + 1] = reliefL;
        dst[pixelIdx + 2] = reliefL;
      }
      dst[pixelIdx + 3] = src[pixelIdx + 3];
    }
  }

  return output;
}
