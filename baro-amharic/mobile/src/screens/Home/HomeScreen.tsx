import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import BrandHeader from "@/components/BrandHeader";
import ProgressBar from "@/components/ProgressBar";
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS } from "@/data/categoryPresentation";
import { CATEGORY_LABELS, Category } from "@/types/lesson";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const CATEGORIES: Category[] = ["erayo", "weedho", "wadahadal", "naxwe"];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { lessons } = useLessons();
  const { completedLessonIds, streakCount } = useProgress();

  const progress = lessons.length === 0 ? 0 : Math.min(1, completedLessonIds.length / lessons.length);
  const dailyLesson = lessons[0];
  const completedCount = Math.min(completedLessonIds.length, lessons.length);
  const progressPercent = Math.round(progress * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <View>
                <Text style={styles.streakLabel}>DAILY STREAK</Text>
                <Text style={styles.streakValue}>
                  {streakCount} {streakCount === 1 ? "Day" : "Days"} Streak
                </Text>
              </View>
            </View>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{progressPercent}%</Text>
            </View>
          </View>

          <View style={styles.progressSummary}>
            <Text style={styles.progressTitle}>Lessons completed</Text>
            <Text style={styles.progressCount}>
              {completedCount} <Text style={styles.progressTotal}>/ {lessons.length}</Text>
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>

        {dailyLesson ? (
          <View style={styles.dailyCard}>
            <View style={styles.dailyTopRow}>
              <View style={styles.dailyBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.dailyLabel}>TODAY'S LESSON</Text>
              </View>
              <Text style={styles.dailyCategory}>{CATEGORY_LABELS[dailyLesson.category].split(" (")[0]}</Text>
            </View>

            <Text style={styles.dailyAmharic} numberOfLines={2}>
              {dailyLesson.amharic}
            </Text>
            <Text style={styles.dailyTitle}>{dailyLesson.title}</Text>
            <Text style={styles.dailyDetails}>
              {dailyLesson.pronunciation} <Text style={styles.detailSeparator}>•</Text> {dailyLesson.somali}
            </Text>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate("Lesson", { lessonId: dailyLesson.id })}
              accessibilityRole="button"
              accessibilityLabel={`Start lesson: ${dailyLesson.title}`}
            >
              <Text style={styles.startButtonText}>Start lesson</Text>
              <Text style={styles.startButtonIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionSubtitle}>Qaybaha</Text>
        </View>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryRow}
            onPress={() =>
              navigation.navigate("Learn", {
                screen: "LearnRoot",
                params: { screen: category, params: { category } },
              })
            }
            accessibilityRole="button"
            accessibilityLabel={`Open ${CATEGORY_LABELS[category]}`}
          >
            <View style={styles.categoryIcon}>
              <MaterialCommunityIcons name={CATEGORY_ICONS[category]} size={30} color={colors.gold} />
            </View>
            <View style={styles.categoryInfo}>
              <View style={styles.categoryTitleRow}>
                <Text style={styles.categoryText}>{CATEGORY_LABELS[category].split(" (")[0]}</Text>
                <Text style={styles.categoryTranslation}>
                  {CATEGORY_LABELS[category].match(/\((.+)\)/)?.[1]}
                </Text>
              </View>
              <Text style={styles.categoryDescription}>
                {CATEGORY_DESCRIPTIONS[category]} <Text style={styles.detailSeparator}>•</Text>{" "}
                {lessons.filter((lesson) => lesson.category === category).length} lessons
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 32 },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(63, 163, 114, 0.55)",
    padding: 16,
    marginBottom: 18,
  },
  progressTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardAlt,
    borderWidth: 1,
    borderColor: "rgba(184, 145, 47, 0.55)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  streakIcon: { fontSize: 22, marginRight: 10 },
  streakLabel: { color: colors.gold, fontSize: 11, fontWeight: "800" },
  streakValue: { color: colors.cream, fontSize: 14, fontWeight: "700", marginTop: 2 },
  percentBadge: {
    borderWidth: 1,
    borderColor: "rgba(0, 107, 80, 0.8)",
    backgroundColor: colors.background,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  percentText: { color: colors.accentGreen, fontWeight: "800", fontSize: 14 },
  progressSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 8,
  },
  progressTitle: { color: colors.textMuted, fontSize: 14, fontWeight: "600" },
  progressCount: { color: colors.cream, fontSize: 15, fontWeight: "800" },
  progressTotal: { color: colors.accentGreen, fontWeight: "600" },
  dailyCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(63, 163, 114, 0.7)",
  },
  dailyTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dailyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 107, 80, 0.38)",
    borderWidth: 1,
    borderColor: colors.accentGreen,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold, marginRight: 8 },
  dailyLabel: { ...typography.label, color: colors.gold },
  dailyCategory: { color: colors.accentGreen, fontSize: 12, fontWeight: "700" },
  dailyAmharic: { ...typography.heading, color: colors.cream, marginTop: 26 },
  dailyTitle: { color: colors.gold, fontSize: 20, fontWeight: "800", marginTop: 10 },
  dailyDetails: { color: colors.accentGreen, fontSize: 15, marginTop: 4, marginBottom: 22 },
  detailSeparator: { color: colors.gold, fontWeight: "700" },
  startButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  startButtonText: { color: colors.background, fontSize: 17, fontWeight: "800" },
  startButtonIcon: { color: colors.background, fontSize: 14, marginLeft: 12 },
  sectionHeading: { flexDirection: "row", alignItems: "baseline", marginBottom: 12 },
  sectionTitle: { ...typography.title, color: colors.cream },
  sectionSubtitle: { color: colors.accentGreen, fontSize: 14, marginLeft: 8 },
  categoryRow: {
    backgroundColor: colors.card,
    borderColor: "rgba(0, 107, 80, 0.8)",
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
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
  categoryTitleRow: { flexDirection: "row", alignItems: "baseline", flexWrap: "wrap" },
  categoryText: { color: colors.cream, fontSize: 16, fontWeight: "800", marginRight: 5 },
  categoryTranslation: { color: colors.accentGreen, fontSize: 15, fontWeight: "600" },
  categoryDescription: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  chevron: { color: colors.accentGreen, fontSize: 26, marginLeft: 8 },
});
