import { type CSSProperties } from "react";

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    padding: "0.875rem 1rem",
    backgroundColor: "var(--color-error-bg)",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    borderRadius: "var(--radius-md)",
    marginTop: "1rem",
    animation: "errorSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  dot: {
    flexShrink: 0,
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--color-error)",
  },
  message: {
    flex: 1,
    fontSize: "0.875rem",
    color: "var(--color-error)",
    lineHeight: 1.5,
  },
  button: {
    flexShrink: 0,
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    color: "var(--color-error)",
    fontSize: "1.125rem",
    borderRadius: "var(--radius-sm)",
    transition: "background var(--transition-fast)",
    cursor: "pointer",
  },
};

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <>
      <style>{`
        .error-dismiss:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
      <div style={styles.container} role="alert">
        <div style={styles.dot} />
        <p style={styles.message}>{message}</p>
        <button
          className="error-dismiss"
          style={styles.button}
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      </div>
    </>
  );
}
