/**
 * ಲಿಪಿ ಲೆನ್ಸ್ | Lipi Lens - Kannada Kali & Lipi Journal Engine
 * Spaced-repetition Leitner box algorithm (Boxes 1-5) and Rajyotsava 50-word challenge.
 */

export interface JournalEntry {
  id: string;
  word: string;
  transliteration: string;
  englishMeaning: string;
  sourceSignboard: string;
  scannedAt: string;
  box: number; // Leitner box 1 (new) to 5 (mastered)
  nextReviewDate: string;
  reviewedCount: number;
  correctCount: number;
}

export interface AlphabetProgress {
  vowelsLearned: string[];
  consonantsLearned: string[];
  conjunctsLearned: string[];
}

const STORAGE_KEY_JOURNAL = 'lipilens_journal_v1';

export const INITIAL_SEEDED_JOURNAL: JournalEntry[] = [
  {
    id: 'seed-1',
    word: 'ರಾಜ್ಯೋತ್ಸವ',
    transliteration: 'Rājyōtsava',
    englishMeaning: 'State Formation Day (1 Nov)',
    sourceSignboard: 'Rajyotsava Banner',
    scannedAt: '2026-11-01',
    box: 3,
    nextReviewDate: '2026-11-20',
    reviewedCount: 4,
    correctCount: 4,
  },
  {
    id: 'seed-2',
    word: 'ಮೆಜೆಸ್ಟಿಕ್',
    transliteration: 'Mejesṭik',
    englishMeaning: 'Majestic Central Bus & Metro Terminal',
    sourceSignboard: 'BMTC Bus Board',
    scannedAt: '2026-11-02',
    box: 2,
    nextReviewDate: '2026-11-20',
    reviewedCount: 3,
    correctCount: 2,
  },
  {
    id: 'seed-3',
    word: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
    transliteration: 'Bisi Bēḷe Bāt',
    englishMeaning: 'Hot Spiced Lentil & Rice Stew',
    sourceSignboard: 'Darshini Hotel Menu',
    scannedAt: '2026-11-03',
    box: 4,
    nextReviewDate: '2026-11-25',
    reviewedCount: 5,
    correctCount: 5,
  },
  {
    id: 'seed-4',
    word: 'ಪ್ರವೇಶ',
    transliteration: 'Pravēśa',
    englishMeaning: 'Entry / Admission',
    sourceSignboard: 'Traffic Sign',
    scannedAt: '2026-11-04',
    box: 1,
    nextReviewDate: '2026-11-20',
    reviewedCount: 1,
    correctCount: 0,
  },
  {
    id: 'seed-5',
    word: 'ಬೆಂಗಳೂರು',
    transliteration: 'Beṅgaḷūru',
    englishMeaning: 'Bengaluru / Begur Stone Inscription',
    sourceSignboard: 'Begur Hero Stone',
    scannedAt: '2026-11-05',
    box: 3,
    nextReviewDate: '2026-11-21',
    reviewedCount: 3,
    correctCount: 3,
  },
];

export function getJournalEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_JOURNAL);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(INITIAL_SEEDED_JOURNAL));
      return INITIAL_SEEDED_JOURNAL;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SEEDED_JOURNAL;
  }
}

export function saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'box' | 'nextReviewDate' | 'reviewedCount' | 'correctCount' | 'scannedAt'>): JournalEntry {
  const current = getJournalEntries();
  const existing = current.find(e => e.word === entry.word);
  if (existing) return existing;

  const newEntry: JournalEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    box: 1,
    scannedAt: new Date().toISOString().split('T')[0],
    nextReviewDate: new Date().toISOString().split('T')[0],
    reviewedCount: 0,
    correctCount: 0,
  };

  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(updated));
  } catch {}
  return newEntry;
}

export function updateLeitnerBox(id: string, remembered: boolean): void {
  const current = getJournalEntries();
  const index = current.findIndex(e => e.id === id);
  if (index === -1) return;

  const entry = current[index];
  const newBox = remembered ? Math.min(5, entry.box + 1) : 1;
  const daysToAdd = [1, 2, 4, 7, 14][newBox - 1];

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  current[index] = {
    ...entry,
    box: newBox,
    reviewedCount: entry.reviewedCount + 1,
    correctCount: remembered ? entry.correctCount + 1 : entry.correctCount,
    nextReviewDate: nextDate.toISOString().split('T')[0],
  };

  try {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(current));
  } catch {}
}
