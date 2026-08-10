import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/store";
import { SplitHeading, Reveal, Parallax } from "@/components/Motion";
import { DrawnDivider } from "@/components/DrawnSvg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Muhammad Owais Raza" },
      {
        name: "description",
        content:
          "The process, principles and stack behind Muhammad Owais Raza's work as an aesthetic engineer and fullstack architect.",
      },
      { property: "og:title", content: "About — Muhammad Owais Raza" },
      {
        property: "og:description",
        content: "Principles, process and technology stack of Muhammad Owais Raza.",
      },
    ],
  }),
  component: About,
});

function About() {
  const profile = usePortfolio((s) => s.profile);
  const disciplines = usePortfolio((s) => s.disciplines);
  const timeline = usePortfolio((s) => s.timeline);

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-36 sm:px-8 lg:px-12">
      <span className="mono-label text-primary">About</span>
      <SplitHeading
        as="h1"
        type="lines"
        className="mt-5 max-w-4xl font-display text-[clamp(2.25rem,7vw,6rem)] font-black uppercase leading-[0.9] tracking-tighter"
      >
        {`Engineer of\nhigh-fidelity\nweb ecosystems`}
      </SplitHeading>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl">{profile.bio}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass rounded-3xl p-7">
            <dl className="space-y-5">
              {[
                ["Name", profile.name],
                ["Role", profile.role],
                ["Based", profile.location],
                ["Status", profile.available ? "Available for hire" : "Booked"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4">
                  <dt className="mono-label text-muted-foreground">{k}</dt>
                  <dd className="text-right text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>

      <DrawnDivider className="my-20" />

      <div className="grid gap-5 lg:grid-cols-3">
        {disciplines.map((d, i) => (
          <Reveal key={d.title} delay={i * 0.08}>
            <div className="glass glass-hover h-full rounded-3xl p-8">
              <p className="mono-label text-primary">0{i + 1}</p>
              <h2 className="mt-4 font-display text-2xl font-black uppercase tracking-tight">
                {d.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {d.items.map((it) => (
                  <li
                    key={it}
                    className="mono-label rounded-full border border-border px-3 py-1.5 text-muted-foreground"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Parallax className="mt-24" amount={40}>
        <div className="glass rounded-[2.5rem] p-8 sm:p-12">
          <SplitHeading
            type="words"
            className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black uppercase tracking-tighter"
          >
            Trajectory
          </SplitHeading>
          <ol className="mt-10 space-y-0">
            {timeline.map((t) => (
              <li
                key={t.year}
                className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-baseline gap-6 border-t border-border py-6"
              >
                <span className="mono-label text-primary">{t.year}</span>
                <span className="text-sm text-muted-foreground sm:text-base">{t.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </Parallax>

      <Reveal className="mt-16">
        <div className="flex flex-wrap gap-4">
          <Link
            to="/"
            hash="image-portfolio"
            data-magnetic
            className="mono-label inline-flex rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-[var(--glow-cyan)]"
          >
            View Image Portfolio
          </Link>
          <Link
            to="/"
            hash="video-portfolio"
            data-magnetic
            className="mono-label inline-flex rounded-full border border-primary/40 px-8 py-4 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Video Portfolio
          </Link>
          <Link
            to="/contact"
            data-magnetic
            className="mono-label inline-flex rounded-full border border-border px-8 py-4 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Work with me
          </Link>
          <a
            href={profile.cvUrl || undefined}
            download={profile.cvUrl ? "Muhammad_Owais_Raza_CV.pdf" : undefined}
            data-magnetic
            aria-disabled={!profile.cvUrl}
            className={`mono-label inline-flex items-center gap-2 rounded-full border border-primary/40 px-8 py-4 text-primary transition-colors hover:bg-primary hover:text-primary-foreground ${
              profile.cvUrl ? "" : "pointer-events-none opacity-40"
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CV
          </a>
        </div>
      </Reveal>
    </div>
  );
}
