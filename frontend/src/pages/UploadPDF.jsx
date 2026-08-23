import AppLayout from "../components/Layout/AppLayout";
import PageHeader from "../components/Layout/PageHeader";
import { FaFileUpload } from "react-icons/fa";

import UploadBox from "../components/UploadPDF/UploadBox";
import PDFCard from "../components/UploadPDF/PDFCard";

function UploadPDF() {
  return (
    <AppLayout>

      <PageHeader
        title="Upload Study Material"
        description="Upload your PDFs and organize your study materials."
        icon={<FaFileUpload />}
      />

      <UploadBox />

      <div className="mt-8">
        <div className="mt-8">
          <PDFCard
            name="Operating_System_Notes.pdf"
            size="3.45 MB"
          />

          <div className="mt-4">
            <PDFCard
              name="Java_Programming.pdf"
              size="6.20 MB"
            />
          </div>

          <div className="mt-4">
            <PDFCard
              name="DBMS_Unit_4.pdf"
              size="2.18 MB"
            />
          </div>
        </div>
      </div>

    </AppLayout>
  );
}

export default UploadPDF;