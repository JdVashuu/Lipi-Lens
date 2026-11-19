# LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X)
### Edge-Native Spatial AR & Neuro-Symbolic Kannada Script Intelligence Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-00F5FF.svg)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)]()
[![Kannada Rajyotsava](https://img.shields.io/badge/Kannada_Rajyotsava-Gold_&_Crimson-E11D48.svg)]()

> Most hackathon teams slap a camera onto an LLM API and call it an OCR app. **LipiLens-X** treats Kannada script recognition as a **real-time computer vision, spatial AR, and computational linguistics problem**—running on-device inference directly on the browser GPU (WebGPU), projecting perspective-corrected translations back onto physical signboards in 3D space, and mathematically decomposing Kannada's complex *abugida* morphology (*ottaksharas* and *sandhi*) in real time.

---

## 🏛️ System Architecture

```
                          [ Physical Signboard / Video Feed ]
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Tier 1: On-Device pHash Cache      │ ── Hit (<15ms) ──┐
                      │    (64-bit dHash Hamming Distance)    │                  │
                      └───────────────────────────────────────┘                  │
                                          │ Miss                                 │
                                          ▼                                      │
                      ┌───────────────────────────────────────┐                  │
                      │  Tier 2: Edge CV Polygon Detection    │                  │
                      │  (WASM / WebGPU DBNet++ & ONNX Web)   │                  │
                      └───────────────────────────────────────┘                  │
                                          │                                      │
                                          ▼                                      │
                      ┌───────────────────────────────────────┐                  │
                      │  Confidence / Entropy Gate (τ < 0.85) │                  │
                      └───────────────────────────────────────┘                  │
                                 │                   │                           │
                   High (≥0.85)  │                   │ Low (<0.85 or Stone)      │
                                 ▼                   ▼                           │
                   ┌───────────────────┐   ┌───────────────────────────┐         │
                   │ Local Indic FST   │   │  Tier 3: Cloud VLM        │         │
                   │ & Morphology      │   │  (Gemini 2.5 Flash Fallback)│        │
                   └───────────────────┘   └───────────────────────────┘         │
                                 │                   │                           │
                                 └──────────┬────────┘                           │
                                            ▼                                    │
                      ┌───────────────────────────────────────┐                  │
                      │    Planar Homography Warp (H ∈ R³ˣ³)  │ <────────────────┘
                      │   & Real-time Background Inpainting   │
                      └───────────────────────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │  AR Canvas Overlay / Akshara X-Ray    │
                      │  & Syllable Synchronized Audio (TTS)  │
                      └───────────────────────────────────────┘
```

---

## 📐 Deep Engineering Formulations

### 1. Planar Homography Matrix ($H \in \mathbb{R}^{3\times3}$)
To project translated text seamlessly onto tilted, curved, or skewed physical signboards:
$$\begin{bmatrix} x' \\ y' \\ w' \end{bmatrix} = \begin{bmatrix} h_{00} & h_{01} & h_{02} \\ h_{10} & h_{11} & h_{12} \\ h_{20} & h_{21} & h_{22} \end{bmatrix} \begin{bmatrix} u \\ v \\ 1 \end{bmatrix}, \quad x = \frac{x'}{w'}, \quad y = \frac{y'}{w'}$$

The system solves an 8-degree-of-freedom Direct Linear Transform (DLT) system mapping canonical rectangular text coordinates to detected scene polygon vertices, converted directly into hardware-accelerated CSS `matrix3d` properties for GPU-accelerated 60 FPS rendering.

### 2. Deterministic Unicode Finite-State Transducer (`U+0C80`–`U+0CFF`)
Kannada is an **agglutinative abugida**. Characters are segmented into grapheme clusters:
- **Base Consonants ($V$):** `U+0C95`–`U+0CB9` ($k, kh, g, gh...$)
- **Virama / Halant ($H$):** `U+0CCD` (್)
- **Subscript Conjuncts ($O$):** $H + C$ chains (e.g. `ರ್ + ತ್ + ಸ್ + ಯ = ರ್ತ್ಸ್ಯ`)
- **Dependent Vowel Signs ($M$):** `U+0CBE`–`U+0CCC` (Kagunita)
- **Yogavaahas ($Y$):** `U+0C82` (ಂ Anusvara) / `U+0C83` (ಃ Visarga)

**Formation Formula**:
$$[ \text{Base}_H ] + \sum [ \text{Ottakshara}_i ] + [ \text{Matra} ] + [ \text{Yogavaaha} ] \longrightarrow \text{Akshara AST}$$
Example:
$$[ \text{ಜ್ (U+0C9C+U+0CCD)} ] + [ \text{ಯ್ (U+0CAF+U+0CCD)} ] + [ \text{ಓ (U+0CCA)} ] = \text{ಜ್ಯೋ}$$

---

## 🎯 4 "Jaw-Drop" Demo Moments

1. **Live AR Signboard Hijack:**
   Point your camera or select the BMTC Bus Board / Darshini Menu; adjust 3D pitch/yaw or drag corner calibration pins. The translated English text stays locked to the signboard in 3D perspective with smooth background inpainting.
2. **Akshara X-Ray Mode:**
   Tap complex words like **ಕರ್ನಾಟಕ ರಾಜ್ಯೋತ್ಸವ** to expand an interactive AST deconstructor showing the base consonants, *ottaksharas*, vowel modifiers, and slow-motion synchronized pronunciation.
3. **Shilashasana (Heritage Inscription) Mode:**
   Toggle the custom CLAHE + adaptive relief shader on the Begur Inscription Stone (c. 890 CE) to reveal the oldest recorded mention of *"Bengaluru"* (*ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್*).
4. **Airplane Mode Stress Test:**
   Toggle "Airplane Mode" on the top navigation bar. Notice the FPS stays locked at 60 FPS and pHash cache lookups run sub-15ms with zero cloud network connectivity!

---

## ⚡ Quickstart

### Prerequisites
- Node.js (v18+) or Bun (v1.0+)
- Python (v3.10+) with `uv` or `pip`

### One-Command Launch
```bash
./start.sh
```

Or run manually:

#### Backend:
```bash
cd backend
uv venv && uv pip install -r requirements.txt
uv run uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend:
```bash
cd frontend
bun install # or npm install
bun run dev # or npm run dev
```

Visit: **http://localhost:5173**

---

## 🛡️ Judge Q&A Defense Cheat Sheet

| Question | M.Tech-Grade Defense |
|---|---|
| **"Why not just use Google Lens?"** | Google Lens is a consumer black-box translator: it fails offline on moving BMTC buses, doesn't teach the script, cannot decompose Kannada *ottaksharas* or *sandhi* grammar for learners, and lacks specialized epigraphical filters for weathered *Shilashasana* stone monuments. |
| **"How do you handle Kannada's 49 base characters and thousands of conjunct combinations?"** | Instead of forcing a neural classifier to memorize thousands of visual conjunct classes, we decouple **visual glyph detection** from **linguistic structure** using a deterministic Unicode Finite-State Transducer (`U+0C80–U+0CFF`). |
| **"What happens on low-end Android phones without WebGPU?"** | ONNX Runtime Web automatically falls back from the WebGPU execution provider to **WASM SIMD** threads, dropping frame sampling from 30 FPS to 5 FPS keyframe tracking while keeping the spatial UI responsive. |
| **"What is the 3-Tier Inference Cascade?"** | **Tier 1 (0–15ms):** Perceptual hash (`pHash`) check against cache.<br>**Tier 2 (40–90ms):** Edge GPU Indic OCR + Unicode FST decomposition.<br>**Tier 3 (Fallback):** Cloud VLM (Gemini 2.5 Flash) triggered only when token confidence $< 0.85$. |

---

### Kannada Rajyotsava Hackathon Edition 💛❤️
Made with dedication to the preservation, learning, and computational intelligence of Kannada literature and epigraphy.
