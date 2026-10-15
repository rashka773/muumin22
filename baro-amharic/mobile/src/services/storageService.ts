import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  savedWords: "baro:savedWords", // string[] of lesson IDs
  completedLessons: "baro:completedLessons", // string[] of lesson IDs
  quizResults: "baro:quizResults", // { correct: number; total: number }[]
  streak: "baro:streak", // { count: number; lastActiveDate: string }
};

async function getJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn(`[storageService] Failed to read ${key}:`, err);
    return fallback;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// --- Saved words -----------------------------------------------------------

export async function getSavedWords(): Promise<string[]> {
  return getJson<string[]>(KEYS.savedWords, []);
}

export async function toggleSavedWord(lessonId: string): Promise<string[]> {
  const current = await getSavedWords();
  const next = current.includes(lessonId)
    ? current.filter((id) => id !== lessonId)
    : [...current, lessonId];
  await setJson(KEYS.savedWords, next);
  return next;
}

// --- Completed lessons -------------------------------------------------------

export async function getCompletedLessons(): Promise<string[]> {
  return getJson<string[]>(KEYS.completedLessons, []);
}

export async function markLessonComplete(lessonId: string): Promise<string[]> {
  const current = await getCompletedLessons();
  if (current.includes(lessonId)) return current;
  const next = [...current, lessonId];
  await setJson(KEYS.completedLessons, next);
  return next;
}

// --- Quiz accuracy -----------------------------------------------------------

interface QuizResult {
  correct: number;
  total: number;
}

export async function recordQuizResult(result: QuizResult): Promise<QuizResult[]> {
  const current = await getJson<QuizResult[]>(KEYS.quizResults, []);
  const next = [...current, result];
  await setJson(KEYS.quizResults, next);
  return next;
}

export async function getQuizAccuracy(): Promise<number> {
  const results = await getJson<QuizResult[]>(KEYS.quizResults, []);
  if (results.length === 0) return 0;
  const totals = results.reduce(
    (acc, r) => ({ correct: acc.correct + r.correct, total: acc.total + r.total }),
    { correct: 0, total: 0 }
  );
  return totals.total === 0 ? 0 : Math.round((totals.correct / totals.total) * 100);
}

// --- Daily streak --------------------------------------------------------

interface Streak {
  count: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export async function touchDailyStreak(): Promise<Streak> {
  const today = new Date().toISOString().slice(0, 10);
  const current = await getJson<Streak>(KEYS.streak, { count: 0, lastActiveDate: "" });

  if (current.lastActiveDate === today) {
    return current; // already counted today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const nextCount = current.lastActiveDate === yesterday ? current.count + 1 : 1;
  const next: Streak = { count: nextCount, lastActiveDate: today };
  await setJson(KEYS.streak, next);
  return next;
}

export async function getStreak(): Promise<Streak> {
  return getJson<Streak>(KEYS.streak, { count: 0, lastActiveDate: "" });
}
