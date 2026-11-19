"""
LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Semantic pHash Cache Store
Pre-warmed with standard BMTC bus routes, Darshini menus, and BBMP traffic signage.
"""

from typing import Optional, Dict, Any, List
from phash import hamming_distance

# Pre-warmed cache items with perceptual fingerprints
PREWARMED_CACHE: List[Dict[str, Any]] = [
    {
        "pHash": "b94e823a7c1f0d8a",
        "kannada_text": "ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ",
        "transliteration": "K.R. Mārukaṭṭe",
        "english_translation": "KR Market (City Market)",
        "confidence_score": 0.98,
        "inference_tier": "EDGE_CACHE",
        "cultural_note": "Established in 1928, named after Krishnaraja Wadiyar IV, KR Market is Asia's largest wholesale flower market.",
        "sandhi_breakdown": {
            "type": "ತತ್ಪುರುಷ ಸಮಾಸ",
            "split": ["ಮಾರು", "ಕಟ್ಟೆ"],
            "rule": "ಮಾರುವ ಕಟ್ಟೆ = ಮಾರುಕಟ್ಟೆ",
            "description": "Platform for commerce / marketplace"
        }
    },
    {
        "pHash": "f0c39a117b2e48aa",
        "kannada_text": "ಮೆಜೆಸ್ಟಿಕ್ - ಶಿವಾಜಿನಗರ",
        "transliteration": "Mejesṭik - Śivājinagara",
        "english_translation": "Majestic - Shivajinagar",
        "confidence_score": 0.96,
        "inference_tier": "EDGE_CACHE",
        "cultural_note": "Majestic is Bengaluru's central transit nexus at Kempegowda Bus Station.",
        "sandhi_breakdown": {
            "type": "ತತ್ಪುರುಷ ಸಮಾಸ",
            "split": ["ಶಿವಾಜಿ", "ನಗರ"],
            "rule": "ಶಿವಾಜಿಯ ನಗರ = ಶಿವಾಜಿನಗರ",
            "description": "Historic cantonment market district named after Chhatrapati Shivaji"
        }
    },
    {
        "pHash": "98fa01bc24d67e33",
        "kannada_text": "ಬಿಸಿ ಬೇಳೆ ಬಾತ್",
        "transliteration": "Bisi Bēḷe Bāt",
        "englishTranslation": "Hot Lentil & Rice Stew (Bisi Bele Bath)",
        "english_translation": "Hot Lentil & Rice Stew (Bisi Bele Bath)",
        "confidence_score": 0.99,
        "inference_tier": "EDGE_CACHE",
        "cultural_note": "Originated in the royal Mysore Palace kitchens, seasoned with peppery spices and pure ghee.",
        "sandhi_breakdown": {
            "type": "ಕನ್ನಡ ವಿಶೇಷಣ ಸಮಾಸ",
            "split": ["ಬಿಸಿ ಬೇಳೆ", "ಭಾತ್"],
            "rule": "ಬಿಸಿಯಾದ ಬೇಳೆಯ ಅನ್ನ = ಬಿಸಿಬೇಳೆಭಾತ್",
            "description": "Lentils and rice cooked together hot"
        }
    },
    {
        "pHash": "3a1f8c77209e51dd",
        "kannada_text": "ಮಸಾಲೆ ದೋಸೆ",
        "transliteration": "Masāle Dōse",
        "english_translation": "Crispy Masala Dosa",
        "confidence_score": 0.97,
        "inference_tier": "EDGE_CACHE",
        "cultural_note": "Bengaluru-style crispy golden crepe smeared with red chutney and spiced potato mash.",
        "sandhi_breakdown": None
    },
    {
        "pHash": "81f092ea7d34190b",
        "kannada_text": "ಪ್ರವೇಶ ನಿಷೇಧಿಸಲಾಗಿದೆ",
        "transliteration": "Pravēśa Niṣēdhisalāgide",
        "english_translation": "No Entry (One-Way Traffic)",
        "confidence_score": 0.96,
        "inference_tier": "EDGE_CACHE",
        "cultural_note": "Standard official bilingual traffic regulatory signboard in Bengaluru.",
        "sandhi_breakdown": {
            "type": "ಸಂಸ್ಕೃತ ತತ್ಸಮ",
            "split": ["ಪ್ರವೇಶ", "ನಿಷೇಧ"],
            "rule": "ಪ್ರವೇಶವನ್ನು ನಿಷೇಧಿಸಲಾಗಿದೆ",
            "description": "Entry is prohibited"
        }
    },
    {
        "pHash": "1a2b3c4d5e6f7081",
        "kannada_text": "ಶ್ರೀಮದ್ ಬೆಂಗಳೂರ ಕಾಳಗದೊಳ್",
        "transliteration": "Śrīmad Beṅgaḷūra Kāḷagadoḷ",
        "english_translation": "In the historic battle of Bengaluru...",
        "confidence_score": 0.81,
        "inference_tier": "CLOUD_VLM",
        "cultural_note": "The Begur Hero Stone (c. 890 CE) contains the earliest epigraphical record of the name 'Bengaluru'.",
        "sandhi_breakdown": {
            "type": "ಹಳಗನ್ನಡ ಸಪ್ತಮೀ ವಿಭಕ್ತಿ",
            "split": ["ಕಾಳಗ", "ಒಳ್"],
            "rule": "ಕಾಳಗ + ಒಳ್ = ಕಾಳಗದೊಳ್",
            "description": "Locative case ending in Old Kannada"
        }
    }
]

class SemanticSignCache:
    def __init__(self):
        self.cache: List[Dict[str, Any]] = list(PREWARMED_CACHE)
        self.hits = 0
        self.misses = 0

    def lookup_by_phash(self, query_hash: str, max_distance: int = 8) -> Optional[Dict[str, Any]]:
        """
        Searches cache using perceptual hash with Hamming distance threshold.
        Returns match if distance <= max_distance.
        """
        best_match = None
        min_dist = 65

        for item in self.cache:
            dist = hamming_distance(query_hash, item["pHash"])
            if dist < min_dist:
                min_dist = dist
                best_match = item

        if best_match and min_dist <= max_distance:
            self.hits += 1
            res = dict(best_match)
            res["hamming_distance"] = min_dist
            res["cache_hit"] = True
            return res

        self.misses += 1
        return None

    def insert(self, item: Dict[str, Any]) -> None:
        self.cache.append(item)

    def get_stats(self) -> Dict[str, Any]:
        return {
            "entries_count": len(self.cache),
            "hits": self.hits,
            "misses": self.misses,
            "hit_ratio": (self.hits / (self.hits + self.misses)) if (self.hits + self.misses) > 0 else 0.0
        }

sign_cache = SemanticSignCache()
