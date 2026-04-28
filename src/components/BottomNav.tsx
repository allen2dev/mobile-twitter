"use client";

import { motion } from "framer-motion";

const tabs = [
  { id: "home", label: "主页", icon: HomeIcon },
  { id: "explore", label: "探索", icon: SearchIcon },
  { id: "notifications", label: "通知", icon: BellIcon },
  { id: "messages", label: "私信", icon: MailIcon },
] as const;

export type TabId = (typeof tabs)[number]["id"];

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export function BottomNav({ active, onChange }: Props) {
  return (
    <motion.nav
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-subtle)] bg-[var(--bg-nav)] px-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg-nav-solid)]"
      aria-label="主导航"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-x-2 -top-0.5 bottom-0 -z-10 rounded-2xl bg-[var(--pill-bg)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <Icon
                className={
                  isActive
                    ? "h-6 w-6 text-[var(--accent-strong)]"
                    : "h-6 w-6 text-[var(--text-secondary)]"
                }
              />
              <span
                className={
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"
                }
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4h-3v2.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
