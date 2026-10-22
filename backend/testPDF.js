import fs from "fs";
import path from "path";
import { extractPDFText } from "./utils/pdfExtractor.js";

const uploadsDir = path.resolve("uploads");

async function testPDF() {
  try {
    const files = fs
      .readdirSync(uploadsDir)
      .filter((file) => file.toLowerCase().endsWith(".pdf"));

    if (files.length === 0) {
      console.log("❌ No PDF files found in the uploads folder.");
      return;
    }

    const pdfPath = path.join(uploadsDir, files[0]);

    console.log("📄 Testing PDF:", files[0]);

    const text = await extractPDFText(pdfPath);

    console.log("\n✅ PDF text extraction successful!");
    console.log("Extracted characters:", text.length);
    console.log("\n--- First 1000 characters ---\n");
    console.log(text.slice(0, 1000));
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testPDF();