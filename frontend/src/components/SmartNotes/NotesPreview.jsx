import jsPDF from "jspdf";
import SummaryCard from "./SummaryCard";
import KeyPoints from "./KeyPoints";
import RevisionCard from "./RevisionCard";

function NotesPreview({ notes }) {
  const downloadPDF = () => {
    if (!notes) return;

    console.log("Original summary:", notes.summary);
    console.log("Original key points:", notes.keyPoints);
    console.log("Original questions:", notes.questions);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 18;
    const maxWidth = pageWidth - margin * 2;
    const footerLimit = pageHeight - 22;

    let y = 20;

    // Professional color palette
    const navy = [30, 41, 90];
    const blue = [37, 99, 235];
    const dark = [45, 55, 72];
    const gray = [100, 116, 139];

    // Clean text without destroying normal paragraph breaks
    const sanitizeText = (value) => {
      if (value == null) return "";

      return String(value)
        .replace(/\\n/g, "\n")
        .replace(/\r\n?/g, "\n")
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, " ")
        .replace(/[ \t]+/g, " ")
        .trim();
    };

    // Page background
    const addPageBackground = () => {
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
    };

    // Create a page and reset the content position
    const addNewPage = () => {
      pdf.addPage();
      addPageBackground();
      y = 22;
    };

    // Check whether content fits before the footer
    const checkPageSpace = (requiredHeight = 8) => {
      if (y + requiredHeight > footerLimit) {
        addNewPage();
      }
    };

    // Render a block of wrapped text safely across pages
    const addWrappedLines = (
      lines,
      x,
      lineHeight = 6,
      fontSize = 10.5
    ) => {
      pdf.setFontSize(fontSize);

      lines.forEach((line) => {
        checkPageSpace(lineHeight);

        pdf.text(line, x, y);
        y += lineHeight;
      });
    };

    // Initialize the first page
    addPageBackground();

    // Title banner
    pdf.setFillColor(...navy);
    pdf.roundedRect(margin, y, maxWidth, 30, 3, 3, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("StudyMate AI", margin + 7, y + 12);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("SMART STUDY NOTES", margin + 7, y + 22);

    y += 42;

    // Section headings
    const addHeading = (title) => {
      checkPageSpace(18);

      pdf.setFillColor(...blue);
      pdf.roundedRect(margin, y - 5, 3, 10, 1, 1, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(...navy);

      pdf.text(title, margin + 7, y + 2);

      y += 14;
    };

    // Chapter summary paragraphs
    const addParagraph = (value) => {
      const cleanText = sanitizeText(value);

      if (!cleanText) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10.5);
        pdf.setTextColor(...dark);

        checkPageSpace(7);
        pdf.text("No summary available.", margin + 2, y);
        y += 8;

        return;
      }

      const paragraphs = cleanText.split(/\n+/);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setTextColor(...dark);

      paragraphs.forEach((paragraph) => {
        const content = paragraph.trim();

        if (!content) return;

        const lines = pdf.splitTextToSize(
          content,
          maxWidth - 4
        );

        addWrappedLines(lines, margin + 2, 6, 10.5);

        y += 3;
      });
    };

    // Numbered lists with consistent indentation
    const addNumberedList = (items) => {
      items.forEach((item, index) => {
        const cleanItem = sanitizeText(item);

        if (!cleanItem) return;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10.5);

        const numberWidth = 9;
        const textX = margin + numberWidth;
        const textWidth = maxWidth - numberWidth;

        const lines = pdf.splitTextToSize(
          cleanItem,
          textWidth
        );

        const lineHeight = 6;
        const itemSpacing = 3;

        // Keep a normal-sized item together when possible.
        // Very long items are allowed to continue onto another page.
        const estimatedHeight =
          lines.length * lineHeight + itemSpacing;

        if (
          estimatedHeight <= footerLimit - 22 &&
          y + estimatedHeight > footerLimit
        ) {
          addNewPage();
        }

        // Number and first line start together.
        checkPageSpace(lineHeight);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10.5);
        pdf.setTextColor(...blue);

        pdf.text(`${index + 1}.`, margin + 2, y);

        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...dark);

        lines.forEach((line, lineIndex) => {
          if (lineIndex > 0) {
            checkPageSpace(lineHeight);
          }

          pdf.text(line, textX, y);
          y += lineHeight;
        });

        y += itemSpacing;
      });
    };

    // Section 1: Chapter summary
    addHeading("Chapter Summary");
    addParagraph(notes.summary);

    // Section 2: Important key points
    addHeading("Important Key Points");
    addNumberedList(
      Array.isArray(notes.keyPoints) ? notes.keyPoints : []
    );

    // Section 3: Quick revision questions
    addHeading("Quick Revision Questions");
    addNumberedList(
      Array.isArray(notes.questions) ? notes.questions : []
    );

    // Add footer and page numbers after all pages are created
    const pageCount = pdf.internal.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {
      pdf.setPage(page);

      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);

      pdf.line(
        margin,
        pageHeight - 15,
        pageWidth - margin,
        pageHeight - 15
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(...gray);

      pdf.text(
        "Generated by StudyMate AI",
        margin,
        pageHeight - 8
      );

      pdf.text(
        `Page ${page} of ${pageCount}`,
        pageWidth - margin,
        pageHeight - 8,
        { align: "right" }
      );
    }

    pdf.save("StudyMate-AI-Smart-Notes.pdf");
  };

  // Empty state
  if (!notes) {
    return (
      <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
        <h2 className="text-2xl font-bold text-white">
          AI Generated Notes
        </h2>

        <p className="mt-3 text-gray-400">
          Your summary, key points, and revision questions will
          appear here after you generate notes from a PDF.
        </p>
      </div>
    );
  }

  // Smart Notes preview
  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white">
          AI Generated Notes
        </h2>

        <button
          type="button"
          onClick={downloadPDF}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Download Notes as PDF
        </button>
      </div>

      <div className="space-y-6">
        <SummaryCard summary={notes.summary} />

        <KeyPoints points={notes.keyPoints} />

        <RevisionCard questions={notes.questions} />
      </div>
    </div>
  );
}

export default NotesPreview;