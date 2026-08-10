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
