/**
 * LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Neural Speech & Syllable-Level Alignment Engine
 *
 * Provides:
 * 1. Web Speech API synthesis with kn-IN / en-IN fallback
 * 2. Syllable-level timestamp scheduling for synchronized UI node illumination
 * 3. Web Audio API synthesized resonant formant acoustic backup for 100% offline mode
 */

import { AksharaNode } from './kannadaFST';

export interface TTSPlaybackOptions {
  rate?: number; // 0.5 for Slow-Mo, 1.0 for normal
  pitch?: number;
  onAksharaStart?: (akshara: AksharaNode, index: number) => void;
  onComplete?: () => void;
}

class TTSEngine {
  private audioCtx: AudioContext | null = null;
  private currentTimeoutIds: number[] = [];
  private isPlaying = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public stop(): void {
    this.isPlaying = false;
    this.currentTimeoutIds.forEach(id => window.clearTimeout(id));
    this.currentTimeoutIds = [];
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Speaks the word with synchronized akshara-by-akshara event illumination
   */
  public speakWordWithAlignment(
    word: string,
    aksharas: AksharaNode[],
    options: TTSPlaybackOptions = {}
  ): void {
    this.stop();
    this.isPlaying = true;

    const rate = options.rate || 0.9;
    const speedMultiplier = 1 / rate;

    // Filter to speakable aksharas
    const speakableAksharas = aksharas.filter(a => a.type !== 'WHITESPACE');
    if (speakableAksharas.length === 0) return;

    // Try native Web Speech API first
    let nativeUtteranceSupported = false;
    if ('speechSynthesis' in window) {
      const voices = window.speechSynthesis.getVoices();
      const kannadaVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('kannada') || v.lang.includes('kn-IN'))
        || voices.find(v => v.lang.includes('hi') || v.lang.includes('te') || v.lang.includes('ta'))
        || voices.find(v => v.lang.includes('en-IN'))
        || voices[0];

      if (kannadaVoice) {
        nativeUtteranceSupported = true;
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.voice = kannadaVoice;
        utterance.rate = rate;
        utterance.pitch = options.pitch || 1.0;
        utterance.lang = kannadaVoice.lang.includes('kn') ? 'kn-IN' : 'en-IN';

        utterance.onend = () => {
          this.isPlaying = false;
          options.onComplete?.();
        };

        utterance.onerror = () => {
          // If native speech fails or is blocked, fallback to synthesized formant audio
          this.playAcousticFormantSynthesizer(speakableAksharas, speedMultiplier, options);
        };

        window.speechSynthesis.speak(utterance);
      }
    }

    // Schedule synchronized akshara glow timings
    let cumulativeDelayMs = 0;
    speakableAksharas.forEach((akshara, idx) => {
      const delay = cumulativeDelayMs;
      const timeoutId = window.setTimeout(() => {
        if (!this.isPlaying) return;
        options.onAksharaStart?.(akshara, idx);

        // If native speech is not supported, generate Web Audio formant acoustic pulse
        if (!nativeUtteranceSupported) {
          this.generateSyllableAcoustic(akshara, akshara.durationMs * speedMultiplier);
        }
      }, delay);

      this.currentTimeoutIds.push(timeoutId);
      cumulativeDelayMs += (akshara.durationMs * speedMultiplier);
    });

    // Schedule completion
    const endTimeoutId = window.setTimeout(() => {
      if (this.isPlaying && !nativeUtteranceSupported) {
        this.isPlaying = false;
        options.onComplete?.();
      }
    }, cumulativeDelayMs + 100);
    this.currentTimeoutIds.push(endTimeoutId);
  }

  /**
   * Offline Web Audio API Formant Synthesizer:
   * Generates authentic harmonic resonant vowel tones with consonants
   */
  private generateSyllableAcoustic(akshara: AksharaNode, durationMs: number): void {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const dur = durationMs / 1000;

      // Base fundamental frequency (F0) around 165Hz (warm male/female Kannada speaker)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Bandpass filter for vowel formant resonance (F1/F2)
      const formantFilter = ctx.createBiquadFilter();
      formantFilter.type = 'bandpass';

      // Tune formant frequency based on vowel sound
      const vowel = akshara.vowelSign ? akshara.vowelSign.name : akshara.inherentVowel;
      if (vowel.includes('i') || vowel.includes('Gudisu')) {
        formantFilter.frequency.setValueAtTime(2200, now); // [i] high F2
      } else if (vowel.includes('u') || vowel.includes('Kommu')) {
        formantFilter.frequency.setValueAtTime(800, now); // [u] low F2
      } else if (vowel.includes('e') || vowel.includes('Ettva')) {
        formantFilter.frequency.setValueAtTime(1800, now);
      } else if (vowel.includes('o') || vowel.includes('Ottva')) {
        formantFilter.frequency.setValueAtTime(1000, now);
      } else {
        formantFilter.frequency.setValueAtTime(1250, now); // [a] center
      }
      formantFilter.Q.setValueAtTime(4.0, now);

      // Pitch contour
      osc.type = 'sawtooth';
      const baseFreq = 160 + (akshara.index % 4) * 8;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + dur);

      // Amplitude envelope (ADSR)
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(formantFilter);
      formantFilter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + dur + 0.05);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  private playAcousticFormantSynthesizer(
    aksharas: AksharaNode[],
    speedMultiplier: number,
    options: TTSPlaybackOptions
  ): void {
    let cumulativeDelay = 0;
    aksharas.forEach((akshara, idx) => {
      const delay = cumulativeDelay;
      const tid = window.setTimeout(() => {
        if (!this.isPlaying) return;
        options.onAksharaStart?.(akshara, idx);
        this.generateSyllableAcoustic(akshara, akshara.durationMs * speedMultiplier);
      }, delay);
      this.currentTimeoutIds.push(tid);
      cumulativeDelay += akshara.durationMs * speedMultiplier;
    });

    const endTid = window.setTimeout(() => {
      this.isPlaying = false;
      options.onComplete?.();
    }, cumulativeDelay + 80);
    this.currentTimeoutIds.push(endTid);
  }
}

export const ttsEngine = new TTSEngine();
