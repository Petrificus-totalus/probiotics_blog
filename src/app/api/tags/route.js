import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const db = await getMySQLConnection();
    const [data] = await db.execute("SELECT * FROM tags");
    db.end();
    return new NextResponse(JSON.stringify({ data }), {
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
    const { tag } = Object.fromEntries(req);
    console.log(tag);
    const tags = tag.split(",");
    console.log(tags);
    const sql = `
    INSERT INTO tags (tag)
    VALUES (?)
    `;
    const repeated = [];
    for (let t of tags) {
      const [total] = await db.execute(
        `SELECT COUNT(tag) as total FROM tags WHERE tags.tag = ?`,
        [t]
      );
      if (total[0].total > 0) {
        repeated.push(t);
      } else {
        await db.execute(sql, [t.trim()]);
      }
    }

    db.end();
    return new NextResponse(JSON.stringify({ status: "success", repeated }), {
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
