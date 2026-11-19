/**
 * LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Deterministic Kannada Akshara FST Parser
 * Unicode Block: U+0C80 - U+0CFF
 *
 * Implements an exact Finite-State Transducer (FST) for the Kannada abugida script.
 * Decomposes complex consonant clusters (ottaksharas), vowel modifiers (kagunita),
 * halant/virama (pollu), and yogavaahas into an Abstract Syntax Tree (AST).
 */

export interface OttaksharaInfo {
  glyph: string;
  consonant: string;
  name: string;
  unicode: string;
  viramaCode: string;
}

export interface VowelSignInfo {
  glyph: string;
  name: string;
  unicode: string;
  sound: string;
  isLong: boolean;
}

export interface YogavaahaInfo {
  glyph: string;
  type: 'ANUSVARA' | 'VISARGA' | 'CANDRABINDU';
  name: string;
  unicode: string;
}

export interface AksharaNode {
  id: string;
  raw: string;
  index: number;
  type: 'INDEPENDENT_VOWEL' | 'CONSONANT' | 'CONJUNCT' | 'SPECIAL' | 'PUNCTUATION' | 'WHITESPACE';
  baseGlyph: string;
  baseName: string;
  baseUnicode: string;
  inherentVowel: string;
  vowelSign: VowelSignInfo | null;
  viramaPresent: boolean;
  ottaksharas: OttaksharaInfo[];
  yogavaaha: YogavaahaInfo | null;
  phoneticIPA: string;
  transliteration: string;
  formationFormula: string;
  durationMs: number; // For syllable TTS sync
}

export interface WordAnalysis {
  word: string;
  aksharas: AksharaNode[];
  ipa: string;
  transliteration: string;
  sandhiInfo?: {
    type: string;
    description: string;
    split: [string, string];
    rule: string;
  };
}

// --------------------------------------------------------------------------
// Kannada Unicode Metadata Tables (U+0C80 - U+0CFF)
// --------------------------------------------------------------------------

export const KANNADA_INDEPENDENT_VOWELS: Record<string, { name: string; ipa: string; trans: string; isLong: boolean }> = {
  '\u0C85': { name: 'ಅ (Hrasva A)', ipa: 'ɐ', trans: 'a', isLong: false },
  '\u0C86': { name: 'ಆ (Dirgha Aa)', ipa: 'aː', trans: 'ā', isLong: true },
  '\u0C87': { name: 'ಇ (Hrasva I)', ipa: 'i', trans: 'i', isLong: false },
  '\u0C88': { name: 'ಈ (Dirgha Ee)', ipa: 'iː', trans: 'ī', isLong: true },
  '\u0C89': { name: 'ಉ (Hrasva U)', ipa: 'u', trans: 'u', isLong: false },
  '\u0C8A': { name: 'ಊ (Dirgha Oo)', ipa: 'uː', trans: 'ū', isLong: true },
  '\u0C8B': { name: 'ಋ (Rishi Ru)', ipa: 'ru', trans: 'r̥', isLong: false },
  '\u0C8C': { name: 'ಌ (Lu)', ipa: 'lu', trans: 'l̥', isLong: false },
  '\u0C8E': { name: 'ಎ (Hrasva E)', ipa: 'e', trans: 'e', isLong: false },
  '\u0C8F': { name: 'ಏ (Dirgha Ee)', ipa: 'eː', trans: 'ē', isLong: true },
  '\u0C90': { name: 'ಐ (Ai)', ipa: 'aɪ', trans: 'ai', isLong: true },
  '\u0C92': { name: 'ಒ (Hrasva O)', ipa: 'o', trans: 'o', isLong: false },
  '\u0C93': { name: 'ಓ (Dirgha Oo)', ipa: 'oː', trans: 'ō', isLong: true },
  '\u0C94': { name: 'ಔ (Au)', ipa: 'aʊ', trans: 'au', isLong: true },
};

