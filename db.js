const { Pool } = require("pg");

let _client;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "password",
  port: 5432,
  database: "library",
});

async function connect() {
  _client = await pool.connect();
  console.log("Connected with DB");
}

function getClient() {
  if (!_client) {
    throw new Error("DB client is not defined");
  }

  return _client;
}

module.exports = {
  connect,
  getClient,
};
