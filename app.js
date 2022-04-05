const express = require('express');
const app = express();
const port = 3000;
const db = require("./db/database");

//Middleware to parse requests
app.use(express.json());

app.get("/facts", db.getFacts);
app.post("/", db.postFact);
app.put("/facts/:id", db.updateFact);
app.delete("/facts/:id", db.deleteFact);

//Homepage, display JSON Bateman
app.get("/", (req, res) => {
  res.send({
    name: "Jason Kent Bateman",
    birthday: "14 January 1969",
    birthplace: "Rye, New York",
    nationality: "American",
    ethnicity: "White",
    zodiac: "Capricorn",
    height: "5ft 11in",
    weight: "167.5lbs",
  });
});

app.get("/teapot", (req, res) => {
  res.status(418);
  res.set("X-tea-preference", "Earl Gray");
  res.send("teapot?? Are you a British Chap??");
});

app.listen(port, () => console.log(`JSON_B running on port: ${port}`));
