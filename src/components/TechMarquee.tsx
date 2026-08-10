import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { usePortfolio } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { SplitHeading, Reveal } from "@/components/Motion";
import { TechIcon } from "@/components/TechIcon";

/** Skill card with pointer-tracked 3D tilt + neon edge glow. */
function TechCard({ name, slug }: { name: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-py * 14}deg) rotateY(${px * 14}deg) translateZ(14px) scale(1.05)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      data-magnetic
      onPointerMove={tilt}
      onPointerLeave={reset}
      style={{ willChange: "transform" }}
      className="glass glass-hover group flex w-36 shrink-0 flex-col items-center gap-3 rounded-3xl p-5 transition-transform duration-300 ease-out hover:border-primary/40 hover:shadow-[var(--glow-cyan)]"
    >
      <div className="grid h-12 w-12 place-items-center">
        <TechIcon
          slug={slug}
          name={name}
          className="h-9 w-9 animate-float transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="mono-label truncate text-center text-muted-foreground transition-colors group-hover:text-primary">
        {name}
      </span>
    </div>
  );
}

/**
 * One infinite row. The row is edge-to-edge (full viewport width) so cards
 * glide in and out of view like they belong to the page — no fenced-in look.
 *
 * Seamless repeat: each of the two identical copies carries its own trailing
 * gap (`pr-4`), so the track is exactly 2× one period. Translating by -50%
 * lands the second copy precisely where the first started — no visible jump.
 */
function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: { id: string; name: string; slug: string }[];
  reverse?: boolean;
  duration: number;
}) {
  return (
    <div className="group/marquee relative overflow-hidden">
      <div
        className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center gap-4 pr-4">
            {items.map((t) => (
              <TechCard key={`${dup}-${t.id}`} name={t.name} slug={t.slug} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechMarquee() {
  const tech = usePortfolio((s) => s.tech);
  const hydrated = useHydrated();
  const list = hydrated ? tech : tech.slice(0, 12);
  const wrap = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed counter-drift: the two rows slide apart as the section passes.
  useEffect(() => {
    registerGsap();
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-row='0']",
        { xPercent: -4 },
        {
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        "[data-row='1']",
        { xPercent: 4 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [list.length]);

  if (list.length === 0) return null;

  const half = Math.ceil(list.length / 2);
  const rowA = list.slice(0, half);
  const rowB = list.slice(half).length ? list.slice(half) : list;

  return (
    <section
      id="stack"
      className="relative z-10 overflow-hidden py-24"
      aria-label="Software & stack"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <span className="mono-label text-primary">Toolbox</span>
        <SplitHeading
          type="words"
          className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter"
        >
          Software & Stack
        </SplitHeading>
      </div>

      <Reveal className="mt-12" y={30}>
        <div ref={wrap} className="space-y-4">
          <div data-row="0">
            <MarqueeRow items={rowA} duration={34} />
          </div>
          <div data-row="1">
            <MarqueeRow items={rowB} duration={42} reverse />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
