import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { Lesson } from "@/types/lesson";

const AUDIO_DIR = `${FileSystem.documentDirectory}audio/`;

async function ensureAudioDir() {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
  }
}

function localPathFor(remoteUrl: string): string {
  const fileName = remoteUrl.split("/").pop() || `${Date.now()}.mp3`;
  return `${AUDIO_DIR}${fileName}`;
}

/**
 * Returns a local file URI for a lesson's audio, downloading it from R2 the
 * first time and reading straight from cache on every later call — so audio
 * plays offline after the first listen.
 */
export async function getCachedAudioUri(remoteUrl: string): Promise<string> {
  await ensureAudioDir();
  const localPath = localPathFor(remoteUrl);
  const info = await FileSystem.getInfoAsync(localPath);

  if (info.exists) {
    return localPath;
  }

  const { uri } = await FileSystem.downloadAsync(remoteUrl, localPath);
  return uri;
}

/**
 * Downloads (if needed) and plays a lesson's pronunciation audio.
 * Returns the Sound instance so the caller can unload it when done.
 */
export async function playLessonAudio(lesson: Lesson) {
  const uri = await getCachedAudioUri(lesson.audioFile);
  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
  return sound;
}
