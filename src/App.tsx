import React, { useEffect, useState, useRef } from "react";

interface ThreatAnalysis {
  riskScore: number; // 0 - 100
  riskLevel: "Low Risk" | "Medium Risk" | "Critical Risk";
  category: "Payment Fraud" | "Phishing / Social Engineering" | "Malicious Link" | "Legitimate Activity" | "Digital Threat Scanning";
  detectionVector: string;
  explanation: string;
  investigationDetails: string;
  protectiveAction: string;
  reportSummary: string;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"payment" | "threat" | "engine" | null>(null);
  const [queryInput, setQueryInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ThreatAnalysis | null>(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const aboutRef = useRef<HTMLElement>(null);

  // IntersectionObserver for About Section entrance
  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAboutVisible(true);
            setTimeout(() => {
              el.classList.add("is-in");
            }, 2200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 1. Animation Completion & Fallback Handling
  useEffect(() => {
    const appearElements = document.querySelectorAll(".appear");

    const handleAnimationEnd = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.classList.add("is-in");
    };

    appearElements.forEach((el) => {
      el.addEventListener("animationend", handleAnimationEnd);
    });

    // Fallback: After 2.2s, force all .appear elements into their final state (.is-in)
    const fallbackTimer = setTimeout(() => {
      appearElements.forEach((el) => {
        el.classList.add("is-in");
      });
    }, 2200);

    return () => {
      appearElements.forEach((el) => {
        el.removeEventListener("animationend", handleAnimationEnd);
      });
      clearTimeout(fallbackTimer);
    };
  }, []);

  // 2. Mobile Menu State Synchronization with Body & Resize
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    const handleResize = () => {
      if (window.innerWidth >= 901 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setActiveModal(null);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  // Focus modal input when opened
  useEffect(() => {
    if (activeModal && modalInputRef.current) {
      setTimeout(() => {
        modalInputRef.current?.focus();
      }, 100);
    }
  }, [activeModal]);

  const handleOpenModal = (mode: "payment" | "threat" | "engine", defaultQuery: string = "") => {
    setIsMenuOpen(false);
    setActiveModal(mode);
    setQueryInput(defaultQuery);
    setAnalysisResult(null);
    if (defaultQuery) {
      performScan(defaultQuery, mode);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setAnalysisResult(null);
  };

  const performScan = (textToScan: string, mode: "payment" | "threat" | "engine") => {
    if (!textToScan.trim()) return;
    setIsScanning(true);
    setAnalysisResult(null);

    // Simulate advanced neural risk intelligence inspection
    setTimeout(() => {
      const lower = textToScan.toLowerCase();
      let result: ThreatAnalysis;

      if (lower.includes("crypto") || lower.includes("offshore") || lower.includes("42,500") || lower.includes("urgent wire") || lower.includes("routing")) {
        result = {
          riskScore: 94,
          riskLevel: "Critical Risk",
          category: "Payment Fraud",
          detectionVector: "Anomalous beneficiary jurisdiction with spoofed authorized signature token",
          explanation: "High-entropy routing variation detected. The destination escrow node exhibits a 98.4% correlation with known BEC drainer infrastructure.",
          investigationDetails: "Transaction originates from an unverified session footprint with a 2-hour velocity surge across automated payment rails.",
          protectiveAction: "Payment gateway interlock triggered. Immediate ledger freeze and dual-key authorization required.",
          reportSummary: "Blocked preemptively before ledger settlement. Incident report logged to security telemetry."
        };
      } else if (lower.includes("http") || lower.includes(".cc") || lower.includes("login") || lower.includes("verify") || lower.includes("alert") || lower.includes("sms")) {
        result = {
          riskScore: 89,
          riskLevel: "Critical Risk",
          category: "Phishing / Social Engineering",
          detectionVector: "Deceptive domain punycode with reverse proxy credential interception kit",
          explanation: "The link mimics banking authentication endpoints while harvesting MFA session cookies in real-time.",
          investigationDetails: "Domain registered <48 hours ago in a bulletproof hosting subnet. Direct spoof of internal banking single-sign-on.",
          protectiveAction: "DNS sinkhole routed and gateway domain blacklisted across organizational endpoint fleet.",
          reportSummary: "Zero-day phishing campaign intercepted. User session invalidated and perimeter alerted."
        };
      } else if (lower.includes("stripe") || lower.includes("webhook") || lower.includes("149") || lower.includes("clean") || lower.includes("verified")) {
        result = {
          riskScore: 4,
          riskLevel: "Low Risk",
          category: "Legitimate Activity",
          detectionVector: "Signed cryptographic webhook with authentic merchant payload signature",
          explanation: "Valid HMAC-SHA256 signature verified against Stripe official cluster CIDR blocks. Zero behavioral anomaly detected.",
          investigationDetails: "Merchant account age: 3.4 years. Normal transaction velocity and geographic alignment confirmed.",
          protectiveAction: "Normal processing allowed with continuous behavioral anomaly monitoring.",
          reportSummary: "Transaction authorized with nominal 4/100 baseline friction score."
        };
      } else {
        result = {
          riskScore: 32,
          riskLevel: "Medium Risk",
          category: mode === "payment" ? "Payment Fraud" : "Digital Threat Scanning",
          detectionVector: "Heuristic pattern evaluated across KaliShield Threat Knowledge Graph",
          explanation: "Moderate behavioral divergence from historical baseline. No direct weaponized IOC detected, but high entropy observed.",
          investigationDetails: "Entity profile contains unverified metadata attributes that warrant step-up verification.",
          protectiveAction: "Enforced step-up biometric / multi-factor verification before release.",
          reportSummary: "Logged to anomaly monitoring pipeline for real-time drift tracking."
        };
      }

      setAnalysisResult(result);
      setIsScanning(false);
    }, 700);
  };

  return (
    <>
      {/* 1. Subtle Background Film Grain */}
      <div className="grain" aria-hidden="true"></div>

      {/* 2. Atmospheric Hero Photo Layer */}
      <div className="hero-photo" aria-hidden="true"></div>

      {/* 3. Main Page Container */}
      <div className="page">
        {/* Full-screen mobile backdrop */}
        <div
          className="menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>

        {/* Full-screen mobile navigation drawer */}
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="Mobile Navigation"
        >
          <a
            href="#top"
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            Overview
          </a>
          <a
            href="#about"
            className="mobile-nav-link"
            onClick={() => {
              setIsMenuOpen(false);
              setIsAboutVisible(true);
            }}
          >
            About KaliShield
          </a>
          <a
            href="#risk-engine"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("engine", "Offshore Wire Transfer $42,500");
            }}
          >
            Risk Engine
          </a>
          <a
            href="#message-scanner"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("threat", "Bank Alert SMS: verify at https://secure-bank-login-update.cc");
            }}
          >
            Scanners
          </a>
          <a
            href="#incidents"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleOpenModal("payment", "Corporate CEO wire change request");
            }}
          >
            Incidents
          </a>
          <button
            type="button"
            className="mobile-nav-link"
            style={{
              background: "var(--accent, #EFFF00)",
              color: "#000000",
              fontWeight: 800,
              marginTop: "8px"
            }}
            onClick={() => handleOpenModal("payment")}
          >
            Check Risk
          </button>
        </nav>

