import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLessons } from "@/context/LessonContext";
import { useProgress } from "@/context/ProgressContext";
import BrandHeader from "@/components/BrandHeader";
import QuizOption from "@/components/QuizOption";
import AudioButton from "@/components/AudioButton";
import { CATEGORY_DESCRIPTIONS, CATEGORY_ICONS } from "@/data/categoryPresentation";
import { Category, CATEGORY_LABELS, Lesson, QuizQuestion } from "@/types/lesson";
import { isCorrect } from "@/utils/quizScoring";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const CATEGORIES: Category[] = ["erayo", "weedho", "wadahadal", "naxwe"];
const QUESTION_COUNT_STEP = 5;
type PracticeDirection = "am-to-so" | "so-to-am";

const DIRECTIONS: { value: PracticeDirection; label: string }[] = [
  { value: "am-to-so", label: "Amharic → Somali" },
  { value: "so-to-am", label: "Somali → Amharic" },
];

interface PracticeQuestion {
  lesson: Lesson;
  question: QuizQuestion;
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function randomizeAnswerPositions(questions: PracticeQuestion[]): PracticeQuestion[] {
  let previousCorrectIndex: number | undefined;

  return questions.map(({ lesson, question }) => {
    const sourceCorrectIndex = question.options.indexOf(question.correctAnswer);
    if (sourceCorrectIndex < 0 || question.options.length < 2) {
      return { lesson, question: { ...question, options: shuffled(question.options) } };
    }

    const answerPositions = Array.from({ length: question.options.length }, (_, index) => index).filter(
      (index) => index !== previousCorrectIndex
    );
    const correctIndex = answerPositions[Math.floor(Math.random() * answerPositions.length)];
    const distractors = shuffled(question.options.filter((_, index) => index !== sourceCorrectIndex));
    let distractorIndex = 0;
    const options = question.options.map((_, index) =>
      index === correctIndex ? question.correctAnswer : distractors[distractorIndex++]
    );

    previousCorrectIndex = correctIndex;
    return { lesson, question: { ...question, options } };
  });
}

function getDirectionalQuestions(lessons: Lesson[], direction: PracticeDirection): PracticeQuestion[] {
  return lessons.flatMap((lesson) => {
    const matchingQuestions = lesson.quizQuestions.filter(
      (question) => question.type === "multiple_choice" && question.direction === direction
    );
    if (matchingQuestions.length > 0) {
      return matchingQuestions.map((question) => ({ lesson, question }));
    }

    const prompt = direction === "am-to-so" ? lesson.amharic : lesson.somali;
    const correctAnswer = direction === "am-to-so" ? lesson.somali : lesson.amharic;
    const distractors = Array.from(
      new Set(
        lessons
          .filter((candidate) => candidate.id !== lesson.id)
          .map((candidate) => (direction === "am-to-so" ? candidate.somali : candidate.amharic))
          .filter((answer) => answer && answer !== correctAnswer)
      )
    );

    if (!prompt || !correctAnswer || distractors.length === 0) return [];

    const options = shuffled([correctAnswer, ...shuffled(distractors).slice(0, 3)]);
    return [
      {
        lesson,
        question: {
          id: `${lesson.id}-${direction}-generated`,
          type: "multiple_choice",
          direction,
          prompt,
          options,
          correctAnswer,
        },
      },
    ];
  });
}

export default function PracticeScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { lessons, getLessonById } = useLessons();
  const { submitQuizResult } = useProgress();

