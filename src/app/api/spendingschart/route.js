import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  const db = await getMySQLConnection();

  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const item = searchParams.get("item") || "week";
    console.log(item);

    if (item === "week") {
      console.log("week");
      const [data] = await db.execute(
        ` SELECT WEEK(date) as week, SUM(price) as total_amount
            FROM transactions
            WHERE date >= CURDATE() - INTERVAL 10 WEEK
            GROUP BY WEEK(date)
            ORDER BY WEEK(date);`
      );
      return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else if (item === "day") {
      const [data] = await db.query(
        `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS day, COUNT(*) AS total_transactions, SUM(price) AS total_amount
    FROM transactions
    WHERE date >= CURDATE() - INTERVAL 90 DAY
    GROUP BY DATE_FORMAT(date, '%Y-%m-%d')
    ORDER BY DATE_FORMAT(date, '%Y-%m-%d');`
      );
      return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const [data] = await db.execute(
        `SELECT 
            DATE_FORMAT(date, '%Y-%m') AS month,
            COUNT(*) AS total_transactions,
            SUM(price) AS total_amount
        FROM transactions
        WHERE date >= CURDATE() - INTERVAL 6 MONTH
        GROUP BY DATE_FORMAT(date, '%Y-%m')
        ORDER BY DATE_FORMAT(date, '%Y-%m');`
      );
      return new NextResponse(JSON.stringify({ data }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Database connection or query error:", error);
    db?.end();
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    db.release();
  }
};
