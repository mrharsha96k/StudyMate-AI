import File from "../models/File.js";
import { extractPDFText } from "../utils/pdfExtractor.js";

// ========================================
// 1. UPLOAD PDF AND EXTRACT TEXT
// ========================================
export const uploadPDF = async (req, res) => {
  try {
    // Ensure the request has an authenticated Firebase user
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Check whether a PDF was selected
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a PDF file.",
      });
    }

    // Extract text from the uploaded PDF
    const extractedText = await extractPDFText(req.file.path);

    // Save PDF details, extracted text, and owner to MongoDB
    const savedFile = await File.create({
      userId: req.user.uid,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      extractedText,
    });

    // Send successful response
    return res.status(201).json({
      success: true,
      message: "PDF uploaded and processed successfully!",
      file: {
        id: savedFile._id,
        filename: savedFile.filename,
        originalName: savedFile.originalName,
        size: savedFile.size,
        uploadedAt: savedFile.createdAt,
      },
      extraction: {
        successful: true,
        extractedCharacters: extractedText.length,
      },
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    return res.status(500).json({
      success: false,
      message: "PDF upload or text extraction failed.",
    });
  }
};

// ========================================
// 2. GET THE AUTHENTICATED USER'S PDFs
// ========================================
export const getUploadedPDFs = async (req, res) => {
  try {
    // Ensure the request has an authenticated Firebase user
    if (!req.user?.uid) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // Retrieve only this user's PDF details
    const files = await File.find({
      userId: req.user.uid,
    })
      .select("_id originalName size createdAt")
      .sort({ createdAt: -1 });

    // Return the PDF list
    return res.status(200).json({
      success: true,
      count: files.length,
      files: files.map((file) => ({
        id: file._id,
        originalName: file.originalName,
        size: file.size,
        uploadedAt: file.createdAt,
      })),
    });
  } catch (error) {
    console.error("Fetch uploaded PDFs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve uploaded PDFs.",
    });
  }
};
