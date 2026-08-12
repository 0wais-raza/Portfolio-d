/* ============================================================================
 *  ✏️  YOUR CONTENT LIVES HERE — EDIT THIS ONE FILE
 * ============================================================================
 *  Everything on the site (hero, about, projects, stats, tech stack, image &
 *  video portfolios, contact details) is driven by the data below.
 *
 *  There is NO database anymore — change anything here, save, and the site
 *  updates instantly. Types are provided so you get autocomplete + errors if
 *  you miss a field.
 *
 *  Quick reference:
 *    profile  → hero, about page, footer, contact details, favicon, CV link
 *    stats    → the "07 / 42 / 99 / 11" stat band on the home page
 *    projects → the "Selected artifacts" gallery + /projects page
 *    tech     → the "Software & Stack" marquee
 *    images   → "Image Portfolio" gallery on the home page
 *    videos   → "Video Portfolio" gallery on the home page
 *
 *  Notes:
 *    • photo / images / videos: any public image or video URL works.
 *      A data: URL also works if you inline your own file.
 *    • project `thumbnail`: set your own main image (drop it in `public/` and
 *      reference it as "/my-image.png", or paste any https:// URL). Leave it
 *      empty and the live screenshot of `url` is generated automatically.
 *    • CV: drop your resume at `public/cv.pdf` and it becomes the
 *      "Download CV" file on the site.
 *    • roles appear in the hero animation and "I'm a …" lines.
 *    • marquee is the scrolling text band under the hero.
 * ========================================================================== */

export type ProfileData = {
  name: string;
  tagline: string;
  role: string;
  bio: string;
  photo: string;
  favicon: string;
  cvUrl: string;
  email: string;
  location: string;
  available: boolean;
  github: string;
  linkedin: string;
  insta: string;
  roles: string[];
  marquee: string[];
  stats: { id: string; label: string; value: string }[];
};

export type ProjectData = {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string; // comma-separated, e.g. "React, Node, Postgres"
  url: string; // live URL — visited when the visitor clicks "Visit live site"
  /** Main image for the project card.
   *  Leave empty → a live screenshot of `url` is generated automatically.
   *  Set to a `/public-file.png` path or any https:// URL → used as-is. */
  thumbnail?: string;
  year: string;
};

export type TechData = { id: string; name: string; slug: string };
export type MediaData = { id: string; title: string; url: string; caption: string };
export type Discipline = { title: string; body: string; items: string[] };
export type TimelineEntry = { year: string; label: string };

export type SiteData = {
  profile: ProfileData;
  projects: ProjectData[];
  tech: TechData[];
  images: MediaData[];
  videos: MediaData[];
  disciplines: Discipline[];
  timeline: TimelineEntry[];
};

/* ============================================================================
 *  👤  PROFILE — hero, about page, nav, footer, contact
 * ========================================================================== */
export const profile: ProfileData = {
  name: "Muhammad Owais Raza",
  tagline: "Creative Technologist & Fullstack Architect",
  role: "Fullstack Solutions Architect",

  // Shown under the hero photo / in the about "Who I am" panel.
  bio: "Engineer of high-fidelity web ecosystems. I work at the intersection of raw performance and luxury editorial design — building interfaces that feel inevitable, render fast, and leave a mark.",

  // Your photo — drop a file in `public/` and reference it as "/my-photo.png",
  // or paste any public URL.
  photo: "/me.png",
  // Site favicon (browser tab icon). Defaults to `photo` when empty.
  favicon: "/me.png",

  // Direct download for the "Download CV" button. Drop your resume at
  // `public/cv.pdf` and keep this as "/cv.pdf". Empty = button disabled.
  cvUrl: "/cv.pdf",

  email: "owaispro300@gmail.com",
  location: "Karachi, PK — Remote worldwide",
  available: false,

  github: "https://github.com/0wais-raza",
  linkedin: "https://www.linkedin.com/in/owais-raza-pro/",
  insta: "https://www.instagram.com/itz_professionalofficial/",

  // Animated role rotation in the hero — each entry gets its own line/badge.
  roles: ["Video Editor", "Graphic Designer", "Web Designer & Developer", "FX Learner"],

  // Scrolling text band under the hero.
  marquee: [
    "Premiere Pro",
    "After Effects",
    "Photoshop",
    "Illustrator",
    "React",
    "Tailwind CSS",
    "GSAP",
    "Blender",
  ],

  // The "Years Shipping / Products Launched / …" stat band.
  stats: [
    { id: "stat-1", label: "Years Shipping", value: "03+" },
    { id: "stat-2", label: "Websites Deployed", value: "33+" },
    { id: "stat-3", label: "Aura", value: "∞" },
    { id: "stat-4", label: "Video edited", value: "50+" },
  ],
};

/* ============================================================================
 *  🚀  PROJECTS — home gallery + /projects page
 * ========================================================================== */
