/**
 * LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Authentic Bengaluru & Karnataka Signboard Test Scenes
 *
 * Provides 4 benchmark scenes with calibrated perspective bounding quadrilaterals,
 * original Kannada text, phonetics, translations, cultural notes, and pHash hashes.
 */

import { Quad } from '../core/homography';

export interface SignTextRegion {
  id: string;
  kannadaText: string;
  transliteration: string;
  englishTranslation: string;
  confidence: number;
  inferenceTier: 'EDGE_CACHE' | 'LOCAL_OCR' | 'CLOUD_VLM';
  quad: Quad; // [TL, TR, BR, BL] normalized (0-800 x 0-500)
  backgroundColor: string;
  textColor: string;
  fontCategory: 'BMTC_BUS' | 'DARSHINI_MENU' | 'TRAFFIC_SIGN' | 'HERITAGE_STONE';
  culturalNote: string;
  sandhiNote?: string;
  pHash: string; // 64-bit perceptual hash
}

export interface SampleScene {
  id: string;
  title: string;
  kannadaTitle: string;
  category: 'TRANSIT' | 'CULINARY' | 'URBAN_CIVIC' | 'HERITAGE_EPIGRAPHY';
  description: string;
  location: string;
  canvasWidth: number;
  canvasHeight: number;
  regions: SignTextRegion[];
  defaultPitch: number;
  defaultYaw: number;
  defaultRoll: number;
  bgRenderer: 'BMTC' | 'DARSHINI' | 'STREET' | 'SHILASHASANA';
}

