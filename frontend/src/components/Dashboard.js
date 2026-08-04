import React, { useState, useRef } from "react";
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

  const editorRef = useRef(null);

  // 👇 Monaco mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // 👇 Read file
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (e) => setCode(e.target.result);

    reader.readAsText(selected);
  };

  // 👇 Upload
  const handleUpload = async () => {
    if (!file) return alert("Select file");

    setLoading(true);

    try {
      const res = await uploadCode(file);
      setData(res);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // 🔥 Convert AI label → severity
  const mapSeverity = (label) => {

    if (label === "LABEL_1") return "HIGH";
    if (label === "LABEL_0") return "LOW";

    return "MEDIUM";
  };

  // 🎨 Severity → color
  const getColor = (severity) => {

    if (severity === "HIGH") return "red";
    if (severity === "MEDIUM") return "orange";

    return "green";
  };

  const issues = data?.analysis || [];

  // 🔥 Highlight lines in Monaco
  const getDecorations = () => {

    if (!editorRef.current) return [];

    return issues
      .filter(i => i.line)
      .map((issue) => ({

        range: new window.monaco.Range(
          issue.line,
          1,
          issue.line,
          1
        ),

        options: {
          isWholeLine: true,
          className: `line-${getColor(mapSeverity(issue.label))}`
        }
      }));
  };

  // 👇 Apply decorations
  React.useEffect(() => {

    if (!editorRef.current) return;

    editorRef.current.deltaDecorations([], getDecorations());

  }, [data]);

  // 👇 Jump to line
  const jumpToLine = (line) => {

    if (!line || !editorRef.current) return;

    editorRef.current.revealLineInCenter(line);
  };

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
              onMount={handleEditorDidMount}
            />

          </div>

          {/* Issues */}
          <div className="issues-panel">

            <h2>AI Issues</h2>

            {issues.length === 0 && <p>No issues found</p>}

            {issues.map((item, index) => {

              const severity = mapSeverity(item.label);

              return (

                <div
                  key={index}
                  className={`issue-card ${severity.toLowerCase()}`}
                  onClick={() => jumpToLine(item.line)}
                >

                  <FaBug />

                  <div>
                    <h3>{severity}</h3>
                    <p>Line: {item.line || "N/A"}</p>
                    <p>Confidence: {item.score}</p>
                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;