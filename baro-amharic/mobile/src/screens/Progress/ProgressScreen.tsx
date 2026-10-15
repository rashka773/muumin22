import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import BrandHeader from "@/components/BrandHeader";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const navigation = useNavigation<any>();
  const { lessons } = useLessons();
  const { completedLessonIds, savedWordIds, accuracy, streakCount } = useProgress();

  const wordsLearned = completedLessonIds.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Progress</Text>

        <View style={styles.grid}>
          <StatCard label="Lessons completed" value={`${completedLessonIds.length}/${lessons.length}`} />
          <StatCard label="Words learned" value={String(wordsLearned)} />
          <StatCard label="Quiz accuracy" value={`${accuracy}%`} />
          <StatCard label="Daily streak" value={`${streakCount} 🔥`} />
        </View>

        <TouchableOpacity style={styles.savedButton} onPress={() => navigation.navigate("Saved")}>
          <Text style={styles.savedButtonText}>View saved words ({savedWordIds.length})</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 48 },
  title: { ...typography.heading, color: colors.cream, marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  statCard: {
    width: "48%",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  statValue: { color: colors.gold, fontSize: 24, fontWeight: "800", marginBottom: 6 },
  statLabel: { color: colors.textMuted, fontSize: 13 },
  savedButton: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  savedButtonText: { color: colors.cream, fontWeight: "600" },
});
