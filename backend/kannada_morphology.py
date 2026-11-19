"""
LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Python Kannada Unicode FST Parser & Morphological Analyzer
Unicode Block: U+0C80 - U+0CFF
"""

from typing import List, Dict, Any, Optional

VIRAMA = '\u0CCD'
ANUSVARA = '\u0C82'
VISARGA = '\u0C83'

KANNADA_CONSONANTS = {
    '\u0C95': {'name': 'Ka', 'trans': 'k'},
    '\u0C96': {'name': 'Kha', 'trans': 'kh'},
    '\u0C97': {'name': 'Ga', 'trans': 'g'},
    '\u0C98': {'name': 'Gha', 'trans': 'gh'},
    '\u0C99': {'name': 'Nga', 'trans': 'ṅ'},
    '\u0C9A': {'name': 'Cha', 'trans': 'c'},
    '\u0C9B': {'name': 'Chha', 'trans': 'ch'},
    '\u0C9C': {'name': 'Ja', 'trans': 'j'},
    '\u0C9D': {'name': 'Jha', 'trans': 'jh'},
    '\u0C9E': {'name': 'Nya', 'trans': 'ñ'},
    '\u0C9F': {'name': 'Ta', 'trans': 'ṭ'},
    '\u0CA0': {'name': 'Tha', 'trans': 'ṭh'},
    '\u0CA1': {'name': 'Da', 'trans': 'ḍ'},
    '\u0CA2': {'name': 'Dha', 'trans': 'ḍh'},
    '\u0CA3': {'name': 'Na', 'trans': 'ṇ'},
    '\u0CA4': {'name': 'Ta', 'trans': 't'},
    '\u0CA5': {'name': 'Tha', 'trans': 'th'},
    '\u0CA6': {'name': 'Da', 'trans': 'd'},
    '\u0CA7': {'name': 'Dha', 'trans': 'dh'},
    '\u0CA8': {'name': 'Na', 'trans': 'n'},
    '\u0CAA': {'name': 'Pa', 'trans': 'p'},
    '\u0CAB': {'name': 'Pha', 'trans': 'ph'},
    '\u0CAC': {'name': 'Ba', 'trans': 'b'},
    '\u0CAD': {'name': 'Bha', 'trans': 'bh'},
    '\u0CAE': {'name': 'Ma', 'trans': 'm'},
    '\u0CAF': {'name': 'Ya', 'trans': 'y'},
    '\u0CB0': {'name': 'Ra', 'trans': 'r'},
    '\u0CB1': {'name': 'Rra', 'trans': 'ṟ'},
    '\u0CB2': {'name': 'La', 'trans': 'l'},
    '\u0CB3': {'name': 'Lla', 'trans': 'ḷ'},
    '\u0CB5': {'name': 'Va', 'trans': 'v'},
    '\u0CB6': {'name': 'Sha', 'trans': 'ś'},
    '\u0CB7': {'name': 'Shha', 'trans': 'ṣ'},
    '\u0CB8': {'name': 'Sa', 'trans': 's'},
    '\u0CB9': {'name': 'Ha', 'trans': 'h'},
    '\u0CDE': {'name': 'Za', 'trans': 'ḻ'},
}

KANNADA_INDEPENDENT_VOWELS = {
    '\u0C85': {'name': 'A', 'trans': 'a'},
    '\u0C86': {'name': 'Aa', 'trans': 'ā'},
    '\u0C87': {'name': 'I', 'trans': 'i'},
    '\u0C88': {'name': 'Ee', 'trans': 'ī'},
    '\u0C89': {'name': 'U', 'trans': 'u'},
    '\u0C8A': {'name': 'Oo', 'trans': 'ū'},
    '\u0C8B': {'name': 'Ru', 'trans': 'r̥'},
    '\u0C8E': {'name': 'E', 'trans': 'e'},
    '\u0C8F': {'name': 'Ee', 'trans': 'ē'},
    '\u0C90': {'name': 'Ai', 'trans': 'ai'},
    '\u0C92': {'name': 'O', 'trans': 'o'},
    '\u0C93': {'name': 'Oo', 'trans': 'ō'},
    '\u0C94': {'name': 'Au', 'trans': 'au'},
}

KANNADA_MATRAS = {
    '\u0CBE': {'name': 'Aa Matra', 'trans': 'ā'},
    '\u0CBF': {'name': 'I Matra', 'trans': 'i'},
    '\u0CC0': {'name': 'Ee Matra', 'trans': 'ī'},
    '\u0CC1': {'name': 'U Matra', 'trans': 'u'},
    '\u0CC2': {'name': 'Oo Matra', 'trans': 'ū'},
    '\u0CC3': {'name': 'Ru Matra', 'trans': 'r̥'},
    '\u0CC6': {'name': 'E Matra', 'trans': 'e'},
    '\u0CC7': {'name': 'Ee Matra', 'trans': 'ē'},
    '\u0CC8': {'name': 'Ai Matra', 'trans': 'ai'},
    '\u0CCA': {'name': 'O Matra', 'trans': 'o'},
    '\u0CCB': {'name': 'Oo Matra', 'trans': 'ō'},
    '\u0CCC': {'name': 'Au Matra', 'trans': 'au'},
}

def parse_kannada_word_fst(word: str) -> List[Dict[str, Any]]:
    """
    Decomposes word into Kannada Abugida Grapheme Clusters.
    """
    clusters = []
    i = 0
    n = len(word)

    while i < n:
        c = word[i]
        if c in KANNADA_INDEPENDENT_VOWELS:
            raw = c
            i += 1
            if i < n and word[i] in (ANUSVARA, VISARGA):
                raw += word[i]
                i += 1
            clusters.append({
                "raw": raw,
                "type": "INDEPENDENT_VOWEL",
                "base": c,
                "base_unicode": f"U+{ord(c):04X}",
                "ottaksharas": [],
                "matra": None
            })
            continue

        if c in KANNADA_CONSONANTS:
            base = c
            raw = c
            ottaksharas = []
            matra = None
            i += 1

            # Check for Ottakshara chain
            while i < n and word[i] == VIRAMA:
                if i + 1 < n and word[i + 1] in KANNADA_CONSONANTS:
                    next_c = word[i + 1]
                    raw += VIRAMA + next_c
                    ottaksharas.append({
                        "glyph": next_c,
                        "unicode": f"U+{ord(next_c):04X}",
                        "name": f"{KANNADA_CONSONANTS[next_c]['name']}-vattu"
                    })
                    i += 2
                else:
                    raw += VIRAMA
                    i += 1
                    break

            # Check for Matra
            if i < n and word[i] in KANNADA_MATRAS:
                m = word[i]
                raw += m
                matra = {
                    "glyph": m,
                    "unicode": f"U+{ord(m):04X}",
                    "name": KANNADA_MATRAS[m]["name"]
                }
                i += 1

            # Check for Yogavaaha
            if i < n and word[i] in (ANUSVARA, VISARGA):
                raw += word[i]
                i += 1

            clusters.append({
                "raw": raw,
                "type": "CONJUNCT" if ottaksharas else "CONSONANT",
                "base": base,
                "base_unicode": f"U+{ord(base):04X}",
                "ottaksharas": ottaksharas,
                "matra": matra
            })
            continue

        # Whitespace or punctuation
        clusters.append({
            "raw": c,
            "type": "OTHER",
            "base": c,
            "base_unicode": f"U+{ord(c):04X}",
            "ottaksharas": [],
            "matra": None
        })
        i += 1

    return clusters
