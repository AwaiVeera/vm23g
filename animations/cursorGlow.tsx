import { Platform, StyleSheet, View } from "react-native";
import { usePointer } from "@/systems/motion/motionBus";

export const CursorGlow = () => {
  const { x, y } = usePointer();

  if (Platform.OS !== "web") return null;

  const style = {
    transform: [
      { translateX: x * window.innerWidth - 200 },
      { translateY: y * window.innerHeight - 200 },
    ],
  };

  return <View style={[styles.base, style]} />;
};

const styles = StyleSheet.create({
  base: {
    position: "fixed" as any,
    width: 400,
    height: 400,
    borderRadius: 999,
    opacity: 0.12,
    backgroundColor: "#738253",
    filter: "blur(120px)" as any,
    zIndex: 1,
    pointerEvents: "none",
  },
});
