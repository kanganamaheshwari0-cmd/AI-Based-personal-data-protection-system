
const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema(
  {
    originalTextEncrypted: {
      type: String,
      required: true
    },
    maskedText: {
      type: String,
      required: true
    },
    totalMasked: {
      type: Number,
      default: 0
    },
    detections: [
      {
        type: {
          type: String,
          required: true
        },
        placeholder: {
          type: String,
          required: true
        }
      }
    ],
    privacyScore: {
      type: Number,
      default: 100
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scan", scanSchema);
