# Baro Amharic

Amharic learning app for Somali speakers. React Native (Expo) mobile app, MERN-style backend added later.

## Structure

```
baro-amharic/
├─ mobile/    # React Native (Expo) app — start here
├─ server/    # Express + MongoDB API — Phase 3 (accounts/sync), not needed yet
├─ content/   # Lesson data + audio, source of truth before upload to R2
└─ docs/      # Planning docs
```

## Getting started (mobile app)

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `i` / `a` for a simulator/emulator.

## Current state

This is a scaffold, not a finished app:

- Navigation, screens, context, and services are wired up and follow the plan in `docs/`.
- Lesson data is bundled from `content/lessons.json`, so the app can load the full catalog without a backend or network call. Metro watches the `content/` directory; restart Expo after changing lesson data.
- `lessonService.ts` can optionally fetch a live catalog from a Cloudflare R2 URL. Set `R2_LESSONS_URL` there when the bucket is ready; the bundled catalog remains the offline fallback.
- Audio playback/caching (`audioCacheService.ts`) and progress/saved-words storage (`storageService.ts`) are implemented against `expo-av`, `expo-file-system`, and `AsyncStorage`.
- `server/` and `content/scripts/upload-to-r2.js` are Phase 3 / content-publishing skeletons — not required to run the app today.

## Next steps

1. `npm install` inside `mobile/` and start Expo to browse the bundled lessons.
2. Add real audio recordings and update their URLs in `content/lessons.json`.
3. Add your own app icon/splash under `mobile/assets/`.
4. Keep building out screens/components from here.
