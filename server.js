const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

const homeHtml = fs.readFileSync("./home.html", "utf-8");

app.get("/", function (req, res) {
  res.send(homeHtml);
});

app.post("/", function (req, res) {
  console.log(req.body);

  res.send("Data has arrived");
});

app.get("/about", function (req, res) {
  res.json({ mesagge: "About page" });
});

app.listen(8080, function () {
  console.log("Hello from the server");
});
