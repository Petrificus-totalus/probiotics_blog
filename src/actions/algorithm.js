// import getMySQLConnection from "@/lib/mysql";

// export const getTags = async () => {
//   "use server";
//   // import { NextResponse } from "next/server";

//   // export const dynamic = "force-dynamic";

//   try {
//     const db = await getMySQLConnection();
//     const [data] = await db.execute("SELECT * FROM algorithmtags");
//     db.end();
//     return new NextResponse(JSON.stringify({ data }), {
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
"use server";
import { NextResponse } from "next/server";
import getMySQLConnection from "@/lib/mysql";

export const getTags = async () => {
  let db;

  console.log("hahahahahahah");
  try {
    // Establish a connection to the MySQL database
    db = await getMySQLConnection();

    // Execute the SQL query to retrieve all tags from the "algorithmtags" table
    const [data] = await db.execute("SELECT * FROM algorithmtags");
    // console.log(data);

    // Return the retrieved data directly
    return new NextResponse(JSON.stringify({ data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Log the error to the console for debugging
    console.error("Database connection or query error:", error);

    // Return an error object with the error message
    return { error: error.message };
  }
  //   } finally {
  //     // Ensure the database connection is closed to avoid connection leaks
  //     if (db) {
  //       await db.end();
  //     }
  //   }
};