export const KANNADA_CONSONANTS: Record<string, { name: string; ipa: string; trans: string; varga: string }> = {
  // Ka Varga (Guttural)
  '\u0C95': { name: 'ಕ (Ka-kara)', ipa: 'k', trans: 'k', varga: 'Kanthya (Velar)' },
  '\u0C96': { name: 'ಖ (Kha-kara)', ipa: 'kʰ', trans: 'kh', varga: 'Kanthya (Velar)' },
  '\u0C97': { name: 'ಗ (Ga-kara)', ipa: 'ɡ', trans: 'g', varga: 'Kanthya (Velar)' },
  '\u0C98': { name: 'ಘ (Gha-kara)', ipa: 'ɡʱ', trans: 'gh', varga: 'Kanthya (Velar)' },
  '\u0C99': { name: 'ಙ (Nga-kara)', ipa: 'ŋ', trans: 'ṅ', varga: 'Kanthya (Velar)' },
  // Cha Varga (Palatal)
  '\u0C9A': { name: 'ಚ (Cha-kara)', ipa: 't͡ʃ', trans: 'c', varga: 'Talavya (Palatal)' },
  '\u0C9B': { name: 'ಛ (Chha-kara)', ipa: 't͡ʃʰ', trans: 'ch', varga: 'Talavya (Palatal)' },
  '\u0C9C': { name: 'ಜ (Ja-kara)', ipa: 'd͡ʒ', trans: 'j', varga: 'Talavya (Palatal)' },
  '\u0C9D': { name: 'ಝ (Jha-kara)', ipa: 'd͡ʒʱ', trans: 'jh', varga: 'Talavya (Palatal)' },
  '\u0C9E': { name: 'ಞ (Nya-kara)', ipa: 'ɲ', trans: 'ñ', varga: 'Talavya (Palatal)' },
  // Ta Varga (Retroflex)
  '\u0C9F': { name: 'ಟ (Ta-kara)', ipa: 'ʈ', trans: 'ṭ', varga: 'Murdhanya (Retroflex)' },
  '\u0CA0': { name: 'ಠ (Tha-kara)', ipa: 'ʈʰ', trans: 'ṭh', varga: 'Murdhanya (Retroflex)' },
  '\u0CA1': { name: 'ಡ (Da-kara)', ipa: 'ɖ', trans: 'ḍ', varga: 'Murdhanya (Retroflex)' },
  '\u0CA2': { name: 'ಢ (Dha-kara)', ipa: 'ɖʱ', trans: 'ḍh', varga: 'Murdhanya (Retroflex)' },
  '\u0CA3': { name: 'ಣ (Na-kara)', ipa: 'ɳ', trans: 'ṇ', varga: 'Murdhanya (Retroflex)' },
  // Tha Varga (Dental)
  '\u0CA4': { name: 'ತ (Ta-kara)', ipa: 't̪', trans: 't', varga: 'Dantya (Dental)' },
  '\u0CA5': { name: 'ಥ (Tha-kara)', ipa: 't̪ʰ', trans: 'th', varga: 'Dantya (Dental)' },
  '\u0CA6': { name: 'ದ (Da-kara)', ipa: 'd̪', trans: 'd', varga: 'Dantya (Dental)' },
  '\u0CA7': { name: 'ಧ (Dha-kara)', ipa: 'd̪ʱ', trans: 'dh', varga: 'Dantya (Dental)' },
  '\u0CA8': { name: 'ನ (Na-kara)', ipa: 'n̪', trans: 'n', varga: 'Dantya (Dental)' },
  // Pa Varga (Labial)
  '\u0CAA': { name: 'ಪ (Pa-kara)', ipa: 'p', trans: 'p', varga: 'Oshthya (Labial)' },
  '\u0CAB': { name: 'ಫ (Pha-kara)', ipa: 'pʰ', trans: 'ph', varga: 'Oshthya (Labial)' },
  '\u0CAC': { name: 'ಬ (Ba-kara)', ipa: 'b', trans: 'b', varga: 'Oshthya (Labial)' },
  '\u0CAD': { name: 'ಭ (Bha-kara)', ipa: 'bʱ', trans: 'bh', varga: 'Oshthya (Labial)' },
  '\u0CAE': { name: 'ಮ (Ma-kara)', ipa: 'm', trans: 'm', varga: 'Oshthya (Labial)' },
  // Avargiya Vyanjanas (Approximants & Fricatives)
  '\u0CAF': { name: 'ಯ (Ya-kara)', ipa: 'j', trans: 'y', varga: 'Avargiya' },
  '\u0CB0': { name: 'ರ (Ra-kara)', ipa: 'r', trans: 'r', varga: 'Avargiya' },
  '\u0CB1': { name: 'ಱ (Kula Ra-kara / Rra)', ipa: 'r', trans: 'ṟ', varga: 'Avargiya (Archaic)' },
  '\u0CB2': { name: 'ಲ (La-kara)', ipa: 'l', trans: 'l', varga: 'Avargiya' },
  '\u0CB3': { name: 'ಳ (Kula La-kara)', ipa: 'ɭ', trans: 'ḷ', varga: 'Avargiya' },
  '\u0CB5': { name: 'ವ (Va-kara)', ipa: 'ʋ', trans: 'v', varga: 'Avargiya' },
  '\u0CB6': { name: 'ಶ (Sha-kara)', ipa: 'ʃ', trans: 'ś', varga: 'Talavya Fricative' },
  '\u0CB7': { name: 'ಷ (Shha-kara)', ipa: 'ʂ', trans: 'ṣ', varga: 'Murdhanya Fricative' },
  '\u0CB8': { name: 'ಸ (Sa-kara)', ipa: 's', trans: 's', varga: 'Dantya Fricative' },
  '\u0CB9': { name: 'ಹ (Ha-kara)', ipa: 'h', trans: 'h', varga: 'Kanthya Fricative' },
  '\u0CDE': { name: 'ೞ (Fa / Za / Archaic Lla)', ipa: 'ɻ', trans: 'ḻ', varga: 'Halegannada Archaic' },
};

