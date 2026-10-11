import { useEffect, useState } from "react";

export type DemoPhase = "typing" | "submitting" | "accepted" | "celebrating";

export function useDemoLoop(): DemoPhase {
  const [phase, setPhase] = useState<DemoPhase>("typing");
  useEffect(() => {
    const sequence: readonly [DemoPhase, number][] = [["typing",2600],["submitting",900],["accepted",900],["celebrating",2200]];
    let index = 0;
    let timer = window.setTimeout(function advance() {
      index = (index + 1) % sequence.length;
      setPhase(sequence[index][0]);
      timer = window.setTimeout(advance, sequence[index][1]);
    }, sequence[0][1]);
    return () => window.clearTimeout(timer);
  }, []);
  return phase;
}
