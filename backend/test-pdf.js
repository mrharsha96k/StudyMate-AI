import mongoose from "mongoose";
import dotenv from "dotenv";
import { extractPDFText } from "./utils/pdfExtractor.js";
import File from "./models/File.js";

dotenv.config();

const fileId = "6ad79f060e89bb0ca7226bd4";

const filePath =
  "D:\\StudyMate-AI\\backend\\uploads\\1792515846141-595050356.pdf";

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected!");

  const extractedText = await extractPDFText(filePath);

  console.log("Extracted characters:", extractedText.length);

  if (!extractedText.trim()) {
    throw new Error("No text extracted. Database was not updated.");
  }

  const updatedFile = await File.findByIdAndUpdate(
    fileId,
    { extractedText },
    { new: true }
  );

  if (!updatedFile) {
    throw new Error("PDF record not found in MongoDB.");
  }

  console.log("PDF text saved successfully!");
  console.log("PDF:", updatedFile.originalName);
  console.log("Saved characters:", updatedFile.extractedText.length);
} catch (error) {
  console.error("Error:", error.message);
} finally {
  await mongoose.disconnect();
}