        {/* Hero Cinematic Viewport Screen */}
        <div className="hero-viewport">
          {/* Side-Vertical Technical Typography */}
          <div className="side-vertical" aria-hidden="true">
            EXPERIENCE THE CORE SYSTEM / KALISHIELD 4.02
          </div>

          {/* 4. Three-Column Header */}
          <header className="header">
            {/* Left: Brand Logo */}
            <div className="header-left">
              <a
                href="#top"
                className="logo appear delay-logo"
                aria-label="KaliShield AI Home"
                onClick={() => handleCloseModal()}
              >
                <span className="shield-mark" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v5" />
                    <circle cx="12" cy="16" r="0.75" fill="currentColor" />
                  </svg>
                </span>
                <span>KaliShield.ai</span>
              </a>
            </div>

            {/* Center: Liquid-Metal Navigation Pills */}
            <nav className="nav-center" aria-label="Main Navigation">
              <div className="nav-pills">
                <a href="#top" className="nav-pill appear delay-nav-1">
                  <span>Overview</span>
                  <span className="shine" aria-hidden="true"></span>
                </a>
                <a
                  href="#about"
                  className="nav-pill appear delay-nav-2"
                  onClick={() => setIsAboutVisible(true)}
                >
                  <span>About</span>
                  <span className="shine" aria-hidden="true"></span>
                </a>
                <a
                  href="#risk-engine"
                  className="nav-pill appear delay-nav-3"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenModal("engine", "Anomalous Swift routing change $85,000");
                  }}
                >
                  <span>Risk Engine</span>
                  <span className="shine" aria-hidden="true"></span>
                </a>
                <a
                  href="#message-scanner"
                  className="nav-pill appear delay-nav-4"
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenModal("threat", "Bank SMS alert: verify at https://secure-bank-login-update.cc");
                  }}
                >
                  <span>Scanners</span>
                  <span className="shine" aria-hidden="true"></span>
                </a>
              </div>
            </nav>

          {/* Right: CTA Button & Mobile Burger */}
          <div className="header-right">
            <button
              type="button"
              className="btn btn-solid appear delay-header-cta"
              onClick={() => handleOpenModal("payment")}
              aria-label="Check Risk"
            >
              <span>Check Risk</span>
              <span className="shine" aria-hidden="true"></span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="burger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="burger-bar" aria-hidden="true"></span>
              <span className="burger-bar" aria-hidden="true"></span>
              <span className="burger-bar" aria-hidden="true"></span>
            </button>
          </div>
        </header>

        {/* 5. Bottom-Centered Hero Section */}
        <main className="hero" id="top">
          <div className="hero-copy">
            {/* Hero Badge */}
            <div className="hero-badge appear delay-badge">
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 1v14M1 8h14M3.5 3.5l9 9M12.5 3.5l-9 9" strokeLinecap="round" />
              </svg>
              <span>AI Risk Manager</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="headline">
              <span className="headline-line">
                <span className="headline-inner appear delay-h1-1">
                  <span className="headline-stroke">Threats hide.</span> <em className="headline-serif appear delay-serif">KaliShield</em>
                </span>
              </span>
              <span className="headline-line">
                <span className="headline-inner appear delay-h1-2">
                  detects before loss.
                </span>
              </span>
            </h1>

            {/* Hero Description */}
            <p className="hero-desc appear delay-desc">
              AI-powered protection for payments, messages, links and calls — detecting
              suspicious behavior before it becomes financial loss.
            </p>

            {/* Subtle Product Flow Architecture */}
            <div className="hero-flow appear delay-flow" aria-label="Product Workflow">
              <span>Detect</span>
              <span>Explain</span>
              <span>Investigate</span>
              <span>Protect</span>
              <span>Report</span>
              <span>Track</span>
            </div>

            {/* Hero Actions */}
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-solid appear delay-cta-primary"
                onClick={() => handleOpenModal("payment", "Offshore Wire Transfer $42,500")}
              >
                <span>Check a Payment</span>
                <span className="shine" aria-hidden="true"></span>
              </button>
              <button
                type="button"
                className="btn btn-ghost appear delay-cta-secondary"
                onClick={() => handleOpenModal("threat", "Bank SMS: urgent login required at https://secure-bank-login-update.cc")}
              >
                <span>Scan a Threat</span>
                <span className="shine" aria-hidden="true"></span>
              </button>
            </div>
          </div>

          {/* Signature Accent Box Callout (Bold Typography) */}
          <div className="accent-box appear delay-flow">
            <div className="accent-title">Autonomous Shield</div>
            <div className="accent-desc">
              Intercepting anomalous payment velocity, spoofed signatures, and zero-day phishing vectors before ledger loss.
            </div>
            <button
              type="button"
              className="accent-link"
              onClick={() => handleOpenModal("engine", "Offshore Wire Transfer $42,500")}
            >
              RUN DIAGNOSTIC →
            </button>
          </div>
        </main>

        {/* 6. Bottom Statistics Bar (Bold Typography Grid) */}
        <footer className="stats" aria-label="Capabilities and Safeguards">
          {/* Stat 1: Payment Risk Detection */}
          <div className="stat-item appear delay-stat-1">
            <div className="stat-num">
              0.02<span className="stat-num-accent">s</span>
            </div>
            <div className="stat-label">
              <svg
                className="stat-icon"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="5" width="20" height="14" rx="1" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <circle cx="7" cy="15" r="1" fill="currentColor" />
              </svg>
              <span>Payment Risk Detection</span>
            </div>
          </div>

          {/* Stat 2: Digital Threat Scanning */}
          <div className="stat-item appear delay-stat-2">
            <div className="stat-num">
              99.8<span className="stat-num-accent">%</span>
            </div>
            <div className="stat-label">
              <svg
                className="stat-icon"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Digital Threat Scanning</span>
            </div>
          </div>

          {/* Stat 3: Explainable Risk Intelligence */}
          <div className="stat-item appear delay-stat-3">
            <div className="stat-num">
              ZERO<span className="stat-num-accent">LOSS</span>
            </div>
            <div className="stat-label">
              <svg
                className="stat-icon"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Explainable Intelligence</span>
            </div>
          </div>
        </footer>
      </div>

      {/* 7. About KaliShield AI Section */}
      <section
        id="about"
        ref={aboutRef}
        className={`about-section ${isAboutVisible ? "is-visible" : ""}`}
        aria-label="About KaliShield AI"
      >
        <div className="about-container">
          {/* Top Block: Purpose & High-Level Positioning */}
          <div className="about-header-block">
            {/* Small Label */}
            <div className="about-appear delay-about-label">
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.55)",
                padding: "4px 0"
              }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent, #EFFF00)" }}></span>
                <span>ABOUT KALISHIELD AI</span>
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="about-appear delay-about-heading" style={{
              margin: "18px 0 24px",
              fontSize: "clamp(30px, 4.4vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#ffffff"
            }}>
              AI that understands <em className="headline-serif">risk before it becomes loss.</em>
            </h2>

            {/* Description Paragraphs */}
            <div className="about-appear delay-about-desc" style={{
              maxWidth: "760px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              fontSize: "16px",
              lineHeight: 1.68,
              color: "rgba(255, 255, 255, 0.72)",
              fontWeight: 400
            }}>
              <p style={{ margin: 0 }}>
                KaliShield AI is an AI-powered risk management platform designed to detect, understand and respond to suspicious digital and financial activity before it turns into a real-world loss.
              </p>
              <p style={{ margin: 0 }}>
                Instead of treating every payment, message, link or call as an isolated event, KaliShield analyzes behavior and context to identify patterns that may indicate fraud, phishing, impersonation, scams or coordinated attacks.
              </p>
            </div>
          </div>

          {/* Core Workflow Section: How KaliShield Works */}
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "56px" }}>
            <div className="about-appear delay-how-heading" style={{ maxWidth: "700px", marginBottom: "32px" }}>
              <h3 style={{
                margin: "0 0 10px",
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "#ffffff"
              }}>
                How KaliShield works.
              </h3>
              <p style={{
                margin: 0,
                fontSize: "15.5px",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.65)"
              }}>
                Every interaction passes through a continuous risk-intelligence pipeline that turns suspicious signals into explainable actions.
              </p>
            </div>

            {/* Product Pipeline Flow Ribbon with Animated Subtle Glow */}
            <div className="pipeline-track about-appear delay-how-heading">
              <div className="pipeline-flow-labels" aria-hidden="true">
                <span>DETECT</span>
                <span className="pipeline-flow-arrow">→</span>
                <span>EXPLAIN</span>
                <span className="pipeline-flow-arrow">→</span>
                <span>INVESTIGATE</span>
                <span className="pipeline-flow-arrow">→</span>
                <span>PROTECT</span>
                <span className="pipeline-flow-arrow">→</span>
                <span>REPORT</span>
                <span className="pipeline-flow-arrow">→</span>
                <span>TRACK</span>
              </div>
              <div className="pipeline-line-container" aria-hidden="true">
                <div className="pipeline-line-glow"></div>
              </div>
            </div>

            {/* 6 Compact Stages - Single Horizontal Sequence on Desktop */}
            <div className="stages-horizontal">
              {/* STEP 01 - DETECT */}
              <div className="stage-item about-appear delay-step-1">
                <div className="stage-header">
                  <span className="stage-badge">STEP 01</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 6a6 6 0 1 0 6 6" />
                      <circle cx="12" cy="12" r="2" />
                      <line x1="12" y1="12" x2="20" y2="4" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">DETECT</h4>
                <p className="stage-desc">
                  KaliShield monitors incoming signals across payments, messages, links, calls and other digital interactions to identify unusual or suspicious behavior.
                </p>
              </div>

              {/* STEP 02 - EXPLAIN */}
              <div className="stage-item about-appear delay-step-2">
                <div className="stage-header">
                  <span className="stage-badge">STEP 02</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">EXPLAIN</h4>
                <p className="stage-desc">
                  The system converts detected signals into an understandable risk explanation instead of producing an unexplained score.
                </p>
              </div>

              {/* STEP 03 - INVESTIGATE */}
              <div className="stage-item about-appear delay-step-3">
                <div className="stage-header">
                  <span className="stage-badge">STEP 03</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="12" cy="18" r="3" />
                      <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
                      <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
                      <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">INVESTIGATE</h4>
                <p className="stage-desc">
                  KaliShield connects related signals and examines patterns to determine whether an event is isolated, suspicious or part of a larger fraud pattern.
                </p>
              </div>

              {/* STEP 04 - PROTECT */}
              <div className="stage-item about-appear delay-step-4">
                <div className="stage-header">
                  <span className="stage-badge">STEP 04</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">PROTECT</h4>
                <p className="stage-desc">
                  Once risk is identified, KaliShield helps trigger the appropriate protective response before suspicious activity can become financial damage.
                </p>
              </div>

              {/* STEP 05 - REPORT */}
              <div className="stage-item about-appear delay-step-5">
                <div className="stage-header">
                  <span className="stage-badge">STEP 05</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">REPORT</h4>
                <p className="stage-desc">
                  Risk events and their reasoning can be documented so teams can understand what happened, why it mattered and what action was taken.
                </p>
              </div>

              {/* STEP 06 - TRACK */}
              <div className="stage-item about-appear delay-step-6">
                <div className="stage-header">
                  <span className="stage-badge">STEP 06</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">TRACK</h4>
                <p className="stage-desc">
                  KaliShield keeps risk activity connected over time, helping teams identify recurring behavior, emerging threats and changes in the overall risk environment.
                </p>
              </div>
            </div>

            {/* Mobile Vertical Stages Sequence */}
            <div className="stages-vertical">
              {/* Mobile 01 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 01</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 6a6 6 0 1 0 6 6" />
                      <circle cx="12" cy="12" r="2" />
                      <line x1="12" y1="12" x2="20" y2="4" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">DETECT</h4>
                <p className="stage-desc">
                  KaliShield monitors incoming signals across payments, messages, links, calls and other digital interactions to identify unusual or suspicious behavior.
                </p>
              </div>

              {/* Mobile 02 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 02</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">EXPLAIN</h4>
                <p className="stage-desc">
                  The system converts detected signals into an understandable risk explanation instead of producing an unexplained score.
                </p>
              </div>

              {/* Mobile 03 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 03</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <circle cx="12" cy="18" r="3" />
                      <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
                      <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
                      <line x1="16.5" y1="8.5" x2="13.5" y2="15.5" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">INVESTIGATE</h4>
                <p className="stage-desc">
                  KaliShield connects related signals and examines patterns to determine whether an event is isolated, suspicious or part of a larger fraud pattern.
                </p>
              </div>

              {/* Mobile 04 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 04</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">PROTECT</h4>
                <p className="stage-desc">
                  Once risk is identified, KaliShield helps trigger the appropriate protective response before suspicious activity can become financial damage.
                </p>
              </div>

              {/* Mobile 05 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 05</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <line x1="10" y1="9" x2="8" y2="9" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">REPORT</h4>
                <p className="stage-desc">
                  Risk events and their reasoning can be documented so teams can understand what happened, why it mattered and what action was taken.
                </p>
              </div>

              {/* Mobile 06 */}
              <div className="stage-item">
                <div className="stage-node-vertical" style={{ top: "20px" }}></div>
                <div className="stage-header">
                  <span className="stage-badge">STEP 06</span>
                  <span className="stage-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </span>
                </div>
                <h4 className="stage-title">TRACK</h4>
                <p className="stage-desc">
                  KaliShield keeps risk activity connected over time, helping teams identify recurring behavior, emerging threats and changes in the overall risk environment.
                </p>
              </div>
            </div>
          </div>

          {/* What KaliShield Protects Against */}
          <div className="about-appear delay-protection-list" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "56px", textAlign: "center" }}>
            <p style={{
              margin: "0 auto 8px",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "640px"
            }}>
              Built to recognize risk across the moments where digital trust can break.
            </p>
            <div className="protects-pill-list">
              {[
                "Suspicious Payments",
                "Phishing",
                "Malicious Links",
                "Scam Calls",
                "Impersonation",
                "Fraud Spikes",
                "Coordinated Fraud"
              ].map((item) => (
                <span key={item} className="protects-pill">
                  <span className="protects-pill-dot" aria-hidden="true"></span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>

          {/* The Core Idea: The KaliShield Approach (Editorial Block) */}
          <div className="approach-block about-appear delay-approach-label">
            <div style={{
              fontSize: "10.5px",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.5)",
              marginBottom: "12px"
            }}>
              THE KALISHIELD APPROACH
            </div>
            <h3 className="about-appear delay-approach-heading" style={{
              margin: "0 0 16px",
              fontSize: "clamp(22px, 3.2vw, 34px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ffffff"
            }}>
              Don't just flag the threat. Understand it.
            </h3>
            <p className="about-appear delay-approach-desc" style={{
              margin: 0,
              fontSize: "15.5px",
              lineHeight: 1.68,
              color: "rgba(255, 255, 255, 0.75)",
              maxWidth: "880px"
            }}>
              KaliShield is designed to move beyond simple detection. It connects signals, explains why something is risky, investigates the surrounding context and helps teams take action with a clearer understanding of what is happening.
            </p>
          </div>
        </div>
      </section>

      {/* Global Minimal Subfooter */}
      <footer className="site-subfooter">
        <div>
          KALISHIELD AI · AUTONOMOUS RISK MANAGEMENT PLATFORM
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to Top ↑
          </a>
        </div>
      </footer>
    </div>

      {/* 7. Liquid-Metal Risk Scanner Modal Overlay (Activated only on CTA click) */}
      {activeModal && (
        <div
          className="risk-modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="risk-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "2px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent, #EFFF00)"
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 id="modal-title" style={{ margin: 0, fontSize: "15px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    KaliShield Risk Engine
                  </h3>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {activeModal === "payment" ? "Autonomous Payment & Wire Verification" : activeModal === "threat" ? "Zero-Day Message & URL Scanning" : "Full-Spectrum Financial Risk Analysis"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "2px",
                  color: "#ffffff",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 700
                }}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Input Field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                performScan(queryInput, activeModal);
              }}
              style={{ display: "flex", gap: "8px", marginBottom: "18px" }}
            >
              <input
                ref={modalInputRef}
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={activeModal === "payment" ? "Enter transaction ID, wire details, or routing..." : "Paste suspicious link, SMS, or email snippet..."}
                style={{
                  flex: 1,
                  height: "44px",
                  background: "#000000",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "2px",
                  padding: "0 14px",
                  color: "#ffffff",
                  fontSize: "13.5px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                disabled={isScanning || !queryInput.trim()}
                className="btn btn-solid"
                style={{ height: "44px", opacity: isScanning ? 0.6 : 1 }}
              >
                <span>{isScanning ? "Scanning..." : "Inspect"}</span>
                <span className="shine" aria-hidden="true"></span>
              </button>
            </form>

            {/* Quick Test Vectors */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "10.5px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800, marginBottom: "8px" }}>
                Simulate Test Vectors
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => {
                    const text = "Offshore wire transfer $42,500 to new escrow entity";
                    setQueryInput(text);
                    performScan(text, "payment");
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Unauthorized Wire
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = "Bank Alert: Verify identity at https://secure-bank-login-update.cc";
                    setQueryInput(text);
                    performScan(text, "threat");
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Phishing SMS Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = "CEO urgent vendor payment routing change";
                    setQueryInput(text);
                    performScan(text, "payment");
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Executive BEC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = "Stripe webhook payment authorization $149.00 USD verified";
                    setQueryInput(text);
                    performScan(text, "payment");
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "2px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    cursor: "pointer"
                  }}
                >
                  Legitimate Webhook
                </button>
              </div>
            </div>

            {/* Analysis Result Display */}
            {analysisResult && (
              <div style={{
                background: "#000000",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "2px",
                padding: "18px",
                fontSize: "13px",
                animation: "modalFadeIn 0.2s ease"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.15)", paddingBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "2px",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      backgroundColor: analysisResult.riskScore > 70 ? "#ef4444" : analysisResult.riskScore > 30 ? "var(--accent, #EFFF00)" : "#22c55e",
                      color: analysisResult.riskScore > 70 ? "#ffffff" : analysisResult.riskScore > 30 ? "#000000" : "#000000"
                    }}>
                      {analysisResult.riskLevel.toUpperCase()}
                    </span>
                    <span style={{ color: "#ffffff", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em", fontSize: "12.5px" }}>
                      {analysisResult.category}
                    </span>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "14px", fontWeight: 800, color: analysisResult.riskScore > 70 ? "#f87171" : analysisResult.riskScore > 30 ? "var(--accent, #EFFF00)" : "#4ade80" }}>
                    RISK INDEX: {analysisResult.riskScore}/100
                  </div>
                </div>

                {/* 6-Step Explanation Hierarchy */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Vector</div>
                    <div style={{ fontSize: "12.5px", color: "#ffffff", marginTop: "3px", fontWeight: 600 }}>{analysisResult.detectionVector}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Action</div>
                    <div style={{ fontSize: "12.5px", color: "#ffffff", marginTop: "3px", fontWeight: 600 }}>{analysisResult.protectiveAction}</div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: "12px", marginTop: "10px" }}>
                  <div style={{ fontSize: "10px", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 800 }}>Explanation</div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", lineHeight: 1.5, fontWeight: 500 }}>
                    {analysisResult.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
