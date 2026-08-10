import { useEffect, useState } from "react";

/** True only after client mount — use before reading persisted store state. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