  const lessonId = route.params?.lessonId as string | undefined;
  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<PracticeDirection>("am-to-so");
  const [questionCount, setQuestionCount] = useState(5);
  const [sessionStarted, setSessionStarted] = useState(Boolean(lessonId));
  const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>([]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const categoryLessons = selectedCategory ? lessons.filter((item) => item.category === selectedCategory) : [];
  const categoryQuestions = getDirectionalQuestions(categoryLessons, selectedDirection);
  const questions: PracticeQuestion[] = lesson
    ? lesson.quizQuestions.map((question) => ({ lesson, question }))
    : sessionQuestions;
  const questionEntry = questions[questionIndex];
  const question = questionEntry?.question;
  const questionLesson = questionEntry?.lesson;

  const startCategorySession = () => {
    const chosenQuestions = shuffled(categoryQuestions).slice(0, Math.min(questionCount, categoryQuestions.length));
    const nextQuestions = randomizeAnswerPositions(chosenQuestions);
    setSessionQuestions(nextQuestions);
    setQuestionIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setSessionStarted(true);
  };

  const chooseAnotherCategory = () => {
    setSessionStarted(false);
    setSelectedCategory(null);
    setQuestionCount(5);
    setSessionQuestions([]);
    setQuestionIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  };

  const cancelPractice = () => {
    if (lesson) {
      navigation.goBack();
      return;
    }
    chooseAnotherCategory();
  };

  if (!lesson && !sessionStarted) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <BrandHeader />
        <ScrollView contentContainerStyle={styles.pickerContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose what to practice</Text>
            <Text style={styles.subtitle}>Pick a category and choose how many questions to practice.</Text>
          </View>

          <Text style={styles.directionLabel}>Question direction</Text>
          <View style={styles.directionSegments}>
            {DIRECTIONS.map((direction) => {
              const isSelected = selectedDirection === direction.value;
              return (
                <TouchableOpacity
                  key={direction.value}
                  style={[styles.directionOption, isSelected && styles.directionOptionSelected]}
                  onPress={() => {
                    setSelectedDirection(direction.value);
                    setSelectedCategory(null);
                    setQuestionCount(5);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={[styles.directionOptionText, isSelected && styles.directionOptionTextSelected]}>
                    {direction.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {CATEGORIES.map((category) => {
            const categoryLessons = lessons.filter((item) => item.category === category);
            const directionQuestionCount = getDirectionalQuestions(categoryLessons, selectedDirection).length;
            const isSelected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryRow,
                  isSelected && styles.categoryRowSelected,
                  directionQuestionCount === 0 && styles.categoryRowUnavailable,
                ]}
                disabled={directionQuestionCount === 0}
                onPress={() => {
                  setSelectedCategory(category);
                  setQuestionCount(5);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${CATEGORY_LABELS[category]}, ${directionQuestionCount} questions`}
              >
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons name={CATEGORY_ICONS[category]} size={28} color={colors.gold} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{CATEGORY_LABELS[category]}</Text>
                  <Text style={styles.categoryDescription}>
                    {CATEGORY_DESCRIPTIONS[category]} · {directionQuestionCount} questions
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                  size={23}
                  color={isSelected ? colors.gold : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}

          {selectedCategory ? (
            <View style={styles.questionCountRow}>
              <View>
                <Text style={styles.questionCountLabel}>Questions</Text>
                <Text style={styles.questionCountHint}>{categoryQuestions.length} available</Text>
              </View>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={[styles.stepperButton, questionCount <= QUESTION_COUNT_STEP && styles.stepperButtonDisabled]}
                  onPress={() => setQuestionCount((count) => Math.max(QUESTION_COUNT_STEP, count - QUESTION_COUNT_STEP))}
                  disabled={questionCount <= QUESTION_COUNT_STEP}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease question count"
                >
                  <MaterialCommunityIcons name="minus" size={20} color={colors.cream} />
                </TouchableOpacity>
                <Text style={styles.questionCountValue}>{Math.min(questionCount, categoryQuestions.length)}</Text>
                <TouchableOpacity
                  style={[styles.stepperButton, questionCount >= categoryQuestions.length && styles.stepperButtonDisabled]}
                  onPress={() => setQuestionCount((count) => Math.min(categoryQuestions.length, count + QUESTION_COUNT_STEP))}
                  disabled={questionCount >= categoryQuestions.length}
                  accessibilityRole="button"
                  accessibilityLabel="Increase question count"
                >
                  <MaterialCommunityIcons name="plus" size={20} color={colors.cream} />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.startButton, (!selectedCategory || categoryQuestions.length === 0) && styles.disabledButton]}
            onPress={startCategorySession}
            disabled={!selectedCategory || categoryQuestions.length === 0}
            accessibilityRole="button"
          >
            <Text style={styles.startButtonText}>
              Start practice{selectedCategory ? ` · ${Math.min(questionCount, categoryQuestions.length)} questions` : ""}
            </Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.background} />
          </TouchableOpacity>
          {selectedCategory && categoryQuestions.length === 0 ? (
            <Text style={styles.noQuestions}>This category does not have any quiz questions yet.</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    );
  }

  const handleSelect = (option: string) => {
    if (selected || !question) return;
    setSelected(option);
    if (isCorrect(question, option)) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = async () => {
    if (!question) return;
    const isLast = questionIndex === questions.length - 1;
    if (isLast) {
      await submitQuizResult(correctCount, questions.length);
      setFinished(true);
    } else {
      setQuestionIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (questions.length === 0 || !question || !questionLesson) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <BrandHeader />
        <View style={styles.resultWrap}>
          <Text style={styles.empty}>
            {lesson ? "No quiz questions for this lesson yet." : "No quiz questions are available for this category yet."}
          </Text>
          {!lesson ? (
            <TouchableOpacity style={styles.doneButton} onPress={chooseAnotherCategory}>
              <Text style={styles.doneButtonText}>Choose another category</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <BrandHeader />
        <View style={styles.resultWrap}>
          <Text style={styles.resultTitle}>Nice work!</Text>
          <Text style={styles.resultScore}>
            {correctCount} / {questions.length} correct
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={lesson ? () => navigation.navigate("Home") : chooseAnotherCategory}
          >
            <Text style={styles.doneButtonText}>{lesson ? "Back to Home" : "Choose another category"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getOptionState = (option: string): "default" | "selected" | "correct" | "incorrect" => {
    if (!selected) return "default";
    if (option === question.correctAnswer) return "correct";
    if (option === selected) return "incorrect";
    return "default";
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BrandHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sessionTopRow}>
          <Text style={styles.progress}>Question {questionIndex + 1} / {questions.length}</Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelPractice}
            accessibilityRole="button"
            accessibilityLabel="Cancel practice"
          >
            <MaterialCommunityIcons name="close" size={18} color={colors.textMuted} />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {!lesson ? (
          <Text style={styles.questionSource}>
            {selectedDirection === "am-to-so" ? "Amharic → Somali" : "Somali → Amharic"} · {questionLesson.title}
          </Text>
        ) : null}

        {question.type === "listening" ? (
          <>
            <Text style={styles.prompt}>Listen and choose what you heard</Text>
            <AudioButton lesson={{ ...questionLesson, audioFile: question.audioFile ?? questionLesson.audioFile }} />
          </>
        ) : (
          <Text style={styles.prompt}>{question.prompt}</Text>
        )}

        <View style={{ marginTop: 20 }}>
          {question.options.map((option) => (
            <QuizOption
              key={option}
              label={option}
              state={getOptionState(option)}
              onPress={() => handleSelect(option)}
              disabled={!!selected}
            />
          ))}
        </View>

        {selected ? (
          <Text style={styles.feedback}>
            {isCorrect(question, selected) ? "Correct! 🎉" : `Not quite — correct answer: ${question.correctAnswer}`}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          disabled={!selected}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {questionIndex === questions.length - 1 ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 48 },
  empty: { color: colors.textMuted, textAlign: "center", marginTop: 40 },
  pickerContent: { padding: 20, paddingBottom: 36 },
  header: { paddingBottom: 18 },
  title: { ...typography.title, color: colors.cream },
  subtitle: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  directionLabel: { color: colors.textMuted, fontSize: 13, fontWeight: "700", marginBottom: 8 },
  directionSegments: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  directionOption: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    paddingHorizontal: 5,
  },
  directionOptionSelected: { backgroundColor: colors.gold },
  directionOptionText: { color: colors.textMuted, fontSize: 12, fontWeight: "700", textAlign: "center" },
  directionOptionTextSelected: { color: colors.background },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  categoryRowSelected: { borderColor: colors.gold, backgroundColor: colors.cardAlt },
  categoryRowUnavailable: { opacity: 0.45 },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryInfo: { flex: 1, minWidth: 0, marginRight: 10 },
  categoryTitle: { color: colors.cream, fontSize: 15, fontWeight: "700" },
  categoryDescription: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  questionCountRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  questionCountLabel: { color: colors.cream, fontSize: 15, fontWeight: "700" },
  questionCountHint: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  stepper: { flexDirection: "row", alignItems: "center" },
  stepperButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: { opacity: 0.35 },
  questionCountValue: { minWidth: 48, color: colors.gold, fontSize: 20, fontWeight: "800", textAlign: "center" },
  startButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.gold,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  disabledButton: { opacity: 0.45 },
  startButtonText: { color: colors.background, fontSize: 16, fontWeight: "800", marginRight: 10 },
  noQuestions: { color: colors.textMuted, textAlign: "center", marginTop: 10 },
  progress: { ...typography.label, color: colors.textMuted, marginBottom: 12 },
  sessionTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cancelButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingLeft: 12 },
  cancelButtonText: { color: colors.textMuted, fontWeight: "700", marginLeft: 4 },
  questionSource: { color: colors.gold, fontWeight: "700", marginBottom: 10 },
  prompt: { ...typography.amharic, fontSize: 24, color: colors.cream, marginBottom: 12 },
  feedback: { color: colors.gold, marginTop: 8, fontWeight: "600" },
  nextButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { color: colors.background, fontWeight: "700", fontSize: 16 },
  resultWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  resultTitle: { ...typography.heading, color: colors.cream, marginBottom: 12 },
  resultScore: { color: colors.gold, fontSize: 20, fontWeight: "700", marginBottom: 32 },
  doneButton: { backgroundColor: colors.gold, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  doneButtonText: { color: colors.background, fontWeight: "700" },
});
