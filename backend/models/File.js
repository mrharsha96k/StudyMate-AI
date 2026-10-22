
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    // Firebase UID of the student who owns this PDF
    userId: {
      type: String,
      required: true,
      index: true,
    },

    filename: {
      type: String,
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
      required: true,
      default: "application/pdf",
    },

    size: {
      type: Number,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    extractedText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;

