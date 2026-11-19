/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Deterministic Kannada Akshara FST Parser
 * Unicode Block: U+0C80 - U+0CFF
 *
 * Implements an exact Finite-State Transducer (FST) for the Kannada abugida script.
 * Decomposes complex consonant clusters (ottaksharas), vowel modifiers (kagunita),
 * halant/virama (pollu), and yogavaahas into an Abstract Syntax Tree (AST).
 *
 * Verified Unicode Code Points:
 * - Virama / Halant / Pollu: U+0CCD (್)
 * - Short O sign: U+0CCA (ೊ, Ottva - Hrasva)
 * - Long O sign:  U+0CCB (ೋ, Ottva Dirgha - Dirgha)
 * - Anusvara:     U+0C82 (ಂ)
 * - Visarga:      U+0C83 (ಃ)
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
  equationKannada: string; // e.g. "ಜ್ + ಯ್ + ೋ = ಜ್ಯೋ"
  durationMs: number;
}

export interface WordAnalysis {
  word: string;
  aksharas: AksharaNode[];
  ipa: string;
  transliteration: string;
  sandhiInfo?: {
    type: string;
    kannadaType: string;
    description: string;
    split: [string, string];
    rule: string;
  };
}

// --------------------------------------------------------------------------
// Kannada Unicode Metadata Tables (U+0C80 - U+0CFF)
// --------------------------------------------------------------------------

export const KANNADA_INDEPENDENT_VOWELS: Record<string, { name: string; kannadaName: string; ipa: string; trans: string; isLong: boolean }> = {
  '\u0C85': { name: 'A (Hrasva)', kannadaName: 'ಅ (ಹ್ರಸ್ವ ಅ)', ipa: 'ɐ', trans: 'a', isLong: false },
  '\u0C86': { name: 'Aa (Dirgha)', kannadaName: 'ಆ (ದೀರ್ಘ ಆ)', ipa: 'aː', trans: 'ā', isLong: true },
  '\u0C87': { name: 'I (Hrasva)', kannadaName: 'ಇ (ಹ್ರಸ್ವ ಇ)', ipa: 'i', trans: 'i', isLong: false },
  '\u0C88': { name: 'Ee (Dirgha)', kannadaName: 'ಈ (ದೀರ್ಘ ಈ)', ipa: 'iː', trans: 'ī', isLong: true },
  '\u0C89': { name: 'U (Hrasva)', kannadaName: 'ಉ (ಹ್ರಸ್ವ ಉ)', ipa: 'u', trans: 'u', isLong: false },
  '\u0C8A': { name: 'Oo (Dirgha)', kannadaName: 'ಊ (ದೀರ್ಘ ಊ)', ipa: 'uː', trans: 'ū', isLong: true },
  '\u0C8B': { name: 'Ru (Hrasva)', kannadaName: 'ಋ (ಋಕಾರ)', ipa: 'ru', trans: 'r̥', isLong: false },
  '\u0C8C': { name: 'Lu (Archaic)', kannadaName: 'ಌ (ಲುಕಾರ)', ipa: 'lu', trans: 'l̥', isLong: false },
  '\u0C8E': { name: 'E (Hrasva)', kannadaName: 'ಎ (ಹ್ರಸ್ವ ಎ)', ipa: 'e', trans: 'e', isLong: false },
  '\u0C8F': { name: 'Ee (Dirgha)', kannadaName: 'ಏ (ದೀರ್ಘ ಏ)', ipa: 'eː', trans: 'ē', isLong: true },
  '\u0C90': { name: 'Ai (Dirgha)', kannadaName: 'ಐ (ಐಕಾರ)', ipa: 'aɪ', trans: 'ai', isLong: true },
  '\u0C92': { name: 'O (Hrasva)', kannadaName: 'ಒ (ಹ್ರಸ್ವ ಒ)', ipa: 'o', trans: 'o', isLong: false },
  '\u0C93': { name: 'Oo (Dirgha)', kannadaName: 'ಓ (ದೀರ್ಘ ಓ)', ipa: 'oː', trans: 'ō', isLong: true },
  '\u0C94': { name: 'Au (Dirgha)', kannadaName: 'ಔ (ಔಕಾರ)', ipa: 'aʊ', trans: 'au', isLong: true },
};

