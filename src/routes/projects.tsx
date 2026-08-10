import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { usePortfolio } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { SplitHeading, Reveal } from "@/components/Motion";
import { ProjectThumb } from "@/components/ProjectThumb";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Muhammad Owais Raza" },
      {
        name: "description",
        content:
          "Selected engineering and design work by Muhammad Owais Raza, with live production screenshots and full stack breakdowns.",
      },
      { property: "og:title", content: "Projects — Muhammad Owais Raza" },
      {
        property: "og:description",
        content: "Selected builds with live previews, stacks and launch links.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  const projects = usePortfolio((s) => s.projects);
  const hydrated = useHydrated();
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects],
  );

  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-36 sm:px-8 lg:px-12">
      <span className="mono-label text-primary">Index of work</span>
      <SplitHeading
        as="h1"
        type="chars"
        stagger={0.03}
        className="mt-5 font-display text-[clamp(2.5rem,9vw,7rem)] font-black uppercase leading-[0.88] tracking-tighter"
      >
        Projects
      </SplitHeading>

      <Reveal className="mt-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={`mono-label rounded-full border px-5 py-2.5 transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {hydrated && visible.length === 0 ? (
        <p className="mt-16 text-muted-foreground">
          No projects yet — add them in src/content/portfolio.ts.
        </p>
      ) : null}

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {visible.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 0.08}>
            <article
              data-magnetic
              className="glass glass-hover group flex h-full flex-col rounded-3xl p-4"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-high">
                <ProjectThumb
                  project={p}
                  eager={i < 2}
                  className="h-full w-full scale-105 grayscale transition-all duration-700 group-hover:scale-100 group-hover:grayscale-0"
                />
                <span className="mono-label absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <h2 className="min-w-0 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
                    {p.title}
                  </h2>
                  <span className="mono-label shrink-0 rounded-full border border-border px-3 py-1.5 text-muted-foreground">
                    {p.year}
                  </span>
                </div>
                <p className="mono-label mt-2 text-primary">{p.category}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.tech
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <li
                        key={t}
                        className="mono-label rounded-full bg-secondary px-3 py-1.5 text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                </ul>

                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-label mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 px-6 py-3 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    Visit live site ↗
                  </a>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
