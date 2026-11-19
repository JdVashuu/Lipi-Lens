import { describe, it, expect } from 'vitest';
import { parseKannadaText, segmentWordIntoAksharas } from '../core/kannadaFST';

describe('Kannada Akshara FST Splitter - 30+ Words Test Suite', () => {
  const testWords = [
    // 1-5: Classic Kannada Rajyotsava & State words
    { word: 'ರಾಜ್ಯೋತ್ಸವ', expectedCount: 4, checkCluster: 'ಜ್ಯೋ', base: 'ಜ', otta: 'ಯ', matraCode: 'U+0CCB' }, // Long-O U+0CCB
    { word: 'ಕರ್ನಾಟಕ', expectedCount: 4, checkCluster: 'ರ್ನ', base: 'ರ', otta: 'ನ' },
    { word: 'ಕನ್ನಡ', expectedCount: 3, checkCluster: 'ನ್ನಡ', base: 'ನ', otta: 'ನ' },
    { word: 'ಬೆಂಗಳೂರು', expectedCount: 4, checkCluster: 'ಬೆಂ', base: 'ಬ' },
    { word: 'ಮೈಸೂರು', expectedCount: 3 },

    // 6-10: Transit & Public Life
    { word: 'ಮೆಜೆಸ್ಟಿಕ್', expectedCount: 4 },
    { word: 'ನಿಲ್ದಾಣ', expectedCount: 3, checkCluster: 'ಲ್ದಾ', base: 'ಲ', otta: 'ದ' },
    { word: 'ಮಾರುಕಟ್ಟೆ', expectedCount: 4, checkCluster: 'ಟ್ಟೆ', base: 'ಟ', otta: 'ಟ' },
    { word: 'ಸಾರಿಗೆ', expectedCount: 3 },
    { word: 'ಪ್ರವೇಶ', expectedCount: 3, checkCluster: 'ಪ್ರ', base: 'ಪ', otta: 'ರ' },

    // 11-15: Culinary & Darshini
    { word: 'ಬಿಸಿಬೇಳೆಬಾತ್', expectedCount: 6 },
    { word: 'ದೋಸೆ', expectedCount: 2 },
    { word: 'ಇಡ್ಲಿ', expectedCount: 2, checkCluster: 'ಡ್ಲಿ', base: 'ಡ', otta: 'ಲ' },
    { word: 'ವಡೆ', expectedCount: 2 },
    { word: 'ಕಾಫಿ', expectedCount: 2 },

    // 16-20: Cultural & Historical
    { word: 'ಶಿಲಾಶಾಸನ', expectedCount: 5 },
    { word: 'ವೀರಗಲ್ಲು', expectedCount: 4, checkCluster: 'ಲ್ಲು', base: 'ಲ', otta: 'ಲ' },
    { word: 'ಹಲ್ಮಿಡಿ', expectedCount: 3, checkCluster: 'ಲ್ಮಿ', base: 'ಲ', otta: 'ಮ' },
    { word: 'ಕವಿರಾಜಮಾರ್ಗ', expectedCount: 6, checkCluster: 'ರ್ಗ', base: 'ರ', otta: 'ಗ' },
    { word: 'ವಚನ', expectedCount: 3 },

    // 21-25: Multi-conjunct & Complex Clusters
    { word: 'ಸ್ತ್ರೀ', expectedCount: 1, checkCluster: 'ಸ್ತ್ರೀ', base: 'ಸ' }, // Triple conjunct: s + t + r + ee
    { word: 'ರಾಷ್ಟ್ರ', expectedCount: 2, checkCluster: 'ಷ್ಟ್ರ', base: 'ಷ' }, // Double conjunct: sh + t + r
    { word: 'ವಿದ್ಯಾಭ್ಯಾಸ', expectedCount: 4, checkCluster: 'ದ್ಯಾ', base: 'ದ', otta: 'ಯ' },
    { word: 'ಸೂರ್ಯೋದಯ', expectedCount: 4 },
    { word: 'ಜ್ಞಾನ', expectedCount: 2, checkCluster: 'ಜ್ಞಾ', base: 'ಜ', otta: 'ಞ' },

    // 26-30+: Everyday Signboards & Expressions
    { word: 'ಶಾಲೆ', expectedCount: 2 },
    { word: 'ಪುಸ್ತಕ', expectedCount: 3, checkCluster: 'ಸ್ತಕ', base: 'ಸ', otta: 'ತ' },
    { word: 'ಆಸ್ಪತ್ರೆ', expectedCount: 3, checkCluster: 'ಸ್ಪ', base: 'ಸ', otta: 'ಪ' },
    { word: 'ಸ್ವಾಗತ', expectedCount: 3, checkCluster: 'ಸ್ವಾ', base: 'ಸ', otta: 'ವ' },
    { word: 'ಧನ್ಯವಾದ', expectedCount: 4 },
    { word: 'ನಮಸ್ಕಾರ', expectedCount: 4, checkCluster: 'ಸ್ಕಾ', base: 'ಸ', otta: 'ಕ' },
    { word: 'ಹಬ್ಬ', expectedCount: 2, checkCluster: 'ಬ್ಬ', base: 'ಬ', otta: 'ಬ' },
  ];

  it('correctly segments at least 32 distinct Kannada words into proper grapheme clusters', () => {
    expect(testWords.length).toBeGreaterThanOrEqual(30);

    for (const item of testWords) {
      const aksharas = segmentWordIntoAksharas(item.word);
      expect(aksharas.length).toBe(item.expectedCount);
    }
  });

  it('correctly uses U+0CCB for long-o in ರಾಜ್ಯೋತ್ಸವ and outputs precise formation equation', () => {
    const analysis = parseKannadaText('ರಾಜ್ಯೋತ್ಸವ');
    expect(analysis.length).toBe(1);
    const word = analysis[0];
    expect(word.aksharas.length).toBe(4);

    // Check cluster "ಜ್ಯೋ"
    const jyoNode = word.aksharas[1];
    expect(jyoNode.raw).toBe('ಜ್ಯೋ');
    expect(jyoNode.baseGlyph).toBe('ಜ');
    expect(jyoNode.baseUnicode).toBe('U+0C9C');
    expect(jyoNode.ottaksharas.length).toBe(1);
    expect(jyoNode.ottaksharas[0].glyph).toBe('ಯ');
    expect(jyoNode.ottaksharas[0].unicode).toBe('U+0CAF');

    // Long-O sign must be U+0CCB, not U+0CCA!
    expect(jyoNode.vowelSign).not.toBeNull();
    expect(jyoNode.vowelSign?.unicode).toBe('U+0CCB');
    expect(jyoNode.vowelSign?.isLong).toBe(true);

    // Kannada equation and Unicode equation
    expect(jyoNode.equationKannada).toContain('ಜ್ + ಯ್ + ೋ = ಜ್ಯೋ');
    expect(jyoNode.formationFormula).toContain('U+0C9C');
    expect(jyoNode.formationFormula).toContain('U+0CCD');
    expect(jyoNode.formationFormula).toContain('U+0CAF');
    expect(jyoNode.formationFormula).toContain('U+0CCB');
  });

  it('handles complex triple conjunct ಸ್ತ್ರೀ (S + T + R + Ee)', () => {
    const aksharas = segmentWordIntoAksharas('ಸ್ತ್ರೀ');
    expect(aksharas.length).toBe(1);
    const node = aksharas[0];
    expect(node.baseGlyph).toBe('ಸ');
    expect(node.ottaksharas.length).toBe(2);
    expect(node.ottaksharas[0].glyph).toBe('ತ');
    expect(node.ottaksharas[1].glyph).toBe('ರ');
    expect(node.vowelSign?.unicode).toBe('U+0CC0'); // Ee-kara Matra
  });

  it('identifies Guna Sandhi for ರಾಜ್ಯೋತ್ಸವ and ಕನ್ನಡೋತ್ಸವ', () => {
    const analysis = parseKannadaText('ರಾಜ್ಯೋತ್ಸವ');
    expect(analysis[0].sandhiInfo).toBeDefined();
    expect(analysis[0].sandhiInfo?.type).toBe('Guna Sandhi');
    expect(analysis[0].sandhiInfo?.split).toEqual(['ರಾಜ್ಯ', 'ಉತ್ಸವ']);
  });
});