export const KANNADA_DEPENDENT_VOWELS: Record<string, { name: string; ipa: string; trans: string; isLong: boolean }> = {
  '\u0CBE': { name: 'ಾ (Dirgha / A-kara Matra)', ipa: 'aː', trans: 'ā', isLong: true },
  '\u0CBF': { name: 'ಿ (Gudisu / I-kara Matra)', ipa: 'i', trans: 'i', isLong: false },
  '\u0CC0': { name: 'ೀ (Gudisu Dirgha / Ee Matra)', ipa: 'iː', trans: 'ī', isLong: true },
  '\u0CC1': { name: 'ು (Kommu / U-kara Matra)', ipa: 'u', trans: 'u', isLong: false },
  '\u0CC2': { name: 'ೂ (Kommu Dirgha / Oo Matra)', ipa: 'uː', trans: 'ū', isLong: true },
  '\u0CC3': { name: 'ೃ (Vattusuli / Ru Matra)', ipa: 'ru', trans: 'r̥', isLong: false },
  '\u0CC4': { name: 'ೄ (Vattusuli Dirgha)', ipa: 'ruː', trans: 'r̥̄', isLong: true },
  '\u0CC6': { name: 'ೆ (Ettva / E-kara Matra)', ipa: 'e', trans: 'e', isLong: false },
  '\u0CC7': { name: 'ೇ (Ettva Dirgha / Ee Matra)', ipa: 'eː', trans: 'ē', isLong: true },
  '\u0CC8': { name: 'ೈ (Aitva / Ai Matra)', ipa: 'aɪ', trans: 'ai', isLong: true },
  '\u0CCA': { name: 'ೊ (Ottva / O-kara Matra)', ipa: 'o', trans: 'o', isLong: false },
  '\u0CCB': { name: 'ೋ (Ottva Dirgha / Oo Matra)', ipa: 'oː', trans: 'ō', isLong: true },
  '\u0CCC': { name: 'ೌ (Autva / Au Matra)', ipa: 'aʊ', trans: 'au', isLong: true },
};

export const VIRAMA = '\u0CCD'; // ್ (Halant / Pollu)
export const ANUSVARA = '\u0C82'; // ಂ
export const VISARGA = '\u0C83'; // ಃ

