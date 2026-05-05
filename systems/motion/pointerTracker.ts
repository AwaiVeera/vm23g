import { Platform } from "react-native";
import { useEffect } from "react";
import { useMotionBus } from "./motionBus";

export const usePointerTracker = () => {
  const setPointer = useMotionBus((s) => s.setPointer);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let raf = 0;

    const handler = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        setPointer(x, y);
      });
    };

    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, [setPointer]);
};