export const KANNADA_CONSONANTS: Record<string, { name: string; kannadaName: string; ipa: string; trans: string; varga: string }> = {
  // Ka Varga (Guttural / Kanthya)
  '\u0C95': { name: 'Ka', kannadaName: 'ಕ (ಕ-ಕಾರ)', ipa: 'k', trans: 'k', varga: 'ಕಂಠ್ಯ (Kanthya / Velar)' },
  '\u0C96': { name: 'Kha', kannadaName: 'ಖ (ಖ-ಕಾರ)', ipa: 'kʰ', trans: 'kh', varga: 'ಕಂಠ್ಯ (Kanthya / Velar)' },
  '\u0C97': { name: 'Ga', kannadaName: 'ಗ (ಗ-ಕಾರ)', ipa: 'ɡ', trans: 'g', varga: 'ಕಂಠ್ಯ (Kanthya / Velar)' },
  '\u0C98': { name: 'Gha', kannadaName: 'ಘ (ಘ-ಕಾರ)', ipa: 'ɡʱ', trans: 'gh', varga: 'ಕಂಠ್ಯ (Kanthya / Velar)' },
  '\u0C99': { name: 'Nga', kannadaName: 'ಙ (ಙ-ಕಾರ)', ipa: 'ŋ', trans: 'ṅ', varga: 'ಕಂಠ್ಯ (Kanthya / Velar)' },
  // Cha Varga (Palatal / Talavya)
  '\u0C9A': { name: 'Cha', kannadaName: 'ಚ (ಚ-ಕಾರ)', ipa: 't͡ʃ', trans: 'c', varga: 'ತಾಲವ್ಯ (Talavya / Palatal)' },
  '\u0C9B': { name: 'Chha', kannadaName: 'ಛ (ಛ-ಕಾರ)', ipa: 't͡ʃʰ', trans: 'ch', varga: 'ತಾಲವ್ಯ (Talavya / Palatal)' },
  '\u0C9C': { name: 'Ja', kannadaName: 'ಜ (ಜ-ಕಾರ)', ipa: 'd͡ʒ', trans: 'j', varga: 'ತಾಲವ್ಯ (Talavya / Palatal)' },
  '\u0C9D': { name: 'Jha', kannadaName: 'ಝ (ಝ-ಕಾರ)', ipa: 'd͡ʒʱ', trans: 'jh', varga: 'ತಾಲವ್ಯ (Talavya / Palatal)' },
  '\u0C9E': { name: 'Nya', kannadaName: 'ಞ (ಞ-ಕಾರ)', ipa: 'ɲ', trans: 'ñ', varga: 'ತಾಲವ್ಯ (Talavya / Palatal)' },
  // Ta Varga (Retroflex / Murdhanya)
  '\u0C9F': { name: 'Ta', kannadaName: 'ಟ (ಟ-ಕಾರ)', ipa: 'ʈ', trans: 'ṭ', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya / Retroflex)' },
  '\u0CA0': { name: 'Tha', kannadaName: 'ಠ (ಠ-ಕಾರ)', ipa: 'ʈʰ', trans: 'ṭh', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya / Retroflex)' },
  '\u0CA1': { name: 'Da', kannadaName: 'ಡ (ಡ-ಕಾರ)', ipa: 'ɖ', trans: 'ḍ', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya / Retroflex)' },
  '\u0CA2': { name: 'Dha', kannadaName: 'ಢ (ಢ-ಕಾರ)', ipa: 'ɖʱ', trans: 'ḍh', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya / Retroflex)' },
  '\u0CA3': { name: 'Na', kannadaName: 'ಣ (ಣ-ಕಾರ)', ipa: 'ɳ', trans: 'ṇ', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya / Retroflex)' },
  // Tha Varga (Dental / Dantya)
  '\u0CA4': { name: 'Ta', kannadaName: 'ತ (ತ-ಕಾರ)', ipa: 't̪', trans: 't', varga: 'ದಂತ್ಯ (Dantya / Dental)' },
  '\u0CA5': { name: 'Tha', kannadaName: 'ಥ (ಥ-ಕಾರ)', ipa: 't̪ʰ', trans: 'th', varga: 'ದಂತ್ಯ (Dantya / Dental)' },
  '\u0CA6': { name: 'Da', kannadaName: 'ದ (ದ-ಕಾರ)', ipa: 'd̪', trans: 'd', varga: 'ದಂತ್ಯ (Dantya / Dental)' },
  '\u0CA7': { name: 'Dha', kannadaName: 'ಧ (ಧ-ಕಾರ)', ipa: 'd̪ʱ', trans: 'dh', varga: 'ದಂತ್ಯ (Dantya / Dental)' },
  '\u0CA8': { name: 'Na', kannadaName: 'ನ (ನ-ಕಾರ)', ipa: 'n̪', trans: 'n', varga: 'ದಂತ್ಯ (Dantya / Dental)' },
  // Pa Varga (Labial / Oshthya)
  '\u0CAA': { name: 'Pa', kannadaName: 'ಪ (ಪ-ಕಾರ)', ipa: 'p', trans: 'p', varga: 'ಓಷ್ಠ್ಯ (Oshthya / Labial)' },
  '\u0CAB': { name: 'Pha', kannadaName: 'ಫ (ಫ-ಕಾರ)', ipa: 'pʰ', trans: 'ph', varga: 'ಓಷ್ಠ್ಯ (Oshthya / Labial)' },
  '\u0CAC': { name: 'Ba', kannadaName: 'ಬ (ಬ-ಕಾರ)', ipa: 'b', trans: 'b', varga: 'ಓಷ್ಠ್ಯ (Oshthya / Labial)' },
  '\u0CAD': { name: 'Bha', kannadaName: 'ಭ (ಭ-ಕಾರ)', ipa: 'bʱ', trans: 'bh', varga: 'ಓಷ್ಠ್ಯ (Oshthya / Labial)' },
  '\u0CAE': { name: 'Ma', kannadaName: 'ಮ (ಮ-ಕಾರ)', ipa: 'm', trans: 'm', varga: 'ಓಷ್ಠ್ಯ (Oshthya / Labial)' },
  // Avargiya Vyanjanas (Approximants & Fricatives)
  '\u0CAF': { name: 'Ya', kannadaName: 'ಯ (ಯ-ಕಾರ)', ipa: 'j', trans: 'y', varga: 'ಅವರ್ಗೀಯ (Avargiya)' },
  '\u0CB0': { name: 'Ra', kannadaName: 'ರ (ರ-ಕಾರ)', ipa: 'r', trans: 'r', varga: 'ಅವರ್ಗೀಯ (Avargiya)' },
  '\u0CB1': { name: 'Rra (Archaic)', kannadaName: 'ಱ (ಶಕಟ ರೇಫ)', ipa: 'r', trans: 'ṟ', varga: 'ಅವರ್ಗೀಯ - ಹಳಗನ್ನಡ (Old Kannada)' },
  '\u0CB2': { name: 'La', kannadaName: 'ಲ (ಲ-ಕಾರ)', ipa: 'l', trans: 'l', varga: 'ಅವರ್ಗೀಯ (Avargiya)' },
  '\u0CB3': { name: 'Lla', kannadaName: 'ಳ (ಳ-ಕಾರ)', ipa: 'ɭ', trans: 'ḷ', varga: 'ಅವರ್ಗೀಯ (Avargiya)' },
  '\u0CB5': { name: 'Va', kannadaName: 'ವ (ವ-ಕಾರ)', ipa: 'ʋ', trans: 'v', varga: 'ಅವರ್ಗೀಯ (Avargiya)' },
  '\u0CB6': { name: 'Sha', kannadaName: 'ಶ (ಶ-ಕಾರ)', ipa: 'ʃ', trans: 'ś', varga: 'ತಾಲವ್ಯ (Talavya Fricative)' },
  '\u0CB7': { name: 'Shha', kannadaName: 'ಷ (ಷ-ಕಾರ)', ipa: 'ʂ', trans: 'ṣ', varga: 'ಮೂರ್ಧನ್ಯ (Murdhanya Fricative)' },
  '\u0CB8': { name: 'Sa', kannadaName: 'ಸ (ಸ-ಕಾರ)', ipa: 's', trans: 's', varga: 'ದಂತ್ಯ (Dantya Fricative)' },
  '\u0CB9': { name: 'Ha', kannadaName: 'ಹ (ಹ-ಕಾರ)', ipa: 'h', trans: 'h', varga: 'ಕಂಠ್ಯ (Kanthya Fricative)' },
  '\u0CDE': { name: 'Zha (Archaic)', kannadaName: 'ೞ (ಕುಳ / ೞ-ಕಾರ)', ipa: 'ɻ', trans: 'ḻ', varga: 'ಹಳಗನ್ನಡ ಅಪೂರ್ವ (Archaic)' },
};

