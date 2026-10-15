import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import BrandHeader from "@/components/BrandHeader";
import LessonCard from "@/components/LessonCard";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function SavedScreen() {
  const navigation = useNavigation<any>();
  const { lessons } = useLessons();
  const { savedWordIds } = useProgress();

  const savedLessons = lessons.filter((l) => savedWordIds.includes(l.id));

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <View style={styles.header}>
        <Text style={styles.title}>Saved</Text>
        <Text style={styles.subtitle}>Words and expressions you've saved to review</Text>
      </View>
      <FlatList
        data={savedLessons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LessonCard lesson={item} onPress={() => navigation.navigate("Lesson", { lessonId: item.id })} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nothing saved yet — tap ☆ Save on a lesson.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { ...typography.title, color: colors.cream },
  subtitle: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  list: { padding: 20, paddingTop: 8 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
});
