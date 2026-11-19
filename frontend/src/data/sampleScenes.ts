/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - 8 Authentic Benchmark Signboard Scenes
 *
 * All 8 demo images required for the Kannada Rajyotsava evaluation:
 * 1. BMTC Bus Board (Majestic - KR Market)
 * 2. Namma Metro Station Sign (Majestic Interchange / ಮೆಜೆಸ್ಟಿಕ್ ಮೆಟ್ರೋ)
 * 3. Darshini Hotel Menu (Bisi Bele Bath, Masale Dose, Filter Coffee)
 * 4. Regulatory Traffic Sign ("ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ" No-Entry)
 * 5. Heritage Silk & Sweet Shop Board (ಮೈಸೂರು ಸಿಲ್ಕ್ & ಕಾಮಧೇನು ಸ್ವೀಟ್ಸ್)
 * 6. Begur Hero Stone Inscription (890 CE Shilashasana)
 * 7. Kannada Rajyotsava Celebration Banner (ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು)
 * 8. Municipal Street Name Board (ಕುವೆಂಪು ರಸ್ತೆ / Kuvempu Road)
 */

import { Quad } from '../core/homography';

export interface SignTextRegion {
  id: string;
  kannadaText: string;
  transliteration: string;
  englishTranslation: string;
  confidence: number;
  inferenceTier: 'EDGE_CACHE' | 'LOCAL_OCR' | 'CLOUD_VLM';
  quad: Quad; // [TL, TR, BR, BL]
  backgroundColor: string;
  textColor: string;
  fontCategory: string;
  culturalNote: string;
  sandhiNote?: string;
  pHash: string; // 64-bit perceptual hash
}

export interface SampleScene {
  id: string;
  title: string;
  kannadaTitle: string;
  category: 'TRANSIT' | 'CULINARY' | 'URBAN_CIVIC' | 'HERITAGE_EPIGRAPHY' | 'COMMERCE' | 'FESTIVAL';
  description: string;
  location: string;
  canvasWidth: number;
  canvasHeight: number;
  regions: SignTextRegion[];
  defaultPitch: number;
  defaultYaw: number;
  defaultRoll: number;
  bgRenderer: 'BMTC' | 'METRO' | 'DARSHINI' | 'STREET' | 'SHOP' | 'SHILASHASANA' | 'BANNER' | 'STREET_BOARD';
}