// Common Sandhi and Compound dictionaries for Bengaluru & Karnataka Context
export const KNOWN_SANDHI_WORDS: Record<string, { type: string; split: [string, string]; rule: string; description: string }> = {
  'ಕನ್ನಡೋತ್ಸವ': {
    type: 'ಗುಣ ಸಂಧಿ (Guna Sandhi)',
    split: ['ಕನ್ನಡ', 'ಉತ್ಸವ'],
    rule: 'ಅ/ಆ + ಉ/ಊ = ಓ',
    description: 'Kannada + Utsava = Kannadotsava (Celebration of Kannada culture)',
  },
  'ರಾಜ್ಯೋತ್ಸವ': {
    type: 'ಗುಣ ಸಂಧಿ (Guna Sandhi)',
    split: ['ರಾಜ್ಯ', 'ಉತ್ಸವ'],
    rule: 'ಅ/ಆ + ಉ/ಊ = ಓ',
    description: 'Rajya (State) + Utsava (Festival) = Karnataka Statehood Day',
  },
  'ವಿದ್ಯಾಭ್ಯಾಸ': {
    type: 'ಸವರ್ಣದೀರ್ಘ ಸಂಧಿ (Savarnadirgha Sandhi)',
    split: ['ವಿದ್ಯಾ', 'ಅಭ್ಯಾಸ'],
    rule: 'ಆ + ಅ = ಆ',
    description: 'Vidya (Knowledge) + Abhyasa (Practice) = Education',
  },
  'ದೇವಸ್ಥಾನ': {
    type: 'ತತ್ಪುರುಷ ಸಮಾಸ / ಸಂಸ್ಕೃತ ಸಂಧಿ (Compound)',
    split: ['ದೇವ', 'ಸ್ಥಾನ'],
    rule: 'ದೇವರ ಸ್ಥಾನ = ದೇವಸ್ಥಾನ',
    description: 'Deva (Diety) + Sthana (Abode) = Temple',
  },
  'ಮಾತಿಲ್ಲ': {
    type: 'ಲೋಪ ಸಂಧಿ (Lopa Sandhi)',
    split: ['ಮಾತು', 'ಇಲ್ಲ'],
    rule: 'ಉ + ಇ = ಇ (ಉ ಲೋಪ)',
    description: 'Matu (Words) + Illa (None) = Speechless',
  },
  'ಮನೆಯನ್ನು': {
    type: 'ಆಗಮ ಸಂಧಿ - ಯಕಾರಾಗಮ (Yakaragama Sandhi)',
    split: ['ಮನೆ', 'ಅನ್ನು'],
    rule: 'ಎ + ಅ = ಎ + ಯ್ + ಅ',
    description: 'Mane (Home) + Annu (Accusative marker) = Home (Object)',
  },
  'ಮರವನ್ನು': {
    type: 'ಆಗಮ ಸಂಧಿ - ವಕಾರಾಗಮ (Vakaragama Sandhi)',
    split: ['ಮರ', 'ಅನ್ನು'],
    rule: 'ಅ + ಅ = ಅ + ವ್ + ಅ',
    description: 'Mara (Tree) + Annu (Accusative marker) = Tree (Object)',
  },
  'ಕಂಬನಿ': {
    type: 'ಆದೇಶ ಸಂಧಿ (Aadesha Sandhi)',
    split: ['ಕಣ್', 'ಪನಿ'],
    rule: 'ಪ ಕಾರಕ್ಕೆ ಬ ಕಾರ ಆದೇಶ',
    description: 'Kannu (Eye) + Pani (Drop) = Tears',
  },
  'ಬೆಂಗಾವಲು': {
    type: 'ಆದೇಶ ಸಂಧಿ (Aadesha Sandhi)',
    split: ['ಬೆನ್', 'ಕಾವಲು'],
    rule: 'ಕ ಕಾರಕ್ಕೆ ಗ ಕಾರ ಆದೇಶ',
    description: 'Rear guard / protection',
  },
  'ಬೆಂಗಳೂರು': {
    type: 'ಐತಿಹಾಸಿಕ ನಾಮಪದ (Historical Etymology)',
    split: ['ಬೆಂದ', 'ಕಾಳೂರು'],
    rule: 'ಬೆಂದ ಕಾಳು + ಊರು = ಬೆಂಗಳೂರು (City of Boiled Beans / Begur Inscription Bengaval-ooru)',
    description: 'Historic city name rooted in the 890 CE Begur Hero Stone inscription',
  },
  'ಮೈಸೂರು': {
    type: 'ಪೌರಾಣಿಕ ನಾಮಪದ (Mythological Compound)',
    split: ['ಮಹಿಷ', 'ಊರು'],
    rule: 'ಮಹಿಷನ ಊರು = ಮೈಸೂರು',
    description: 'Mahishasura + Ooru = City of Mahisha',
  },
  'ವಿಧಾನಸೌಧ': {
    type: 'ಕರ್ಮಧಾರಯ ಸಮಾಸ (Compound)',
    split: ['ವಿಧಾನ', 'ಸೌಧ'],
    rule: 'ವಿಧಾನವನ್ನು ರಚಿಸುವ ಸೌಧ',
    description: 'Legislative + Mansion = Karnataka State Capitol',
  },
  'ಬಿಸಿಬೇಳೆಬಾತ್': {
    type: 'ಕನ್ನಡ ಪಾಕಶಾಸ್ತ್ರ ಸಮಾಸ (Culinary Compound)',
    split: ['ಬಿಸಿ ಬೇಳೆ', 'ಭಾತ್'],
    rule: 'ಬಿಸಿಯಾದ ಬೇಳೆಯ ಅನ್ನ',
    description: 'Iconic Karnataka spiced lentil and rice specialty dish',
  },
};

