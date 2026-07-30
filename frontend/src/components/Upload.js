import React, { useState } from "react";
import axios from "axios";

function Upload() {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData
      );

      setResult(response.data);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">

      <h2 className="text-xl mb-4">Upload Code</h2>

      <input type="file" onChange={handleFileChange} />

      <button
        onClick={handleUpload}
        className="bg-blue-600 px-4 py-2 rounded mt-4"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <pre className="mt-4 bg-black p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

    </div>
  );
}

export default Upload;