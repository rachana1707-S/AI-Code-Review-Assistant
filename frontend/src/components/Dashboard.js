import React, {useState, useRef, useEffect} from "react";
import Editor from "@monaco-editor/react";
import {Link, useNavigate} from "react-router-dom";

import Navbar from "./Navbar/Navbar";
import QualityScore from "./Analytics/QualityScore";
import IssueChart from "./Analytics/IssueChart";

import {
  FaHome,
  FaHistory,
  FaCog,
  FaUpload,
  FaBug,
  FaShieldAlt,
  FaCheckCircle,
  FaSignOutAlt,
  FaFilter
} from "react-icons/fa";

import {uploadCode} from "../services/api";

import "./Dashboard.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState("ALL");

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

  const handleEditorDidMount = (
    editor,
    monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setData(null);
    setError("");
    setSeverityFilter("ALL");
    setSourceFilter("ALL");

    const reader = new FileReader();

    reader.onload = (event) => {
      setCode(event.target.result);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError(
        "Please select a code file first."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await uploadCode(file);

      setData(response);
      setSeverityFilter("ALL");
      setSourceFilter("ALL");
    } catch (error) {
      console.error(
        "Upload error:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Code analysis failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const mapSeverity = (severity) => {
    const value =
      severity?.toUpperCase();

    if (
      value === "HIGH" ||
      value === "MEDIUM" ||
      value === "LOW"
    ) {
      return value;
    }

    return "LOW";
  };

  const getSeverityIcon = (
    severity
  ) => {
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
    data?.analysis || []
  ).map((item) => ({
    ...item,
    severity: mapSeverity(
      item.severity
    ),
    source: item.source || "AI"
  }));

  const availableSources = [
    "ALL",
    ...new Set(
      issues.map(
        (issue) => issue.source
      )
    )
  ];

  const filteredIssues =
    issues.filter((issue) => {
      const severityMatches =
        severityFilter === "ALL" ||
        issue.severity ===
          severityFilter;

      const sourceMatches =
        sourceFilter === "ALL" ||
        issue.source ===
          sourceFilter;

      return (
        severityMatches &&
        sourceMatches
      );
    });

  const qualityScore =
    data?.quality_score !== undefined
      ? data.quality_score
      : 100;

  const getDecorationClass = (
    severity
  ) => {
    switch (severity) {
      case "HIGH":
        return "editor-line-high";

      case "MEDIUM":
        return "editor-line-medium";

      default:
        return "editor-line-low";
    }
  };

  const getGlyphClass = (
    severity
  ) => {
    switch (severity) {
      case "HIGH":
        return "editor-glyph-high";

      case "MEDIUM":
        return "editor-glyph-medium";

      default:
        return "editor-glyph-low";
    }
  };

  const getOverviewColor = (
    severity
  ) => {
    switch (severity) {
      case "HIGH":
        return "#ff334f";

      case "MEDIUM":
        return "#ffb020";

      default:
        return "#2ee87b";
    }
  };

  useEffect(() => {
    if (
      !editorRef.current ||
      !monacoRef.current
    ) {
      return;
    }

    const decorations =
      filteredIssues
        .filter((item) => item.line)
        .map((item) => ({
          range:
            new monacoRef.current.Range(
              item.line,
              1,
              item.line,
              1
            ),

          options: {
            isWholeLine: true,

            className:
              getDecorationClass(
                item.severity
              ),

            glyphMarginClassName:
              getGlyphClass(
                item.severity
              ),

            overviewRuler: {
              color:
                getOverviewColor(
                  item.severity
                ),

              position:
                monacoRef.current
                  .editor
                  .OverviewRulerLane
                  .Full
            },

            hoverMessage: {
              value:
                `**${item.severity}**\n\n` +
                `**${item.title || "Code Issue"}**\n\n` +
                `${item.message || "Issue detected."}\n\n` +
                `Source: ${item.source}`
            }
          }
        }));

    decorationRef.current =
      editorRef.current.deltaDecorations(
        decorationRef.current,
        decorations
      );
  }, [
    data,
    severityFilter,
    sourceFilter
  ]);

  const jumpToLine = (line) => {
    if (
      !line ||
      !editorRef.current
    ) {
      return;
    }

    editorRef.current
      .revealLineInCenter(line);

    editorRef.current
      .setPosition({
        lineNumber: line,
        column: 1
      });

    editorRef.current.focus();
  };

  const getLanguage = () => {
    if (!file) {
      return "python";
    }

    const filename =
      file.name.toLowerCase();

    if (
      filename.endsWith(".js") ||
      filename.endsWith(".jsx")
    ) {
      return "javascript";
    }

    if (
      filename.endsWith(".java")
    ) {
      return "java";
    }

    return "python";
  };

  const resetFilters = () => {
    setSeverityFilter("ALL");
    setSourceFilter("ALL");
  };

  return (
    <div
      className={
        data
          ? "dashboard analyzed"
          : "dashboard before-analysis"
      }
    >
      <aside className="sidebar">
        <div>
          <h2 className="sidebar-logo">
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

            <Link
              to="/settings"
              className="menu-link"
            >
              <p>
                <FaCog />
                Settings
              </p>
            </Link>
          </div>
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

          <button
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Navbar
          title="AI Code Review"
        />

        <div className="dashboard-intro">
          <h1>
            Review Your Code
          </h1>

          <p>
            Upload your source code and inspect
            quality, syntax, security and style
            issues directly inside the editor.
          </p>
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

            {loading
              ? "Analyzing..."
              : "Analyze Code"}
          </button>
        </div>

        {file && (
          <p className="selected-file">
            Selected file:{" "}
            <strong>
              {file.name}
            </strong>
          </p>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {data && (
          <div className="analytics-grid">
            <QualityScore
              score={qualityScore}
            />

            <IssueChart
              issues={issues}
            />
          </div>
        )}

        {data && (
          <div className="analysis-filter-panel">
            <div className="filter-title">
              <FaFilter />

              <div>
                <h3>
                  Filter Findings
                </h3>

                <p>
                  Choose which errors are
                  visible and highlighted.
                </p>
              </div>
            </div>

            <div className="filter-groups">
              <div className="filter-group">
                <span className="filter-label">
                  Severity
                </span>

                <div className="filter-buttons">
                  <button
                    className={
                      severityFilter === "ALL"
                        ? "filter-button active"
                        : "filter-button"
                    }
                    onClick={() =>
                      setSeverityFilter(
                        "ALL"
                      )
                    }
                  >
                    All
                  </button>

                  <button
                    className={
                      severityFilter === "HIGH"
                        ? "filter-button high active"
                        : "filter-button high"
                    }
                    onClick={() =>
                      setSeverityFilter(
                        "HIGH"
                      )
                    }
                  >
                    High
                  </button>

                  <button
                    className={
                      severityFilter === "MEDIUM"
                        ? "filter-button medium active"
                        : "filter-button medium"
                    }
                    onClick={() =>
                      setSeverityFilter(
                        "MEDIUM"
                      )
                    }
                  >
                    Medium
                  </button>

                  <button
                    className={
                      severityFilter === "LOW"
                        ? "filter-button low active"
                        : "filter-button low"
                    }
                    onClick={() =>
                      setSeverityFilter(
                        "LOW"
                      )
                    }
                  >
                    Low
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">
                  Error Type
                </span>

                <select
                  value={sourceFilter}
                  onChange={(event) =>
                    setSourceFilter(
                      event.target.value
                    )
                  }
                >
                  {availableSources.map(
                    (source) => (
                      <option
                        key={source}
                        value={source}
                      >
                        {source === "ALL"
                          ? "All Types"
                          : source}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                className="reset-filter-button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="split-view">
          <div className="editor-container">
            <div className="editor-header">
              <div className="editor-file-info">
                <span className="editor-dot red">
                </span>

                <span className="editor-dot yellow">
                </span>

                <span className="editor-dot green">
                </span>

                <strong>
                  {file
                    ? file.name
                    : "Code Editor"}
                </strong>
              </div>

              {data && (
                <span className="visible-findings">
                  {filteredIssues.length}{" "}
                  visible findings
                </span>
              )}
            </div>

            <div className="monaco-wrapper">
              <Editor
                height="100%"
                language={getLanguage()}
                value={code}
                theme="vs-dark"
                onMount={
                  handleEditorDidMount
                }
                options={{
                  fontSize: 14,
                  glyphMargin: true,
                  minimap: {
                    enabled: false
                  },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  smoothScrolling: true,
                  overviewRulerBorder: false,
                  padding: {
                    top: 15
                  }
                }}
              />
            </div>
          </div>

          <div className="issues-panel">
            <div className="issues-panel-header">
              <div>
                <h2>
                  Code Findings
                </h2>

                {data && (
                  <span>
                    {filteredIssues.length}{" "}
                    shown
                  </span>
                )}
              </div>
            </div>

            {!data && (
              <div className="no-issues">
                <FaShieldAlt />

                <h3>
                  Ready to analyze
                </h3>

                <p>
                  Choose a source code file
                  and click Analyze Code.
                </p>
              </div>
            )}

            {data &&
              filteredIssues.length ===
                0 && (
                <div className="no-issues-success">
                  <FaCheckCircle />

                  <h3>
                    No matching issues
                  </h3>

                  <p>
                    No findings match your
                    current filters.
                  </p>
                </div>
              )}

            {filteredIssues.map(
              (item, index) => (
                <div
                  key={
                    `${item.source}-${item.line}-${index}`
                  }
                  className={
                    `issue-card ${item.severity.toLowerCase()}`
                  }
                  onClick={() =>
                    jumpToLine(
                      item.line
                    )
                  }
                >
                  <div className="issue-icon">
                    {getSeverityIcon(
                      item.severity
                    )}
                  </div>

                  <div className="issue-content">
                    <div className="issue-heading">
                      <h3>
                        {item.title ||
                          "Code Issue"}
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
                      {item.message ||
                        "Code issue detected."}
                    </p>

                    <div className="issue-meta">
                      <span>
                        Line:{" "}
                        {item.line ||
                          "N/A"}
                      </span>

                      <span className="issue-source">
                        {item.source}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {data && (
          <div className="severity-legend">
            <span>
              <i className="legend-high">
              </i>
              High severity
            </span>

            <span>
              <i className="legend-medium">
              </i>
              Medium severity
            </span>

            <span>
              <i className="legend-low">
              </i>
              Low severity
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;