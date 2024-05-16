import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    const db = await getMySQLConnection();
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const page = parseInt(searchParams.get("page") || "1");

    const [total] = await db.execute(
      "SELECT COUNT(*) as total FROM algorithms"
    );
    // console.log(total);
    const count = 10; // 每页记录数
    const totalPages = Math.ceil(total[0].total / count);

    const offset = (page - 1) * count;
    const [data] = await db.query(`SELECT * FROM algorithms LIMIT ? OFFSET ?`, [
      count,
      offset,
    ]);
    await Promise.all(
      data.map(async (algorithm) => {
        const [tags] = await db.query(
          `
          SELECT t.tag FROM algo_tags at
          JOIN algorithmtags t ON t.tagID = at.tagID
          WHERE at.algorithmID = ?
        `,
          [algorithm.algorithmID]
        );

        algorithm.tags = tags.map((tag) => tag.tag);
      })
    );

    console.log(data);

    return new NextResponse(JSON.stringify({ data, totalPages }), {
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

export const POST = async (request) => {
  try {
    const db = await getMySQLConnection();
    const req = await request.formData();
    const { description, difficulty, link, tags, markdown } =
      Object.fromEntries(req);

    const insertAlgorithmQuery = `
    INSERT INTO algorithms (description, difficulty, link, markdown)
    VALUES (?, ?, ?, ?)
    `;
    const algorithmValues = [description, difficulty, link, markdown];
    const [{ insertId }] = await db.execute(
      insertAlgorithmQuery,
      algorithmValues
    );

    // 2. 根据tags字符串将tags分割成单独的tagID
    const tagIDs = tags.split(",").map((tag) => parseInt(tag.trim()));

    // 3. 将每个tagID插入transaction_tag表
    const insertAlgorithmTagsQuery = `
        INSERT INTO algo_tags (algorithmID, tagID)
        VALUES (?, ?)
        `;
    for (const tagID of tagIDs) {
      await db.execute(insertAlgorithmTagsQuery, [insertId, tagID]);
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
