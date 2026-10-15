import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BrandHeader from "@/components/BrandHeader";
import { useLessons } from "@/context/LessonContext";
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS } from "@/data/categoryPresentation";
import { Category, CATEGORY_LABELS } from "@/types/lesson";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const CATEGORIES: Category[] = ["erayo", "weedho", "wadahadal", "naxwe"];

export default function LearnCategoriesScreen() {
  const navigation = useNavigation<any>();
  const { lessons } = useLessons();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>LEARN</Text>
          <Text style={styles.title}>Choose a category</Text>
          <Text style={styles.subtitle}>Pick a topic to explore its lessons.</Text>
        </View>

        {CATEGORIES.map((category) => {
          const label = CATEGORY_LABELS[category];
          const lessonCount = lessons.filter((lesson) => lesson.category === category).length;

          return (
            <TouchableOpacity
              key={category}
              style={styles.categoryRow}
              onPress={() => navigation.navigate(category, { category })}
              accessibilityRole="button"
              accessibilityLabel={`Open ${label}`}
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons name={CATEGORY_ICONS[category]} size={30} color={colors.gold} />
              </View>
              <View style={styles.categoryInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.categoryTitle}>{label.split(" (")[0]}</Text>
                  <Text style={styles.translation}>{label.match(/\((.+)\)/)?.[1]}</Text>
                </View>
                <Text style={styles.description}>
                  {CATEGORY_DESCRIPTIONS[category]} <Text style={styles.separator}>•</Text>{" "}
                  {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 32 },
  heading: { marginBottom: 20 },
  eyebrow: { color: colors.gold, fontSize: 12, fontWeight: "800", marginBottom: 6 },
  title: { ...typography.title, color: colors.cream },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: 6 },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(0, 107, 80, 0.8)",
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: "rgba(0, 107, 80, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(0, 107, 80, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  categoryInfo: { flex: 1, minWidth: 0 },
  titleRow: { flexDirection: "row", alignItems: "baseline", flexWrap: "wrap" },
  categoryTitle: { color: colors.cream, fontSize: 16, fontWeight: "800", marginRight: 5 },
  translation: { color: colors.accentGreen, fontSize: 15, fontWeight: "600" },
  description: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  separator: { color: colors.gold, fontWeight: "700" },
  chevron: { color: colors.accentGreen, fontSize: 26, marginLeft: 8 },
});