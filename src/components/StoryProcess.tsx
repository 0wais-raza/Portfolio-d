import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePortfolio } from "@/lib/store";
import { SplitHeading } from "@/components/Motion";
import { DrawnBracket, OrbitGraphic } from "@/components/DrawnSvg";

/**
 * Process — the home page "How I ship" pipeline.
 *
 * Desktop: a two-column editorial layout — header/readout on the left, the
 * phase timeline on the right. A neon rail draws itself down the timeline as
 * the visitor scrolls; each step rises and un-blurs as it enters; the phase
 * currently in view is mirrored live in the header readout (big gradient
 * index + title) and its rail dot pulses.
 *
 * Mobile: the header stacks above the timeline with the same reveals. Reduced
 * motion renders final states. Content lives in src/content/portfolio.ts
 * (`processIntro` + `process`).
 */
export function StoryProcess() {
  const process = usePortfolio((s) => s.process);
  const processIntro = usePortfolio((s) => s.processIntro);
  const wrap = useRef<HTMLElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const prevActive = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    if (!el || process.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const railFill = el.querySelector<HTMLElement>("[data-p-rail-fill]");
      if (railFill) {
        if (reduced) gsap.set(railFill, { scaleY: 1 });
        else {
          gsap.fromTo(
            railFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 55%", scrub: true },
            },
          );
        }
      }

      gsap.utils.toArray<HTMLElement>("[data-p-card]").forEach((card) => {
        if (reduced) {
          gsap.set(card, { opacity: 1, y: 0, filter: "blur(0px)" });
          const num = card.querySelector<HTMLElement>("[data-p-num]");
          if (num) gsap.set(num, { opacity: 1, x: 0 });
          return;
        }

        gsap.fromTo(
          card,
          { opacity: 0, y: 56, filter: "blur(10px)", rotateX: 10 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          },
        );

        const num = card.querySelector<HTMLElement>("[data-p-num]");
        if (num) {
          gsap.fromTo(
            num,
            { opacity: 0, x: 32, rotate: 8 },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%" },
            },
          );
          // Parallax drift — the ghost index glides past as the card crosses the viewport.
          gsap.fromTo(
            num,
            { y: 44 },
            {
              y: -44,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        // Inner stagger: title rises, body fades in slightly after.
        const title = card.querySelector<HTMLElement>("[data-p-title]");
        if (title) {
          gsap.from(title, {
            y: 24,
            autoAlpha: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        }
        const body = card.querySelector<HTMLElement>("[data-p-body]");
        if (body) {
          gsap.from(body, {
            y: 18,
            autoAlpha: 0,
            duration: 0.8,
            delay: 0.28,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        }
      });
    }, el);
    return () => ctx.revert();
  }, [process.length]);

  // Live phase readout — professional swap: the header mirrors the phase
  // currently in view with a blur/rise entrance each time it changes.
  useEffect(() => {
    registerGsap();
    const read = readout.current;
    if (!read) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(read, { autoAlpha: 1, y: 0 });
      return;
    }

    const play = () => {
      gsap.fromTo(
        read,
        { autoAlpha: 0, y: 22, rotateX: -8, filter: "blur(6px)" },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,filter,opacity",
          overwrite: "auto",
        },
      );
    };

    // First paint: wait until the readout scrolls into view before playing.
    if (prevActive.current === 0 && active === 0) {
      const st = ScrollTrigger.create({
        trigger: read,
        start: "top 90%",
        once: true,
        onEnter: play,
      });
      prevActive.current = active;
      return () => st.kill();
    }
    play();
    prevActive.current = active;
    return undefined;
  }, [active]);

  // Track which phase is currently in view → header readout + rail dot pulse.
  useEffect(() => {
    const el = wrap.current;
    if (!el || process.length === 0) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-p-card]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [process.length]);

  if (process.length === 0) return null;
  const current = process[Math.min(active, process.length - 1)]!;

  return (
    <section
      ref={wrap}
      className="relative z-10 mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:gap-20">
        {/* Header + live phase readout (desktop) */}
        <div className="relative">
          <OrbitGraphic className="pointer-events-none absolute -top-8 right-0 hidden h-44 w-44 lg:block" />
          <span className="mono-label text-primary">02 — The method</span>
          <SplitHeading
            type="lines"
            className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter"
          >
            How I ship
          </SplitHeading>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {processIntro}
          </p>

          <div
            className="mt-12 hidden lg:block"
            aria-live="polite"
            style={{ perspective: "900px" }}
          >
            <div ref={readout} style={{ willChange: "transform, opacity, filter" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-6xl font-black leading-none text-gradient-neon">
                  {current.step}
                </span>
                <span className="mono-label text-muted-foreground/70">
                  / {String(process.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-black uppercase tracking-tight">
                {current.title}
              </p>
              <div className="mt-6 h-px w-40 bg-gradient-to-r from-primary to-transparent" />
            </div>
          </div>

          <DrawnBracket className="mt-14 hidden h-16 w-16 opacity-60 lg:block" />
        </div>

        {/* Timeline */}
        <div className="relative" style={{ perspective: "1400px" }}>
          <div aria-hidden className="absolute bottom-4 left-6 top-4 w-px bg-border">
            <div
              data-p-rail-fill
              className="h-full w-full origin-top scale-y-0 bg-primary shadow-[var(--glow-cyan)]"
            />
          </div>

          <div className="space-y-16">
            {process.map((p, i) => (
              <div key={p.id} data-p-card className="relative pl-16 sm:pl-20">
                <span
                  data-p-dot
                  aria-hidden
                  className={`absolute left-6 top-1.5 grid h-3.5 w-3.5 -translate-x-1/2 place-items-center rounded-full border-2 transition-all duration-500 ${
                    active === i
                      ? "animate-pulse border-primary bg-primary shadow-[var(--glow-cyan)]"
                      : "border-primary/40 bg-background"
                  }`}
                >
                  {/* Radar ring — spins while the phase is in view. */}
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    aria-hidden
                    className={`pointer-events-none absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
                      active === i
                        ? "animate-[orbit-spin_6s_linear_infinite] opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="var(--primary)"
                      strokeWidth="1"
                      strokeDasharray="3 5"
                      strokeLinecap="round"
                      opacity="0.55"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="var(--primary)"
                      strokeWidth="1.5"
                      strokeDasharray="24 64"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                  </svg>
                </span>
                <div className="relative">
                  <span
                    data-p-num
                    aria-hidden
                    className="pointer-events-none absolute -top-1 right-0 hidden select-none font-display text-6xl font-black leading-none tracking-tighter text-outline opacity-30 md:block"
                  >
                    {p.step}
                  </span>
                  <p className="mono-label text-primary/80">Phase {p.step}</p>
                  <h3
                    data-p-title
                    className="mt-2 font-display text-2xl font-black uppercase tracking-tight sm:text-3xl"
                  >
                    {p.title}
                  </h3>
                  <p
                    data-p-body
                    className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
