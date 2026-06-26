import { create } from "zustand";

export interface UserProfile {
  age?: number | null;
  nationality?: string | null;
  education?: string | null;
  profession?: string | null;
  languages: string[];
  immigrationObjective?: string | null;
  financialSituation?: string | null;
  onboardingStep: number;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  profile?: UserProfile | null;
}

export interface CountryMinimal {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  flagUrl: string;
  overallScore: number;
}

interface AppState {
  locale: string;
  theme: "light" | "dark";
  user: User | null;
  favorites: CountryMinimal[];
  isLoadingFavorites: boolean;
  setLocale: (locale: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setUser: (user: User | null) => void;
  setFavorites: (favorites: CountryMinimal[]) => void;
  fetchProfileAndFavorites: () => Promise<void>;
  toggleFavorite: (country: CountryMinimal) => Promise<boolean>;
  setOnboardingStep: (step: number) => void;
  clearAuth: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  locale: "pt-BR",
  theme: "light",
  user: null,
  favorites: [],
  isLoadingFavorites: false,

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

  setUser: (user) => set({ user }),

  setFavorites: (favorites) => set({ favorites }),

  fetchProfileAndFavorites: async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        set({
          user: {
            id: data.id,
            name: data.name,
            email: data.email,
            image: data.image,
            profile: data.profile,
          },
          favorites: data.favorites || [],
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    }
  },

  toggleFavorite: async (country) => {
    try {
      const response = await fetch("/api/user/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryId: country.id }),
      });

      if (response.ok) {
        const data = await response.json();
        const currentFavorites = get().favorites;

        if (data.favorited) {
          set({ favorites: [...currentFavorites, country] });
          return true;
        } else {
          set({ favorites: currentFavorites.filter((f) => f.id !== country.id) });
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
      return false;
    }
  },

  setOnboardingStep: (step) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          profile: currentUser.profile
            ? { ...currentUser.profile, onboardingStep: step }
            : { onboardingStep: step, languages: [] },
        },
      });
    }
  },

  clearAuth: () => set({ user: null, favorites: [] }),
}));

