import getMySQLConnection from "@/lib/mysql";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const db = await getMySQLConnection();
    // console.log(db);

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

// export const POST = async (request) => {
//   try {
//     const db = await getMySQLConnection();
//     const req = await request.formData();
//     const { date, description, location, title, price, tags } =
//       Object.fromEntries(req);
//     console.log(date, description, location, title, price, tags);
//     console.log(Array.isArray(tags));
//     // const sql = `UPDATE user
//     //        SET Account = ?, Password = ?, Access = ?
//     //        WHERE UserID = ?`;
//     // const data = [Account, Password, Access, UserID];
//     // await db.query(sql, data);

//     // db.end();
//     return new NextResponse(JSON.stringify({ status: "success" }), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Database connection or query error:", error);
//     db?.end();
//     return new NextResponse(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
// };