export const SAMPLE_SCENES: SampleScene[] = [
  {
    id: 'bmtc-bus',
    title: 'BMTC Bus Destination Board',
    kannadaTitle: 'ಬಿಎಂಟಿಸಿ ಬಸ್ ಫಲಕ',
    category: 'TRANSIT',
    description: 'Skewed route board on a Volvo Vajra bus at Kempegowda Bus Station (Majestic)',
    location: 'Majestic (Kempegowda Bus Station), Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -8,
    defaultYaw: 14,
    defaultRoll: -2,
    bgRenderer: 'BMTC',
    regions: [
      {
        id: 'bmtc-reg-1',
        kannadaText: 'ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ',
        transliteration: 'K.R. Mārukaṭṭe',
        englishTranslation: 'KR Market (City Market)',
        confidence: 0.98,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 140, y: 155 },
          { x: 670, y: 130 },
          { x: 675, y: 220 },
          { x: 135, y: 245 },
        ],
        backgroundColor: '#0F1E36', // Deep BMTC Blue
        textColor: '#FACC15', // High-vis Canary Yellow
        fontCategory: 'BMTC_BUS',
        culturalNote: 'Named after Krishnaraja Wadiyar IV, KR Market is one of Asia’s largest flower and wholesale markets, established in 1928.',
        sandhiNote: 'ಮಾರು + ಕಟ್ಟೆ = ಮಾರುಕಟ್ಟೆ (ಸಮಾಸ - Market platform)',
        pHash: 'b94e823a7c1f0d8a',
      },
      {
        id: 'bmtc-reg-2',
        kannadaText: 'ಮೆಜೆಸ್ಟಿಕ್ - ಶಿವಾಜಿನಗರ',
        transliteration: 'Mejesṭik - Śivājinagara',
        englishTranslation: 'Majestic - Shivajinagar',
        confidence: 0.96,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 148, y: 260 },
          { x: 658, y: 240 },
          { x: 662, y: 325 },
          { x: 145, y: 345 },
        ],
        backgroundColor: '#0F1E36',
        textColor: '#FFFFFF',
        fontCategory: 'BMTC_BUS',
        culturalNote: '"Majestic" is Bengaluru colloquial shorthand for the Kempegowda Bus Station, originally named after the historic Majestic Cinema theater.',
        sandhiNote: 'ಶಿವಾಜಿ + ನಗರ = ಶಿವಾಜಿನಗರ (ತತ್ಪುರುಷ ಸಮಾಸ)',
        pHash: 'f0c39a117b2e48aa',
      },
      {
        id: 'bmtc-reg-3',
        kannadaText: 'ಬೆಂಗಳೂರು ಮಹಾನಗರ ಸಾರಿಗೆ ಸಂಸ್ಥೆ',
        transliteration: 'Beṅgaḷūru Mahānagara Sārige Saṁsthe',
        englishTranslation: 'Bengaluru Metropolitan Transport Corp (BMTC)',
        confidence: 0.94,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 180, y: 90 },
          { x: 630, y: 75 },
          { x: 633, y: 120 },
          { x: 178, y: 135 },
        ],
        backgroundColor: '#1E293B',
        textColor: '#F59E0B',
        fontCategory: 'BMTC_BUS',
        culturalNote: 'BMTC runs over 6,000 buses carrying 3.5+ million passengers daily across Bengaluru.',
        pHash: 'c7d210549ba38812',
      },
    ],
  },
  {
    id: 'darshini-menu',
    title: 'Bengaluru Darshini Hotel Menu',
    kannadaTitle: 'ಬೆಂಗಳೂರು ದರ್ಶಿನಿ ತಿಂಡಿ ಫಲಕ',
    category: 'CULINARY',
    description: 'Iconic stainless-steel and acrylic tariff board from an authentic Bengaluru Darshini',
    location: 'Malleshwaram / VV Puram, Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: 5,
    defaultYaw: -10,
    defaultRoll: 1,
    bgRenderer: 'DARSHINI',
    regions: [
      {
        id: 'menu-reg-1',
        kannadaText: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
        transliteration: 'Bisi Bēḷe Bāt',
        englishTranslation: 'Hot Lentil & Rice Stew (Bisi Bele Bath)',
        confidence: 0.99,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 120, y: 130 },
          { x: 520, y: 145 },
          { x: 515, y: 200 },
          { x: 115, y: 185 },
        ],
        backgroundColor: '#78350F', // Warm Rosewood/Mahogany
        textColor: '#FEF08A',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Bisi Bele Bath originated in the royal kitchens of the Mysore Palace and is seasoned with nutmeg, Marathi moggu, and pure ghee.',
        sandhiNote: 'ಬಿಸಿ + ಬೇಳೆ + ಭಾತ್ (ಕನ್ನಡ ವಿಶೇಷಣ ಸಮಾಸ)',
        pHash: '98fa01bc24d67e33',
      },
      {
        id: 'menu-reg-2',
        kannadaText: 'ಮಸಾಲೆ ದೋಸೆ',
        transliteration: 'Masāle Dōse',
        englishTranslation: 'Crispy Masala Dosa (with Potato Palya)',
        confidence: 0.97,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 122, y: 215 },
          { x: 518, y: 228 },
          { x: 514, y: 280 },
          { x: 118, y: 268 },
        ],
        backgroundColor: '#78350F',
        textColor: '#FEF08A',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Bengaluru / Mysuru-style dosas are famously thick and crisp, smeared inside with fiery red garlic-chutney and dollops of butter.',
        pHash: '3a1f8c77209e51dd',
      },
      {
        id: 'menu-reg-3',
        kannadaText: 'ರವೆ ಇಡ್ಲಿ ವಡೆ',
        transliteration: 'Rave Iḍli Vaḍe',
        englishTranslation: 'Semolina Steamed Cake & Crispy Vada',
        confidence: 0.95,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 125, y: 295 },
          { x: 516, y: 305 },
          { x: 512, y: 355 },
          { x: 121, y: 345 },
        ],
        backgroundColor: '#78350F',
        textColor: '#FEF08A',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Rava Idli was invented in Bengaluru by Mavalli Tiffin Room (MTR) during World War II when rice supplies were rationed.',
        pHash: '4b92ce11a876005f',
      },
      {
        id: 'menu-reg-4',
        kannadaText: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
        transliteration: 'Philṭar Kāphi',
        englishTranslation: 'Traditional South Indian Filter Coffee',
        confidence: 0.99,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 127, y: 370 },
          { x: 514, y: 380 },
          { x: 510, y: 430 },
          { x: 123, y: 420 },
        ],
        backgroundColor: '#78350F',
        textColor: '#FDE047',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Brewed using a metal percolation decoction with Chikmagalur & Kodagu plantation peaberry coffee and chicory, frothed in a brass davarah.',
        sandhiNote: 'ಆಂಗ್ಲ ಭಾಷಾ ಸ್ವೀಕೃತ ಪದ (Loanword: Filter Coffee)',
        pHash: 'e6b81a29f34088bc',
      },
    ],
  },
  {
    id: 'traffic-sign',
    title: 'Bengaluru Urban Street Traffic Sign',
    kannadaTitle: 'ನಗರ ಸಂಚಾರ ಮಾರ್ಗಸೂಚಿ ಫಲಕ',
    category: 'URBAN_CIVIC',
    description: 'High-contrast bilingual road sign by BBMP & Traffic Police near MG Road',
    location: 'MG Road / Brigade Road Junction, Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -6,
    defaultYaw: -12,
    defaultRoll: 0,
    bgRenderer: 'STREET',
    regions: [
      {
        id: 'street-reg-1',
        kannadaText: 'ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ',
        transliteration: 'Pravēśa Niṣēdhisalāgide',
        englishTranslation: 'No Entry (One-Way Traffic)',
        confidence: 0.96,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 160, y: 135 },
          { x: 640, y: 155 },
          { x: 630, y: 225 },
          { x: 150, y: 205 },
        ],
        backgroundColor: '#064E3B', // Deep Traffic Green
        textColor: '#FFFFFF',
        fontCategory: 'TRAFFIC_SIGN',
        culturalNote: 'Standard bilingual signage format mandated by BBMP with Kannada prioritized at 60% prominent visual weight according to the Karnataka Official Language Act.',
        sandhiNote: 'ಪ್ರವೇಶ + ನಿಷೇಧ (ಸಂಸ್ಕೃತ ತತ್ಸಮ)',
        pHash: '81f092ea7d34190b',
      },
      {
        id: 'street-reg-2',
        kannadaText: 'ನೋ ಪಾರ್ಕಿಂಗ್ - ಎಂ.ಜಿ. ರಸ್ತೆ',
        transliteration: 'Nō Pārkiṅg - Eṁ.Ji. Raste',
        englishTranslation: 'No Parking - M.G. Road',
        confidence: 0.93,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 170, y: 245 },
          { x: 625, y: 262 },
          { x: 618, y: 325 },
          { x: 163, y: 308 },
        ],
        backgroundColor: '#064E3B',
        textColor: '#FACC15',
        fontCategory: 'TRAFFIC_SIGN',
        culturalNote: 'Showcases Bengaluru "Kanglish" code-mixing in urban infrastructure (English loanwords transcribed phonetically into Kannada abugida script).',
        sandhiNote: 'ನೋ ಪಾರ್ಕಿಂಗ್ (Kanglish Loanword Transcription)',
        pHash: 'a5518b2c4e90df33',
      },
      {
        id: 'street-reg-3',
        kannadaText: 'ವಾಹನಗಳನ್ನು ಟೋ ಮಾಡಲಾಗುವುದು',
        transliteration: 'Vāhanagaḷannu Ṭō Māḍalāguvudu',
        englishTranslation: 'Violating Vehicles Will Be Towed',
        confidence: 0.91,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 195, y: 345 },
          { x: 600, y: 358 },
          { x: 595, y: 405 },
          { x: 190, y: 392 },
        ],
        backgroundColor: '#991B1B', // Red Warning Banner
        textColor: '#FFFFFF',
        fontCategory: 'TRAFFIC_SIGN',
        culturalNote: 'Strict enforcement notice for Bengaluru traffic police tow-away zones.',
        sandhiNote: 'ವಾಹನಗಳು + ಅನ್ನು = ವಾಹನಗಳನ್ನು (ದ್ವಿತೀಯಾ ವಿಭಕ್ತಿ)',
        pHash: '62e104fd88a1b559',
      },
    ],
  },
  {
    id: 'shilashasana',
    title: 'Historic Inscription (Shilashasana Mode)',
    kannadaTitle: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಶಿಲಾಶಾಸನ (ಕ್ರಿ.ಶ. ೮೯೦)',
    category: 'HERITAGE_EPIGRAPHY',
    description: 'Weathered Ganga-era stone tablet containing the earliest epigraphical record of "Bengaluru"',
    location: 'Begur Fort / Panchalingeshwara Temple, Bengaluru (c. 890 CE)',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -2,
    defaultYaw: 8,
    defaultRoll: -3,
    bgRenderer: 'SHILASHASANA',
    regions: [
      {
        id: 'stone-reg-1',
        kannadaText: 'ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್',
        transliteration: 'Śrīmad Beṅgaḷūra Kāḷagadoḷ',
        englishTranslation: 'In the glorious battle of Bengaluru...',
        confidence: 0.81, // < 0.85 threshold: triggers Tier 3 Cloud VLM fallback or Shilashasana filter!
        inferenceTier: 'CLOUD_VLM',
        quad: [
          { x: 170, y: 150 },
          { x: 660, y: 135 },
          { x: 665, y: 225 },
          { x: 175, y: 240 },
        ],
        backgroundColor: '#374151', // Weathered Granite
        textColor: '#E5E7EB',
        fontCategory: 'HERITAGE_STONE',
        culturalNote: 'The Begur Inscription (circa 890 CE, rule of King Ereganga Neetimarga II) contains the oldest recorded mention of the name "Bengaluru" (ಬೆಂಗಳೂರು), proving the city existed over 1,130 years ago!',
        sandhiNote: 'ಹಳಗನ್ನಡ ಸಪ್ತಮೀ ವಿಭಕ್ತಿ: ಕಾಳಗ + ಒಳ್ = ಕಾಳಗದೊಳ್ (In the battle)',
        pHash: '1a2b3c4d5e6f7081',
      },
      {
        id: 'stone-reg-2',
        kannadaText: 'ಬೆಟ್ಟದೊಳ್ ಕಾದಿ ಸತ್ತಂ ನಾಗತ್ತರನ ಮಗಂ',
        transliteration: 'Beṭṭadoḷ Kādi Sattaṁ Nāgattarana Magaṁ',
        englishTranslation: 'Fighting bravely on the hill fell the son of Nagattara',
        confidence: 0.79, // Escalated to Cloud VLM
        inferenceTier: 'CLOUD_VLM',
        quad: [
          { x: 165, y: 260 },
          { x: 655, y: 245 },
          { x: 660, y: 340 },
          { x: 170, y: 355 },
        ],
        backgroundColor: '#374151',
        textColor: '#E5E7EB',
        fontCategory: 'HERITAGE_STONE',
        culturalNote: 'This is a "Veeragallu" (Hero Stone) honoring chieftain Buttanashetty, son of Nagattara, who sacrificed his life defending Bengaluru against the Nolambas.',
        sandhiNote: 'ಹಳಗನ್ನಡ ಕ್ರಿಯಾಪದ: ಕಾದಿ (ಯುದ್ಧಮಾಡಿ) + ಸತ್ತಂ (ವೀರಮರಣ ಹೊಂದಿದನು)',
        pHash: '990a1b2c3d4e5f60',
      },
    ],
  },
];
