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
      "SELECT COUNT(DISTINCT date) as total FROM transactions"
    );
    // console.log(total);
    const count = 3; // 每页记录数
    const totalPages = Math.ceil(total[0].total / count);

    const offset = (page - 1) * count;
    const [datesResult] = await db.query(
      `SELECT DISTINCT date FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?`,
      [count, offset]
    );

    // console.log(datesResult);
    // Extract dates for the next query
    const dates = datesResult.map((d) => d.date);

    if (dates.length === 0) {
      return new NextResponse(JSON.stringify({ data: [], totalPages }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Second query to get transactions based on the dates fetched
    const [transactions] = await db.query(
      `
        SELECT transactionID, title, price, location, date, description
        FROM transactions
        WHERE date IN (?)
        ORDER BY date DESC, transactionID ASC
    `,
      [dates]
    );
    // console.log(transactions);
    // Fetch tags for these transactions
    const [tags] = await db.query(
      `
          SELECT tt.transactionID, tg.tag
          FROM transaction_tag tt
          JOIN tags tg ON tt.tagID = tg.tagID
          WHERE tt.transactionID IN (?)
        `,
      [transactions.map((t) => t.transactionID)]
    );

    const [links] = await db.query(
      `
          SELECT tl.transactionID, l.link
          FROM transaction_link tl
          JOIN links l ON tl.linkID = l.linkID
          WHERE tl.transactionID IN (?)
        `,
      [transactions.map((t) => t.transactionID)]
    );
    db.end();

    // Process results to group by date
    // Combine transactions with their tags
    const grouped = transactions.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          total: 0,
          transactions: [],
        };
      }

      const transactionTags = tags
        .filter((tag) => tag.transactionID === item.transactionID)
        .map((tag) => tag.tag);
      const transactionLinks = links
        .filter((link) => link.transactionID === item.transactionID)
        .map((link) => link.link);

      acc[item.date].transactions.push({
        ...item,
        tags: transactionTags,
        links: transactionLinks,
      });

      acc[item.date].total += parseFloat(item.price);
      return acc;
    }, {});

    console.log(grouped);
    return new NextResponse(
      JSON.stringify({ data: Object.values(grouped), totalPages }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
    const { date, description, location, title, price, tags, files } =
      Object.fromEntries(req);

    const insertTransactionQuery = `
    INSERT INTO transactions (date, description, location, title, price)
    VALUES (?, ?, ?, ?, ?)
    `;
    const transactionValues = [
      new Date(date),
      description,
      location,
      title,
      parseFloat(price),
    ];
    const [{ insertId }] = await db.execute(
      insertTransactionQuery,
      transactionValues
    );

    // 2. 根据tags字符串将tags分割成单独的tagID
    const tagIDs = tags.split(",").map((tag) => parseInt(tag.trim()));

    // 3. 将每个tagID插入transaction_tag表
    const insertTransactionTagQuery = `
        INSERT INTO transaction_tag (transactionID, tagID)
        VALUES (?, ?)
        `;
    for (const tagID of tagIDs) {
      await db.execute(insertTransactionTagQuery, [insertId, tagID]);
    }
    const fileNameList = files.split(",");
    const insertLinkQuery = `
        INSERT INTO links (link)
        VALUES (?)
        `;
    const insertTransactionLinkQuery = `
        INSERT INTO transaction_link (transactionID, linkID)
        VALUES (?, ?)
        `;
    for (const file of fileNameList) {
      const [res] = await db.execute(insertLinkQuery, [file]);
      const insertLinkId = res.insertId;

      await db.execute(insertTransactionLinkQuery, [insertId, insertLinkId]);
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
