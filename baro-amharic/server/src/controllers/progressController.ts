import { Response } from "express";
import { Progress } from "@/models/Progress";
import { AuthedRequest } from "@/middleware/authMiddleware";

// GET /progress — fetch this user's synced progress (or defaults if none yet)
export async function getProgress(req: AuthedRequest, res: Response) {
  const progress = await Progress.findOne({ user: req.userId });
  res.json(
    progress ?? {
      savedWordIds: [],
      completedLessonIds: [],
      quizResults: [],
      streak: { count: 0, lastActiveDate: "" },
    }
  );
}

// PUT /progress — overwrite with the device's current local state.
// A production version would merge rather than overwrite, to handle
// multiple devices updating between syncs.
export async function upsertProgress(req: AuthedRequest, res: Response) {
  const { savedWordIds, completedLessonIds, quizResults, streak } = req.body;

  const progress = await Progress.findOneAndUpdate(
    { user: req.userId },
    { savedWordIds, completedLessonIds, quizResults, streak, updatedAt: new Date() },
    { upsert: true, new: true }
  );

  res.json(progress);
}
