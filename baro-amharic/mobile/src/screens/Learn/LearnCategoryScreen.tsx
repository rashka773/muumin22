import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import BrandHeader from "@/components/BrandHeader";
import LessonCard from "@/components/LessonCard";
import { Category, CATEGORY_LABELS } from "@/types/lesson";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function LearnCategoryScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const category: Category = route.params?.category ?? "erayo";

  const { getLessonsByCategory } = useLessons();
  const { completedLessonIds } = useProgress();
  const lessons = getLessonsByCategory(category);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.categoriesButton}
          onPress={() => navigation.navigate("Categories")}
          accessibilityRole="button"
          accessibilityLabel="Back to all categories"
        >
          <MaterialCommunityIcons name="arrow-left" size={18} color={colors.accentGreen} />
          <Text style={styles.categoriesButtonText}>All categories</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{CATEGORY_LABELS[category]}</Text>
      </View>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LessonCard
            lesson={item}
            completed={completedLessonIds.includes(item.id)}
            onPress={() => navigation.navigate("Lesson", { lessonId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No lessons in this category yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 6 },
  categoriesButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", marginBottom: 8 },
  categoriesButtonText: { color: colors.accentGreen, fontSize: 14, fontWeight: "700", marginLeft: 6 },
  title: { ...typography.title, color: colors.cream },
  list: { padding: 20, paddingTop: 8 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
});
