import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePortfolio } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { SplitHeading, Reveal, Parallax } from "@/components/Motion";
import { DrawnDivider, DrawnBracket } from "@/components/DrawnSvg";
import { ProjectThumb } from "@/components/ProjectThumb";
import { TechMarquee } from "@/components/TechMarquee";
import { MediaPortfolio } from "@/components/MediaPortfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Owais Raza — Motion engineer & Fullstack Architect" },
      {
        name: "description",
        content:
          "Muhammad Owais Raza builds high-performance, editorial-grade web products — WebGL, GSAP motion systems and resilient fullstack architecture.",
      },
      {
        property: "og:title",
        content: "Muhammad Owais Raza — Tech Engineer",
      },
      {
        property: "og:description",
        content:
          "Selected work, motion engineering and fullstack architecture by Muhammad Owais Raza.",
      },
    ],
  }),
  component: Home,
});

{
  /* Role Icons Mapping for Floating Badges */
}
const ROLE_BADGES: Record<string, { label: string; icon: React.ReactNode }> = {
  "Video Editor": {
    label: "REEL_ENGINE",
    icon: (
      <svg
        className="h-4 w-4 text-cyan-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    ),
  },
  "Graphic Designer": {
    label: "VECTOR_STUDIO",
    icon: (
      <svg
        className="h-4 w-4 text-purple-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.58 7.58" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  Developer: {
    label: "ARCHITECT",
    icon: (
      <svg
        className="h-4 w-4 text-emerald-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
};

function HeroSequence() {
  const profile = usePortfolio((s) => s.profile);
  const roles = profile.roles.length ? profile.roles : ["Developer"];

  // Hero name comes from the content file: first word on line one,
  // the rest on line two (e.g. "Muhammad" / "Owais Raza").
  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  const wrap = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = wrap.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      // Guard clause: ensure refs exist before GSAP runs
      if (!lines.current || !photo.current || !copy.current || !cta.current || !panel.current)
        return;

      const roleEls = gsap.utils.toArray<HTMLElement>("[data-role-line]", lines.current);
      const badgeEls = gsap.utils.toArray<HTMLElement>("[data-badge-item]", photo.current);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(copy.current, { autoAlpha: 0, y: -60, filter: "blur(10px)" }, 0)
        .to(cta.current, { autoAlpha: 0, y: 40, filter: "blur(10px)" }, 0)
        .to(
          photo.current,
          {
            xPercent: -72,
            yPercent: 32,
            scale: 1.25,
            rotateZ: 2,
            rotateY: 354,
            duration: 1,
            ease: "power2.inOut",
          },
          0,
        )
        .fromTo(
          panel.current,
          { autoAlpha: 0, x: 80, filter: "blur(12px)" },
          { autoAlpha: 1, x: 0, filter: "blur(0px)" },
          0.35,
        );

      roleEls.forEach((el, i) => {
        const badge = badgeEls[i];
        const at = 0.55 + i * 0.55;

        tl.fromTo(
          el,
          { autoAlpha: 0, yPercent: 80, skewY: 6, filter: "blur(8px)" },
          { autoAlpha: 1, yPercent: 0, skewY: 0, filter: "blur(0px)", duration: 0.3 },
          at,
        );

        if (badge) {
          tl.fromTo(
            badge as HTMLElement,
            { autoAlpha: 0, scale: 0.6, y: -15, rotate: -10 },
            { autoAlpha: 1, scale: 1, y: 0, rotate: 0, duration: 0.35, ease: "back.out(1.7)" },
            at,
          );
        }

        if (i < roleEls.length - 1) {
          tl.to(
            el,
            { autoAlpha: 0, yPercent: -80, skewY: -6, filter: "blur(8px)", duration: 0.28 },
            at + 0.35,
          );
          if (badge) {
            tl.to(
              badge as HTMLElement,
              { autoAlpha: 0, scale: 0.6, y: 15, rotate: 10, duration: 0.28 },
              at + 0.35,
            );
          }
        }
      });
    });

    return () => mm.revert();
  }, [roles.length, profile.photo]);
  return (
    <section ref={wrap} className="relative w-full overflow-hidden">
      <div className="flex min-h-svh w-full items-center justify-center px-4 sm:px-8 lg:px-12 py-12 md:py-0">
        <div className="relative mx-auto grid w-full max-w-360 place-items-center">
          <div
            ref={photo}
            style={{ willChange: "transform", transformStyle: "preserve-3d" }}
            className="relative z-10 mb-2 mt-4 h-[clamp(11rem,26vw,22rem)] w-[clamp(11rem,26vw,22rem)] shrink-0 group"
          >
            <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500/30 via-purple-500/20 to-primary/40 blur-xl transition-all duration-500" />
            <div className="relative h-full w-full -rotate-6 overflow-hidden rounded-[2.5rem] border-2 border-primary/40 bg-surface-high/80 p-2 shadow-2xl backdrop-blur-md">
              <img
                src={profile.photo}
                alt="Muhammad Owais Raza"
                className="h-full w-full rounded-[2rem] object-cover"
              />
            </div>

            <div className="pointer-events-none absolute -right-4 -top-4 z-30 hidden md:block">
              {roles.map((r) => {
                const badge = ROLE_BADGES[r] ?? ROLE_BADGES["Developer"]!;
                return (
                  <div
                    key={r}
                    data-badge-item
                    className="absolute right-0 top-0 flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-background/90 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xl shadow-xl opacity-0"
                  >
                    {badge.icon}
                    <div className="flex flex-col">
                      <span className="mono-label text-[8px] sm:text-[9px] uppercase tracking-wider text-primary font-bold">
                        {badge.label}
                      </span>
                      <span className="text-[11px] sm:text-xs font-black tracking-tight text-foreground">
                        {r}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            ref={copy}
            className="relative z-20 text-center -mt-6 sm:-mt-10 pointer-events-none w-full px-2"
            style={{ willChange: "transform, opacity" }}
          >
            {" "}
            <SplitHeading
              as="h1"
              type="chars"
              stagger={0.026}
              className="font-display text-[clamp(2.5rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em]"
            >
              {firstName}
            </SplitHeading>
            <SplitHeading
              as="h1"
              type="chars"
              stagger={0.026}
              delay={0.1}
              className="text-outline font-display text-[clamp(2.5rem,8.5vw,7.5rem)] font-black uppercase leading-[0.86] tracking-[-0.045em]"
            >
              {lastName}
            </SplitHeading>
          </div>

          <div
            ref={cta}
            className="relative z-30 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 w-full max-w-md px-4 pointer-events-auto"
          >
            <Link
              to="/contact"
              data-magnetic
              className="mono-label rounded-full bg-primary px-6 py-3 sm:px-10 sm:py-4 text-primary-foreground shadow-(--glow-cyan) transition-transform hover:scale-105 text-xs sm:text-sm"
            >
              Contact Me
            </Link>

            <a
              href={profile.cvUrl || undefined}
              download={profile.cvUrl ? "Muhammad_Owais_Raza_CV.pdf" : undefined}
              data-magnetic
              aria-disabled={!profile.cvUrl}
              className={`mono-label rounded-full border border-primary/40 bg-surface/80 px-6 py-3 sm:px-8 sm:py-4 text-foreground backdrop-blur-md transition-all hover:border-primary hover:bg-primary/10 hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm flex-1 sm:flex-none whitespace-nowrap ${
                profile.cvUrl ? "" : "pointer-events-none opacity-40"
              }`}
            >
              <span>Download CV</span>
              <svg
                className="h-4 w-4 text-primary shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
          </div>

          <div
            ref={panel}
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-1/2 flex-col justify-center px-6 opacity-0 md:flex"
            style={{ willChange: "transform, opacity" }}
          >
            <div className="glass relative overflow-hidden rounded-3xl border border-primary/20 p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="mono-label text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Who I am
                </span>
                <span className="mono-label text-xs text-muted-foreground/70">
                  [ SYSTEM_ROLES ]
                </span>
              </div>

              <div ref={lines} className="relative my-8 h-20 overflow-hidden">
                {roles.map((r, idx) => (
                  <div
                    key={r}
                    data-role-line
                    className="absolute inset-0 flex items-center gap-3 font-display text-[clamp(2rem,3.5vw,3.2rem)] font-black uppercase leading-none tracking-tight opacity-0"
                  >
                    <span className="mono-label text-base text-primary/40">0{idx + 1}</span>
                    <span>
                      I'm a <span className="text-gradient-neon">{r}</span>
                    </span>
                  </div>
                ))}
              </div>

              <p className="max-w-md text-xs leading-relaxed text-muted-foreground/90 border-t border-border/50 pt-4">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-70">
        <span className="mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
          Scroll to explore
        </span>
        <div className="h-8 w-4 rounded-full border border-muted-foreground/40 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce mx-auto" />
        </div>
      </div>
    </section>
  );
}

function RolesMobile() {
  const roles = usePortfolio((s) => s.profile.roles);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(wrap.current, {
        scrollTrigger: { trigger: wrap.current, start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative z-10 mx-auto max-w-360 px-5 pb-8 sm:px-8 md:hidden">
      {roles.map((r, i) => (
        <Reveal key={r} delay={i * 0.06}>
          <p className="font-display text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tighter">
            I'm a <span className="text-gradient-neon">{r}</span>
          </p>
        </Reveal>
      ))}
    </section>
  );
}

function Marquee() {
  const items = usePortfolio((s) => s.profile.marquee);
  const line = `${items.join(" • ")} • `;
  const comp = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(comp.current, {
        scrollTrigger: { trigger: comp.current, start: "top 95%" },
        y: 50,
        opacity: 0,
        rotateX: -10,
        duration: 0.8,
        ease: "power3.out",
      });
    }, comp);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={comp}
      className="relative z-10 overflow-hidden border-y border-border bg-surface/40 py-6"
    >
      <div className="flex w-max animate-marquee" style={{ willChange: "transform" }}>
        {[0, 1].map((i) => (
          <span
            key={i}
            className="whitespace-nowrap px-6 font-display text-2xl font-black uppercase tracking-tight text-muted-foreground/25 sm:text-4xl"
          >
            {line.repeat(2)}
          </span>
        ))}
      </div>
    </section>
  );
}

function StatsBand() {
  const stats = usePortfolio((s) => s.profile.stats);
  const hydrated = useHydrated();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(".stat-card-anim", {
        scrollTrigger: { trigger: wrap.current, start: "top 85%" },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative z-10 mx-auto max-w-360 px-5 py-24 sm:px-8 lg:px-12">
      <DrawnDivider className="mb-16" />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {(hydrated ? stats : stats.slice(0, 4)).map((s, i) => (
          <div key={s.id} className="stat-card-anim">
            <Reveal delay={i * 0.06}>
              <div className="glass glass-hover h-full rounded-3xl p-7">
                <p className="font-display text-5xl font-black tracking-tighter text-gradient-neon">
                  {s.value}
                </p>
                <p className="mono-label mt-4 text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

function HorizontalShowcase() {
  const projects = usePortfolio((s) => s.projects);
  const hydrated = useHydrated();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = wrap.current;
    const el = track.current;
    if (!section || !el) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => el.scrollWidth - window.innerWidth + 96;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-h-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0.35, scale: 0.94, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 92%",
              end: "left 55%",
              scrub: true,
            },
          },
        );
      });

      return () => {
        tween.kill();
      };
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [hydrated, projects.length]);

  return (
    <section ref={wrap} className="relative z-10 md:h-svh md:overflow-hidden">
      <div className="flex h-full flex-col justify-center py-20 md:py-0">
        <div
          ref={track}
          className="flex flex-col gap-8 px-5 sm:px-8 md:w-max md:flex-row md:items-center md:gap-10 md:px-12 w-full max-w-full"
        >
          <div className="shrink-0 md:w-[38vw]">
            <span className="mono-label text-primary">Selected artifacts</span>
            <SplitHeading
              type="lines"
              className="mt-4 font-display text-[clamp(2.25rem,6vw,4.5rem)] font-black uppercase leading-[0.9] tracking-tighter"
            >
              {`Projects\n(001—00${Math.min(projects.length, 9)})`}
            </SplitHeading>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Live thumbnails render straight from production URLs. Scroll sideways through the
              gallery.
            </p>
            <DrawnBracket className="mt-8 h-20 w-20" />
          </div>

          {projects.map((p, i) => (
            <article
              key={p.id}
              data-h-card
              data-magnetic
              className="glass glass-hover group shrink-0 rounded-3xl p-4 w-full sm:w-[85vw] md:w-[42vw]"
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface-high">
                <ProjectThumb
                  project={p}
                  eager={i === 0}
                  className="h-full w-full grayscale transition-all duration-700 group-hover:grayscale-0"
                />
                <span className="mono-label absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4 px-2 pb-2">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-xl sm:text-2xl font-black uppercase tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mono-label mt-2 truncate text-muted-foreground">
                    {p.category} · {p.year}
                  </p>
                </div>
                <Link
                  to="/projects"
                  aria-label={`See ${p.title}`}
                  className="shrink-0 rounded-full border border-border p-3 text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary"
                >
                  ↗
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(".closing-card-anim", {
        scrollTrigger: { trigger: wrap.current, start: "top 85%" },
        scale: 0.9,
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power3.out",
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative z-10 mx-auto max-w-360 px-5 py-28 sm:px-8 lg:px-12">
      <Parallax>
        <div className="closing-card-anim glass overflow-hidden rounded-[2.5rem] p-6 sm:p-14">
          <SplitHeading
            type="lines"
            className="font-display text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter"
          >
            {`Have something\nworth building?`}
          </SplitHeading>
          <Reveal delay={0.1} className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                data-magnetic
                className="mono-label rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-(--glow-cyan)"
              >
                Open the terminal
              </Link>
              <Link
                to="/about"
                className="mono-label text-muted-foreground underline-offset-8 transition-colors hover:text-primary hover:underline"
              >
                More about the process
              </Link>
            </div>
          </Reveal>
        </div>
      </Parallax>
    </section>
  );
}

function Home() {
  return (
    <>
      <HeroSequence />
      <RolesMobile />
      <Marquee />
      <StatsBand />
      <HorizontalShowcase />
      <TechMarquee />
      <MediaPortfolio />
      <ClosingCta />
    </>
  );
}
