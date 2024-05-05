import mysql from "mysql2/promise";

const config = {
  host: "database-myblog.cfkksaq8scxo.ap-southeast-2.rds.amazonaws.com",
  port: "3306",
  user: "jnh19981103",
  password: "31822939jnhJNH!",
  database: "mywebsite",
};

async function getMySQLConnection() {
  const connection = await mysql.createConnection(config);
  return connection;
}

export default getMySQLConnection;
