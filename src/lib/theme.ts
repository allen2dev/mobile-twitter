export const THEME_STORAGE_KEY = "mobile-twitter-theme";

export const THEMES = ["dark", "light", "midnight"] as const;

export type ThemeId = (typeof THEMES)[number];

export function isThemeId(value: string | null): value is ThemeId {
  return value === "dark" || value === "light" || value === "midnight";
}

export const THEME_META: Record<
  ThemeId,
  { label: string; description: string; preview: string }
> = {
  dark: {
    label: "深色",
    description: "默认夜间",
    preview:
      "linear-gradient(145deg, oklch(0.32 0.04 260) 0%, oklch(0.14 0.03 260) 100%)",
  },
  light: {
    label: "浅色",
    description: "明亮界面",
    preview:
      "linear-gradient(145deg, oklch(0.99 0.01 260) 0%, oklch(0.9 0.02 260) 100%)",
  },
  midnight: {
    label: "午夜",
    description: "紫调深色",
    preview:
      "linear-gradient(145deg, oklch(0.38 0.14 290) 0%, oklch(0.14 0.08 300) 100%)",
  },
};

/** Inline script: read localStorage and set data-theme before paint (avoid flash). */
export const THEME_BOOT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var v=localStorage.getItem(k);var a=document.documentElement;if(v==="dark"||v==="light"||v==="midnight")a.setAttribute("data-theme",v);else a.setAttribute("data-theme","dark");}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
