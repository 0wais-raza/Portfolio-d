import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, ScrollTrigger, registerGsap } from "@/lib/gsap";

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
};

/** GSAP SplitText headline: units stagger up from behind overflow masks. */
export function SplitHeading({
  children,
  as: Tag = "h2",
  className = "",
  type = "lines",
  delay = 0,
  stagger = 0.09,
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    // SplitText rewrites the DOM of its target. If React owned those children it
    // would later try to removeChild nodes SplitText replaced (NotFoundError /
    // blank screen). The inner span is rendered via dangerouslySetInnerHTML, so
    // React never reconciles inside it.
    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1 });
      split = new SplitText(inner, {
        type: type === "chars" ? "chars,words" : type,
        linesClass: "split-line",
        mask: type,
      });
      const targets = type === "lines" ? split.lines : type === "words" ? split.words : split.chars;

      gsap.from(targets, {
        yPercent: 118,
        rotate: type === "chars" ? 4 : 0,
        duration: 1.15,
        delay,
        ease: "expo.out",
        stagger,
        scrollTrigger: { trigger: el, start },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [children, type, delay, stagger, start]);

  const escaped = children.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return (
    <Tag
      ref={ref as never}
      className={`invisible ${className}`}
      dangerouslySetInnerHTML={{ __html: `<span style="display:block">${escaped}</span>` }}
    />
  );
}

/** Generic scroll reveal: fade + rise + blur out of focus. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 44,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, skewY: 2, scale: 0.98, filter: "blur(14px)" },
        {
          autoAlpha: 1,
          y: 0,
          skewY: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div
      ref={ref}
      className={`invisible ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}

/** Parallax wrapper: scrubbed translate + scale as the element crosses viewport. */
export function Parallax({
  children,
  className = "",
  amount = 80,
  scale = 1.06,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: amount, scale },
        {
          y: -amount,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [amount, scale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
