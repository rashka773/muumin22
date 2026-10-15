// Amharic text should always render large and highly readable per the brand brief.
// Swap fontFamily values once custom fonts are added under assets/fonts and loaded
// via expo-font (Noto Sans Ethiopic is a solid free choice for Amharic script).
export const typography = {
  amharic: {
    fontFamily: undefined as string | undefined, // falls back to system font until a custom font is loaded
    fontSize: 30,
    lineHeight: 40,
  },
  pronunciation: {
    fontSize: 16,
    fontStyle: "italic" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800" as const,
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
};

export default typography;
