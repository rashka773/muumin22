import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

interface Props {
  label: string;
  state: "default" | "selected" | "correct" | "incorrect";
  onPress: () => void;
  disabled?: boolean;
}

export default function QuizOption({ label, state, onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.option, styles[state]]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  default: {},
  selected: { borderColor: colors.gold },
  correct: { borderColor: colors.success, backgroundColor: "rgba(76, 175, 109, 0.18)" },
  incorrect: { borderColor: colors.error, backgroundColor: "rgba(217, 105, 95, 0.18)" },
  label: { color: colors.cream, fontSize: 16, fontWeight: "600" },
});
