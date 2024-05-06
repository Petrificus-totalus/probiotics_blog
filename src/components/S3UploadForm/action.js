"use server";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  // console.log(fileName);
  const filename = `transactions/${fileName}-${Date.now()}`;

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: fileBuffer,
    ContentType: "image/*",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return filename;
}

export async function uploadFile(formData) {
  try {
    const uploadedFiles = [];
    const files = formData.getAll("file");

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(buffer, file.name);
      uploadedFiles.push(fileName);
    }

    return {
      data: JSON.stringify(uploadedFiles),
      message: "File has been upload.",
    };
  } catch (error) {
    console.error("Database connection or query error:", error);
    db?.end();
    return { status: "error", message: "Failed to upload file." };
  }
}
