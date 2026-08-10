import {
  siReact,
  siTypescript,
  siJavascript,
  siNextdotjs,
  siGreensock,
  siTailwindcss,
  siNodedotjs,
  siFigma,
  siBlender,
  siVite,
  siPostgresql,
  siFramer,
  siThreedotjs,
  siHtml5,
  siCss,
  siPython,
  siGit,
  siGithub,
  siDavinciresolve,
  siWordpress,
  siShopify,
} from "simple-icons";

type Simple = { path: string; hex: string; title: string };

/** Curated inline-SVG icon registry — crisp vectors, zero network requests. */
const registry: Record<string, Simple> = {
  react: siReact,
  typescript: siTypescript,
  javascript: siJavascript,
  nextdotjs: siNextdotjs,
  "next.js": siNextdotjs,
  greensock: siGreensock,
  gsap: siGreensock,
  tailwindcss: siTailwindcss,
  nodedotjs: siNodedotjs,
  figma: siFigma,
  blender: siBlender,
  vite: siVite,
  postgresql: siPostgresql,
  framer: siFramer,
  threedotjs: siThreedotjs,
  html5: siHtml5,
  css: siCss,
  python: siPython,
  git: siGit,
  github: siGithub,
  davinciresolve: siDavinciresolve,
  wordpress: siWordpress,
  shopify: siShopify,
};

/** Adobe marks were removed from simple-icons — render official-palette monograms. */
const monograms: Record<string, { label: string; hex: string }> = {
  photoshop: { label: "Ps", hex: "31A8FF" },
  illustrator: { label: "Ai", hex: "FF9A00" },
  premierepro: { label: "Pr", hex: "9999FF" },
  aftereffects: { label: "Ae", hex: "9999FF" },
  indesign: { label: "Id", hex: "FF3366" },
  lightroom: { label: "Lr", hex: "31A8FF" },
  xd: { label: "Xd", hex: "FF61F6" },
};

export const TECH_SLUGS = [...Object.keys(registry), ...Object.keys(monograms)].sort();

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function TechIcon({
  slug,
  name,
  className = "h-9 w-9",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const key = norm(slug || name);
  const icon = registry[key] ?? registry[slug?.toLowerCase()];
  const mono = monograms[key];

  if (icon) {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-hidden
        className={className}
        style={{ fill: `#${icon.hex}`, filter: `drop-shadow(0 0 10px #${icon.hex}55)` }}
      >
        <path d={icon.path} />
      </svg>
    );
  }

  const label = mono?.label ?? name.slice(0, 2);
  const hex = mono?.hex ?? "22D3EE";

  return (
    <span
      aria-hidden
      className={`grid place-items-center rounded-xl border font-display text-sm font-black ${className}`}
      style={{
        color: `#${hex}`,
        borderColor: `#${hex}66`,
        background: `#${hex}14`,
        boxShadow: `0 0 14px #${hex}33`,
      }}
    >
      {label}
    </span>
  );
}
