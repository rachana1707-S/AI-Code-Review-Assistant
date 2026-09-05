import React, {useState, useRef, useEffect} from "react";
import Editor from "@monaco-editor/react";
import {Link, useNavigate} from "react-router-dom";

import QualityScore from "./Analytics/QualityScore";
import IssueChart from "./Analytics/IssueChart";
import AIRecommendation from "./Analytics/AIRecommendation";

import {
  FaHome,
  FaHistory,
  FaCog,
  FaUpload,
  FaBug,
  FaShieldAlt,
  FaCheckCircle,
  FaSignOutAlt
} from "react-icons/fa";

import {uploadCode} from "../services/api";

import "./Dashboard.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationRef = useRef([]);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setData(null);
    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {
      setCode(e.target.result);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await uploadCode(file);

      setData(response);
    } catch (error) {
      console.error("Upload error:", error);

      setError(
        error.response?.data?.detail ||
        "Code analysis failed. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const mapSeverity = (severity) => {
    if (
      severity === "HIGH" ||
      severity === "MEDIUM" ||
      severity === "LOW"
    ) {
      return severity;
    }

    if (severity === "LABEL_1") {
      return "HIGH";
    }

    if (severity === "LABEL_0") {
      return "LOW";
    }

    return "MEDIUM";
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "HIGH":
        return <FaBug />;
      case "MEDIUM":
        return <FaShieldAlt />;
      default:
        return <FaCheckCircle />;
    }
  };

  const issues = (
    data?.analysis ||
    data?.ai_review ||
    data?.issues ||
    []
  ).map((item) => {
    return {
      ...item,
      severity: mapSeverity(
        item.severity || item.label
      )
    };
  });

  const qualityScore =
    data?.quality_score !== undefined
      ? data.quality_score
      : issues.length === 0
      ? 100
      : Math.max(
          50,
          100 - issues.length * 5
        );

  useEffect(() => {
    if (
      !editorRef.current ||
      !monacoRef.current
    ) {
      return;
    }

    const decorations = issues
      .filter((item) => item.line)
      .map((item) => {
        return {
          range: new monacoRef.current.Range(
            item.line,
            1,
            item.line,
            1
          ),
          options: {
            isWholeLine: true,
            className:
              `line-${item.severity.toLowerCase()}`
          }
        };
      });

    decorationRef.current =
      editorRef.current.deltaDecorations(
        decorationRef.current,
        decorations
      );
  }, [data]);

  const jumpToLine = (line) => {
    if (
      !line ||
      !editorRef.current
    ) {
      return;
    }

    editorRef.current.revealLineInCenter(line);

    editorRef.current.setPosition({
      lineNumber: line,
      column: 1
    });

    editorRef.current.focus();
  };

  const getLanguage = () => {
    if (!file) {
      return "python";
    }

    const filename = file.name.toLowerCase();

    if (
      filename.endsWith(".js") ||
      filename.endsWith(".jsx")
    ) {
      return "javascript";
    }

    if (filename.endsWith(".java")) {
      return "java";
    }

    return "python";
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>
          🤖 CodeAI
        </h2>

        <div className="menu">
          <Link
            to="/"
            className="menu-link"
          >
            <p className="active-menu">
              <FaHome />
              Dashboard
            </p>
          </Link>

          <Link
            to="/reviews"
            className="menu-link"
          >
            <p>
              <FaHistory />
              Reviews
            </p>
          </Link>

          <p>
            <FaCog />
            Settings
          </p>
        </div>

        <div className="sidebar-user">
          <div>
            <span>
              Signed in as
            </span>

            <strong>
              {user.name || "User"}
            </strong>
          </div>

          <button onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <div className="dashboard-heading">
          <div>
            <h1>
              AI Code Review
            </h1>

            <p className="subtitle">
              Analyze your code with AI-powered insights
            </p>
          </div>
        </div>

        <div className="upload-bar">
          <input
            type="file"
            accept=".py,.java,.js,.jsx"
            onChange={handleFileChange}
          />

          <button
            onClick={handleUpload}
            disabled={loading}
          >
            <FaUpload />
            {
              loading
                ? "Analyzing..."
                : "Analyze"
            }
          </button>
        </div>

        {
          file && (
            <p className="selected-file">
              Selected file:{" "}
              <strong>
                {file.name}
              </strong>
            </p>
          )
        }

        {
          error && (
            <div className="dashboard-error">
              {error}
            </div>
          )
        }

        {
          data && (
            <div className="analytics-grid">
              <QualityScore
                score={qualityScore}
              />

              <IssueChart
                issues={issues}
              />
            </div>
          )
        }

        <div className="split-view">
          <div className="editor-container">
            <Editor
              height="500px"
              language={getLanguage()}
              value={code}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                minimap: {
                  enabled: false
                },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                smoothScrolling: true,
                padding: {
                  top: 15
                }
              }}
            />
          </div>

          <div className="issues-panel">
            <h2>
              AI Findings
            </h2>

            {
              !data && (
                <p className="no-issues">
                  Upload and analyze a file to see AI findings.
                </p>
              )
            }

            {
              data &&
              issues.length === 0 && (
                <div className="no-issues-success">
                  <FaCheckCircle />

                  <p>
                    No AI issues detected.
                  </p>
                </div>
              )
            }

            {
              issues.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={
                      `issue-card ${item.severity.toLowerCase()}`
                    }
                    onClick={() =>
                      jumpToLine(item.line)
                    }
                  >
                    <div className="issue-icon">
                      {
                        getSeverityIcon(
                          item.severity
                        )
                      }
                    </div>

                    <div className="issue-content">
                      <div className="issue-heading">
                        <h3>
                          {
                            item.title ||
                            "Code Issue"
                          }
                        </h3>

                        <span
                          className={
                            `severity-badge ${item.severity.toLowerCase()}`
                          }
                        >
                          {item.severity}
                        </span>
                      </div>

                      <p>
                        {
                          item.message ||
                          "Code improvement detected."
                        }
                      </p>

                      <div className="issue-meta">
                        <span>
                          Line:{" "}
                          {
                            item.line ||
                            "N/A"
                          }
                        </span>

                        {
                          item.score !== undefined &&
                          item.score !== null && (
                            <span>
                              Confidence:{" "}
                              {
                                Number(
                                  item.score
                                ).toFixed(2)
                              }
                            </span>
                          )
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>

        {
          data && (
            <AIRecommendation
              issues={issues}
            />
          )
        }
      </main>
    </div>
  );
}

export default Dashboard;