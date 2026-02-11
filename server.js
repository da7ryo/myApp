const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

// const homeHtml = fs.readFileSync("./home.html", "utf-8");

const users = [];

app.get("/", function (req, res) {
  res.json(users);
});

app.post("/", function (req, res) {
  const newUser = req.body;
  users.push(newUser);

  res.json(newUser);
});

app.listen(8080, function () {
  console.log("Hello from the server");
});
