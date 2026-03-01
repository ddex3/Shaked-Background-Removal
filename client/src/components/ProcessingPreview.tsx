import { type CSSProperties, useMemo } from "react";

interface ProcessingPreviewProps {
  imageUrl: string;
}

const SPARKLE_COUNT = 28;

function generateSparkles() {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
    id: i,
    left: `${Math.random() * 94 + 3}%`,
    top: `${Math.random() * 90 + 5}%`,
    size: Math.random() * 6 + 3,
    delay: Math.random() * 3,
    duration: Math.random() * 1.5 + 1.2,
    opacity: Math.random() * 0.5 + 0.4,
  }));
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    position: "relative",
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto",
    borderRadius: "var(--radius-xl)",
    overflow: "hidden",
    boxShadow: "var(--shadow-card)",
    animation: "fadeInScale 0.4s cubic-bezier(0.4, 0, 0.2, 1) both",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
    filter: "blur(6px) brightness(0.55)",
    transform: "scale(1.04)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(30, 30, 40, 0.45)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  text: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.85)",
    letterSpacing: "0.02em",
    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
    zIndex: 2,
  },
  sparkle: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
  },
};

function StarSvg({ size, opacity }: { size: number; opacity: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path
        d="M12 2 L13.5 9 L20 8 L14.5 12 L18 19 L12 14.5 L6 19 L9.5 12 L4 8 L10.5 9 Z"
        fill="#d4a843"
      />
      <path
        d="M12 0 L12.8 10 L12 24 L11.2 10 Z"
        fill="rgba(255, 220, 120, 0.8)"
      />
      <path
        d="M0 12 L10 11.2 L24 12 L10 12.8 Z"
        fill="rgba(255, 220, 120, 0.8)"
      />
    </svg>
  );
}

export function ProcessingPreview({ imageUrl }: ProcessingPreviewProps) {
  const sparkles = useMemo(generateSparkles, []);

  return (
    <>
      <style>{`
        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0.3) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>
      <div style={styles.wrapper}>
        <img src={imageUrl} alt="Processing" style={styles.image} draggable={false} />
        <div style={styles.overlay}>
          {sparkles.map((s) => (
            <div
              key={s.id}
              style={{
                ...styles.sparkle,
                left: s.left,
                top: s.top,
                animation: `sparkleTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
              }}
            >
              <StarSvg size={s.size} opacity={s.opacity} />
            </div>
          ))}
          <p style={styles.text}>Removing background…</p>
        </div>
      </div>
    </>
  );
}
