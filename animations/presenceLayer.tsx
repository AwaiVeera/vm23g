import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

const NODE_COUNT = 6;

export const PresenceLayer = () => {
  const [nodes, setNodes] = useState(
    Array.from({ length: NODE_COUNT }).map(() => ({
      x: Math.random(),
      y: Math.random(),
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          x: Math.min(Math.max(n.x + (Math.random() - 0.5) * 0.02, 0), 1),
          y: Math.min(Math.max(n.y + (Math.random() - 0.5) * 0.02, 0), 1),
        }))
      );
    }, 1200);

    return () => clearInterval(id);
  }, []);

  return (
    <View style={[StyleSheet.absoluteFill, styles.layer]}>
      {nodes.map((n, i) => (
        <View
          key={i}
          style={[
            styles.node,
            {
              left: `${n.x * 100}%`,
              top: `${n.y * 100}%`,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    pointerEvents: "none",
  },
  node: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#738253",
    opacity: 0.4,
  },
});
