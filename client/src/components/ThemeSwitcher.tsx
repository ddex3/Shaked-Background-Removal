import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme-preference";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .theme-toggle {
          position: relative;
          width: 52px;
          height: 28px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          padding: 0;
          outline: none;
          background: ${isDark ? "var(--color-accent)" : "var(--color-border)"};
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15);
          transition: background 300ms cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
        }
        .theme-toggle:focus-visible {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4), inset 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .theme-toggle:hover {
          background: ${isDark ? "var(--color-accent-hover)" : "var(--color-text-tertiary)"};
        }
        .toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(${isDark ? "24px" : "0"});
        }
        .toggle-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <button
        className="theme-toggle"
        onClick={toggle}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        type="button"
      >
        <div className="toggle-knob">
          <div className="toggle-icon">
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </div>
        </div>
      </button>
    </>
  );
}
