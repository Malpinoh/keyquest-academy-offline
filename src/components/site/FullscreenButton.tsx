import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type FullscreenButtonProps = {
  targetRef: RefObject<HTMLElement | null>;
};

export function FullscreenButton({ targetRef }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    const target = targetRef.current;
    if (!target) return;

    try {
      if (document.fullscreenElement === target) {
        await document.exitFullscreen();
      } else {
        if (document.fullscreenElement) await document.exitFullscreen();
        await target.requestFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  }, [targetRef]);

  useEffect(() => {
    const syncFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === targetRef.current);
    };

    const handleShortcut = (event: KeyboardEvent) => {
      const isMacFullscreenShortcut = event.ctrlKey && event.metaKey && event.key.toLowerCase() === "f";
      const isF11Shortcut = event.key === "F11";

      if (!isMacFullscreenShortcut && !isF11Shortcut) return;
      if (event.repeat || event.altKey || (isMacFullscreenShortcut && event.shiftKey)) return;

      event.preventDefault();
      void toggleFullscreen();
    };

    document.addEventListener("fullscreenchange", syncFullscreen);
    window.addEventListener("keydown", handleShortcut);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreen);
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [targetRef, toggleFullscreen]);

  return (
    <div className="flex flex-col items-start gap-1">
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
      title={isFullscreen ? "Exit full screen (Esc)" : "Full screen (F11 / Ctrl+⌘+F)"}
      className="h-9 gap-2 rounded-sm border-[#9eacba] bg-white"
    >
      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      <span className="hidden sm:inline">{isFullscreen ? "Exit full screen" : "Full screen"}</span>
    </Button>
    <p className="max-w-[230px] text-[10px] leading-tight text-muted-foreground sm:text-xs">
      {isFullscreen
        ? "Press Esc to leave full screen."
        : "Click Full screen, or press F11 (Windows/Linux) · Ctrl + ⌘ + F (Mac)."}
    </p>
    </div>
  );
}
