export type Tweet = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  time: string;
  stats: { replies: number; reposts: number; likes: number };
};

export const SAMPLE_TWEETS: Tweet[] = [
  {
    id: "1",
    author: "Design Notes",
    handle: "designnotes",
    avatar: "DN",
    content:
      "Glass surfaces, motion depth, and restrained color beat loud gradients every time. shipped.",
    time: "2m",
    stats: { replies: 12, reposts: 48, likes: 312 },
  },
  {
    id: "2",
    author: "Next.js",
    handle: "nextjs",
    avatar: "Nx",
    content:
      "Static export + GitHub Pages = zero-config previews for your UI experiments. deploy early.",
    time: "12m",
    stats: { replies: 56, reposts: 120, likes: 890 },
  },
  {
    id: "3",
    author: "Motion",
    handle: "motiondotdev",
    avatar: "Mo",
    content:
      "Stagger your list entrance — users perceive polish when timing feels intentional, not flashy.",
    time: "1h",
    stats: { replies: 8, reposts: 34, likes: 201 },
  },
  {
    id: "4",
    author: "You",
    handle: "you",
    avatar: "Me",
    content: "Rebuilt the mobile shell with a modern token palette and spring transitions.",
    time: "3h",
    stats: { replies: 3, reposts: 9, likes: 42 },
  },
];
