import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { ComparisonSlider } from "../components/ComparisonSlider.tsx";
import { ErrorAlert } from "../components/ErrorAlert.tsx";
import { ProcessingPreview } from "../components/ProcessingPreview.tsx";
import { ThumbnailStrip, type HistoryItem } from "../components/ThumbnailStrip.tsx";
import { UploadCard } from "../components/UploadCard.tsx";

let idCounter = 0;
function nextId() {
  return `img-${++idCounter}-${Date.now()}`;
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  pageCenter: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: "10vh",
  },

  hero: {
    textAlign: "center",
    padding: "2rem 1.5rem 1.5rem",
    maxWidth: "640px",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.75rem",
    fontWeight: 800,
    color: "var(--color-text-primary)",
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
  },
  titleAccent: {
    color: "#1e3a5f",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "var(--color-text-secondary)",
    marginTop: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },

  mainNarrow: {
    flex: 1,
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
    padding: "0 1.5rem 2rem",
  },
  mainWide: {
    flex: 1,
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "0 1.5rem 2rem",
  },

  splitLayout: {
    display: "flex",
    gap: "1.5rem",
    alignItems: "flex-start",
    justifyContent: "center",
    animation: "slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both",
  },
  sliderCol: {
    flex: "0 1 520px",
    minWidth: 0,
  },
  sidebar: {
    width: "240px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  sidebarCard: {
    background: "var(--color-surface)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-card)",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
    animation: "fadeIn 0.4s 0.15s both",
  },

  btnPrimary: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "var(--color-accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontSize: "0.875rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    transition: "background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)",
  },
  btnOutline: {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "transparent",
    color: "var(--color-text-secondary)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast)",
  },

  historySection: {
    animation: "fadeIn 0.5s both",
  },

  divider: {
    height: "1px",
    backgroundColor: "var(--color-border-light)",
    margin: "0.25rem 0",
  },

  footer: {
    padding: "2rem 1.5rem",
    borderTop: "1px solid var(--color-border-light)",
    color: "var(--color-text-tertiary)",
    fontSize: "0.8125rem",
    lineHeight: 1.8,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  footerLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    color: "var(--color-text-secondary)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.8125rem",
    transition: "color var(--transition-fast)",
  },
  footerCredit: {
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.8125rem",
  },
};

