import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a presigned URL for secure, direct-to-S3 client uploads.
 * @param {string} key - The S3 object key (e.g., 'tenant_123/doc_456.pdf')
 * @param {string} contentType - The MIME type of the file
 * @param {string} bucket - The destination bucket
 * @param {number} expiresIn - URL expiration in seconds (default 3600)
 */
export async function generatePresignedUploadUrl({
  key,
  contentType,
  bucket = process.env.AWS_S3_RAW_BUCKET,
  expiresIn = 3600,
}) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn });
  return { url, key, bucket };
}
