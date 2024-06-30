import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "database-myblog.cfkksaq8scxo.ap-southeast-2.rds.amazonaws.com",
  port: "3306",
  user: "jnh19981103",
  password: "31822939jnhJNH!",
  database: "mywebsite",
  waitForConnections: true,
  connectionLimit: 10, // 调整为合适的连接数
  queueLimit: 0,
});

async function getMySQLConnection() {
  const connection = await pool.getConnection();
  return connection;
}

export default getMySQLConnection;
