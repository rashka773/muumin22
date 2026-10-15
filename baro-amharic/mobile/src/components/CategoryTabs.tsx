import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Category, CATEGORY_LABELS } from "@/types/lesson";
import { colors } from "@/theme/colors";

const CATEGORIES: Category[] = ["erayo", "weedho", "wadahadal", "naxwe"];

interface Props {
  active: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryTabs({ active, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <TouchableOpacity
            key={category}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onSelect(category)}
          >
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {CATEGORY_LABELS[category].split(" ")[0]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 16 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  tabActive: { backgroundColor: colors.gold },
  label: { color: colors.textMuted, fontWeight: "600", fontSize: 13 },
  labelActive: { color: colors.background },
});
