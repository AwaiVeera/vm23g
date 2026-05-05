import { create } from "zustand";

type State = {
  scrollY: number;
  pointer: { x: number; y: number };
  viewport: { w: number; h: number };
  setScrollY: (y: number) => void;
  setPointer: (x: number, y: number) => void;
  setViewport: (w: number, h: number) => void;
};

export const useMotionBus = create<State>((set) => ({
  scrollY: 0,
  pointer: { x: 0.5, y: 0.5 },
  viewport: { w: 0, h: 0 },
  setScrollY: (y) => set({ scrollY: y }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setViewport: (w, h) => set({ viewport: { w, h } }),
}));

export const useScrollY = () => useMotionBus((s) => s.scrollY);
export const usePointer = () => useMotionBus((s) => s.pointer);
export const useViewport = () => useMotionBus((s) => s.viewport);
