const fs = require("fs");
const express = require("express");
const { randomUUID } = require("crypto"); // vraca string, jedinstveni id za svaki poziv

const app = express();
app.use(express.json());

// const homeHtml = fs.readFileSync("./home.html", "utf-8");

let animals = [];

app.get("/animals", function (req, res) {
  res.json(animals);
});

app.post("/animals", function (req, res) {
  const newAnimal = {
    ...req.body,
    id: randomUUID(),
  };

  animals.push(newAnimal);

  res.json(newAnimal);
});

app.get("/animals/:id", function (req, res) {
  const { id } = req.params;
  const selectedAnimal = animals.find((animal) => animal.id === id);

  if (!selectedAnimal) {
    return res.json({ msg: "Animal not found" });
  }

  res.json(selectedAnimal);
});

app.patch("/animals/:id", function (req, res) {
  const { id } = req.params;
  const selectedAnimal = animals.find((animal) => animal.id === id);

  if (!selectedAnimal) {
    return res.json({ msg: "Animal not found" });
  }

  const { name } = req.body;
  animals = animals.map((animal) => {
    if (animal.id === id) {
      return { ...animal, name };
    } else {
      return animal;
    }
  });

  const updatedAnimal = animals.find((animal) => animal.id === id);

  console.log(updatedAnimal);

  res.json(updatedAnimal);
});
// dobiti u req.body name property, u req.params cu dobiti id, trebam u animals arrayu naci zeljeni objekt i postaviti mu
// ime na vrijednost koju sam dobio u req.body i vratiti promijenjeni objekt, uz koristenje map metode trebam update
// uraditi

app.listen(8080, function () {
  console.log("Hello from the server");
});
