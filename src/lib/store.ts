import { create } from "zustand";
import { siteData, type Discipline, type TimelineEntry } from "@/content/portfolio";

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string;
  url: string;
  /** Custom main image (public path or URL). Empty → live screenshot of `url`. */
  thumbnail?: string;
  year: string;
};

export type Stat = { id: string; label: string; value: string };
export type Tech = { id: string; name: string; slug: string };
export type Media = { id: string; title: string; url: string; caption: string };

export type Profile = {
  name: string;
  tagline: string;
  roles: string[];
  photo: string;
  marquee: string[];
  role: string;
  bio: string;
  email: string;
  location: string;
  available: boolean;
  favicon: string;
  cvUrl: string;
  github: string;
  linkedin: string;
  insta: string;
  stats: Stat[];
};

export type Inquiry = {
  name: string;
  email: string;
  message: string;
};

/** Live screenshot thumbnail for a project's live URL (via Microlink). */
export const thumbnailFor = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`;

type PortfolioState = {
  profile: Profile;
  projects: Project[];
  tech: Tech[];
  images: Media[];
  videos: Media[];
  disciplines: Discipline[];
  timeline: TimelineEntry[];
  loaded: boolean;
  /** Kept for API compatibility — content is static now, nothing to fetch. */
  hydrate: () => Promise<void>;
  /** Opens the visitor's email app with a pre-filled message to `profile.email`. */
  addInquiry: (i: Inquiry) => Promise<void>;
};

export const usePortfolio = create<PortfolioState>()((set, get) => ({
  // All content comes straight from src/content/portfolio.ts — edit that file.
  profile: siteData.profile,
  projects: siteData.projects,
  tech: siteData.tech,
  images: siteData.images,
  videos: siteData.videos,
  disciplines: siteData.disciplines,
  timeline: siteData.timeline,
  loaded: true,

  hydrate: async () => {
    set({ loaded: true });
  },

  addInquiry: async (i) => {
    const email = get().profile.email;
    if (!email) throw new Error("No contact email configured in src/content/portfolio.ts");
    const subject = encodeURIComponent(`Portfolio inquiry from ${i.name}`);
    const body = encodeURIComponent(`Name: ${i.name}\nEmail: ${i.email}\n\n${i.message}`);
    const href = `mailto:${email}?subject=${subject}&body=${body}`;
    // Give the success state a moment to paint before the mail app opens.
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
    await new Promise((r) => setTimeout(r, 300));
  },
}));
