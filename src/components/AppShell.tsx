"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BottomNav, type TabId } from "@/components/BottomNav";
import { ThemePicker } from "@/components/ThemePicker";
import { TweetFeed } from "@/components/TweetFeed";
import { SAMPLE_TWEETS } from "@/lib/sampleData";

const messages = [
  { id: "m1", name: "产品协作", preview: "动效评审改到周四上午", time: "现在" },
  { id: "m2", name: "设计系统", preview: "tokens 文档已更新", time: "昨天" },
];

export function AppShell() {
  const [tab, setTab] = useState<TabId>("home");

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col pb-28">
      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-header)] px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg-header-solid)]"
      >
        <ThemePicker />
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
          {tabTitle(tab)}
        </h1>
        <motion.button
          type="button"
          className="rounded-full bg-gradient-to-r from-[var(--btn-from)] to-[var(--btn-to)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[var(--btn-shadow)] ring-1 ring-[var(--btn-ring)]"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 12px 40px -8px var(--btn-glow)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          发帖
        </motion.button>
      </motion.header>

      <main className="feed-scroll flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === "home" ? (
            <motion.section
              key="home"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
            >
              <TweetFeed tweets={SAMPLE_TWEETS} />
            </motion.section>
          ) : null}
          {tab === "explore" ? (
            <motion.section
              key="explore"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-6"
            >
              <p className="text-[var(--text-muted)]">
                探索页为演示占位 — 部署到 GitHub Pages 后可在此接入真实数据源或搜索。
              </p>
              <motion.div
                className="mt-6 grid gap-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {["#Nextjs", "#FramerMotion", "#GitHubPages"].map((tag, i) => (
                  <motion.div
                    key={tag}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="rounded-2xl border border-[var(--border-card)] bg-[var(--chip-bg)] px-4 py-3 text-[var(--text-body)]"
                  >
                    <span className="text-[var(--accent-tag)]">{tag}</span>
                    <span className="ml-2 text-sm text-[var(--text-secondary)]">
                      趋势 {1200 + i * 340}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.section>
          ) : null}
          {tab === "notifications" ? (
            <motion.section
              key="notifications"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-[var(--divide)]"
            >
              {["有人赞了你的帖子", "有人转发了你的帖子", "新关注者：Design Lab"].map(
                (text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="px-4 py-4 text-[var(--text-body)]"
                  >
                    {text}
                  </motion.div>
                ),
              )}
            </motion.section>
          ) : null}
          {tab === "messages" ? (
            <motion.section
              key="messages"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="divide-y divide-[var(--divide)]"
            >
              {messages.map((m, i) => (
                <motion.button
                  key={m.id}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex w-full gap-3 px-4 py-4 text-left transition-colors hover:bg-[var(--row-hover)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--msg-avatar-bg)] text-sm font-medium text-[var(--text-primary)]">
                    {m.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {m.name}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">{m.time}</span>
                    </div>
                    <p className="truncate text-sm text-[var(--text-muted)]">{m.preview}</p>
                  </div>
                </motion.button>
              ))}
            </motion.section>
          ) : null}
        </AnimatePresence>
      </main>

      <BottomNav active={tab} onChange={setTab} />

      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[var(--fade-bottom)] to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
    </div>
  );
}

function tabTitle(id: TabId): string {
  switch (id) {
    case "home":
      return "主页";
    case "explore":
      return "探索";
    case "notifications":
      return "通知";
    case "messages":
      return "私信";
    default:
      return "";
  }
}
