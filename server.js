const fs = require("fs");
const express = require("express");
const { randomUUID } = require("crypto"); // vraca string, jedinstveni id za svaki poziv
const { Script } = require("vm");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const homePage = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
const setAnimalPage = fs.readFileSync(`${__dirname}/set-animal.html`, "utf-8");

let animals = JSON.parse(fs.readFileSync(`${__dirname}/animals.json`, "utf-8"));

app.get("/", function (req, res) {
  const animalsForHtml = animals
    .map(
      (animal) =>
        `<p>${animal.name}, ${animal.type} with ID: ${animal.id} 
      <a href="/update-animal/${animal.id}"><button>update</button></a>
      <form action="/animals/delete/${animal.id}" method="POST">
      <button type="submit">delete</button> </form>
      </p>`,
    )
    .join();
  const finalHomePage = homePage.replace("PLACEHOLDER", animalsForHtml);
  res.status(200).send(finalHomePage);
});

app.post("/animals", function (req, res) {
  const newAnimal = {
    ...req.body,
    id: randomUUID(),
  };

  animals.push(newAnimal);

  fs.writeFileSync(
    `${__dirname}/animals.json`,
    JSON.stringify(animals),
    "utf-8",
  );

  res.redirect("/");
});

app.get("/create-animal", function (req, res) {
  const title = "Create animal";
  const action = "animals";
  const method = "POST";
  const nameInput = "";
  const typeInput = "";
  const submit = "Create";

  const finalCreateAnimalPage = setAnimalPage
    .replace("PLACEHOLDER_TITLE", title)
    .replace("PLACEHOLDER_ACTION", action)
    .replace("PLACEHOLDER_METHOD", method)
    .replace("PLACEHOLDER_NAME", nameInput)
    .replace("PLACEHOLDER_TYPE", typeInput)
    .replace("PLACEHOLDER_SUBMIT", submit);

  res.status(200).send(finalCreateAnimalPage);
});

app.get("/update-animal/:id", function (req, res) {
  const { id } = req.params;
  const selectedAnimal = animals.find((animal) => animal.id === id);
  const title = "Update animal";
  const action = `animals/${id}`;
  const method = "POST";
  const nameInput = selectedAnimal.name;
  const typeInput = selectedAnimal.type;
  const submit = "Update";

  const finalCreateAnimalPage = setAnimalPage
    .replace("PLACEHOLDER_TITLE", title)
    .replace("PLACEHOLDER_ACTION", action)
    .replace("PLACEHOLDER_METHOD", method)
    .replace("PLACEHOLDER_NAME", nameInput)
    .replace("PLACEHOLDER_TYPE", typeInput)
    .replace("PLACEHOLDER_SUBMIT", submit);

  res.status(200).send(finalCreateAnimalPage);
});

app.post("/animals/:id", function (req, res) {
  const { id } = req.params;
  const { name, type } = req.body;

  const selectedAnimal = animals.find((animal) => animal.id === id);

  if (selectedAnimal) {
    selectedAnimal.name = name;
    selectedAnimal.type = type;
  }
  fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users), "utf-8");
  res.redirect("/");
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

/*app.patch("/animals/:id", checkExistenceMiddleware, function (req, res) {
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
}); */

app.post("/animals/delete/:id", checkExistenceMiddleware, function (req, res) {
  const { id } = req.params;

  animals = animals.filter((animal) => animal.id !== id);

  res.redirect("/");
});

app.listen(8080, function () {
  console.log("Hello from the server");
});
