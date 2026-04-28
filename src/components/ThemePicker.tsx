"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/ThemeProvider";

export function ThemePicker() {
  const { theme, setTheme, themes, meta } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [panelBox, setPanelBox] = useState({ top: 0, left: 0, width: 256 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePanelPosition = useCallback(() => {
    if (!open || !buttonRef.current) return;
    const el = buttonRef.current;
    const r = el.getBoundingClientRect();
    const maxW = 280;
    const width = Math.min(maxW, window.innerWidth - 32);
    let left = r.left;
    const margin = 16;
    if (left + width > window.innerWidth - margin) {
      left = window.innerWidth - margin - width;
    }
    if (left < margin) left = margin;
    const top = r.bottom + 10;
    setPanelBox({ top, left, width });
  }, [open]);

  useLayoutEffect(() => {
    updatePanelPosition();
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;
    function onViewportChange() {
      updatePanelPosition();
    }
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, updatePanelPosition]);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const overlay =
    mounted && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                key="theme-picker-layer"
                id="theme-picker-layer"
                role="presentation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[90]"
              >
                <motion.button
                  type="button"
                  aria-label="关闭主题面板"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 bg-[var(--popover-backdrop)] backdrop-blur-[3px]"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  ref={panelRef}
                  id={panelId}
                  role="listbox"
                  aria-label="主题列表"
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 460, damping: 34 }}
                  style={{
                    position: "fixed",
                    top: panelBox.top,
                    left: panelBox.left,
                    width: panelBox.width,
                    zIndex: 1,
                  }}
                  className="flex max-h-[min(70vh,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--popover-border)] bg-[var(--popover-surface)] shadow-[var(--popover-shadow)] backdrop-blur-xl"
                >
                  <div className="border-b border-[var(--divide)] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--popover-title)]">
                      外观
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-[var(--text-primary)]">
                      选择主题
                    </p>
                  </div>
                  <div className="overflow-y-auto overscroll-contain p-2">
                    {themes.map((id, index) => {
                      const selected = theme === id;
                      return (
                        <div key={id}>
                          {index > 0 ? (
                            <div className="my-1 h-px bg-[var(--divide)]" aria-hidden />
                          ) : null}
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              setTheme(id);
                              setOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--popover-surface)] ${
                              selected
                                ? "bg-[var(--pill-bg)]"
                                : "hover:bg-[var(--surface-hover)] active:bg-[var(--surface-hover)]"
                            }`}
                          >
                            <span
                              className="relative h-11 w-11 shrink-0 rounded-xl shadow-inner ring-2 ring-[var(--border-subtle)] ring-inset"
                              style={{ background: meta[id].preview }}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-[var(--text-primary)]">
                                {meta[id].label}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-[var(--text-muted)]">
                                {meta[id].description}
                              </span>
                            </span>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
                              {selected ? (
                                <motion.span
                                  layoutId="theme-check"
                                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-strong)]/15 text-[var(--popover-check)] ring-1 ring-[var(--accent-strong)]/35"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 35,
                                  }}
                                >
                                  <CheckIcon className="h-4 w-4" />
                                </motion.span>
                              ) : (
                                <span className="h-7 w-7 rounded-full border border-[var(--border-subtle)] bg-transparent" />
                              )}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null;

  return (
    <div className="relative" ref={rootRef}>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-[var(--chip-bg)] ring-1 ring-[var(--border-subtle)] transition-shadow ${
          open ? "ring-2 ring-[var(--accent-strong)]/50 shadow-md" : ""
        }`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="listbox"
        aria-label="选择主题"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <PaletteIcon className="h-[18px] w-[18px] text-[var(--accent-strong)]" />
      </motion.button>
      {overlay}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaletteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.55 0 1-.45 1-1 0-.39-.23-.74-.56-.9-.33-.16-.56-.5-.56-.9 0-.39.23-.73.56-.89.34-.17.56-.52.56-.91 0-.39-.22-.73-.56-.89-.33-.17-.56-.51-.56-.89 0-.39.23-.73.56-.89.34-.17.56-.52.56-.91 0-.36-.19-.67-.46-.84.21-.76.47-1.49.81-2.17.35-.71.82-1.37 1.41-1.94C17.56 8.41 18 10.17 18 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9zm-1 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S9.5 10.83 9.5 10 10.17 7.5 11 7.5zm5 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-8 2.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S5 15.83 5 15s.67-1.5 1.5-1.5zm11.5 1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
    </svg>
  );
}
