# Getting Started

run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Bug

## mysql 8.0.32

There will be error `Incorrect arguments to mysqld_stmt_execute` if you use `db.execute` when there is `LIMIT` keyword in sql.
Use `db.query` instead, or use other version of mysql

```javascript
await db.query(
  `SELECT DISTINCT date FROM transactions ORDER BY date DESC LIMIT ? OFFSET ?`,
  [count, offset]
);
```
