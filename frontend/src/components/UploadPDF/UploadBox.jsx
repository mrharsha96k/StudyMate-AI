import { useState } from "react";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa";

function UploadBox() {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedFile(file);
        }
    };
    return (
        <div className="border-2 border-dashed border-blue-500 rounded-3xl p-12 text-center bg-slate-900 hover:bg-slate-800 transition cursor-pointer">

        <FaCloudUploadAlt className="text-6xl text-blue-400 mx-auto mb-6" />

        <h2 className="text-2xl font-bold text-white">
            Drag & Drop PDF Here
        </h2>

        <p className="text-gray-400 mt-3">
            or click to browse your files
        </p>

        <label className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl font-semibold cursor-pointer transition">

            Choose PDF

            <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
            />

        </label>

        {selectedFile && (
            <div className="mt-8 bg-slate-800 rounded-2xl p-6 max-w-md mx-auto">

                <div className="flex flex-col items-center text-center gap-3">

                <FaFilePdf className="text-red-500 text-5xl" />

                <div>

                    <h3 className="text-white font-semibold">
                    {selectedFile.name}
                    </h3>

                    <p className="text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                    <p className="text-green-400 mt-2">
                    ✅ Ready to Upload
                    </p>

                    <button
                        className="mt-5 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold transition"
                    >
                        Upload PDF
                    </button>

                </div>

                </div>

            </div>
        )}

        </div>
    );
}

export default UploadBox;