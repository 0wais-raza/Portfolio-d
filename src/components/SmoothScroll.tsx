import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, ScrollSmoother, registerGsap } from "@/lib/gsap";

/**
 * GSAP ScrollSmoother. Only children rendered inside #smooth-content are
 * transformed — fixed/sticky chrome (nav, cursor, overlays, toasts) must stay
 * outside this component or it will drift when the content wrapper animates.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    registerGsap();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.25,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: true,
    });
    smootherRef.current = smoother;
    ScrollTrigger.refresh();

    return () => {
      smoother.kill();
      smootherRef.current = null;
    };
  }, []);

  // Keep triggers accurate when fonts/images settle after first paint.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}

/** Refresh every ScrollTrigger once async database content lands. */
export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  requestAnimationFrame(() => {
    gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
  });
}
