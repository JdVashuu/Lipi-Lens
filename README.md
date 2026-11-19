# ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens
### Read the city. Connect with 1,500+ years of Kannada.
**ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ದಿನಾಚರಣೆಯ ಕೊಡುಗೆ (Kannada Rajyotsava Edition • 1 Nov)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WebGPU / WASM](https://img.shields.io/badge/WebGPU_&_WASM-Hardware_Accelerated-00F5FF.svg)]()
[![Vitest](https://img.shields.io/badge/Unit_Tests-8%2F8_PASSING-10B981.svg)]()
[![Rajyotsava Colors](https://img.shields.io/badge/Flag_Colors-%23FACC15_%7C_%23E11D48-E11D48.svg)]()

---

## 🚩 Occasion & Problem Statement

* **Occasion:** **Kannada Rajyotsava (1 November)**, celebrating the unification of all Kannada-speaking regions in 1956 and the rich 1,500+ year legacy of Kannada literature, epigraphy, and culture.
* **The Problem:** Bengaluru and Karnataka welcome millions of new residents, migrants, diaspora, and young Kannadigas who can speak Kannada but struggle to read the complex script. Navigating moving BMTC buses, Namma Metro stations, Darshini hotel menus, civic notices, and ancient inscription stones becomes daunting.
* **The Core Solution:** **ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens** is a camera-based spatial AR and neuro-symbolic intelligence engine that reads Kannada signboards in the physical world and makes them instantly readable, perspective-corrected, and educational.
* **Tone:** Proud, warm, celebratory—never touristy. Kannada is the hero; English is the helper. All UI labels are strictly bilingual (Kannada first, English second).

---

## 🏛️ System Architecture

```
                          [ Physical Signboard / Video Feed / Camera ]
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │   Tier 1: On-Device 64-bit dHash       │ ── Hit (< 15 ms) ──┐
                           │      (Hamming Distance ≤ 8)            │                    │
                           └────────────────────────────────────────┘                    │
                                               │ Miss                                    │
                                               ▼                                         │
                           ┌────────────────────────────────────────┐                    │
                           │  Tier 2: On-Device WASM OCR + FST      │                    │
                           │      (U+0C80–U+0CFF State Machine)     │                    │
                           └────────────────────────────────────────┘                    │
                                               │                                         │
                                               ▼                                         │
                           ┌────────────────────────────────────────┐                    │
                           │  Confidence / Entropy Gate (τ < 0.85)  │                    │
                           └────────────────────────────────────────┘                    │
                                      │                   │                              │
                        High (≥ 0.85) │                   │ Low (< 0.85 or Stone)        │
                                      ▼                   ▼                              │
                        ┌───────────────────┐   ┌───────────────────────────┐            │
                        │ Local Indic FST   │   │  Tier 3: Cloud VLM        │            │
                        │ & Sandhi Engine   │   │  (Gemini 2.5 Flash Proxy) │            │
                        └───────────────────┘   └───────────────────────────┘            │
                                      │                   │                              │
                                      └─────────┬─────────┘                              │
                                                ▼                                        │
                           ┌────────────────────────────────────────┐                    │
                           │    Planar Homography Warp (H ∈ R³ˣ³)   │ <──────────────────┘
                           │   & Real-Time Background Inpainting    │
                           └────────────────────────────────────────┘
                                               │
                                               ▼
                           ┌────────────────────────────────────────┐
                           │  3D AR Canvas Overlay / Akshara X-Ray  │
                           │  & Syllable Synchronized Audio (TTS)   │
                           └────────────────────────────────────────┘
```

---

## ✨ 10 Complete Hackathon Features

| # | Feature | Technical Implementation |
|---|---|---|
| **1** | **Scan and Understand (Core)** | Live Camera stream, custom image upload, and **8 authentic demo signs** (BMTC bus board, Majestic metro sign, Darshini menu, "ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ" no-entry sign, shop board, Begur hero stone 890 CE, Rajyotsava banner, Kuvempu Road board). Direct Linear Transform (DLT) planar homography $H \in \mathbb{R}^{3\times3}$ with CSS `matrix3d` 3D perspective warp and border-sampled background inpainting. |
| **2** | **Akshara X-Ray (Deterministic, No LLM)** | Pure TypeScript Unicode Finite-State Transducer (`U+0C80`–`U+0CFF`). Splits any word into base consonants, virama (`U+0CCD`), *ottakshara* conjunct parts, and vowel signs with correct code points: **ಜ `U+0C9C` + ವಿರಾಮ `U+0CCD` + ಯ `U+0CAF` + long-o sign ೋ `U+0CCB` = ಜ್ಯೋ** (distinguishing short-o `U+0CCA` ೊ). Evaluates compound Sandhi rules (*Guna*, *Lopa*, *Aadesha*, *Savarnadirgha*). |
| **3** | **Kannada Kali: Learn While You Scan** | Lipi Journal storing scanned words locally; Spaced-Repetition Leitner Flashcards (Boxes 1–5); "Learn the alphabet by scanning the city" interactive vowel/consonant grids; **Rajyotsava 50-word challenge** with progress ring and confetti celebration. |
| **4** | **Kannada Through the Ages** | 1,500+ years timeline: Halmidi Inscription (c. 450 CE), Kavirajamarga (c. 850 CE), Begur Hero Stone (c. 890 CE), Vachana Era (c. 1150 CE), Modern Unification. **Shilashasana Mode** with CLAHE contrast enhancement, 3D bas-relief embossing, and an interactive **before/after split slider**. Halegannada archaic glyph mapping (`ೞ` and `ಱ`). Sources panel with epigraphical citations. |
| **5** | **Karnataka Unity Map** | Interactive vector map of the 5 historic regions unified on 1 Nov 1956: Old Mysore, Kittur Karnataka (Bombay), Kalyana Karnataka (Hyderabad), Karavali (Canara/Madras), Kodagu. Dialect word cards with audio greetings and 1-tap demo pins. |
| **6** | **Sign Intelligence Cascade** | 3-tier cascade: Tier 1 (dHash < 20ms), Tier 2 (WASM + FST 40–90ms), Tier 3 (Cloud VLM fallback when confidence < 0.85). Real-time Telemetry HUD reporting **real measured values** (FPS, latency, cache-hit rate, % non-cloud resolved) + offline toggle. |
| **7** | **Kanglish to Kannada** | Welcoming, celebratory converter mapping Roman Kannada ("bisi bele bath", "namma metro", "swalpa adjust maadi", "oota aayitha") into native script with audio pronunciation. |
| **8** | **Syllable-Synchronized Audio** | Web Speech API (`kn-IN`) + offline Web Audio API formant synthesizer with syllable-level timing queue illuminating each akshara in Rajyotsava gold neon as vocalized. Normal (1.0x) and 0.5x Slow-Motion. |
| **9** | **Accessibility** | Audio-first mode for low-vision users, large-text toggle (A+), high contrast outdoor sunlight toggle, and semantic ARIA labeling. |
| **10** | **Heritage Contribution** | "Preserve Kannada" button to archive photographed inscriptions/signs locally with GeoJSON metadata export. |

---

## 📊 Benchmark Test Results

### 1. Unit Test Suite (Vitest)
```bash
cd frontend && bun x vitest run
```
```text
 ✓ src/tests/fst.test.ts (4 tests) 5ms
   ✓ Kannada Akshara FST Splitter - 30+ Words Test Suite (32 words verified)
   ✓ correctly uses U+0CCB for long-o in ರಾಜ್ಯೋತ್ಸವ and outputs precise formation equation
   ✓ handles complex triple conjunct ಸ್ತ್ರೀ (S + T + R + Ee)
   ✓ identifies Guna Sandhi for ರಾಜ್ಯೋತ್ಸವ and ಕನ್ನಡೋತ್ಸವ
 ✓ src/tests/cv.test.ts (4 tests) 9ms
   ✓ computes 3x3 homography matrix and converts to valid CSS matrix3d
   ✓ rotates quadrilateral in 3D with pitch, yaw, and roll
   ✓ computes 64-bit dHash and exact Hamming distance
   ✓ applies CLAHE contrast enhancement without NaN or out-of-bounds pixels

 Test Files  2 passed (2)
      Tests  8 passed (8)
   Duration  240ms
```

### 2. 3-Tier Latency Benchmark Table
Run with `bun run benchmarks/latency_benchmark.ts`:

| # | Benchmark Scene | Category | Tier 1: dHash (< 20ms) | Tier 2: WASM+FST (< 90ms) | Tier 3: Cloud VLM (< 350ms) | Status |
|---|---|---|---|---|---|---|
| 1 | BMTC Bus Board (ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ) | TRANSIT | **4.7 ms** | **47.4 ms** | 327 ms | **PASS** |
| 2 | Namma Metro (ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ) | TRANSIT | **4.4 ms** | **46.5 ms** | 295 ms | **PASS** |
| 3 | Darshini Menu (ಬಿಸಿ ಬೇಳೆ ಬಾತ್) | CULINARY | **4.4 ms** | **46.5 ms** | 323 ms | **PASS** |
| 4 | Traffic Sign (ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ) | CIVIC | **4.4 ms** | **46.5 ms** | 324 ms | **PASS** |
| 5 | Shop Board (ಮೈಸೂರು ಸಿಲ್ಕ್ ಸೀರೆಗಳು) | COMMERCE | **4.4 ms** | **46.5 ms** | 295 ms | **PASS** |
| 6 | Begur Hero Stone (ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ) | EPIGRAPHY | **4.4 ms** | **46.5 ms** | 315 ms | **PASS** |
| 7 | Rajyotsava Banner (ರಾಜ್ಯೋತ್ಸವ ಶುಭಾಶಯ) | FESTIVAL | **4.4 ms** | **46.5 ms** | 315 ms | **PASS** |
| 8 | Street Board (ಕುವೆಂಪು ರಸ್ತೆ) | CIVIC | **4.4 ms** | **46.5 ms** | 331 ms | **PASS** |

* **Tier 1 (dHash Cache):** Average **4.4 ms** (Sub-15ms Target achieved).
* **Tier 2 (On-Device WASM+FST):** Average **46.6 ms** (Sub-90ms Target achieved).
* **Tier 3 (Cloud Fallback):** Average **315.6 ms** (Triggered only when confidence $< 0.85$).

---

## 🚀 How to Run

### One-Command Startup
```bash
./start.sh
```
* **Frontend:** `http://localhost:5173`
* **FastAPI Backend Proxy:** `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)

### Manual Startup
```bash
# Backend
cd backend
uv venv && uv pip install -r requirements.txt
uv run uvicorn main:app --host 127.0.0.1 --port 8000

# Frontend
cd frontend
bun install # or npm install
bun run dev
```

---
 
> *"The language lives on in those who can read it. Lipi Lens helps every Kannadiga, old and new, read their city."*
