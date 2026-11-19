/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Kannada Through the Ages (1,500+ Years Heritage Timeline)
 *
 * Grounded in peer-reviewed epigraphical research (Epigraphia Carnatica).
 * Dates are documented as "widely cited as" in accordance with academic standards.
 */

export interface HeritageMilestone {
  id: string;
  century: string;
  widelyCitedDate: string;
  titleKannada: string;
  titleEnglish: string;
  dynasty: string;
  location: string;
  significance: string;
  sampleInscriptionKannada: string;
  transliteration: string;
  meaning: string;
  linguisticStage: 'Poorva Halegannada (Pre-Old Kannada)' | 'Halegannada (Old Kannada)' | 'Nadugannada (Middle Kannada)' | 'Hosagannada (Modern Kannada)';
  sources: string[];
}

export interface HalegannadaGlyph {
  archaicGlyph: string;
  unicode: string;
  name: string;
  kannadaName: string;
  modernEquivalent: string;
  periodUsed: string;
  historicalContext: string;
  exampleWord: string;
  exampleTransliteration: string;
}

export const HERITAGE_MILESTONES: HeritageMilestone[] = [
  {
    id: 'halmidi',
    century: '5th Century CE',
    widelyCitedDate: 'Widely cited as c. 450–475 CE',
    titleKannada: 'ಹಲ್ಮಿಡಿ ಶಿಲಾಶಾಸನ',
    titleEnglish: 'Halmidi Inscription (Earliest Epigraphical Record)',
    dynasty: 'ಕದಂಬ ರಾಜವಂಶ (Kadamba Dynasty / King Kakusthavarma)',
    location: 'ಹಲ್ಮಿಡಿ ಗ್ರಾಮ, ಬೇಲೂರು ತಾಲೂಕು, ಹಾಸನ ಜಿಲ್ಲೆ (Hassan)',
    significance: 'Recognized by epigraphists as the earliest recorded full-sentence stone inscription in Kannada prose.',
    sampleInscriptionKannada: 'ನಮಃ ಶ್ರೀಮತ್ ಕದಂಬಪಣ್... ಪಲ್ಮಿಡಿ ಗ್ರಾಮಮಂ ಕೊಟ್ಟುದು',
    transliteration: 'Namaḥ Śrīmat Kadambapaṇ... Palmiḍi grāmamaṁ koṭṭudu',
    meaning: 'Salutations to the Kadambas... The village of Palmadi is gifted to warrior Vijasaraja.',
    linguisticStage: 'Poorva Halegannada (Pre-Old Kannada)',
    sources: [
      'Archaeological Survey of Mysore Annual Report (1936)',
      'Dr. M. H. Krishna, Director of Archaeology, Mysore State',
      'Epigraphia Carnatica Vol. XV',
    ],
  },
  {
    id: 'kavirajamarga',
    century: '9th Century CE',
    widelyCitedDate: 'Widely cited as c. 850 CE',
    titleKannada: 'ಕವಿರಾಜಮಾರ್ಗ',
    titleEnglish: 'Kavirajamarga (First Extant Poetic & Rhetorical Treatise)',
    dynasty: 'ರಾಷ್ಟ್ರಕೂಟ ಸಾಮ್ರಾಜ್ಯ (Rashtrakuta / King Amoghavarsha Nrupatunga)',
    location: 'ಮಾನ್ಯಖೇಟ (Malkhed, Kalaburagi District)',
    significance: 'Celebrates the linguistic boundaries of Karnataka from the Kaveri River to the Godavari River, praising Kannadigas as naturally adept at poetry ("ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದಾ ಕನ್ನಡದೊಳ್").',
    sampleInscriptionKannada: 'ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದಾ ಕನ್ನಡದೊಳ್ ಭಾವಿಸಿದ ಜನಪದಂ',
    transliteration: 'Kāvēriyindamā Gōdāvarivaramirpa nāḍadā Kannaḍadoḷ bhāvisida janapadaṁ',
    meaning: 'The land spanning from River Kaveri unto the Godavari is the land of Kannada, where people are inherently cultured.',
    linguisticStage: 'Halegannada (Old Kannada)',
    sources: [
      'Kavirajamarga by Srivijaya / Amoghavarsha I (c. 850 CE)',
      'Govinda Pai Research Institute',
      'Sahitya Akademi Monographs on Classical Kannada',
    ],
  },
  {
    id: 'begur-stone',
    century: '9th Century CE',
    widelyCitedDate: 'Widely cited as c. 890 CE',
    titleKannada: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಶಾಸನ',
    titleEnglish: 'Begur Hero Stone (Oldest Record of "Bengaluru")',
    dynasty: 'ಪಶ್ಚಿಮ ಗಂಗ ರಾಜವಂಶ (Western Ganga / King Ereganga Neetimarga II)',
    location: 'ಬೇಗೂರು, ಬೆಂಗಳೂರು (Begur Temple, Bengaluru)',
    significance: 'Epigraphically proves Bengaluru existed over 1,130 years ago. Commemorates chieftain Buttanashetty who fell defending Bengaluru.',
    sampleInscriptionKannada: 'ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್ ಬೆಟ್ಟದೊಳ್ ಕಾದಿ ಸತ್ತಂ ನಾಗತ್ತರನ ಮಗಂ',
    transliteration: 'Śrīmad Beṅgaḷūra Kāḷagadoḷ beṭṭadoḷ kādi sattaṁ Nāgattarana magaṁ',
    meaning: 'In the glorious battle of Bengaluru, fighting bravely upon the hill, fell the valiant son of Nagattara.',
    linguisticStage: 'Halegannada (Old Kannada)',
    sources: [
      'Epigraphia Carnatica Vol. IX (Inscriptions in Bangalore District)',
      'Benjamin Lewis Rice (1905)',
      'Indian National Trust for Art and Cultural Heritage (INTACH Bengaluru)',
    ],
  },
  {
    id: 'vachana-era',
    century: '12th Century CE',
    widelyCitedDate: 'Widely cited as c. 1150–1200 CE',
    titleKannada: 'ಶರಣ ಸಾಹಿತ್ಯ ಮತ್ತು ವಚನ ಚಳವಳಿ',
    titleEnglish: 'Sharana Movement & Vachana Literature',
    dynasty: 'ಕಲ್ಯಾಣ ಚಾಲುಕ್ಯ ಮತ್ತು ಕಲಚೂರಿ ಕಾಲ (Kalyana Kalachuri Era)',
    location: 'ಬಸವಕಲ್ಯಾಣ ಮತ್ತು ಕೂಡಲಸಂಗಮ (Kalyana / Kudalasangama)',
    significance: 'Democratized Kannada literature by shifting away from rigid Sanskritized meters to direct, rhythmic spoken Kannada prose that any citizen could read and recite.',
    sampleInscriptionKannada: 'ಕಳಬೇಡ, ಕೊಲಬೇಡ, ಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ... ಇದೇ ಅಂತರಂಗಶುದ್ಧಿ',
    transliteration: 'Kaḷabēḍa, kolabēḍa, husiya nuḍiyalu bēḍa... idē antaraṅgaśuddhi',
    meaning: 'Do not steal, do not kill, do not speak untruth... this alone is true inner purity (Basaveshwara).',
    linguisticStage: 'Nadugannada (Middle Kannada)',
    sources: [
      'Vachana Sahitya Samagra Samputa, Govt. of Karnataka',
      'Prof. M. Chidananda Murthy, Epigraphist & Scholar',
    ],
  },
  {
    id: 'modern-unification',
    century: '20th Century to Present',
    widelyCitedDate: '1 November 1956 (Unification) / 1973 (Renamed Karnataka)',
    titleKannada: 'ಕರ್ನಾಟಕ ಏಕೀಕರಣ ಮತ್ತು ಆಧುನಿಕ ಯುಗ',
    titleEnglish: 'Karnataka Unification & Contemporary Classical Era',
    dynasty: 'ಆಧುನಿಕ ಪ್ರಜಾಪ್ರಭುತ್ವ (Democratic Republic of India)',
    location: 'ಸಮಗ್ರ ಕರ್ನಾಟಕ (Unified Karnataka)',
    significance: 'United 5 fractured Kannada-speaking administrative zones into one state on 1 Nov 1956. Kannada recognized as Classical Language of India in 2008 with 8 Jnanpith Awards.',
    sampleInscriptionKannada: 'ಹೆಸರಾಯಿತು ಕರ್ನಾಟಕ, ಉಸಿರಾಗಲಿ ಕನ್ನಡ (ದೇ.ಜವರೇಗೌಡ)',
    transliteration: 'Hesarāyitu Karṇāṭaka, usirāgali Kannaḍa',
    meaning: 'The land is named Karnataka; may Kannada be our very breath.',
    linguisticStage: 'Hosagannada (Modern Kannada)',
    sources: [
      'States Reorganisation Act, 1956',
      'Govt. of Karnataka Gazettes (1973 Re-naming)',
      'Classical Language Notification (Govt. of India, 2008)',
    ],
  },
];

