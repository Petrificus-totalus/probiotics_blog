import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  const db = await getMySQLConnection();

  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const page = parseInt(searchParams.get("page") || "1");
    const count = 8; // 每页记录数
    const offset = (page - 1) * count;

    const [data] = await db.query(
      "SELECT * FROM swallowreview LIMIT ? OFFSET ?",
      [count, offset]
    );
    console.log(data);
    const enrichedData = await Promise.all(
      data.map(async (item) => {
        const [res] = await db.execute(
          "SELECT * FROM swallowers where swallowID=?",
          [item.reviewer]
        );
        // console.log(res);
        return { ...item, ...res[0] };
      })
    );
    // console.log(data);
    db.end();
    return new NextResponse(JSON.stringify({ data: enrichedData }), {
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
