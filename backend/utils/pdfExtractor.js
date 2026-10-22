import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractPDFText = async (filePath) => {
  let parser;

  try {
    const pdfBuffer = await fs.readFile(filePath);

    parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    return result.text;
  } catch (error) {
    console.error("PDF text extraction failed:", error.message);
    throw new Error("Unable to extract text from this PDF.");
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};