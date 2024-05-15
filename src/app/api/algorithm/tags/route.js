import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const db = await getMySQLConnection();
    const [data] = await db.execute("SELECT * FROM algorithmtags");
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
