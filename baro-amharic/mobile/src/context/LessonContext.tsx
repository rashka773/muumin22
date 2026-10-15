import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Lesson, Category } from "@/types/lesson";
import { fetchLessons } from "@/services/lessonService";

interface LessonContextValue {
  lessons: Lesson[];
  loading: boolean;
  getLessonById: (id: string) => Lesson | undefined;
  getLessonsByCategory: (category: Category) => Lesson[];
}

const LessonContext = createContext<LessonContextValue | undefined>(undefined);

export function LessonProvider({ children }: { children: React.ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchLessons().then((data) => {
      if (isMounted) {
        setLessons(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<LessonContextValue>(
    () => ({
      lessons,
      loading,
      getLessonById: (id) => lessons.find((l) => l.id === id),
      getLessonsByCategory: (category) => lessons.filter((l) => l.category === category),
    }),
    [lessons, loading]
  );

  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLessons(): LessonContextValue {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLessons must be used within a LessonProvider");
  return ctx;
}
