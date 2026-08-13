import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

/**
 * Line-art SVG that draws itself on scroll via stroke-dashoffset.
 */
export function DrawnDivider({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    registerGsap();
    const svg = ref.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path, circle"));
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const len =
          p instanceof SVGPathElement
            ? p.getTotalLength()
            : 2 * Math.PI * Number((p as unknown as SVGCircleElement).r.baseVal.value);
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: svg,
            start: "top 92%",
            end: "bottom 45%",
            scrub: 0.8,
          },
        });
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 90"
      fill="none"
      aria-hidden
      className={`w-full text-primary ${className}`}
    >
      <path
        d="M0 60 H 320 L 360 20 L 400 60 H 780 L 812 44 L 844 60 H 1200"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="360" cy="20" r="5" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="812" cy="44" r="3.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M40 78 H 1160" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.35" />
    </svg>
  );
}

/** Animated corner bracket line-art used to frame sections. */
export function DrawnBracket({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    registerGsap();
    const svg = ref.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const ctx = gsap.context(() => {
      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.2,
          delay: i * 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: svg, start: "top 90%" },
        });
      });
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={`text-primary ${className}`}
    >
      <path d="M2 40 V2 H40" stroke="currentColor" strokeWidth="2" />
      <path d="M118 80 V118 H80" stroke="currentColor" strokeWidth="2" />
      <path d="M60 24 V96" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M24 60 H96" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}

/**
 * Radar/orbit graphic — the concentric rings draw themselves on scroll while a
 * dashed arc + satellites orbit forever (pure CSS spin). Used as a decorative
 * motion-graphics element behind section headers.
 */
export function OrbitGraphic({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    registerGsap();
    const svg = ref.current;
    if (!svg) return;
    const circles = Array.from(svg.querySelectorAll<SVGCircleElement>("circle[data-draw]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(circles, { strokeDashoffset: 0 });
        gsap.set(svg, { opacity: 0.9, scale: 1 });
        return;
      }
      circles.forEach((c, i) => {
        const len = 2 * Math.PI * Number(c.r.baseVal.value);
        gsap.set(c, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(c, {
          strokeDashoffset: 0,
          ease: "none",
          delay: i * 0.08,
          scrollTrigger: { trigger: svg, start: "top 92%", end: "bottom 60%", scrub: 0.8 },
        });
      });
      // Gentle settle: the whole mark scales up + brightens as it enters.
      gsap.fromTo(
        svg,
        { scale: 0.86, opacity: 0.25 },
        {
          scale: 1,
          opacity: 0.9,
          ease: "none",
          scrollTrigger: { trigger: svg, start: "top 96%", end: "top 55%", scrub: 0.6 },
        },
      );
    }, svg);
    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden
      className={`text-primary ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      <circle
        data-draw
        cx="100"
        cy="100"
        r="82"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <circle
        data-draw
        cx="100"
        cy="100"
        r="58"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.32"
      />
      <circle
        data-draw
        cx="100"
        cy="100"
        r="30"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.7"
      />
      <g
        style={{ transformOrigin: "100px 100px" }}
        className="animate-[orbit-spin_16s_linear_infinite]"
      >
        <path
          d="M 100 18 A 82 82 0 0 1 178 74"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        <circle cx="100" cy="18" r="3.5" fill="currentColor" />
      </g>
      <g
        style={{ transformOrigin: "100px 100px" }}
        className="animate-[orbit-spin_24s_linear_infinite_reverse]"
      >
        <circle cx="160" cy="40" r="3" fill="var(--violet)" />
        <circle cx="72" cy="150" r="2" fill="currentColor" opacity="0.8" />
      </g>
    </svg>
  );
}
