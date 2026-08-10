import { thumbnailFor, type Project } from "@/lib/store";
import { useState } from "react";

/**
 * Project main image resolution order:
 *   1. `project.thumbnail` — a custom image (public path like "/project.png"
 *      or any https:// URL) set in src/content/portfolio.ts.
 *   2. Live screenshot of `project.url` (via Microlink).
 *   3. Styled letter placeholder.
 */
export function ProjectThumb({
  project,
  className = "",
  eager = false,
}: {
  project: Project;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const custom = project.thumbnail?.trim();
  const valid = /^https?:\/\//i.test(project.url);

  if (custom && !failed) {
    return (
      <img
        src={custom}
        alt={`${project.title} artwork`}
        loading={eager ? "eager" : "lazy"}
        onError={() => setFailed(true)}
        className={`bg-surface-high object-cover object-top ${className}`}
      />
    );
  }

  if (!valid || failed) {
    return (
      <div
        className={`grid place-items-center bg-surface-high grid-noise ${className}`}
        aria-label={`${project.title} preview unavailable`}
      >
        <span className="font-display text-3xl font-black tracking-tighter text-muted-foreground/40">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={thumbnailFor(project.url)}
      alt={`Live screenshot of ${project.title}`}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className={`bg-surface-high object-cover object-top ${className}`}
    />
  );
}
