import { Category } from "@/types/lesson";

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  erayo: "Essential vocabulary",
  weedho: "Expressions and useful phrases",
  wadahadal: "Everyday conversations",
  naxwe: "Grammar and sentence structure",
};

export const CATEGORY_ICONS = {
  erayo: "book-open-page-variant-outline",
  weedho: "comment-text-outline",
  wadahadal: "forum-outline",
  naxwe: "book-edit-outline",
} as const;