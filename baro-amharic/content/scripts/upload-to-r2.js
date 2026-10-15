/**
 * Uploads content/lessons.json and everything under content/audio and
 * content/images to a Cloudflare R2 bucket.
 *
 * R2 is S3-compatible, so the AWS SDK works against it — just point the
 * endpoint at your account's R2 URL.
 *
 * Setup:
 *   npm install @aws-sdk/client-s3
 *   Set these environment variables (e.g. in a local .env, not committed):
 *     R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *
 * Run:
 *   node upload-to-r2.js
 */

const fs = require("fs");
const path = require("path");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.error(
    "Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME."
  );
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
});

const CONTENT_DIR = path.resolve(__dirname, "..");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.name === ".gitkeep") return [];
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function contentTypeFor(filePath) {
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".mp3")) return "audio/mpeg";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

async function uploadFile(filePath) {
  const key = path.relative(CONTENT_DIR, filePath).split(path.sep).join("/");
  const body = fs.readFileSync(filePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentTypeFor(filePath),
    })
  );
  console.log(`Uploaded: ${key}`);
}

async function main() {
  const lessonsJson = path.join(CONTENT_DIR, "lessons.json");
  const audioFiles = walk(path.join(CONTENT_DIR, "audio"));
  const imageFiles = walk(path.join(CONTENT_DIR, "images"));

  const allFiles = [lessonsJson, ...audioFiles, ...imageFiles].filter(fs.existsSync);

  for (const file of allFiles) {
    await uploadFile(file);
  }

  console.log(`\nDone. Uploaded ${allFiles.length} file(s) to bucket "${BUCKET_NAME}".`);
}

main().catch((err) => {
  console.error("Upload failed:", err);
  process.exit(1);
});
