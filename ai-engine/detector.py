
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

    # "PERSON": re.compile(
    #     r"\b(?:my name is|I am|this is)\s+([A-Z][a-z]+)\b"
    # )

    "PERSON": re.compile(
    r"\b(?:my name is|I am|this is)\s+([A-Z][a-z]+)\b",
    re.IGNORECASE
)
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

            # PERSON pattern captures only the name
            if data_type == "PERSON":
                value = match.group(1)
                start = match.start(1)
                end = match.end(1)
            else:
                value = match.group()
                start = match.start()
                end = match.end()

            detections.append({
                "type": data_type,
                "value": value,
                "start": start,
                "end": end
            })

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
        "PIN_CODE": 10,
        "PERSON": 10
    }

    total_risk = sum(
        risk_weights.get(item["type"], 10)
        for item in detections
    )

    return max(0, 100 - min(total_risk, 100))
