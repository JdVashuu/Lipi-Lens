/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Kanglish to Kannada Converter Engine
 * Celebratory, welcoming transliteration & vocabulary mapping.
 */

export interface KanglishMapping {
  romanQuery: string;
  kannadaScript: string;
  transliterationISO: string;
  englishMeaning: string;
  culturalNote: string;
  category: 'FOOD' | 'TRANSIT' | 'EVERYDAY' | 'CIVIC';
}

export const KANGLISH_DICTIONARY: KanglishMapping[] = [
  {
    romanQuery: 'bisi bele bath',
    kannadaScript: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
    transliterationISO: 'Bisi Bēḷe Bāt',
    englishMeaning: 'Hot spiced lentil and rice specialty dish',
    culturalNote: 'Famous Mysore Palace royal comfort food.',
    category: 'FOOD',
  },
  {
    romanQuery: 'namma metro',
    kannadaScript: 'ನಮ್ಮ ಮೆಟ್ರೋ',
    transliterationISO: 'Namma Meṭrō',
    englishMeaning: '"Our Metro" - Bengaluru Rapid Urban Rail Transit',
    culturalNote: 'One of the first public civic projects to adopt "Namma" (Our) to foster civic pride.',
    category: 'TRANSIT',
  },
  {
    romanQuery: 'swalpa adjust maadi',
    kannadaScript: 'ಸ್ವಲ್ಪ ಅಡ್ಜಸ್ಟ್ ಮಾಡಿ',
    transliterationISO: 'Svalpa aḍjasṭ māḍi',
    englishMeaning: 'Please adjust a little bit / accommodate politely',
    culturalNote: 'Bengaluru\'s most iconic warm and accommodating cultural catchphrase.',
    category: 'EVERYDAY',
  },
  {
    romanQuery: 'kannada gothilla',
    kannadaScript: 'ಕನ್ನಡ ಸ್ವಲ್ಪ ಗೊತ್ತು! ಕಲಿಯುತ್ತಿದ್ದೇನೆ',
    transliterationISO: 'Kannaḍa svalpa gottu! Kaliyuttiddēne',
    englishMeaning: 'I know a little Kannada and I am learning!',
    culturalNote: 'Flip "I don\'t know Kannada" into a proud learning statement for new Bengaluru residents.',
    category: 'EVERYDAY',
  },
  {
    romanQuery: 'oota aayitha',
    kannadaScript: 'ಊಟ ಆಯ್ತಾ?',
    transliterationISO: 'Ūṭa āytā?',
    englishMeaning: 'Did you have lunch / meal? (Caring Kannada greeting)',
    culturalNote: 'The supreme Kannada way of asking someone how they are doing.',
    category: 'EVERYDAY',
  },
  {
    romanQuery: 'masale dose',
    kannadaScript: 'ಮಸಾಲೆ ದೋಸೆ',
    transliterationISO: 'Masāle Dōse',
    englishMeaning: 'Crispy fermented rice and lentil crepe with spiced potato',
    culturalNote: 'Karnataka breakfast staple celebrated globally.',
    category: 'FOOD',
  },
  {
    romanQuery: 'filter coffee',
    kannadaScript: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
    transliterationISO: 'Philṭar Kāphi',
    englishMeaning: 'Traditional decoction-brewed South Indian filter coffee',
    culturalNote: 'Brewed with dark roast beans from the Western Ghats (Chikmagalur & Kodagu).',
    category: 'FOOD',
  },
  {
    romanQuery: 'majestic',
    kannadaScript: 'ಮೆಜೆಸ್ಟಿಕ್',
    transliterationISO: 'Mejesṭik',
    englishMeaning: 'Kempegowda Bus Station & Metro Interchange Hub',
    culturalNote: 'Named after the historic Majestic Cinema theater in Gandhinagar.',
    category: 'TRANSIT',
  },
  {
    romanQuery: 'no parking',
    kannadaScript: 'ನೋ ಪಾರ್ಕಿಂಗ್ (ವಾಹನ ನಿಲುಗಡೆ ನಿಷೇಧಿಸಲಾಗಿದೆ)',
    transliterationISO: 'Nō Pārkiṅg',
    englishMeaning: 'No Parking / Vehicle parking prohibited',
    culturalNote: 'Standard bilingual traffic signage in Bengaluru.',
    category: 'CIVIC',
  },
  {
    romanQuery: 'rajyotsava',
    kannadaScript: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ',
    transliterationISO: 'Kannaḍa Rājyōtsava',
    englishMeaning: 'Karnataka State Formation Day (1 November 1956)',
    culturalNote: 'Annual celebration honoring Kannada language and state unity.',
    category: 'CIVIC',
  },
];

export function lookupKanglish(input: string): KanglishMapping[] {
  const query = input.trim().toLowerCase();
  if (!query) return KANGLISH_DICTIONARY.slice(0, 6);

  return KANGLISH_DICTIONARY.filter(item =>
    item.romanQuery.toLowerCase().includes(query) ||
    item.kannadaScript.includes(query) ||
    item.englishMeaning.toLowerCase().includes(query)
  );
}
