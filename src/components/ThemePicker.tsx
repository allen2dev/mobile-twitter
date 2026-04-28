"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemePicker() {
  const { theme, setTheme, themes, meta } = useTheme();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--chip-bg)] ring-1 ring-[var(--border-subtle)]"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="listbox"
        aria-label="选择主题"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <PaletteIcon className="h-[18px] w-[18px] text-[var(--accent-strong)]" />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="listbox"
            aria-label="主题列表"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(calc(100vw-2rem),14rem)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--popover-bg)] p-1 shadow-xl shadow-black/20 backdrop-blur-xl"
          >
            {themes.map((id) => (
              <button
                key={id}
                type="button"
                role="option"
                aria-selected={theme === id}
                onClick={() => {
                  setTheme(id);
                  setOpen(false);
                }}
                className={`flex w-full flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  theme === id
                    ? "bg-[var(--pill-bg)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <span className="text-sm font-semibold">{meta[id].label}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {meta[id].description}
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.55 0 1-.45 1-1 0-.39-.23-.74-.56-.9-.33-.16-.56-.5-.56-.9 0-.39.23-.73.56-.89.34-.17.56-.52.56-.91 0-.39-.22-.73-.56-.89-.33-.17-.56-.51-.56-.89 0-.39.23-.73.56-.89.34-.17.56-.52.56-.91 0-.36-.19-.67-.46-.84.21-.76.47-1.49.81-2.17.35-.71.82-1.37 1.41-1.94C17.56 8.41 18 10.17 18 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9zm-1 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S9.5 10.83 9.5 10 10.17 7.5 11 7.5zm5 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-8 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S5 15.83 5 15s.67-1.5 1.5-1.5zm11.5 1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </svg>
  );
}
