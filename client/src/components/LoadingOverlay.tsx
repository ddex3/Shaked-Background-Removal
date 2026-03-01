import { type CSSProperties } from "react";

interface LoadingOverlayProps {
  visible: boolean;
}

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.25rem",
    backgroundColor: "rgba(248, 249, 251, 0.85)",
    backdropFilter: "blur(12px)",
  },
  spinnerContainer: {
    position: "relative",
    width: "56px",
    height: "56px",
  },
  spinnerOuter: {
    position: "absolute",
    inset: 0,
    border: "3px solid var(--color-border-light)",
    borderTopColor: "var(--color-accent)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  spinnerInner: {
    position: "absolute",
    inset: "8px",
    border: "3px solid transparent",
    borderBottomColor: "var(--color-accent-subtle)",
    borderRadius: "50%",
    animation: "spin 1.2s linear infinite reverse",
  },
  text: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "var(--color-text-secondary)",
    letterSpacing: "0.01em",
  },
};

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinnerOuter} />
        <div style={styles.spinnerInner} />
      </div>
      <p style={styles.text}>Removing background…</p>
    </div>
  );
}
