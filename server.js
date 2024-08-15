const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 2045;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static('website'));


// PostgreSQL client setup
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "endeavor"
});

client.connect();

// Function to perform SELECT * FROM users
// function getUsers(callback) {
//   client.query("SELECT * FROM users ORDER BY id ASC ", (err, res) => {
//     if (err) {
//       console.error("Error executing query", err.stack);
//       callback(err, null);
//     } else {
//       callback(null, res.rows);
//     }
//   });
// }

// // Example route to use the getUsers function
// app.post('/users', (req, res) => {
//   getUsers((err, users) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to retrieve users" });
//     } else {
//       res.status(200).json(users);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// Route to execute arbitrary SQL statements
app.post('/execute', (req, res) => {
  const { sql } = req.body; // Get SQL statement from request body

  if (!sql) {
    return res.status(400).json({ error: "SQL statement is required" });
  }

  client.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL statement", err.stack);
      res.status(500).json({ error: "Failed to execute SQL statement" });
    } else {
      res.status(200).json({ result: result.rows });
    }
  });
});
