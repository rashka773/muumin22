import { Lesson } from "@/types/lesson";
import bundledLessons from "../../../content/lessons.json";

// Set this once your Cloudflare R2 bucket + lessons.json are live, e.g.
// "https://<your-bucket>.r2.dev/lessons.json" or a custom domain in front of it.
// Leaving it null makes the app always use the bundled fallback below.
const R2_LESSONS_URL: string | null = null;

/**
 * Fetches the live lesson catalog from R2. Falls back to the bundled copy
 * (content/lessons.json) on first launch, offline, or if
 * R2_LESSONS_URL hasn't been set yet — so the app always has something to show.
 */
export async function fetchLessons(): Promise<Lesson[]> {
  if (!R2_LESSONS_URL) {
    return bundledLessons as Lesson[];
  }

  try {
    const response = await fetch(R2_LESSONS_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Lesson fetch failed: ${response.status}`);
    const data = (await response.json()) as Lesson[];
    return data;
  } catch (err) {
    console.warn("[lessonService] Falling back to bundled lessons:", err);
    return bundledLessons as Lesson[];
  }
}
