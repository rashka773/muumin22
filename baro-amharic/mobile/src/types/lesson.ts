export type Category = "erayo" | "weedho" | "wadahadal" | "naxwe";

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "listening";
  // Direction only matters for multiple_choice: which language is shown as the prompt
  direction?: "am-to-so" | "so-to-am";
  prompt: string; // text shown, or "" for listening questions (audio is the prompt)
  audioFile?: string; // used for listening questions
  options: string[];
  correctAnswer: string; // must match one of `options`
}

export interface Lesson {
  id: string; // e.g. "erayo-001"
  category: Category;
  level: number; // 1 = beginner
  title: string;
  amharic: string;
  pronunciation: string; // Latin-letter transliteration
  somali: string;
  english?: string;
  example: string;
  audioFile: string; // R2 URL for the pronunciation recording
  image?: string; // R2 URL, optional icon/illustration
  quizQuestions: QuizQuestion[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  erayo: "Erayo (Vocabulary)",
  weedho: "Weedho (Expressions)",
  wadahadal: "Wadahadal (Dialogues)",
  naxwe: "Naxwe (Grammar)",
};
