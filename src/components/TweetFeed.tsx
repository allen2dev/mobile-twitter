"use client";

import { motion } from "framer-motion";
import type { Tweet } from "@/lib/sampleData";

const list = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 400, damping: 30 },
  },
};

type Props = {
  tweets: Tweet[];
};

export function TweetFeed({ tweets }: Props) {
  return (
    <motion.ul
      className="flex flex-col gap-0"
      variants={list}
      initial="hidden"
      animate="visible"
    >
      {tweets.map((tweet) => (
        <motion.li
          key={tweet.id}
          variants={item}
          className="border-b border-[var(--divide)] px-4 py-3 transition-colors hover:bg-[var(--row-hover)]"
        >
          <article className="flex gap-3">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--avatar-from)] to-[var(--avatar-to)] text-sm font-semibold text-white ring-1 ring-[var(--border-subtle)]"
            >
              {tweet.avatar}
            </motion.div>
            <div className="min-w-0 flex-1">
              <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="truncate font-semibold text-[var(--text-primary)]">
                  {tweet.author}
                </span>
                <span className="truncate text-sm text-[var(--text-secondary)]">
                  @{tweet.handle}
                </span>
                <span className="text-sm text-[var(--text-faint)]">· {tweet.time}</span>
              </header>
              <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--text-body)]">
                {tweet.content}
              </p>
              <div className="mt-3 flex max-w-md items-center justify-between text-[var(--text-secondary)]">
                <Stat
                  label="回复"
                  value={tweet.stats.replies}
                  d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"
                />
                <Stat
                  label="转发"
                  value={tweet.stats.reposts}
                  d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"
                />
                <Stat
                  label="喜欢"
                  value={tweet.stats.likes}
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  accent
                />
              </div>
            </div>
          </article>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Stat({
  label,
  value,
  d,
  accent,
}: {
  label: string;
  value: number;
  d: string;
  accent?: boolean;
}) {
  return (
    <motion.button
      type="button"
      className={`group flex items-center gap-1.5 rounded-full px-2 py-1 text-sm tabular-nums transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--stat-hover)] ${accent ? "hover:text-[var(--like-hover)]" : ""}`}
      variants={{
        rest: { scale: 1 },
        hover: { scale: 1.02 },
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[18px] w-[18px] ${accent ? "text-[var(--like-icon)] group-hover:text-[var(--like-icon-hover)]" : ""}`}
        fill="currentColor"
        aria-hidden
      >
        <path d={d} />
      </svg>
      <span className="sr-only">{label}</span>
      <span>{value}</span>
    </motion.button>
  );
}
