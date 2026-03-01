import { type CSSProperties, useCallback, useRef, useState } from "react";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const styles: Record<string, CSSProperties> = {
  card: {
    background: "var(--color-surface)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-card)",
    overflow: "hidden",
    transition: "box-shadow var(--transition-base), background var(--transition-base)",
  },
  dropZone: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "3.5rem",
    border: "2px dashed var(--color-border)",
    borderRadius: "var(--radius-lg)",
    margin: "1rem",
    cursor: "pointer",
    transition: "border-color var(--transition-base), background var(--transition-base)",
  },
  dropZoneDragging: {
    borderColor: "var(--color-accent)",
    backgroundColor: "var(--color-drop-active)",
    transform: "scale(1.005)",
  },
  dropZoneDisabled: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  iconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "var(--radius-lg)",
    backgroundColor: "var(--color-accent-light)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color var(--transition-fast)",
  },
  icon: {
    color: "var(--color-accent)",
  },
  title: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--color-text-primary)",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "var(--color-text-secondary)",
    marginTop: "-0.5rem",
  },
  hint: {
    fontSize: "0.75rem",
    color: "var(--color-text-tertiary)",
    marginTop: "0.25rem",
  },
  previewContainer: {
    position: "relative",
    margin: "1.25rem",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    cursor: "pointer",
  },
  previewImage: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: "var(--radius-lg)",
  },
  previewOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(2px)",
    opacity: 0,
    transition: "opacity var(--transition-base)",
    borderRadius: "var(--radius-lg)",
  },
  previewOverlayText: {
    color: "#ffffff",
    fontSize: "0.8125rem",
    fontWeight: 600,
    padding: "0.5rem 1.25rem",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    borderRadius: "var(--radius-full)",
    letterSpacing: "0.01em",
  },
};

export function UploadCard({ onFileSelect, previewUrl, disabled }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (ALLOWED_TYPES.includes(file.type)) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <>
      <style>{`
        .upload-card:hover {
          box-shadow: var(--shadow-card-hover);
        }
        .upload-preview-wrap:hover .upload-preview-overlay {
          opacity: 1 !important;
        }
      `}</style>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleInputChange}
        style={{ display: "none" }}
      />
      <div
        className="upload-card"
        style={{
          ...styles.card,
          ...(isHovering || isDragging ? { background: "var(--color-accent-light)" } : {}),
        }}
      >
        {previewUrl ? (
          <div
            className="upload-preview-wrap"
            style={styles.previewContainer}
            onClick={handleClick}
          >
            <img src={previewUrl} alt="Upload preview" style={styles.previewImage} />
            <div className="upload-preview-overlay" style={styles.previewOverlay}>
              <span style={styles.previewOverlayText}>Change image</span>
            </div>
          </div>
        ) : (
          <div
            className="upload-dropzone"
            style={{
              ...styles.dropZone,
              ...((isDragging || isHovering) ? { borderColor: "var(--color-accent)", background: "transparent" } : {}),
              ...(disabled ? styles.dropZoneDisabled : {}),
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon-wrap" style={{
              ...styles.iconWrap,
              ...((isHovering || isDragging) ? { backgroundColor: "transparent" } : {}),
            }}>
              <svg
                style={styles.icon}
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p style={styles.title}>Drag & drop your image here</p>
            <p style={styles.subtitle}>or click to browse</p>
            <p style={styles.hint}>PNG, JPG, WebP - Max 10 MB</p>
          </div>
        )}
      </div>
    </>
  );
}