/**
 * Helper to convert Unicode codepoint to formatted hex string (U+0C9C)
 */
export function toHexCode(char: string): string {
  const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
  return `U+${code}`;
}

/**
 * Deterministic Unicode FST: Segments and tokenizes Kannada text into grapheme cluster AST
 */
export function parseKannadaText(text: string): WordAnalysis[] {
  // Normalize Unicode representation to NFC
  const normalized = text.normalize('NFC');
  const words = normalized.split(/([ \t\n\r,.:;!?"'()[\]{}]+)/).filter(Boolean);

  return words.map((chunk, chunkIdx) => {
    // If whitespace or punctuation
    if (/^[ \t\n\r,.:;!?"'()[\]{}]+$/.test(chunk)) {
      const aksharas: AksharaNode[] = [{
        id: `punct-${chunkIdx}`,
        raw: chunk,
        index: 0,
        type: /^\s+$/.test(chunk) ? 'WHITESPACE' : 'PUNCTUATION',
        baseGlyph: chunk,
        baseName: /^\s+$/.test(chunk) ? 'ಸ್ಪೇಸ್ (Space)' : 'ವಿರಾಮ ಚಿಹ್ನೆ (Punctuation)',
        baseUnicode: toHexCode(chunk[0] || ' '),
        inherentVowel: '',
        vowelSign: null,
        viramaPresent: false,
        ottaksharas: [],
        yogavaaha: null,
        phoneticIPA: '',
        transliteration: chunk,
        formationFormula: chunk,
        durationMs: 80,
      }];
      return {
        word: chunk,
        aksharas,
        ipa: '',
        transliteration: chunk,
      };
    }

    // Segment word into Aksharas using Kannada Abugida FST state machine
    const aksharas = segmentWordIntoAksharas(chunk);
    const ipa = aksharas.map(a => a.phoneticIPA).join('');
    const transliteration = aksharas.map(a => a.transliteration).join('');

    // Check for known sandhi breakdown
    const cleanedWord = chunk.replace(/[.,!?:;]/g, '').trim();
    const sandhiInfo = KNOWN_SANDHI_WORDS[cleanedWord];

    return {
      word: chunk,
      aksharas,
      ipa,
      transliteration,
      sandhiInfo,
    };
  });
}

/**
 * Core FST State Machine: Parses a single Kannada word into Aksharas
 */
function segmentWordIntoAksharas(word: string): AksharaNode[] {
  const result: AksharaNode[] = [];
  let i = 0;
  const len = word.length;
  let aksharaIndex = 0;

  while (i < len) {
    const char = word[i];

    // Case 1: Independent Vowel (ಅ, ಆ, ಇ, ಈ...)
    if (KANNADA_INDEPENDENT_VOWELS[char]) {
      const vowelData = KANNADA_INDEPENDENT_VOWELS[char];
      let raw = char;
      let yogavaaha: YogavaahaInfo | null = null;
      let ipa = vowelData.ipa;
      let trans = vowelData.trans;
      i++;

      // Check for trailing Yogavaaha (ಂ or ಃ)
      if (i < len && (word[i] === ANUSVARA || word[i] === VISARGA)) {
        const yChar = word[i];
        raw += yChar;
        if (yChar === ANUSVARA) {
          yogavaaha = { glyph: yChar, type: 'ANUSVARA', name: 'ಅನುಸ್ವಾರ (Anusvara ಂ)', unicode: toHexCode(yChar) };
          ipa += 'm';
          trans += 'ṁ';
        } else {
          yogavaaha = { glyph: yChar, type: 'VISARGA', name: 'ವಿಸರ್ಗ (Visarga ಃ)', unicode: toHexCode(yChar) };
          ipa += 'h';
          trans += 'ḥ';
        }
        i++;
      }

      result.push({
        id: `akshara-${aksharaIndex++}`,
        raw,
        index: aksharaIndex - 1,
        type: 'INDEPENDENT_VOWEL',
        baseGlyph: char,
        baseName: vowelData.name,
        baseUnicode: toHexCode(char),
        inherentVowel: vowelData.ipa,
        vowelSign: null,
        viramaPresent: false,
        ottaksharas: [],
        yogavaaha,
        phoneticIPA: `[${ipa}]`,
        transliteration: trans,
        formationFormula: `[ ${char} (${toHexCode(char)}) ] = ${raw}`,
        durationMs: vowelData.isLong ? 260 : 160,
      });
      continue;
    }

    // Case 2: Consonant Base (ಕ, ಖ, ಗ... + possible conjuncts)
    if (KANNADA_CONSONANTS[char]) {
      const baseConsonantChar = char;
      const baseConsonantData = KANNADA_CONSONANTS[baseConsonantChar];
      let raw = baseConsonantChar;
      const ottaksharas: OttaksharaInfo[] = [];
      let vowelSign: VowelSignInfo | null = null;
      let viramaPresent = false;
      let yogavaaha: YogavaahaInfo | null = null;

      i++;

      // FST loop: Check for virama U+0CCD followed by another consonant (Ottakshara chain)
      while (i < len && word[i] === VIRAMA) {
        // Lookahead to see if next character is a consonant
        if (i + 1 < len && KANNADA_CONSONANTS[word[i + 1]]) {
          const nextConsonant = word[i + 1];
          const conjunctData = KANNADA_CONSONANTS[nextConsonant];
          raw += VIRAMA + nextConsonant;
          ottaksharas.push({
            glyph: nextConsonant,
            consonant: nextConsonant,
            name: `${conjunctData.name.split(' ')[0]}-ವತ್ತು (${conjunctData.trans}-vattu)`,
            unicode: toHexCode(nextConsonant),
            viramaCode: toHexCode(VIRAMA),
          });
          i += 2; // consumed virama + consonant
        } else {
          // Virama without another consonant = Pure consonant with Halant/Pollu (e.g. ಕ್, ನ್, ಲ್)
          raw += VIRAMA;
          viramaPresent = true;
          i++;
          break;
        }
      }

      // Check for Dependent Vowel Sign (Kagunita / Matra)
      if (!viramaPresent && i < len && KANNADA_DEPENDENT_VOWELS[word[i]]) {
        const matraChar = word[i];
        const matraData = KANNADA_DEPENDENT_VOWELS[matraChar];
        raw += matraChar;
        vowelSign = {
          glyph: matraChar,
          name: matraData.name,
          unicode: toHexCode(matraChar),
          sound: matraData.ipa,
          isLong: matraData.isLong,
        };
        i++;
      }

      // Check for Yogavaaha (ಂ or ಃ)
      if (i < len && (word[i] === ANUSVARA || word[i] === VISARGA)) {
        const yChar = word[i];
        raw += yChar;
        if (yChar === ANUSVARA) {
          yogavaaha = { glyph: yChar, type: 'ANUSVARA', name: 'ಅನುಸ್ವಾರ (Anusvara ಂ)', unicode: toHexCode(yChar) };
        } else {
          yogavaaha = { glyph: yChar, type: 'VISARGA', name: 'ವಿಸರ್ಗ (Visarga ಃ)', unicode: toHexCode(yChar) };
        }
        i++;
      }

      // Build Transliteration & IPA
      let trans = baseConsonantData.trans;
      let ipa = baseConsonantData.ipa;

      // Append ottaksharas to pronunciation and transliteration
      for (const otta of ottaksharas) {
        const cData = KANNADA_CONSONANTS[otta.consonant];
        if (cData) {
          trans += cData.trans;
          ipa += cData.ipa;
        }
      }

      // Append vowel
      if (viramaPresent) {
        // No vowel sound (silent pollu)
      } else if (vowelSign) {
        trans += vowelSign.glyph ? KANNADA_DEPENDENT_VOWELS[vowelSign.glyph]?.trans || '' : '';
        ipa += vowelSign.sound;
      } else {
        // Inherent vowel 'a'
        trans += 'a';
        ipa += 'ɐ';
      }

      // Append yogavaaha
      if (yogavaaha) {
        if (yogavaaha.type === 'ANUSVARA') {
          trans += 'ṁ';
          ipa += 'm';
        } else {
          trans += 'ḥ';
          ipa += 'h';
        }
      }

      // Build Formation Formula
      const formulaParts: string[] = [];
      formulaParts.push(`[ ${baseConsonantChar}್ (${toHexCode(baseConsonantChar)}+${toHexCode(VIRAMA)}) ]`);
      for (const otta of ottaksharas) {
        formulaParts.push(`[ ${otta.consonant}್ (${otta.unicode}+${otta.viramaCode}) ]`);
      }
      if (vowelSign) {
        formulaParts.push(`[ ${vowelSign.glyph} (${vowelSign.unicode}) ]`);
      } else if (!viramaPresent) {
        formulaParts.push(`[ ಅ (Inherent 'a') ]`);
      }
      if (yogavaaha) {
        formulaParts.push(`[ ${yogavaaha.glyph} (${yogavaaha.unicode}) ]`);
      }
      const formationFormula = `${formulaParts.join(' + ')} = ${raw}`;

      // Calculate phonetic duration
      let durationMs = 180;
      if (ottaksharas.length > 0) durationMs += 100 * ottaksharas.length;
      if (vowelSign?.isLong) durationMs += 120;

      result.push({
        id: `akshara-${aksharaIndex++}`,
        raw,
        index: aksharaIndex - 1,
        type: ottaksharas.length > 0 ? 'CONJUNCT' : 'CONSONANT',
        baseGlyph: baseConsonantChar,
        baseName: baseConsonantData.name,
        baseUnicode: toHexCode(baseConsonantChar),
        inherentVowel: viramaPresent ? 'none' : (vowelSign ? vowelSign.sound : 'ɐ'),
        vowelSign,
        viramaPresent,
        ottaksharas,
        yogavaaha,
        phoneticIPA: `[${ipa}]`,
        transliteration: trans,
        formationFormula,
        durationMs,
      });
      continue;
    }

    // Case 3: Other character (e.g. English letter, Kannada digits, or punctuation)
    result.push({
      id: `char-${aksharaIndex++}`,
      raw: char,
      index: aksharaIndex - 1,
      type: 'SPECIAL',
      baseGlyph: char,
      baseName: `Glyph (${char})`,
      baseUnicode: toHexCode(char),
      inherentVowel: '',
      vowelSign: null,
      viramaPresent: false,
      ottaksharas: [],
      yogavaaha: null,
      phoneticIPA: char,
      transliteration: char,
      formationFormula: `${char} = ${char}`,
      durationMs: 120,
    });
    i++;
  }

  return result;
}
