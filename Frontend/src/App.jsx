
import { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [prompt, setPrompt] = useState("");
  const [scanned, setScanned] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Privacy Scanner", icon: "⌕" },
    { name: "Scan History", icon: "◷" },
  ];

  const handleScan = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt first.");
      return;
    }

    setScanned(true);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🛡</div>
          <div>
            <h2>DataShield <span>AI</span></h2>
            <p>PERSONAL DATA PROTECTION</p>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activeTab === item.name ? "active" : ""
              }`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="security-card">
            <div className="security-icon">🔒</div>
            <h4>Your privacy matters</h4>
            <p>Your personal information deserves protection.</p>
            <span>● Privacy First</span>
          </div>

          <div className="profile">
            <div className="avatar">U</div>
            <div>
              <h4>My Workspace</h4>
              <p>Personal Account</p>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace</span>
            <span className="breadcrumb-divider"> / </span>
            <span className="breadcrumb-current">{activeTab}</span>
          </div>

          <div className="topbar-right">
            <span className="system-status">
              <span className="status-dot"></span>
              All systems operational
            </span>
            <div className="top-avatar">U</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <span className="eyebrow">AI PRIVACY PROTECTION PLATFORM</span>
              <h1>
                {activeTab === "Dashboard"
                  ? "Your Privacy, Protected."
                  : activeTab}
              </h1>
              <p>
                {activeTab === "Dashboard"
                  ? "Detect sensitive information and protect your data before sharing it with AI."
                  : "Manage and protect your personal information with DataShield AI."}
              </p>
            </div>

            <div className="date-label">🛡 Secure Workspace</div>
          </section>

          {activeTab === "Dashboard" || activeTab === "Privacy Scanner" ? (
            <>
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total Scans</span>
                    <span className="stat-icon purple">⌕</span>
                  </div>
                  <h2>0</h2>
                  <p>Prompts analyzed</p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Protected Data</span>
                    <span className="stat-icon green">✓</span>
                  </div>
                  <h2>0</h2>
                  <p>Sensitive items masked</p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Privacy Score</span>
                    <span className="stat-icon blue">◈</span>
                  </div>
                  <h2>--<small>/100</small></h2>
                  <p>Awaiting first scan</p>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Security Status</span>
                    <span className="stat-icon orange">♧</span>
                  </div>
                  <h2 className="secure-text">Ready</h2>
                  <p>Protection system ready</p>
                </div>
              </section>

              <section className="scanner-section">
                <div className="section-heading">
                  <div>
                    <span className="section-tag">SMART DETECTION</span>
                    <h2>Privacy Scanner</h2>
                    <p>
                      Scan your text to identify sensitive personal information.
                    </p>
                  </div>
                  <span className="ai-badge">✦ AI Powered</span>
                </div>

                <div className="scanner-box">
                  <div className="input-heading">
                    <label>Enter your prompt</label>
                    <span>🔒 Your input is being processed locally in this demo</span>
                  </div>

                  <textarea
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setScanned(false);
                    }}
                    placeholder="Example: Hi, my name is Rahul Sharma. My email is rahul@gmail.com and my phone number is 9876543210. Please help me write a professional email..."
                  />

                  <div className="input-footer">
                    <span>{prompt.length} characters</span>
                    <button
                      className="scan-button"
                      onClick={handleScan}
                    >
                      ✦ Scan for Sensitive Data
                    </button>
                  </div>

                  {scanned && (
                    <div className="demo-result">
                      <span>✓</span>
                      Prompt received! Detection engine integration is the next step.
                    </div>
                  )}
                </div>
              </section>

              <section className="bottom-grid">
                <div className="info-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>How DataShield AI Works</h3>
                      <p>Three simple steps to protect your privacy.</p>
                    </div>
                  </div>

                  <div className="steps">
                    <div className="step">
                      <div className="step-icon purple">⌕</div>
                      <div>
                        <h4>01. Detect</h4>
                        <p>Identify sensitive information using Regex and NLP.</p>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-icon blue">▤</div>
                      <div>
                        <h4>02. Mask</h4>
                        <p>Replace personal data with secure placeholders.</p>
                      </div>
                    </div>

                    <div className="step">
                      <div className="step-icon green">🔒</div>
                      <div>
                        <h4>03. Protect</h4>
                        <p>Secure sensitive information with encryption.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-panel protection-panel">
                  <div className="protection-symbol">🛡</div>
                  <span className="section-tag">YOUR DIGITAL SAFETY</span>
                  <h3>Think Privacy.<br />Stay Protected.</h3>
                  <p>
                    Keep your personal information safe while using AI tools.
                    Your data deserves an extra layer of security.
                  </p>
                  <div className="protection-footer">
                    <span>● Privacy focused</span>
                    <span>✦ Smart detection</span>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="scanner-section empty-history">
              <div className="empty-icon">◷</div>
              <h2>Scan History</h2>
              <p>Your previous privacy scans will appear here.</p>
              <button
                className="scan-button"
                onClick={() => setActiveTab("Privacy Scanner")}
              >
                Start a New Scan
              </button>
            </section>
          )}

          <footer className="footer">
            <span>© 2026 DataShield AI. All rights reserved.</span>
            <span>Built for a safer AI experience. 🛡</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
