import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { localImages } from "@/data/localMedia";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import AudioButton from "@/components/AudioButton";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

export default function LessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { lessonId } = route.params as { lessonId: string };

  const { lessons, getLessonById } = useLessons();
  const { savedWordIds, toggleSaved, completeLesson } = useProgress();

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.empty}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const isSaved = savedWordIds.includes(lesson.id);
  const categoryLessons = lessons.filter((l) => l.category === lesson.category);
  const index = categoryLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = index > 0 ? categoryLessons[index - 1] : undefined;
  const nextLesson = index < categoryLessons.length - 1 ? categoryLessons[index + 1] : undefined;

  const goToPractice = async () => {
    await completeLesson(lesson.id);
    navigation.navigate("Practice", { lessonId: lesson.id });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.amharic}>{lesson.amharic}</Text>
        <Text style={styles.pronunciation}>{lesson.pronunciation}</Text>
                {(localImages[lesson.id] || lesson.image) ? (
          <Image
            source={localImages[lesson.id] ?? { uri: lesson.image }}
            style={{ width: "100%", height: 180, borderRadius: 16, marginTop: 16, marginBottom: 8 }}
            resizeMode="cover"
          />
        ) : null}

        <View style={styles.divider} />

        <Text style={styles.label}>SOMALI</Text>
        <Text style={styles.value}>{lesson.somali}</Text>

        {lesson.english ? (
          <>
            <Text style={styles.label}>ENGLISH</Text>
            <Text style={styles.value}>{lesson.english}</Text>
          </>
        ) : null}

        <AudioButton lesson={lesson} />

        <Text style={[styles.label, { marginTop: 24 }]}>EXAMPLE</Text>
        <Text style={styles.example}>{lesson.example}</Text>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.navButton, !prevLesson && styles.navButtonDisabled]}
            disabled={!prevLesson}
            onPress={() => prevLesson && navigation.setParams({ lessonId: prevLesson.id })}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={() => toggleSaved(lesson.id)}>
            <Text style={styles.saveButtonText}>{isSaved ? "★ Saved" : "☆ Save"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, !nextLesson && styles.navButtonDisabled]}
            disabled={!nextLesson}
            onPress={() => nextLesson && navigation.setParams({ lessonId: nextLesson.id })}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.practiceButton} onPress={goToPractice}>
          <Text style={styles.practiceButtonText}>Practice this lesson</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 48 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  amharic: { ...typography.amharic, color: colors.cream },
  pronunciation: { ...typography.pronunciation, color: colors.textMuted, marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  label: { ...typography.label, color: colors.gold, marginBottom: 4 },
  value: { color: colors.cream, fontSize: 17, marginBottom: 16 },
  example: { color: colors.textMuted, fontSize: 15, fontStyle: "italic", marginBottom: 24 },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  navButton: { paddingVertical: 10, paddingHorizontal: 14 },
  navButtonDisabled: { opacity: 0.3 },
  navButtonText: { color: colors.accentBlue, fontWeight: "600" },
  saveButton: { paddingVertical: 10, paddingHorizontal: 14 },
  saveButtonText: { color: colors.gold, fontWeight: "700" },
  practiceButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  practiceButtonText: { color: colors.background, fontWeight: "700", fontSize: 16 },
});