/**
 * Dependent Vowels (Kagunita Matras):
 * Note: U+0CCA is short-o (ೊ), U+0CCB is long-o (ೋ)!
 */
export const KANNADA_DEPENDENT_VOWELS: Record<string, { name: string; kannadaName: string; ipa: string; trans: string; isLong: boolean }> = {
  '\u0CBE': { name: 'A-kara Matra', kannadaName: 'ಾ (ದೀರ್ಘ / ಆ-ಕಾರ)', ipa: 'aː', trans: 'ā', isLong: true },
  '\u0CBF': { name: 'I-kara Matra', kannadaName: 'ಿ (ಗುಡಿಸು / ಇ-ಕಾರ)', ipa: 'i', trans: 'i', isLong: false },
  '\u0CC0': { name: 'Ee-kara Matra', kannadaName: 'ೀ (ಗುಡಿಸು ದೀರ್ಘ / ಈ-ಕಾರ)', ipa: 'iː', trans: 'ī', isLong: true },
  '\u0CC1': { name: 'U-kara Matra', kannadaName: 'ು (ಕೊಂಬು / ಉ-ಕಾರ)', ipa: 'u', trans: 'u', isLong: false },
  '\u0CC2': { name: 'Oo-kara Matra', kannadaName: 'ೂ (ಕೊಂಬು ದೀರ್ಘ / ಊ-ಕಾರ)', ipa: 'uː', trans: 'ū', isLong: true },
  '\u0CC3': { name: 'Ru-kara Matra', kannadaName: 'ೃ (ವಟ್ಟುಸುಳಿ / ಋ-ಕಾರ)', ipa: 'ru', trans: 'r̥', isLong: false },
  '\u0CC4': { name: 'Ruu-kara Matra', kannadaName: 'ೄ (ವಟ್ಟುಸುಳಿ ದೀರ್ಘ)', ipa: 'ruː', trans: 'r̥̄', isLong: true },
  '\u0CC6': { name: 'E-kara Matra (Short)', kannadaName: 'ೆ (ಎತ್ವ / ಹ್ರಸ್ವ ಎ-ಕಾರ)', ipa: 'e', trans: 'e', isLong: false },
  '\u0CC7': { name: 'Ee-kara Matra (Long)', kannadaName: 'ೇ (ಎತ್ವ ದೀರ್ಘ / ದೀರ್ಘ ಏ-ಕಾರ)', ipa: 'eː', trans: 'ē', isLong: true },
  '\u0CC8': { name: 'Ai-kara Matra', kannadaName: 'ೈ (ಐತ್ವ / ಐ-ಕಾರ)', ipa: 'aɪ', trans: 'ai', isLong: true },
  '\u0CCA': { name: 'O-kara Matra (Short-O)', kannadaName: 'ೊ (ಒತ್ವ / ಹ್ರಸ್ವ ಒ-ಕಾರ)', ipa: 'o', trans: 'o', isLong: false },
  '\u0CCB': { name: 'Oo-kara Matra (Long-O)', kannadaName: 'ೋ (ಒತ್ವ ದೀರ್ಘ / ದೀರ್ಘ ಓ-ಕಾರ)', ipa: 'oː', trans: 'ō', isLong: true },
  '\u0CCC': { name: 'Au-kara Matra', kannadaName: 'ೌ (ಔತ್ವ / ಔ-ಕಾರ)', ipa: 'aʊ', trans: 'au', isLong: true },
};

