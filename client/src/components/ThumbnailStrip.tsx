import { type CSSProperties, useRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface HistoryItem {
  id: string;
  original: string;
  processed: string;
  createdAt: number;
}

interface ThumbnailStripProps {
  items: HistoryItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
}

const styles: Record<string, CSSProperties> = {
  wrapper: {
    width: "100%",
  },
  label: {
    fontSize: "0.6875rem",
    fontWeight: 600,
    color: "var(--color-text-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.625rem",
  },
  strip: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    position: "relative",
  },
  thumb: {
    flexShrink: 0,
    width: "56px",
    height: "56px",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "border-color var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast)",
    position: "relative",
  },
  thumbActive: {
    borderColor: "var(--color-accent)",
    boxShadow: "0 0 0 2px var(--color-accent-light)",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  menu: {
    position: "fixed",
    zIndex: 1000,
    background: "var(--color-surface)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-xl)",
    border: "1px solid var(--color-border)",
    padding: "0.25rem",
    minWidth: "120px",
    animation: "fadeInScale 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.5rem 0.75rem",
    border: "none",
    background: "transparent",
    borderRadius: "var(--radius-xs)",
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: "var(--color-error)",
    cursor: "pointer",
    transition: "background var(--transition-fast)",
  },
};

export function ThumbnailStrip({ items, activeIndex, onSelect, onDelete }: ThumbnailStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; index: number } | null>(null);

  const scrollToActive = useCallback((index: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const child = strip.children[index] as HTMLElement | undefined;
    if (!child) return;
    const stripRect = strip.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    if (childRect.top < stripRect.top || childRect.bottom > stripRect.bottom) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  useEffect(() => {
    scrollToActive(activeIndex);
  }, [activeIndex, scrollToActive]);

  if (items.length === 0) return null;

  return (
    <>
      <style>{`
        .thumb-item:hover {
          transform: scale(1.08);
          box-shadow: var(--shadow-md);
        }
        .thumb-item:active {
          transform: scale(1.02);
        }
        .ctx-menu-item:hover {
          background: var(--color-error-bg) !important;
        }
      `}</style>
      <div style={styles.wrapper}>
        <p style={styles.label}>History</p>
        <div ref={stripRef} style={styles.strip}>
          {items.map((item, i) => (
            <div
              key={item.id}
              className="thumb-item"
              style={{
                ...styles.thumb,
                ...(i === activeIndex ? styles.thumbActive : {}),
              }}
              onClick={() => onSelect(i)}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setContextMenu({ x: e.clientX, y: e.clientY, index: i });
              }}
            >
              <img
                src={item.processed}
                alt={`Result ${i + 1}`}
                style={styles.thumbImage}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>
      </div>

      {contextMenu && createPortal(
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 999 }}
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
          />
          <div
            style={{
              ...styles.menu,
              left: contextMenu.x,
              top: contextMenu.y,
            }}
          >
            <button
              className="ctx-menu-item"
              style={styles.menuItem}
              onClick={() => {
                onDelete(contextMenu.index);
                setContextMenu(null);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
