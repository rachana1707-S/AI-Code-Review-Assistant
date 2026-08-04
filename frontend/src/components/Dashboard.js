import React, { useState } from "react";
import Editor from "@monaco-editor/react";

import {
  FaHome,
  FaHistory,
  FaCog,
  FaUpload,
  FaBug
} from "react-icons/fa";

import { uploadCode } from "../services/api";

import "./Dashboard.css";

function Dashboard() {

  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Read file content
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(event.target.result);
    };

    reader.readAsText(selectedFile);
  };

  // Upload
  const handleUpload = async () => {

    if (!file) return alert("Select file");

    try {
      setLoading(true);

      const res = await uploadCode(file);

      setData(res);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const issues = data?.analysis || [];

  return (

    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2>🤖 CodeAI</h2>

        <div className="menu">
          <p><FaHome /> Dashboard</p>
          <p><FaHistory /> Reviews</p>
          <p><FaCog /> Settings</p>
        </div>
      </div>

      {/* Main */}
      <div className="main-panel">

        <h1>AI Code Review</h1>

        {/* Upload */}
        <div className="upload-bar">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>
            <FaUpload />
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Split View */}
        <div className="split-view">

          {/* Editor */}
          <div className="editor-container">

            <Editor
              height="500px"
              defaultLanguage="python"
              value={code}
              theme="vs-dark"
            />

          </div>

          {/* Issues Panel */}
          <div className="issues-panel">

            <h2>AI Issues</h2>

            {issues.length === 0 && (
              <p>No issues found</p>
            )}

            {issues.map((item, index) => (

              <div className="issue-card" key={index}>

                <FaBug />

                <div>
                  <h3>{item.label}</h3>
                  <p>Confidence: {item.score}</p>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;