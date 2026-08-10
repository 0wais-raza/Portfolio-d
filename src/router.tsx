import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { releasePinnedScrollTriggers } from "@/lib/gsap";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // GSAP pin-spacers move pinned sections (the home hero / horizontal gallery)
  // out of their React-managed parents. Revert them before the router removes
  // the outgoing page's DOM, otherwise React's removeChild throws NotFoundError
  // and the error boundary shows the "This page didn't load" screen on every
  // client-side navigation. Hash-only jumps within a page are left untouched.
  router.subscribe("onBeforeNavigate", ({ pathChanged }) => {
    if (typeof window === "undefined" || !pathChanged) return;
    releasePinnedScrollTriggers();
  });

  return router;
};
