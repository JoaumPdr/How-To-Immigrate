import { create } from "zustand";

interface AppState {
  locale: string;
  theme: "light" | "dark";
  setLocale: (locale: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: "pt-BR",
  theme: "light",
  setLocale: (locale) => set({ locale }),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    set({ theme });
  },
}));
