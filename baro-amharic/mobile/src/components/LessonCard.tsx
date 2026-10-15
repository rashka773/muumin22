import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Lesson } from "@/types/lesson";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface Props {
  lesson: Lesson;
  onPress: () => void;
  completed?: boolean;
}

export default function LessonCard({ lesson, onPress, completed }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.textBlock}>
        <Text style={styles.amharic}>{lesson.amharic}</Text>
        <Text style={styles.somali}>{lesson.somali}</Text>
      </View>
      {completed ? <Text style={styles.badge}>✓</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textBlock: { flex: 1 },
  amharic: {
    color: colors.cream,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  somali: {
    color: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  badge: {
    color: colors.gold,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
});
