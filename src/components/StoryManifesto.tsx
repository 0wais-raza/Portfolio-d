import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { usePortfolio } from "@/lib/store";
import { SplitHeading } from "@/components/Motion";
import { DrawnDivider } from "@/components/DrawnSvg";

/**
 * Manifesto — the home page "thesis".
 *
 * Desktop: the statement is held on screen (pinned stage inside a tall scroll
 * wrapper) and "applies" itself in reading order — each word is fully hidden
 * until a scrubbed wave rises and settles it into the foreground, with a neon
 * wash + glow trailing a beat behind, so the text materializes as you read
 * down. A ghost chapter number parallaxes behind it, a soft spotlight swells
 * as the statement fills, and a live rail/counter on the right tracks reading
 * progress.
 *
 * Mobile: no pin; the same apply + wash plays as the section scrolls past.
 * Reduced motion: everything renders in its final state.
 * Content lives in src/content/portfolio.ts (`manifesto`).
 */
export function StoryManifesto() {
  const manifesto = usePortfolio((s) => s.manifesto);
  const wrap = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const railFill = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);

  const lines = manifesto.map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const totalWords = lines.reduce((n, l) => n + (l ? l.split(" ").length : 0), 0);
  const contentKey = lines.join("|");

  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    const scrollEl = scroll.current;
    const stageEl = stage.current;
    if (!el || !scrollEl || !stageEl || totalWords === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = gsap.utils.toArray<HTMLElement>("[data-m-word]", el);

    if (reduced) {
      gsap.set(words, {
        opacity: 1,
        y: 0,
        scale: 1,
        color: "var(--foreground)",
        textShadow: "0px 0px 0px rgba(0,0,0,0)",
      });
      gsap.set(spotlight.current, { autoAlpha: 0.5 });
      gsap.set(railFill.current, { scaleY: 1 });
      if (counter.current) counter.current.textContent = String(totalWords).padStart(2, "0");
      return;
    }

    /**
     * Seamless "apply": words are fully hidden, then materialize in reading
     * order (rise + settle) as a neon wash trails the applied wave a beat
     * later — both scrubbed against the same scroll range so the statement
     * literally types itself out as you read down.
     */
    const buildScrub = (trigger: Element, start: string, end: string) =>
      gsap.context(() => {
        gsap.set(words, {
          opacity: 0,
          y: 16,
          scale: 0.96,
          color: "var(--muted-foreground)",
          textShadow: "0px 0px 0px rgba(0,0,0,0)",
        });

        const apply = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger, start, end, scrub: 0.6 },
        });
        // Wave 1 — words rise and settle into foreground.
        apply.to(
          words,
          { opacity: 1, y: 0, scale: 1, color: "var(--foreground)", duration: 1, stagger: 0.05 },
          0,
        );
        // Wave 2 — neon wash + glow trails each applied word a beat later.
        apply.to(
          words,
          {
            color: "var(--primary)",
            textShadow: "0px 0px 16px rgba(34,211,238,0.5), 0px 0px 42px rgba(34,211,238,0.22)",
            duration: 1.1,
            stagger: 0.06,
          },
          0.35,
        );

        if (spotlight.current) {
          gsap.fromTo(
            spotlight.current,
            { autoAlpha: 0, scale: 0.9 },
            {
              autoAlpha: 0.55,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger, start, end, scrub: true },
            },
          );
        }

        if (railFill.current) {
          gsap.fromTo(
            railFill.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: { trigger, start, end, scrub: true },
            },
          );
        }

        if (counter.current) {
          const state = { v: 0 };
          gsap.to(state, {
            v: totalWords,
            ease: "none",
            scrollTrigger: { trigger, start, end, scrub: true },
            onUpdate: () => {
              if (counter.current) {
                counter.current.textContent = String(Math.round(state.v)).padStart(2, "0");
              }
            },
          });
        }

        if (ghost.current) {
          gsap.fromTo(
            ghost.current,
            { y: 80 },
            {
              y: -80,
              ease: "none",
              scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      }, el);

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      // Pin the stage (CSS sticky breaks inside ScrollSmoother) while the tall
      // wrapper passes beneath it — that full travel maps to the word scrub.
      const ctx = buildScrub(scrollEl, "top top", "bottom bottom");
      const pin = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        pin: stageEl,
        anticipatePin: 1,
      });
      return () => {
        pin.kill();
        ctx.revert();
      };
    });

    mm.add("(max-width: 767.98px)", () => {
      const ctx = buildScrub(el, "top 70%", "bottom 40%");
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [contentKey, totalWords]);

  if (totalWords === 0) return null;

  return (
    <section ref={wrap} className="relative z-10">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <DrawnDivider className="mb-16" />
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <span className="mono-label text-primary">01 — The thesis</span>
            <SplitHeading
              type="lines"
              className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter"
            >
              Manifesto
            </SplitHeading>
          </div>
          <span className="mono-label text-muted-foreground">Scroll to read</span>
        </div>
      </div>

      {/* Reading stage — the statement holds on screen while the words light up. */}
      <div ref={scroll} className="relative h-auto md:h-[260vh]">
        <div ref={stage} className="relative flex h-svh items-center overflow-hidden">
          <div
            ref={ghost}
            aria-hidden
            className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none font-display text-[20vw] font-black leading-none tracking-tighter text-outline opacity-[0.05] lg:block"
          >
            01
          </div>

          {/* Soft spotlight that swells as the statement applies. */}
          <div
            ref={spotlight}
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-[64vh] w-[72vw] rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklab, var(--primary) 22%, transparent), transparent 72%)",
            }}
          />

          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
              <div>
                {lines.map((line, li) => (
                  <p
                    key={li}
                    className="block font-display text-[clamp(1.5rem,3.4vw,3.25rem)] font-bold leading-[1.2] tracking-tight text-muted-foreground"
                  >
                    {line.split(" ").map((w, wi) => (
                      <span
                        key={`${li}-${wi}`}
                        data-m-word
                        className="mr-[0.24em] inline-block opacity-0 will-change-[opacity,transform,color]"
                      >
                        {w}
                      </span>
                    ))}
                  </p>
                ))}
              </div>

              {/* Reading progress rail (desktop) */}
              <div className="hidden h-44 w-10 flex-col items-center gap-4 md:flex">
                <span ref={counter} className="mono-label text-primary">
                  00
                </span>
                <div className="relative h-full w-px overflow-hidden bg-border">
                  <div
                    ref={railFill}
                    className="absolute inset-x-0 top-0 h-full w-full origin-top scale-y-0 bg-primary shadow-[var(--glow-cyan)]"
                  />
                </div>
                <span className="mono-label text-muted-foreground/60">
                  {String(totalWords).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
