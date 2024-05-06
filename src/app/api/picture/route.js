import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyID: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export const POST = async (request) => {
  try {
    const uploadedFiles = [];
    // const db = await getMySQLConnection();
    const formData = await request.formData();
    let files = formData.get("file");
    if (!files) {
      return new NextResponse(JSON.stringify({ error: "File required" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // file = file[0];
    console.log(files);
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = await uploadFileToS3(buffer, file.name);
      uploadedFiles.push(fileName);
    }

    return new NextResponse(JSON.stringify({ data: uploadedFiles }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database connection or query error:", error);
    db?.end();
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  console.log(fileName);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `transactions/${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}