export const SAMPLE_SCENES: SampleScene[] = [
  // 1. BMTC Bus Board
  {
    id: 'bmtc-bus',
    title: 'BMTC Bus Destination Board',
    kannadaTitle: 'ಬಿಎಂಟಿಸಿ ಬಸ್ ಫಲಕ',
    category: 'TRANSIT',
    description: 'Vajra route board at Kempegowda Bus Station',
    location: 'ಮೆಜೆಸ್ಟಿಕ್ (Kempegowda Bus Station), Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -6,
    defaultYaw: 12,
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
        backgroundColor: '#0F1E36',
        textColor: '#FACC15',
        fontCategory: 'BMTC_BUS',
        culturalNote: 'Named after Krishnaraja Wadiyar IV, KR Market was established in 1928 and remains Asia\'s busiest flower and commodity exchange.',
        sandhiNote: 'ಮಾರು + ಕಟ್ಟೆ = ಮಾರುಕಟ್ಟೆ (ತತ್ಪುರುಷ ಸಮಾಸ / Market platform)',
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
        culturalNote: '"Majestic" is Bengaluru colloquial shorthand for the bus terminal, named after the iconic 1930s Majestic Cinema.',
        sandhiNote: 'ಶಿವಾಜಿ + ನಗರ = ಶಿವಾಜಿನಗರ (Cantonment market)',
        pHash: 'f0c39a117b2e48aa',
      },
    ],
  },

  // 2. Majestic Metro Sign
  {
    id: 'metro-sign',
    title: 'Namma Metro Station Signboard',
    kannadaTitle: 'ನಮ್ಮ ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಫಲಕ',
    category: 'TRANSIT',
    description: 'Underground bilingual interchange signage on the Purple & Green line',
    location: 'ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿಲ್ದಾಣ (Majestic Interchange)',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: 4,
    defaultYaw: -8,
    defaultRoll: 0,
    bgRenderer: 'METRO',
    regions: [
      {
        id: 'metro-reg-1',
        kannadaText: 'ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿಲ್ದಾಣ',
        transliteration: 'Nāḍaprabhu Kempēgauḍa Nildāṇa',
        englishTranslation: 'Nadaprabhu Kempegowda Station',
        confidence: 0.97,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 130, y: 140 },
          { x: 670, y: 155 },
          { x: 665, y: 225 },
          { x: 125, y: 210 },
        ],
        backgroundColor: '#4C1D95', // Royal Purple line
        textColor: '#FFFFFF',
        fontCategory: 'METRO_SIGN',
        culturalNote: 'Honors Kempe Gowda I (1510–1569), the visionary chieftain who founded modern Bengaluru in 1537.',
        sandhiNote: 'ನಾಡ + ಪ್ರಭು = ನಾಡಪ್ರಭು (ತತ್ಪುರುಷ ಸಮಾಸ / Lord of the Land)',
        pHash: '2f8a44c9b130e955',
      },
      {
        id: 'metro-reg-2',
        kannadaText: 'ಮೆಜೆಸ್ಟಿಕ್ ಇಂಟರ್‌ಚೇಂಜ್',
        transliteration: 'Mejesṭik Iṇṭar-cēñj',
        englishTranslation: 'Majestic Metro Interchange',
        confidence: 0.94,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 140, y: 245 },
          { x: 660, y: 260 },
          { x: 655, y: 315 },
          { x: 135, y: 300 },
        ],
        backgroundColor: '#047857', // Green line accent
        textColor: '#FACC15',
        fontCategory: 'METRO_SIGN',
        culturalNote: 'India\'s deepest underground cross-platform rapid transit metro interchange station.',
        sandhiNote: 'ಆಂಗ್ಲ ಭಾಷಾ ಸ್ವೀಕೃತ ಪದ (Transliterated Loanword: Interchange)',
        pHash: '6d11a0c874e5b299',
      },
    ],
  },

  // 3. Darshini Hotel Menu
  {
    id: 'darshini-menu',
    title: 'Bengaluru Darshini Hotel Menu',
    kannadaTitle: 'ಬೆಂಗಳೂರು ದರ್ಶಿನಿ ತಿಂಡಿ ಫಲಕ',
    category: 'CULINARY',
    description: 'Iconic rosewood and brass tariff board from a Malleshwaram eatery',
    location: 'ಮಲ್ಲೇಶ್ವರಂ (Malleshwaram 8th Cross), Bengaluru',
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
        englishTranslation: 'Bisi Bele Bath (Hot Spiced Lentil & Rice Stew)',
        confidence: 0.99,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 120, y: 130 },
          { x: 520, y: 145 },
          { x: 515, y: 200 },
          { x: 115, y: 185 },
        ],
        backgroundColor: '#78350F',
        textColor: '#FEF08A',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Originated in the royal Mysore Palace kitchens, flavored with Marathi moggu, nutmeg, cinnamon, and pure desi ghee.',
        sandhiNote: 'ಬಿಸಿ + ಬೇಳೆ + ಭಾತ್ (ಕನ್ನಡ ವಿಶೇಷಣ ಸಮಾಸ)',
        pHash: '98fa01bc24d67e33',
      },
      {
        id: 'menu-reg-2',
        kannadaText: 'ಮಸಾಲೆ ದೋಸೆ',
        transliteration: 'Masāle Dōse',
        englishTranslation: 'Crispy Masala Dosa (with Red Chutney & Potato Palya)',
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
        culturalNote: 'Bengaluru dosas are renowned for their crisp outer crust, red garlic-chilli chutney smear, and dollops of white butter.',
        pHash: '3a1f8c77209e51dd',
      },
      {
        id: 'menu-reg-3',
        kannadaText: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
        transliteration: 'Philṭar Kāphi',
        englishTranslation: 'Traditional South Indian Filter Coffee',
        confidence: 0.99,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 127, y: 300 },
          { x: 514, y: 310 },
          { x: 510, y: 360 },
          { x: 123, y: 350 },
        ],
        backgroundColor: '#78350F',
        textColor: '#FDE047',
        fontCategory: 'DARSHINI_MENU',
        culturalNote: 'Brewed with dark roast Chikmagalur & Kodagu plantation peaberry coffee and chicory, served in a brass davarah.',
        sandhiNote: 'ಆಂಗ್ಲ ಭಾಷಾ ಸ್ವೀಕೃತ ಪದ (Loanword: Filter Coffee)',
        pHash: 'e6b81a29f34088bc',
      },
    ],
  },

  // 4. No Entry Traffic Sign
  {
    id: 'traffic-sign',
    title: 'Urban Traffic "No Entry" Sign',
    kannadaTitle: 'ಸಂಚಾರ ನಿಯಂತ್ರಣ ಫಲಕ (ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ)',
    category: 'URBAN_CIVIC',
    description: 'High-contrast bilingual road sign by BBMP & Bengaluru Traffic Police',
    location: 'ಎಂ.ಜಿ. ರಸ್ತೆ (MG Road Junction), Bengaluru',
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
        backgroundColor: '#064E3B',
        textColor: '#FFFFFF',
        fontCategory: 'TRAFFIC_SIGN',
        culturalNote: 'Mandatory bilingual signage format giving prominent 60% visual weight to Kannada as mandated by Karnataka language acts.',
        sandhiNote: 'ಪ್ರವೇಶ + ನಿಷೇಧ (ಸಂಸ್ಕೃತ ತತ್ಸಮ)',
        pHash: '81f092ea7d34190b',
      },
      {
        id: 'street-reg-2',
        kannadaText: 'ನೋ ಪಾರ್ಕಿಂಗ್ - ಒನ್ ವೇ',
        transliteration: 'Nō Pārkiṅg - On Vē',
        englishTranslation: 'No Parking - One Way Street',
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
        culturalNote: 'Highlights Kanglish code-mixing in urban civic administration infrastructure.',
        sandhiNote: 'ನೋ ಪಾರ್ಕಿಂಗ್ (Kanglish Loanword)',
        pHash: 'a5518b2c4e90df33',
      },
    ],
  },

  // 5. Traditional Shop Board
  {
    id: 'shop-board',
    title: 'Traditional Karnataka Silk & Sweet Shop',
    kannadaTitle: 'ಕರ್ನಾಟಕ ರೇಷ್ಮೆ ಮತ್ತು ಸಿಹಿ ಮಳಿಗೆ',
    category: 'COMMERCE',
    description: 'Vibrant commercial storefront sign on Avenue Road',
    location: 'ಆವೆನ್ಯೂ ರಸ್ತೆ (Avenue Road / Chickpet), Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -4,
    defaultYaw: 10,
    defaultRoll: -1,
    bgRenderer: 'SHOP',
    regions: [
      {
        id: 'shop-reg-1',
        kannadaText: 'ಮೈಸೂರು ಸಿಲ್ಕ್ ಸೀರೆಗಳು',
        transliteration: 'Maisūru Silk Sīregaḷu',
        englishTranslation: 'Authentic Mysore Silk Sarees',
        confidence: 0.96,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 150, y: 140 },
          { x: 650, y: 155 },
          { x: 645, y: 220 },
          { x: 145, y: 205 },
        ],
        backgroundColor: '#831843', // Royal Crimson Silk
        textColor: '#FACC15',
        fontCategory: 'SHOP_BOARD',
        culturalNote: 'Mysore Silk holds a GI tag (Geographical Indication) and is woven with 100% pure silk and pure gold-silver zari.',
        sandhiNote: 'ಮೈಸೂರು + ರೇಷ್ಮೆ / ಸಿಲ್ಕ್ (ಖ್ಯಾತ ಭೌಗೋಳಿಕ ಹೆಗ್ಗುರುತು)',
        pHash: '77a0bc91f24d1012',
      },
      {
        id: 'shop-reg-2',
        kannadaText: 'ಕಾಮಧೇನು ಮೈಸೂರು ಪಾಕ್',
        transliteration: 'Kāmadhēnu Maisūru Pāk',
        englishTranslation: 'Kamadhenu Royal Mysore Pak Sweets',
        confidence: 0.95,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 160, y: 245 },
          { x: 635, y: 258 },
          { x: 630, y: 315 },
          { x: 155, y: 302 },
        ],
        backgroundColor: '#831843',
        textColor: '#FFFFFF',
        fontCategory: 'SHOP_BOARD',
        culturalNote: 'Mysore Pak was invented by royal chef Kakasura Madappa in 1935 in the palace kitchens of Maharaja Krishnaraja Wadiyar IV.',
        sandhiNote: 'ಮೈಸೂರು + ಪಾಕ = ಮೈಸೂರುಪಾಕ್ (ಪಾಕ / Sugar syrup)',
        pHash: '5e990b1c784fa201',
      },
    ],
  },

  // 6. Begur Hero Stone Inscription (890 CE)
  {
    id: 'shilashasana',
    title: 'Begur Hero Stone Inscription (c. 890 CE)',
    kannadaTitle: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಶಿಲಾಶಾಸನ (ಕ್ರಿ.ಶ. ೮೯೦)',
    category: 'HERITAGE_EPIGRAPHY',
    description: 'Weathered Ganga-era stone tablet containing the earliest epigraphical record of "Bengaluru"',
    location: 'ಬೇಗೂರು ಪಂಚಲಿಂಗೇಶ್ವರ ದೇವಾಲಯ (Begur Temple, c. 890 CE)',
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
        confidence: 0.81, // < 0.85 triggers Tier 3 Cloud VLM
        inferenceTier: 'CLOUD_VLM',
        quad: [
          { x: 170, y: 150 },
          { x: 660, y: 135 },
          { x: 665, y: 225 },
          { x: 175, y: 240 },
        ],
        backgroundColor: '#374151',
        textColor: '#E5E7EB',
        fontCategory: 'HERITAGE_STONE',
        culturalNote: 'Contains the oldest recorded mention of "Bengaluru" (ಬೆಂಗಳೂರು) in epigraphy, dating to the Western Ganga King Ereganga Neetimarga II era.',
        sandhiNote: 'ಹಳಗನ್ನಡ ಸಪ್ತಮೀ ವಿಭಕ್ತಿ: ಕಾಳಗ + ಒಳ್ = ಕಾಳಗದೊಳ್ (In the battle)',
        pHash: '1a2b3c4d5e6f7081',
      },
      {
        id: 'stone-reg-2',
        kannadaText: 'ಬೆಟ್ಟದೊಳ್ ಕಾದಿ ಸತ್ತಂ ನಾಗತ್ತರನ ಮಗಂ',
        transliteration: 'Beṭṭadoḷ Kādi Sattaṁ Nāgattarana Magaṁ',
        englishTranslation: 'Fighting bravely on the hill fell the son of Nagattara',
        confidence: 0.79,
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
        culturalNote: 'Honors warrior Buttanashetty, who laid down his life defending Bengaluru against Nolamba forces.',
        sandhiNote: 'ಹಳಗನ್ನಡ ಕ್ರಿಯಾಪದ: ಕಾದಿ (ಹೋರಾಡಿ) + ಸತ್ತಂ (ವೀರಮರಣ ಹೊಂದಿದನು)',
        pHash: '990a1b2c3d4e5f60',
      },
    ],
  },

  // 7. Kannada Rajyotsava Celebration Banner
  {
    id: 'rajyotsava-banner',
    title: 'Kannada Rajyotsava Celebration Banner',
    kannadaTitle: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ ಶುಭಾಶಯ ಫಲಕ',
    category: 'FESTIVAL',
    description: 'Festive red-and-gold flag banner celebrating Karnataka State Formation Day (1 Nov)',
    location: 'ಕಬ್ಬನ್ ಪಾರ್ಕ್ / ವಿಧಾನಸೌಧ (Vidhana Soudha Grounds), Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: 3,
    defaultYaw: -6,
    defaultRoll: 2,
    bgRenderer: 'BANNER',
    regions: [
      {
        id: 'banner-reg-1',
        kannadaText: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು',
        transliteration: 'Kannaḍa Rājyōtsavada Śubhāśayagaḷu',
        englishTranslation: 'Happy Kannada Rajyotsava (Karnataka Formation Day)',
        confidence: 0.99,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 130, y: 145 },
          { x: 670, y: 160 },
          { x: 665, y: 235 },
          { x: 125, y: 220 },
        ],
        backgroundColor: '#DC2626', // Flag Crimson
        textColor: '#FACC15', // Flag Gold
        fontCategory: 'FESTIVAL_BANNER',
        culturalNote: 'Marks 1 November 1956, when all Kannada-speaking regions across 5 historic provinces unified into Mysore State (renamed Karnataka in 1973).',
        sandhiNote: 'ರಾಜ್ಯ + ಉತ್ಸವ = ರಾಜ್ಯೋತ್ಸವ (ಗುಣ ಸಂಧಿ / Guna Sandhi: ಅ + ಉ = ಓ)',
        pHash: 'ff99104b2a8c3390',
      },
      {
        id: 'banner-reg-2',
        kannadaText: 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ',
        transliteration: 'Sirigannaḍaṁ Gelge Sirigannaḍaṁ Bāḷge',
        englishTranslation: 'May Glorious Kannada Triumph! May Glorious Kannada Flourish!',
        confidence: 0.97,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 140, y: 255 },
          { x: 660, y: 270 },
          { x: 655, y: 325 },
          { x: 135, y: 310 },
        ],
        backgroundColor: '#DC2626',
        textColor: '#FFFFFF',
        fontCategory: 'FESTIVAL_BANNER',
        culturalNote: 'Historic benediction from 9th-century Kavirajamarga and popularized by poet Aluru Venkata Rao during the unification movement.',
        sandhiNote: 'ಸಿರಿ (ಶ್ರೀಮಂತ) + ಕನ್ನಡ = ಸಿರಿಗನ್ನಡ (ಕನ್ನಡ ಕಾವ್ಯ ಪ್ರಾರ್ಥನೆ)',
        pHash: '88c105ab497e2011',
      },
    ],
  },

  // 8. Municipal Street Name Board (Kuvempu Road)
  {
    id: 'street-board',
    title: 'Kuvempu Road Street Name Board',
    kannadaTitle: 'ಕುವೆಂಪು ರಸ್ತೆ ನಾಮಫಲಕ',
    category: 'URBAN_CIVIC',
    description: 'Classic yellow-and-black municipal street name board',
    location: 'ರಾಜಾಜಿನಗರ (Rajajinagar 1st Block), Bengaluru',
    canvasWidth: 800,
    canvasHeight: 520,
    defaultPitch: -5,
    defaultYaw: 14,
    defaultRoll: -1,
    bgRenderer: 'STREET_BOARD',
    regions: [
      {
        id: 'street-board-reg-1',
        kannadaText: 'ರಾಷ್ಟ್ರಕವಿ ಕುವೆಂಪು ರಸ್ತೆ',
        transliteration: 'Rāṣṭrakavi Kuvempu Raste',
        englishTranslation: 'Rashtrakavi Kuvempu Road',
        confidence: 0.98,
        inferenceTier: 'EDGE_CACHE',
        quad: [
          { x: 140, y: 150 },
          { x: 660, y: 130 },
          { x: 665, y: 225 },
          { x: 135, y: 245 },
        ],
        backgroundColor: '#F59E0B', // Municipal Warm Amber Yellow
        textColor: '#0B0F19', // Black typography
        fontCategory: 'STREET_NAME',
        culturalNote: 'Named after Kuppali Venkatappa Puttappa (Kuvempu, 1904–1994), the celebrated national poet who penned Karnataka\'s state anthem "Jaya Bharata Jananiya Tanujate".',
        sandhiNote: 'ರಾಷ್ಟ್ರ + ಕವಿ = ರಾಷ್ಟ್ರಕವಿ (ತತ್ಪುರುಷ ಸಮಾಸ / Poet Laureate)',
        pHash: '34a108cb921f0088',
      },
      {
        id: 'street-board-reg-2',
        kannadaText: '೧ನೇ ಹಂತ ರಾಜಾಜಿನಗರ',
        transliteration: '1nē Hanta Rājājinagara',
        englishTranslation: '1st Stage Rajajinagar, Bengaluru-560010',
        confidence: 0.95,
        inferenceTier: 'LOCAL_OCR',
        quad: [
          { x: 150, y: 260 },
          { x: 650, y: 242 },
          { x: 655, y: 320 },
          { x: 145, y: 340 },
        ],
        backgroundColor: '#F59E0B',
        textColor: '#0B0F19',
        fontCategory: 'STREET_NAME',
        culturalNote: 'Rajajinagar was established in 1949 and named after C. Rajagopalachari, the last Governor-General of India.',
        sandhiNote: 'ರಾಜಾಜಿ + ನಗರ = ರಾಜಾಜಿನಗರ',
        pHash: 'c90b14ea77810023',
      },
    ],
  },
];
