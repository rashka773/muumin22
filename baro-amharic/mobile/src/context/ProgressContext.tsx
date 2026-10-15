import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  getSavedWords,
  toggleSavedWord,
  getCompletedLessons,
  markLessonComplete,
  recordQuizResult,
  getQuizAccuracy,
  touchDailyStreak,
} from "@/services/storageService";

interface ProgressContextValue {
  savedWordIds: string[];
  completedLessonIds: string[];
  accuracy: number; // 0-100
  streakCount: number;
  loading: boolean;
  toggleSaved: (lessonId: string) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  submitQuizResult: (correct: number, total: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [savedWordIds, setSavedWordIds] = useState<string[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [accuracy, setAccuracy] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [saved, completed, acc, streak] = await Promise.all([
        getSavedWords(),
        getCompletedLessons(),
        getQuizAccuracy(),
        touchDailyStreak(),
      ]);
      setSavedWordIds(saved);
      setCompletedLessonIds(completed);
      setAccuracy(acc);
      setStreakCount(streak.count);
      setLoading(false);
    })();
  }, []);

  const toggleSaved = useCallback(async (lessonId: string) => {
    const next = await toggleSavedWord(lessonId);
    setSavedWordIds(next);
  }, []);

  const completeLesson = useCallback(async (lessonId: string) => {
    const next = await markLessonComplete(lessonId);
    setCompletedLessonIds(next);
  }, []);

  const submitQuizResult = useCallback(async (correct: number, total: number) => {
    await recordQuizResult({ correct, total });
    setAccuracy(await getQuizAccuracy());
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      savedWordIds,
      completedLessonIds,
      accuracy,
      streakCount,
      loading,
      toggleSaved,
      completeLesson,
      submitQuizResult,
    }),
    [savedWordIds, completedLessonIds, accuracy, streakCount, loading, toggleSaved, completeLesson, submitQuizResult]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