export function Home() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const revokedRef = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeRevoke = useCallback((url: string | null) => {
    if (url && !revokedRef.current.has(url)) {
      const inHistory = history.some((h) => h.original === url || h.processed === url);
      if (!inHistory) {
        URL.revokeObjectURL(url);
        revokedRef.current.add(url);
      }
    }
  }, [history]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (originalUrl && activeIndex === -1) safeRevoke(originalUrl);
      if (processedUrl && activeIndex === -1) safeRevoke(processedUrl);

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setActiveIndex(-1);
      setError(null);
    },
    [originalUrl, processedUrl, activeIndex, safeRevoke]
  );

  const handleRemoveBackground = useCallback(async () => {
    if (!originalFile || !originalUrl) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", originalFile);

      const response = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.detail || `Server error (${response.status})`);
      }

      const blob = await response.blob();
      const newProcessedUrl = URL.createObjectURL(blob);
      setProcessedUrl(newProcessedUrl);

      const item: HistoryItem = {
        id: nextId(),
        original: originalUrl,
        processed: newProcessedUrl,
        createdAt: Date.now(),
      };

      setHistory((prev) => [item, ...prev]);
      setActiveIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [originalFile, originalUrl]);

  useEffect(() => {
    if (originalFile && originalUrl && !processedUrl && !loading) {
      handleRemoveBackground();
    }
  }, [originalFile, originalUrl]);

  const handleSelectHistory = useCallback(
    (index: number) => {
      const item = history[index];
      if (!item) return;
      setOriginalUrl(item.original);
      setProcessedUrl(item.processed);
      setActiveIndex(index);
      setOriginalFile(null);
      setError(null);
    },
    [history]
  );

  const handleDownload = useCallback(() => {
    if (!processedUrl) return;
    const anchor = document.createElement("a");
    anchor.href = processedUrl;
    anchor.download = originalFile?.name
      ? `no-bg-${originalFile.name}`
      : "no-bg-image.png";
    anchor.click();
  }, [processedUrl, originalFile]);

  const handleDeleteHistory = useCallback(
    (index: number) => {
      const item = history[index];
      if (!item) return;

      setHistory((prev) => prev.filter((_, i) => i !== index));

      if (index === activeIndex) {
        setOriginalUrl(null);
        setProcessedUrl(null);
        setOriginalFile(null);
        setActiveIndex(-1);
      } else if (index < activeIndex) {
        setActiveIndex((prev) => prev - 1);
      }
    },
    [history, activeIndex]
  );

  const handleUploadNew = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
      e.target.value = "";
    },
    [handleFileSelect]
  );

  useEffect(() => {
    return () => {
      const historyUrls = new Set<string>();
      history.forEach((h) => {
        historyUrls.add(h.original);
        historyUrls.add(h.processed);
      });
      historyUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const showUpload = !loading && !processedUrl && activeIndex === -1;
  const showProcessing = loading && originalUrl && !processedUrl;
  const showSlider = originalUrl && processedUrl;

  return (
    <>
      <style>{`
        .btn-primary:hover:not(:disabled) {
          background-color: var(--color-accent-hover) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-outline:hover {
          border-color: var(--color-text-tertiary) !important;
          color: var(--color-text-primary) !important;
          background: var(--color-border-light) !important;
        }
        .footer-link:hover {
          color: var(--color-accent) !important;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem !important; }
          .hero-subtitle { font-size: 1rem !important; }
          .split-layout {
            flex-direction: column !important;
          }
          .sidebar-col {
            width: 100% !important;
          }
          .sidebar-card {
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .sidebar-card > button {
            flex: 1 1 auto !important;
          }
        }
      `}</style>

      <div style={showSlider ? styles.page : styles.pageCenter}>
        <header style={styles.hero}>
          <h1 className="hero-title" style={styles.title}>
            Background{" "}
            <span style={styles.titleAccent}>Removal</span>
          </h1>
          <p className="hero-subtitle" style={styles.subtitle}>
            Instantly remove backgrounds from any image with AI precision
          </p>
        </header>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        <main style={showSlider ? styles.mainWide : styles.mainNarrow}>
          {showUpload && (
            <div className="animate-fade-in">
              <UploadCard
                onFileSelect={handleFileSelect}
                previewUrl={originalUrl}
                disabled={loading}
              />
            </div>
          )}

          {showProcessing && (
            <ProcessingPreview imageUrl={originalUrl} />
          )}

          {showSlider && (
            <div className="split-layout" style={styles.splitLayout}>
              <div style={styles.sliderCol}>
                <ComparisonSlider
                  originalUrl={originalUrl}
                  processedUrl={processedUrl}
                />
              </div>

              <div className="sidebar-col" style={styles.sidebar}>
                <div className="sidebar-card" style={styles.sidebarCard}>
                  <button
                    className="btn-primary"
                    style={styles.btnPrimary}
                    onClick={handleDownload}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  <button
                    className="btn-outline"
                    style={styles.btnOutline}
                    onClick={handleUploadNew}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Upload New
                  </button>
                </div>

                {history.length > 0 && (
                  <div style={styles.sidebarCard}>
                    <div style={styles.historySection}>
                      <ThumbnailStrip
                        items={history}
                        activeIndex={activeIndex}
                        onSelect={handleSelectHistory}
                        onDelete={handleDeleteHistory}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <ErrorAlert message={error} onDismiss={() => setError(null)} />
          )}
        </main>


        <footer style={styles.footer}>
          <a
            className="footer-link"
            style={styles.footerLink}
            href="https://github.com/ddex3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <div style={styles.footerCredit}>
            <span>Built with</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-error)" stroke="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>by</span>
            <strong style={{ fontWeight: 600, color: "var(--color-text-secondary)" }}>Shaked Angel</strong>
          </div>
          <a
            className="footer-link"
            style={styles.footerLink}
            href="https://github.com/ddex3/Shaked-Background-Removal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Source Code
          </a>
        </footer>
      </div>
    </>
  );
}
