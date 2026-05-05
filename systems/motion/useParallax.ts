import { useMemo } from "react";
import { Platform } from "react-native";
import { useScrollY, usePointer } from "./motionBus";

export const useParallax = (depth = 0.1) => {
  const scrollY = useScrollY();
  const { x, y } = usePointer();

  return useMemo(() => {
    const tx = (x - 0.5) * depth * 60;
    const ty = (y - 0.5) * depth * 60 + scrollY * depth * -0.2;

    if (Platform.OS === "web") {
      return {
        transform: `translate3d(${tx}px, ${ty}px, 0)`,
      } as any;
    }

    return {
      transform: [{ translateX: tx }, { translateY: ty }],
    };
  }, [x, y, scrollY, depth]);
};
