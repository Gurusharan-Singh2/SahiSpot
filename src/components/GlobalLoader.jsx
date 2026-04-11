import { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

const GlobalLoader = () => {
  const activeQueries = useIsFetching();
  const activeMutations = useIsMutating();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isActive = activeQueries > 0 || activeMutations > 0;

    if (!isActive) {
      setVisible(false);
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setVisible(true);
    }, 150);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeMutations, activeQueries]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/35 backdrop-blur-[2px]">
      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/90 px-5 py-3 text-sm font-medium text-white shadow-[0_24px_60px_-28px_rgba(15,23,42,0.8)]">
        <Spinner className="size-5 text-orange-300" />
        <span>Loading...</span>
      </div>
    </div>
  );
}

export default GlobalLoader;
