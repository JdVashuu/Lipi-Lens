"""
LipiLens-X (ಲಿಪಿ ಲೆನ್ಸ್-X) - Perceptual Image Hashing (pHash / dHash) Engine
Computes 64-bit perceptual hashes for sub-20ms sign recognition and caching.
"""

from PIL import Image
import io

def compute_dhash(image: Image.Image, hash_size: int = 8) -> str:
    """
    Computes 64-bit difference hash (dHash) from PIL image.
    1. Converts to grayscale.
    2. Resizes to (hash_size + 1, hash_size) e.g. 9x8 pixels.
    3. Compares adjacent horizontal pixels (P[x] > P[x+1]).
    4. Generates 64-bit integer, formatted as 16-character hex string.
    """
    # Convert to grayscale
    gray = image.convert("L")
    # Resize with antialiasing
    resized = gray.resize((hash_size + 1, hash_size), Image.Resampling.LANCZOS)
    pixels = list(resized.getdata())

    # Compute difference
    diff = []
    width = hash_size + 1
    for row in range(hash_size):
        row_offset = row * width
        for col in range(hash_size):
            p_left = pixels[row_offset + col]
            p_right = pixels[row_offset + col + 1]
            diff.append(1 if p_left > p_right else 0)

    # Convert bit array to 64-bit integer and hex
    decimal_val = 0
    for bit in diff:
        decimal_val = (decimal_val << 1) | bit

    return f"{decimal_val:016x}"

def hamming_distance(hash1_hex: str, hash2_hex: str) -> int:
    """
    Computes Hamming distance between two 16-character hex hashes.
    Distance <= 8 indicates matching image content under perspective warp/noise.
    """
    try:
        val1 = int(hash1_hex, 16)
        val2 = int(hash2_hex, 16)
        return bin(val1 ^ val2).count("1")
    except ValueError:
        return 64