export const VIRAMA = '\u0CCD'; // ್ (Halant / Pollu)
export const ANUSVARA = '\u0C82'; // ಂ
export const VISARGA = '\u0C83'; // ಃ

// Hand-curated Sandhi Table with precise grammatical rules
export const KNOWN_SANDHI_WORDS: Record<string, {
  type: string;
  kannadaType: string;
  split: [string, string];
  rule: string;
  description: string;
}> = {
  'ರಾಜ್ಯೋತ್ಸವ': {
    type: 'Guna Sandhi',
    kannadaType: 'ಗುಣ ಸಂಧಿ',
    split: ['ರಾಜ್ಯ', 'ಉತ್ಸವ'],
    rule: 'ರಾಜ್ಯ (ಅ) + ಉತ್ಸವ (ಉ) = ರಾಜ್ಯೋತ್ಸವ (ಓ)',
    description: 'Rajya (State) + Utsava (Celebration) = Karnataka State Formation Day (1 Nov 1956)',
  },
  'ಕನ್ನಡೋತ್ಸವ': {
    type: 'Guna Sandhi',
    kannadaType: 'ಗುಣ ಸಂಧಿ',
    split: ['ಕನ್ನಡ', 'ಉತ್ಸವ'],
    rule: 'ಕನ್ನಡ (ಅ) + ಉತ್ಸವ (ಉ) = ಕನ್ನಡೋತ್ಸವ (ಓ)',
    description: 'Kannada + Utsava = Celebration of Kannada Language and Culture',
  },
  'ವಿದ್ಯಾಭ್ಯಾಸ': {
    type: 'Savarnadirgha Sandhi',
    kannadaType: 'ಸವರ್ಣದೀರ್ಘ ಸಂಧಿ',
    split: ['ವಿದ್ಯಾ', 'ಅಭ್ಯಾಸ'],
    rule: 'ವಿದ್ಯಾ (ಆ) + ಅಭ್ಯಾಸ (ಅ) = ವಿದ್ಯಾಭ್ಯಾಸ (ಆ)',
    description: 'Vidya (Knowledge) + Abhyasa (Practice) = Education / Studies',
  },
  'ದೇವಸ್ಥಾನ': {
    type: 'Tatpurusha Samasa / Sandhi',
    kannadaType: 'ತತ್ಪುರುಷ ಸಮಾಸ',
    split: ['ದೇವ', 'ಸ್ಥಾನ'],
    rule: 'ದೇವರ + ಸ್ಥಾನ = ದೇವಸ್ಥಾನ',
    description: 'Deva (Deity) + Sthana (Abode) = Temple',
  },
  'ಮಾತಿಲ್ಲ': {
    type: 'Lopa Sandhi (Kannada)',
    kannadaType: 'ಲೋಪ ಸಂಧಿ',
    split: ['ಮಾತು', 'ಇಲ್ಲ'],
    rule: 'ಮಾತು (ಉ) + ಇಲ್ಲ (ಇ) = ಮಾತಿಲ್ಲ (ಇ, ಉ-ಕಾರ ಲೋಪ)',
    description: 'Matu (Word) + Illa (No) = Wordless / Speechless',
  },
  'ಮನೆಯನ್ನು': {
    type: 'Aagama Sandhi (Yakaragama)',
    kannadaType: 'ಆಗಮ ಸಂಧಿ (ಯಕಾರಾಗಮ)',
    split: ['ಮನೆ', 'ಅನ್ನು'],
    rule: 'ಮನೆ (ಎ) + ಅನ್ನು (ಅ) = ಮನೆ + ಯ್ + ಅನ್ನು',
    description: 'Mane (House) + Annu (Accusative marker) = To the house',
  },
  'ಮರವನ್ನು': {
    type: 'Aagama Sandhi (Vakaragama)',
    kannadaType: 'ಆಗಮ ಸಂಧಿ (ವಕಾರಾಗಮ)',
    split: ['ಮರ', 'ಅನ್ನು'],
    rule: 'ಮರ (ಅ) + ಅನ್ನು (ಅ) = ಮರ + ವ್ + ಅನ್ನು',
    description: 'Mara (Tree) + Annu (Accusative marker) = To the tree',
  },
  'ಕಂಬನಿ': {
    type: 'Aadesha Sandhi',
    kannadaType: 'ಆದೇಶ ಸಂಧಿ',
    split: ['ಕಣ್', 'ಪನಿ'],
    rule: 'ಕಣ್ + ಪನಿ = ಕಂಬನಿ (ಪ-ಕಾರಕ್ಕೆ ಬ-ಕಾರ ಆದೇಶ)',
    description: 'Kannu (Eye) + Pani (Drop) = Tear drops',
  },
  'ಬೆಂಗಾವಲು': {
    type: 'Aadesha Sandhi',
    kannadaType: 'ಆದೇಶ ಸಂಧಿ',
    split: ['ಬೆನ್', 'ಕಾವಲು'],
    rule: 'ಬೆನ್ + ಕಾವಲು = ಬೆಂಗಾವಲು (ಕ-ಕಾರಕ್ಕೆ ಗ-ಕಾರ ಆದೇಶ)',
    description: 'Rear guard / Security protection',
  },
  'ಬೆಂಗಳೂರು': {
    type: 'Historical Epigraphical Name',
    kannadaType: 'ಐತಿಹಾಸಿಕ ನಾಮಪದ (೮೯೦ ಕ್ರಿ.ಶ. ಬೇಗೂರು ಶಾಸನ)',
    split: ['ಬೆಂದ', 'ಕಾಳೂರು'],
    rule: 'ಬೆಂದ ಕಾಳು + ಊರು / ಬೆಂಗಾವಲ್-ಊರು',
    description: 'City of Bengaluru, attested in the 890 CE Begur Ganga Hero Stone as "ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್"',
  },
  'ಮೈಸೂರು': {
    type: 'Mythological Compound',
    kannadaType: 'ತತ್ಪುರುಷ ಸಮಾಸ',
    split: ['ಮಹಿಷ', 'ಊರು'],
    rule: 'ಮಹಿಷನ + ಊರು = ಮೈಸೂರು',
    description: 'City of Mahisha / Mysuru royal capital of Wadiyars',
  },
  'ವಿಧಾನಸೌಧ': {
    type: 'Karmadharaya Samasa',
    kannadaType: 'ಕರ್ಮಧಾರಯ ಸಮಾಸ',
    split: ['ವಿಧಾನ', 'ಸೌಧ'],
    rule: 'ವಿಧಾನದ + ಸೌಧ = ವಿಧಾನಸೌಧ',
    description: 'Seat of Karnataka State Legislature',
  },
  'ಬಿಸಿಬೇಳೆಬಾತ್': {
    type: 'Culinary Compound',
    kannadaType: 'ಕನ್ನಡ ಪಾಕಶಾಸ್ತ್ರ ಸಮಾಸ',
    split: ['ಬಿಸಿ ಬೇಳೆ', 'ಭಾತ್'],
    rule: 'ಬಿಸಿಯಾದ ಬೇಳೆ + ಅನ್ನ (ಭಾತ್)',
    description: 'Iconic Karnataka spiced lentil and rice dish born in Mysore Palace kitchens',
  },
  'ಗುರುಪದೇಶ': {
    type: 'Guna Sandhi',
    kannadaType: 'ಗುಣ ಸಂಧಿ',
    split: ['ಗುರು', 'ಉಪದೇಶ'],
    rule: 'ಗುರು (ಉ) + ಉಪದೇಶ (ಉ) = ಗುರುಪದೇಶ',
    description: 'Preceptor teachings',
  },
  'ಸೂರ್ಯೋದಯ': {
    type: 'Guna Sandhi',
    kannadaType: 'ಗುಣ ಸಂಧಿ',
    split: ['ಸೂರ್ಯ', 'ಉದಯ'],
    rule: 'ಸೂರ್ಯ (ಅ) + ಉದಯ (ಉ) = ಸೂರ್ಯೋದಯ (ಓ)',
    description: 'Surya (Sun) + Udaya (Rise) = Sunrise',
  },
};

