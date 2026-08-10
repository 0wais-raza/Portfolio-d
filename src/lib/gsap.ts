import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsap() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  registered = true;
}

/**
 * GSAP `pin: true` wraps the pinned element in a `pin-spacer` div, physically
 * moving DOM nodes React still believes live under their original parent. When
 * the router tears down the outgoing page, React's removeChild() then throws
 * `NotFoundError` ("node to be removed is not a child of this node") and the
 * error boundary shows the dead-end "This page didn't load" screen.
 *
 * Call this BEFORE any route change so the DOM matches React's snapshot again.
 * Only pinned triggers are killed — plain scrub/reveal triggers (and the
 * ScrollSmoother's own trigger) never move DOM nodes, so they're left alone.
 */
export function releasePinnedScrollTriggers() {
  if (typeof window === "undefined") return;
  try {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.pin) trigger.kill();
    });
  } catch (error) {
    // Never let teardown bookkeeping break navigation itself.
    console.warn("Failed to release pinned ScrollTriggers before navigation", error);
  }
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
