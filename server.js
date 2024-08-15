const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "admin",
  database: "endeavor"
})
client.connect();
client.query("select * from users", (err, res) => {
  if (!err) { console.log("yees"); console.log(res.rows); }
  else {
    console.log("noo"); console.log(err.response);
  }
  client.end;
})