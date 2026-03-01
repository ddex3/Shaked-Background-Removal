import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

interface ComparisonSliderProps {
  originalUrl: string;
  processedUrl: string;
}

const styles: Record<string, CSSProperties> = {
  outer: {
    borderRadius: "var(--radius-xl)",
    overflow: "hidden",
    boxShadow: "var(--shadow-card)",
    animation: "fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) both",
  },
  container: {
    position: "relative",
    width: "100%",
    userSelect: "none",
    touchAction: "pan-y",
    cursor: "ew-resize",
    overflow: "hidden",
  },
  processedLayer: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
  },
  overlayImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  divider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "2px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    transform: "translateX(-50%)",
    boxShadow: "0 0 12px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
    pointerEvents: "none",
  },
  handle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    zIndex: 11,
    pointerEvents: "auto",
    cursor: "ew-resize",
    transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
  },
  chevron: {
    width: "7px",
    height: "12px",
    fill: "none",
    stroke: "#6366f1",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  },
  label: {
    position: "absolute",
    top: "14px",
    padding: "5px 12px",
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    color: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(8px)",
    borderRadius: "var(--radius-full)",
    zIndex: 5,
    pointerEvents: "none",
    textTransform: "uppercase",
  },
};

export function ComparisonSlider({ originalUrl, processedUrl }: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringHandle, setIsHoveringHandle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) calculatePosition(e.clientX);
    },
    [calculatePosition, isDragging]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => calculatePosition(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      calculatePosition(e.touches[0].clientX);
    };
    const handleEnd = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleEnd);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, calculatePosition]);

  return (
    <div style={styles.outer}>
      <div
        ref={containerRef}
        className="checker-bg"
        style={styles.container}
        onClick={handleContainerClick}
      >
        <img src={processedUrl} alt="Processed" style={styles.processedLayer} draggable={false} />

        <div
          style={{
            ...styles.overlay,
            clipPath: `inset(0 ${100 - position}% 0 0)`,
          }}
        >
          <img src={originalUrl} alt="Original" style={styles.overlayImage} draggable={false} />
        </div>

        <span style={{ ...styles.label, left: "14px" }}>Before</span>
        <span style={{ ...styles.label, right: "14px" }}>After</span>

        <div style={{ ...styles.divider, left: `${position}%` }}>
          <div
            style={{
              ...styles.handle,
              ...(isHoveringHandle || isDragging
                ? { transform: "translate(-50%, -50%) scale(1.12)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(99, 102, 241, 0.3)" }
                : {}),
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onMouseEnter={() => setIsHoveringHandle(true)}
            onMouseLeave={() => setIsHoveringHandle(false)}
          >
            <svg style={styles.chevron} viewBox="0 0 7 12">
              <polyline points="5.5,1 1,6 5.5,11" />
            </svg>
            <svg style={styles.chevron} viewBox="0 0 7 12">
              <polyline points="1.5,1 6,6 1.5,11" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
