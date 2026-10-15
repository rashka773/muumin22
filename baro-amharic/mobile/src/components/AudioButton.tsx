import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Lesson } from "@/types/lesson";
import { localAudio } from "@/data/localMedia";
import { playLessonAudio } from "@/services/audioCacheService";
import { colors } from "@/theme/colors";
import { Audio } from "expo-av";

interface Props {
  lesson: Lesson;
}

export default function AudioButton({ lesson }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (isLoading || isPlaying) return;
    setIsLoading(true);
    try {
      const local = localAudio[lesson.id];
      const sound = local
        ? (await Audio.Sound.createAsync(local)).sound
        : await playLessonAudio(lesson);
      if (local) {
        await sound.playAsync();
      }
      setIsLoading(false);
      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (err) {
      console.warn("[AudioButton] Failed to play audio:", err);
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={styles.icon}>{isPlaying ? "🔊" : "▶"}</Text>
      )}
      <Text style={styles.label}>{isPlaying ? "Playing…" : "Listen"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.gold,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  icon: { fontSize: 16, marginRight: 8 },
  label: { color: colors.background, fontWeight: "700" },
});
