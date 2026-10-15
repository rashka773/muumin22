import { QuizQuestion } from "@/types/lesson";

export interface AnsweredQuestion {
  question: QuizQuestion;
  selectedAnswer: string;
}

export function isCorrect(question: QuizQuestion, selectedAnswer: string): boolean {
  return selectedAnswer === question.correctAnswer;
}

export function scoreQuiz(answered: AnsweredQuestion[]): { correct: number; total: number } {
  const correct = answered.filter((a) => isCorrect(a.question, a.selectedAnswer)).length;
  return { correct, total: answered.length };
}