export const projects: ProjectData[] = [
  {
    id: "project-1",
    title: "CyberVerce - filter catogory",
    category: "E-comerce",
    description:
      "A simple Sylani Web-dev course assigment to simply add a filter using JS, but insect in me says make it super UI, so.....",
    tech: "HTML, CSS, JS, fot this project",
    url: "https://0wais-raza.github.io/CyberVerse/",
    year: "2026",
  },
  {
    id: "project-2",
    title: "Meeral collection",
    category: "e-commerce",
    description:
      "Realtime E comerce store for small brand named Meeral collection, with working data base!",
    tech: "React, TypeScript, MongoDB, Tailwind",
    url: "https://meeral-collection.vercel.app/",
    year: "2026",
  },
  {
    id: "project-3",
    title: "shown soon",
    category: "Visual Brand",
    description:
      "An award-leaning studio site driven by GSAP scroll choreography and a custom WebGL shader background.",
    tech: "Three.js, GSAP, GLSL, Lenis",
    url: "https://gsap.com",
    year: "2023",
  },
  {
    id: "project-4",
    title: "shown soon",
    category: "Commerce",
    description:
      "Headless storefront with kinetic product transitions and a checkout that converts on first intent.",
    tech: "Next.js, Stripe, Motion, Sanity",
    url: "https://stripe.com",
    year: "2024",
  },
];

/* ============================================================================
 *  🧰  TECH STACK — "Software & Stack" marquee on the home page
 *  slug must match a key in src/components/TechIcon.tsx for a real icon
 *  (e.g. "react", "typescript", "greensock", "aftereffects").
 * ========================================================================== */
export const tech: TechData[] = [
  { id: "tech-1", name: "React", slug: "react" },
  { id: "tech-2", name: "TypeScript", slug: "typescript" },
  { id: "tech-3", name: "Motion", slug: "motion" },
  { id: "tech-4", name: "GSAP", slug: "greensock" },
  { id: "tech-5", name: "Tailwind CSS", slug: "tailwindcss" },
  { id: "tech-6", name: "Node.js", slug: "nodedotjs" },
  { id: "tech-7", name: "Figma", slug: "figma" },
  { id: "tech-8", name: "After Effects", slug: "aftereffects" },
  { id: "tech-9", name: "Premiere Pro", slug: "premierepro" },
  { id: "tech-10", name: "Photoshop", slug: "photoshop" },
  { id: "tech-11", name: "Illustrator", slug: "illustrator" },
  { id: "tech-12", name: "Blender", slug: "blender" },
];

/* ============================================================================
 *  🖼️  IMAGE PORTFOLIO — "Image Portfolio" gallery
 * ========================================================================== */
export const images: MediaData[] = [
  {
    id: "image-1",
    title: "Brand Poster Series",
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80",
    caption: "Editorial poster system — typography and grid studies.",
  },
  {
    id: "image-2",
    title: "UI Concept — Obsidian",
    url: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=1200&q=80",
    caption: "Dark dashboard concept with neon accent system.",
  },
  {
    id: "image-3",
    title: "Motion Frames",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
    caption: "Keyframe stills from a title-sequence build.",
  },
  {
    id: "image-4",
    title: "Identity Study",
    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    caption: "Logo lockups and colour exploration.",
  },
];

/* ============================================================================
 *  🎬  VIDEO PORTFOLIO — "Video Portfolio" gallery
 *  Works with YouTube / Vimeo embed URLs or direct .mp4 / .webm files.
 * ========================================================================== */
export const videos: MediaData[] = [
  {
    id: "video-1",
    title: "Showreel 2026",
    url: "https://www.youtube.com/embed/ScMzIvxBSi4",
    caption: "Editing, motion graphics and FX highlights.",
  },
  {
    id: "video-2",
    title: "Product Launch Cut",
    url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
    caption: "Narrative edit with kinetic type overlays.",
  },
];

/* ============================================================================
 *  🧭  ABOUT PAGE — the three discipline cards + career timeline
 * ========================================================================== */
export const disciplines: Discipline[] = [
  {
    title: "Motion Engineering",
    body: "GSAP in Webdev, and mastery of After effects in premium visual motions",
    items: ["GSAP", "ScrollTrigger", "After effects", "Apple UI", "3d Camrta"],
  },
  {
    title: "Fullstack Architecture",
    body: "Typed end-to-end systems: edge runtimes, realtime data, resilient queues and schemas designed to survive scale.",
    items: ["TypeScript", "React", "HTML", "CCS", "JS"],
  },
  {
    title: "Editorial Interface Design",
    body: "Design systems with opinionated typography, restrained palettes and a token layer that keeps every surface coherent.",
    items: ["Design tokens", "Tailwind", "Figma", "Photoshop", "VFX"],
  },
];

export const timeline: TimelineEntry[] = [
  { year: "2022", label: "First production Premiere pro and After effects Mastery" },
  { year: "2023", label: "Professional Webdev and design learning." },
  { year: "2024", label: "Focused on WebGL and motion-heavy editorial builds." },
  { year: "2026", label: "Independent — building award-grade products end to end." },
];

/* Everything the site needs — imported by src/lib/store.ts */
export const siteData: SiteData = {
  profile,
  projects,
  tech,
  images,
  videos,
  disciplines,
  timeline,
};
