
import re


# Patterns for detecting sensitive information
PATTERNS = {
    "EMAIL": re.compile(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    ),

    "PHONE": re.compile(
        r"(?<!\d)(?:\+91[\s-]?)?[6-9]\d{9}(?!\d)"
    ),

    "AADHAAR": re.compile(
        r"(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)"
    ),

    "PIN_CODE": re.compile(
        r"(?<!\d)[1-9]\d{5}(?!\d)"
    ),
}


def detect_sensitive_data(text):
    """
    Detect sensitive information in the given text.
    Returns a list of detected items.
    """

    if not isinstance(text, str):
        raise TypeError("Input must be a string.")

    detections = []

    for data_type, pattern in PATTERNS.items():
        for match in pattern.finditer(text):
            detections.append({
                "type": data_type,
                "value": match.group(),
                "start": match.start(),
                "end": match.end()
            })

    # Sort detections by their starting position
    detections.sort(key=lambda item: item["start"])

    return detections


def calculate_privacy_score(detections):
    """
    Calculate a basic privacy score.
    Higher score means lower detected privacy risk.
    """

    risk_weights = {
        "EMAIL": 15,
        "PHONE": 20,
        "AADHAAR": 30,
        "PIN_CODE": 10
    }

    total_risk = sum(
        risk_weights.get(item["type"], 10)
        for item in detections
    )

    return max(0, 100 - min(total_risk, 100))
