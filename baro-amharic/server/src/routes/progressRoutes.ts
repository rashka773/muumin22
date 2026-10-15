import { Router } from "express";
import { getProgress, upsertProgress } from "@/controllers/progressController";
import { requireAuth } from "@/middleware/authMiddleware";

const router = Router();

router.get("/", requireAuth, getProgress);
router.put("/", requireAuth, upsertProgress);

export default router;
