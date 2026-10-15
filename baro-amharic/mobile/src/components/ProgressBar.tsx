import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

interface Props {
  progress: number; // 0-1
}

export default function ProgressBar({ progress }: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
});
