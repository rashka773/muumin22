import { Schema, model, Document, Types } from "mongoose";

// Mirrors the fields tracked locally in AsyncStorage on the device
// (see mobile/src/services/storageService.ts) so syncing is a straight merge.
export interface ProgressDocument extends Document {
  user: Types.ObjectId;
  savedWordIds: string[];
  completedLessonIds: string[];
  quizResults: { correct: number; total: number }[];
  streak: { count: number; lastActiveDate: string };
  updatedAt: Date;
}

const progressSchema = new Schema<ProgressDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  savedWordIds: { type: [String], default: [] },
  completedLessonIds: { type: [String], default: [] },
  quizResults: {
    type: [{ correct: Number, total: Number }],
    default: [],
  },
  streak: {
    count: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
  },
  updatedAt: { type: Date, default: Date.now },
});

export const Progress = model<ProgressDocument>("Progress", progressSchema);
