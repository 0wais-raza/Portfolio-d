import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Glowing magnetic cursor: a cyan dot that follows instantly and a ring that
 * trails, scales and locks onto [data-magnetic] elements.
 */
export function MagneticCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    document.documentElement.classList.add("cursor-none-desktop");
    gsap.set([dotEl, ringEl], { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(ringEl, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(ringEl, "y", { duration: 0.55, ease: "power3" });
    const dx = gsap.quickTo(dotEl, "x", { duration: 0.09, ease: "power3" });
    const dy = gsap.quickTo(dotEl, "y", { duration: 0.09, ease: "power3" });

    let locked: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.3, overwrite: "auto" });

      const target = (e.target as HTMLElement | null)?.closest?.(
        "[data-magnetic]",
      ) as HTMLElement | null;

      if (target) {
        if (locked !== target) {
          locked = target;
          gsap.to(ringEl, {
            width: 76,
            height: 76,
            borderWidth: 1,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dotEl, { scale: 0.4, duration: 0.3 });
        }
        const r = target.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        xTo(cx + (e.clientX - cx) * 0.28);
        yTo(cy + (e.clientY - cy) * 0.28);
        gsap.to(target, {
          x: (e.clientX - cx) * 0.18,
          y: (e.clientY - cy) * 0.24,
          duration: 0.6,
          ease: "power3.out",
        });
      } else {
        if (locked) {
          gsap.to(locked, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
          locked = null;
          gsap.to(ringEl, {
            width: 34,
            height: 34,
            duration: 0.4,
            ease: "power3.out",
          });
          gsap.to(dotEl, { scale: 1, duration: 0.3 });
        }
        xTo(e.clientX);
        yTo(e.clientY);
      }
      dx(e.clientX);
      dy(e.clientY);
    };

    const leave = () => gsap.to([dotEl, ringEl], { opacity: 0, duration: 0.2 });
    const down = () => gsap.to(ringEl, { scale: 0.8, duration: 0.2 });
    const up = () => gsap.to(ringEl, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);

    return () => {
      document.documentElement.classList.remove("cursor-none-desktop");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
      if (locked) gsap.set(locked, { x: 0, y: 0 });
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2 w-2 rounded-full bg-primary opacity-0 shadow-[0_0_18px_var(--primary)] md:block"
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-[34px] w-[34px] rounded-full border border-primary/60 opacity-0 shadow-[0_0_30px_-8px_var(--primary)] md:block"
      />
    </>
  );
}
