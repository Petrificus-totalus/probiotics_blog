import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";
import { uploadFile } from "@/components/S3UploadForm/action.js";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    const db = await getMySQLConnection();
    const req = await request.formData();

    req.append("folder", "swallow/item");
    console.log(req);
    const result = await uploadFile(req);
    const files = JSON.parse(result["data"]);
    const { restaurantName, rating, reviewerName, summary, review } =
      Object.fromEntries(req);

    const insertSwallowQuery = `
    INSERT INTO swallowreview (reviewer, restaurant, rating, summary, review,coverimage,createtime)
    VALUES (?, ?, ?, ?, ?,?,?)
    `;
    const values = [
      reviewerName,
      restaurantName,
      parseInt(rating),
      summary,
      review,
      files[0],
      new Date(),
    ];
    const [{ insertId }] = await db.execute(insertSwallowQuery, values);
    const insertPicturesQuery = `
    INSERT INTO swallowpic (reviewID, link)
    VALUES (?, ?)
    `;
    if (files.length > 1) {
      // 封面就不传了
      for (let i = 1; i < files.length; i++) {
        await db.execute(insertPicturesQuery, [insertId, files[i]]);
      }
    }

    db.end();
    return new NextResponse(JSON.stringify({ status: "success" }), {
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
