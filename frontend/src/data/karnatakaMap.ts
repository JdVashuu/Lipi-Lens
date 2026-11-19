/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Karnataka Unity Map & Regional Dialect Data
 * Celebrates 1 November 1956 Unification of the 5 Historic Regions.
 */

export interface KarnatakaRegion {
  id: string;
  nameKannada: string;
  nameEnglish: string;
  historicalSource: string;
  districts: string[];
  color: string;
  svgPath: string; // SVG path data for polygon
  dialectGreetingKannada: string;
  dialectGreetingTrans: string;
  dialectGreetingEnglish: string;
  regionalWordCards: {
    wordKannada: string;
    transliteration: string;
    englishMeaning: string;
    dialectContext: string;
  }[];
  demoPins: {
    id: string;
    sceneId: string;
    nameKannada: string;
    nameEnglish: string;
    coords: { x: number; y: number };
  }[];
}

export const KARNATAKA_REGIONS: KarnatakaRegion[] = [
  // 1. Old Mysore
  {
    id: 'old-mysore',
    nameKannada: 'ಹಳೆ ಮೈಸೂರು ಪ್ರಾಂತ್ಯ',
    nameEnglish: 'Old Mysore Region (Princely State of Mysore)',
    historicalSource: 'Wadiyar Dynasty Kingdom (1399–1950)',
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mandya', 'Hassan', 'Tumakuru', 'Kolar', 'Chikkaballapura', 'Ramanagara', 'Chamarajanagar'],
    color: '#FACC15',
    svgPath: 'M 45,55 L 75,55 L 70,85 L 45,85 Z',
    dialectGreetingKannada: 'ಏನ್ ಸಮಾಚಾರ? ಆರಾಮಾಗಿದ್ದೀರಾ?',
    dialectGreetingTrans: 'Ēn samācāra? Ārāmāgiddīrā?',
    dialectGreetingEnglish: 'What is the news? Are you doing well? (Standard Southern Kannada)',
    regionalWordCards: [
      {
        wordKannada: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
        transliteration: 'Bisi Bēḷe Bāt',
        englishMeaning: 'Spiced lentil and rice stew',
        dialectContext: 'Mysore Palace royal culinary tradition',
      },
      {
        wordKannada: 'ಸ್ವಲ್ಪ ಅಡ್ಜಸ್ಟ್ ಮಾಡಿ',
        transliteration: 'Svalpa aḍjasṭ māḍi',
        englishMeaning: 'Please adjust a little bit',
        dialectContext: 'Iconic Bengaluru auto & transit colloquialism',
      },
    ],
    demoPins: [
      { id: 'pin-majestic', sceneId: 'bmtc-bus', nameKannada: 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣ', nameEnglish: 'Majestic BMTC Hub', coords: { x: 55, y: 70 } },
      { id: 'pin-darshini', sceneId: 'darshini-menu', nameKannada: 'ಮಲ್ಲೇಶ್ವರಂ ದರ್ಶಿನಿ', nameEnglish: 'Malleshwaram Darshini', coords: { x: 52, y: 68 } },
      { id: 'pin-begur', sceneId: 'shilashasana', nameKannada: 'ಬೇಗೂರು ವೀರಗಲ್ಲು ಶಾಸನ', nameEnglish: 'Begur Hero Stone (890 CE)', coords: { x: 58, y: 76 } },
      { id: 'pin-metro', sceneId: 'metro-sign', nameKannada: 'ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ಮೆಟ್ರೋ', nameEnglish: 'Majestic Metro Interchange', coords: { x: 54, y: 71 } },
    ],
  },

  // 2. Kittur Karnataka (Bombay-Karnataka)
  {
    id: 'kittur-karnataka',
    nameKannada: 'ಕಿತ್ತೂರು ಕರ್ನಾಟಕ (ಮುಂಬೈ-ಕರ್ನಾಟಕ)',
    nameEnglish: 'Kittur Karnataka (Bombay-Karnataka)',
    historicalSource: 'Rani Chennamma of Kittur & Sangolli Rayanna (Merged from Bombay State in 1956)',
    districts: ['Belagavi', 'Dharwad', 'Hubballi', 'Vijayapura', 'Bagalkote', 'Gadag', 'Uttara Kannada'],
    color: '#E11D48',
    svgPath: 'M 20,20 L 50,20 L 45,50 L 20,50 Z',
    dialectGreetingKannada: 'ಏನ್ರೀ, ಆರಾಮ್ ಅದೀರೇನು? ಖರೆ ಹೇಳ್ರಿ!',
    dialectGreetingTrans: 'Ēnrī, ārām adīrēnu? Kharē hēḷri!',
    dialectGreetingEnglish: 'Hello sir, are you comfortable? Tell the truth! (Warm North Karnataka dialect)',
    regionalWordCards: [
      {
        wordKannada: 'ಖರೇನಾ?',
        transliteration: 'Kharēnā?',
        englishMeaning: 'Is it true? / Really?',
        dialectContext: 'High-frequency northern conversational check',
      },
      {
        wordKannada: 'ರೊಟ್ಟಿ ಊಟ',
        transliteration: 'Roṭṭi Ūṭa',
        englishMeaning: 'Jowar millet flatbread with yennegai brinjal',
        dialectContext: 'Pillars of North Karnataka agrarian diet',
      },
    ],
    demoPins: [
      { id: 'pin-kittur', sceneId: 'rajyotsava-banner', nameKannada: 'ಕಿತ್ತೂರು ಕೋಟೆ', nameEnglish: 'Kittur Fort Gateway', coords: { x: 30, y: 35 } },
    ],
  },

  // 3. Kalyana Karnataka (Hyderabad-Karnataka)
  {
    id: 'kalyana-karnataka',
    nameKannada: 'ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ (ಹೈದರಾಬಾದ್-ಕರ್ನಾಟಕ)',
    nameEnglish: 'Kalyana Karnataka (Hyderabad-Karnataka)',
    historicalSource: 'Cradle of 12th Century Vachana literature & Rashtrakuta capital Manyakheta',
    districts: ['Kalaburagi', 'Bidar', 'Raichur', 'Koppal', 'Ballari', 'Yadgir', 'Vijayanagara'],
    color: '#06B6D4',
    svgPath: 'M 50,15 L 85,15 L 80,48 L 50,48 Z',
    dialectGreetingKannada: 'ಹೌದೂನ್ರಿ! ಸಮಾಚಾರ ಏನದ?',
    dialectGreetingTrans: 'Haudūnri! Samācāra ēnada?',
    dialectGreetingEnglish: 'Yes indeed! What is the news? (Kalyana regional expression)',
    regionalWordCards: [
      {
        wordKannada: 'ಹೌದೂನ್ರಿ',
        transliteration: 'Haudūnri',
        englishMeaning: 'Yes sir / That is absolutely right',
        dialectContext: 'Respectful affirmative suffix in Gulbarga/Bidar',
      },
      {
        wordKannada: 'ಶರಣು ಶರಣಾರ್ಥಿ',
        transliteration: 'Śaraṇu Śaraṇārthi',
        englishMeaning: 'Reverent salutations of the Sharanas',
        dialectContext: 'Universal Basava philosophy greeting',
      },
    ],
    demoPins: [
      { id: 'pin-kalyana', sceneId: 'shilashasana', nameKannada: 'ಮಾನ್ಯಖೇಟ ರಾಷ್ಟ್ರಕೂಟ ಫಲಕ', nameEnglish: 'Manyakheta Heritage Plaque', coords: { x: 68, y: 25 } },
    ],
  },

  // 4. Karavali / Canara (Madras-Karnataka)
  {
    id: 'karavali',
    nameKannada: 'ಕರಾವಳಿ ಕರ್ನಾಟಕ (ಮದ್ರಾಸ್-ಕರ್ನಾಟಕ)',
    nameEnglish: 'Karavali / Coastal Karnataka',
    historicalSource: 'Merged from Madras Presidency & Bombay (Dakshina Kannada & Udupi)',
    districts: ['Dakshina Kannada', 'Udupi', 'Uttara Kannada'],
    color: '#10B981',
    svgPath: 'M 15,45 L 30,45 L 35,75 L 15,75 Z',
    dialectGreetingKannada: 'ಮಾರ್ರೆ! ಎಂಚುಲ್ಲರ್? ಕುಷಿಯಲ್ಲಾ?',
    dialectGreetingTrans: 'Mārre! Eñcullar? Kuṣiyallā?',
    dialectGreetingEnglish: 'My friend! How are you doing? Everything joyful? (Mangalore coastal warmth)',
    regionalWordCards: [
      {
        wordKannada: 'ಮಾರ್ರೆ',
        transliteration: 'Mārre',
        englishMeaning: 'Friend / Companion / Buddy',
        dialectContext: 'Quintessential coastal address form',
      },
      {
        wordKannada: 'ನೀರ್ ದೋಸೆ',
        transliteration: 'Nīr Dōse',
        englishMeaning: 'Delicate water-thin rice crepe',
        dialectContext: 'Traditional Tulu Nadu & coastal specialty',
      },
    ],
    demoPins: [
      { id: 'pin-karavali', sceneId: 'darshini-menu', nameKannada: 'ಮಂಗಳೂರು ಕೆನರಾ ಮಳಿಗೆ', nameEnglish: 'Canara Heritage Board', coords: { x: 22, y: 62 } },
    ],
  },

  // 5. Kodagu (Coorg)
  {
    id: 'kodagu',
    nameKannada: 'ಕೊಡಗು ಪ್ರಾಂತ್ಯ',
    nameEnglish: 'Kodagu (Coorg - Merged "Part C" State)',
    historicalSource: 'Independent State of Coorg merged into Mysore State on 1 Nov 1956',
    districts: ['Kodagu (Madikeri, Virajpet, Somwarpet)'],
    color: '#F59E0B',
    svgPath: 'M 28,72 L 42,72 L 40,84 L 28,84 Z',
    dialectGreetingKannada: 'ಆರಾಮ ಇದ್ದಿರಾ? ಕೊಡಗಿನ ಕಾಫಿ ಕುಡಿದಿರಾ?',
    dialectGreetingTrans: 'Ārāma iddirā? Koḍagina kāphi kuḍidirā?',
    dialectGreetingEnglish: 'Are you at ease? Have you tasted Kodagu coffee?',
    regionalWordCards: [
      {
        wordKannada: 'ಕಾವೇರಿ ತಾಯಿ',
        transliteration: 'Kāvēri Tāyi',
        englishMeaning: 'Mother River Kaveri',
        dialectContext: 'Born at Talakaveri in the Brahmagiri hills of Kodagu',
      },
      {
        wordKannada: 'ಕಡಂಬುಟ್ಟು',
        transliteration: 'Kaḍambuṭṭu',
        englishMeaning: 'Steamed rice balls seasoned with cardamom',
        dialectContext: 'Signature Kodava culinary staple',
      },
    ],
    demoPins: [
      { id: 'pin-kodagu', sceneId: 'bmtc-bus', nameKannada: 'ಮಡಿಕೇರಿ ಸಾರಿಗೆ ಫಲಕ', nameEnglish: 'Madikeri Transit Plaque', coords: { x: 34, y: 78 } },
    ],
  },
];