export const ARCHAIC_GLYPHS: HalegannadaGlyph[] = [
  {
    archaicGlyph: 'ೞ',
    unicode: 'U+0CDE',
    name: 'Zha / Kula',
    kannadaName: 'ೞ (ಕುಳ / ೞ-ಕಾರ)',
    modernEquivalent: 'ಳ (Lla) or ಲ (La)',
    periodUsed: '5th to 12th Century CE (Halmidi to Vachana Era)',
    historicalContext: 'A voiced retroflex approximant [ɻ] similar to Tamil "ழ" and Malayalam "ഴ". Gradually merged with ಳ in Middle Kannada.',
    exampleWord: 'ಏೞು (ēḻu)',
    exampleTransliteration: 'Modern: ಏಳು (Seven / Rise)',
  },
  {
    archaicGlyph: 'ಱ',
    unicode: 'U+0CB1',
    name: 'Rra / Shakata Repha',
    kannadaName: 'ಱ (ಶಕಟ ರೇಫ)',
    modernEquivalent: 'ರ (Ra)',
    periodUsed: '5th to 14th Century CE',
    historicalContext: 'An alveolar trill / hard "r" sound. Represented by a wheel-shaped glyph (shakata) in Badami Chalukya inscriptions.',
    exampleWord: 'ಅಱಿ (aṟi)',
    exampleTransliteration: 'Modern: ಅರಿ (To know / Knowledge)',
  },
];
