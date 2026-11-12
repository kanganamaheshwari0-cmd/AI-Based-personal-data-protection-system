
require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const connectDB = require("./config/db");
const Scan = require("./models/Scan");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ENCRYPTION CONFIGURATION

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || !/^[0-9a-fA-F]{64}$/.test(ENCRYPTION_KEY)) {
  throw new Error(
    "Invalid ENCRYPTION_KEY. A 32-byte hex key is required."
  );
}

// AES-256-GCM Encryption
function encryptText(text) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted
  ].join(":");
}

// AI ENGINE CONFIGURATION

const AI_ENGINE_URL =
  process.env.AI_ENGINE_URL || "http://127.0.0.1:8000";

// HOME ROUTE

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DataShield AI Backend is running!"
  });
});

// HEALTH CHECK

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
    project: "DataShield AI"
  });
});

// TEXT SCAN API

app.post("/api/scan", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid text to scan."
      });
    }

    const aiResponse = await fetch(
      `${AI_ENGINE_URL}/api/detect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!aiResponse.ok) {
      throw new Error("AI Engine detection failed");
    }

    const result = await aiResponse.json();

    return res.status(200).json({
      success: true,
      message: "Text scanned successfully!",
      total_detected: result.total_detected,
      privacy_score: result.privacy_score,
      detections: result.detections
    });

  } catch (error) {
    console.error("Scan API Error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Unable to connect to AI Engine."
    });
  }
});

// DATA MASKING + ENCRYPTION + DATABASE

app.post("/api/mask", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid text."
      });
    }

    // Step 1: Detect sensitive information

    const aiResponse = await fetch(
      `${AI_ENGINE_URL}/api/detect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!aiResponse.ok) {
      throw new Error("AI Engine detection failed");
    }

    const result = await aiResponse.json();

    // Step 2: Validate detection positions

    const detections = [...result.detections].sort(
      (a, b) => b.start - a.start
    );

    let maskedText = text;
    const maskedDetections = [];

    for (let index = 0; index < detections.length; index++) {
      const item = detections[index];

      if (
        !Number.isInteger(item.start) ||
        !Number.isInteger(item.end) ||
        item.start < 0 ||
        item.end <= item.start ||
        item.end > text.length
      ) {
        throw new Error("Invalid detection positions");
      }

      const placeholder =
        `[${item.type}_${detections.length - index}]`;

      maskedText =
        maskedText.substring(0, item.start) +
        placeholder +
        maskedText.substring(item.end);

      maskedDetections.push({
        type: item.type,
        placeholder
      });
    }

    // Step 3: Encrypt original text

    const encryptedOriginalText = encryptText(text);

    // Step 4: Save encrypted data in MongoDB

    const savedScan = await Scan.create({
      originalTextEncrypted: encryptedOriginalText,
      maskedText: maskedText,
      totalMasked: maskedDetections.length,
      detections: maskedDetections,
      privacyScore: result.privacy_score ?? 100
    });

    // Step 5: Send response

    return res.status(201).json({
      success: true,
      message: "Text masked and saved securely!",
      scan_id: savedScan._id,
      masked_text: maskedText,
      total_masked: maskedDetections.length,
      detections: maskedDetections
    });

  } catch (error) {
    console.error("Mask API Error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Unable to mask and save text."
    });
  }
});

// START SERVER


const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `DataShield AI server running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
