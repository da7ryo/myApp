const fs = require("fs");
const express = require("express");
const { randomUUID } = require("crypto"); // vraca string, jedinstveni id za svaki poziv
const { Script } = require("vm");

const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const homePage = fs.readFileSync(`${__dirname}/index.html`, "utf-8");

let animals = [];

app.get("/", function (req, res) {
  res.status(200).send(homePage);
});

app.post("/animals", function (req, res) {
  const newAnimal = {
    ...req.body,
    id: randomUUID(),
  };

  animals.push(newAnimal);

  res.status(201).json(newAnimal);
});

function checkExistenceMiddleware(req, res, next) {
  const { id } = req.params;
  const selectedAnimal = animals.find((animal) => animal.id === id);

  if (!selectedAnimal) {
    return res.status(404).json({ msg: "Animal not found" });
  }
  res.locals.selectedAnimal = selectedAnimal;
  res.locals.id = id;
  next();
}

app.get("/animals/:id", checkExistenceMiddleware, function (req, res) {
  res.status(200).json(res.locals.selectedAnimal);
});

// dobiti u req.body name property, u req.params cu dobiti id, trebam u animals arrayu naci zeljeni objekt i postaviti mu
// ime na vrijednost koju sam dobio u req.body i vratiti promijenjeni objekt, uz koristenje map metode trebam update
// uraditi

app.patch("/animals/:id", checkExistenceMiddleware, function (req, res) {
  const { id } = req.params;

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

  res.status(200).json(updatedAnimal);
});

app.delete("/animals/:id", checkExistenceMiddleware, function (req, res) {
  const { id } = req.params;

  animals = animals.filter((animal) => animal.id !== id);

  res.status(204).json(null);
});

app.listen(8080, function () {
  console.log("Hello from the server");
});