/**
 * Helper to convert character or string to hex format (U+0C9C)
 */
export function toHexCode(char: string): string {
  const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
  return `U+${code}`;
}

/**
 * Deterministic Unicode FST: Segments and tokenizes Kannada text into grapheme cluster AST
 */
export function parseKannadaText(text: string): WordAnalysis[] {
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
        equationKannada: chunk,
        durationMs: 80,
      }];
      return {
        word: chunk,
        aksharas,
        ipa: '',
        transliteration: chunk,
      };
    }

    // Segment word into Aksharas using Kannada Abugida FST
    const aksharas = segmentWordIntoAksharas(chunk);
    const ipa = aksharas.map(a => a.phoneticIPA).join('');
    const transliteration = aksharas.map(a => a.transliteration).join('');

    // Check for known sandhi breakdown
    const cleanedWord = chunk.replace(/[.,!?:;'"(){}\[\]]/g, '').trim();
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
export function segmentWordIntoAksharas(word: string): AksharaNode[] {
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

      const eqParts: string[] = [char];
      if (yogavaaha) eqParts.push(yogavaaha.glyph);

      result.push({
        id: `akshara-${aksharaIndex++}`,
        raw,
        index: aksharaIndex - 1,
        type: 'INDEPENDENT_VOWEL',
        baseGlyph: char,
        baseName: vowelData.kannadaName,
        baseUnicode: toHexCode(char),
        inherentVowel: vowelData.ipa,
        vowelSign: null,
        viramaPresent: false,
        ottaksharas: [],
        yogavaaha,
        phoneticIPA: `[${ipa}]`,
        transliteration: trans,
        formationFormula: `[ ${char} (${toHexCode(char)}) ] = ${raw}`,
        equationKannada: `${eqParts.join(' + ')} = ${raw}`,
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
        if (i + 1 < len && KANNADA_CONSONANTS[word[i + 1]]) {
          const nextConsonant = word[i + 1];
          const conjunctData = KANNADA_CONSONANTS[nextConsonant];
          raw += VIRAMA + nextConsonant;
          ottaksharas.push({
            glyph: nextConsonant,
            consonant: nextConsonant,
            name: `${conjunctData.name}-ವತ್ತು (${conjunctData.trans}-vattu)`,
            unicode: toHexCode(nextConsonant),
            viramaCode: toHexCode(VIRAMA),
          });
          i += 2;
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
          name: matraData.kannadaName,
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

      for (const otta of ottaksharas) {
        const cData = KANNADA_CONSONANTS[otta.consonant];
        if (cData) {
          trans += cData.trans;
          ipa += cData.ipa;
        }
      }

      if (viramaPresent) {
        // silent pollu
      } else if (vowelSign) {
        trans += vowelSign.glyph ? KANNADA_DEPENDENT_VOWELS[vowelSign.glyph]?.trans || '' : '';
        ipa += vowelSign.sound;
      } else {
        trans += 'a';
        ipa += 'ɐ';
      }

      if (yogavaaha) {
        if (yogavaaha.type === 'ANUSVARA') {
          trans += 'ṁ';
          ipa += 'm';
        } else {
          trans += 'ḥ';
          ipa += 'h';
        }
      }

      // Build Detailed Unicode Formation Formula
      // e.g. [ ಜ್ (U+0C9C+U+0CCD) ] + [ ಯ್ (U+0CAF+U+0CCD) ] + [ ೋ (U+0CCB) ] = ಜ್ಯೋ
      const formulaParts: string[] = [];
      const kannadaEqParts: string[] = [];

      formulaParts.push(`[ ${baseConsonantChar}್ (${toHexCode(baseConsonantChar)}+${toHexCode(VIRAMA)}) ]`);
      kannadaEqParts.push(`${baseConsonantChar}್`);

      for (const otta of ottaksharas) {
        formulaParts.push(`[ ${otta.consonant}್ (${otta.unicode}+${otta.viramaCode}) ]`);
        kannadaEqParts.push(`${otta.consonant}್`);
      }

      if (vowelSign) {
        formulaParts.push(`[ ${vowelSign.glyph} (${vowelSign.unicode}) ]`);
        kannadaEqParts.push(vowelSign.glyph);
      } else if (!viramaPresent) {
        formulaParts.push(`[ ಅ (Inherent 'a') ]`);
        kannadaEqParts.push('ಅ');
      }

      if (yogavaaha) {
        formulaParts.push(`[ ${yogavaaha.glyph} (${yogavaaha.unicode}) ]`);
        kannadaEqParts.push(yogavaaha.glyph);
      }

      const formationFormula = `${formulaParts.join(' + ')} = ${raw}`;
      const equationKannada = `${kannadaEqParts.join(' + ')} = ${raw}`;

      let durationMs = 180;
      if (ottaksharas.length > 0) durationMs += 100 * ottaksharas.length;
      if (vowelSign?.isLong) durationMs += 120;

      result.push({
        id: `akshara-${aksharaIndex++}`,
        raw,
        index: aksharaIndex - 1,
        type: ottaksharas.length > 0 ? 'CONJUNCT' : 'CONSONANT',
        baseGlyph: baseConsonantChar,
        baseName: baseConsonantData.kannadaName,
        baseUnicode: toHexCode(baseConsonantChar),
        inherentVowel: viramaPresent ? 'none' : (vowelSign ? vowelSign.sound : 'ɐ'),
        vowelSign,
        viramaPresent,
        ottaksharas,
        yogavaaha,
        phoneticIPA: `[${ipa}]`,
        transliteration: trans,
        formationFormula,
        equationKannada,
        durationMs,
      });
      continue;
    }

    // Case 3: Other character
    result.push({
      id: `char-${aksharaIndex++}`,
      raw: char,
      index: aksharaIndex - 1,
      type: 'SPECIAL',
      baseGlyph: char,
      baseName: `ಅಕ್ಷರ (${char})`,
      baseUnicode: toHexCode(char),
      inherentVowel: '',
      vowelSign: null,
      viramaPresent: false,
      ottaksharas: [],
      yogavaaha: null,
      phoneticIPA: char,
      transliteration: char,
      formationFormula: `${char} = ${char}`,
      equationKannada: `${char} = ${char}`,
      durationMs: 120,
    });
    i++;
  }

  return result;
}
