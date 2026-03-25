const { Pool } = require("pg");

let _client;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "password",
  port: 5432,
  database: "animals",
});

async function connect() {
  _client = await pool.connect();
  console.log("Connected with DB");
}
async function query() {
  if (!_client) {
    throw new Error("DB client is not defined");
  }

  const result = await _client.query("SELECT * FROM animals");

  return result;
}

module.exports = {
  connect,
  query,
};
