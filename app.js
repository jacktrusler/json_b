const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require("pg");

const pool = new Pool({
  user: "tenzin",
  database: "tenzin",
  port: 5432,
  host: "localhost",
});

pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});

app.use(express.json());

app.post("/", (req, res) => {
  //make keys lowercase to case check
  const json = JSON.stringify(req.body);
  const newJson = json.replace(/"([\w]+)":/g, function ($0, $1) {
    return '"' + $1.toLowerCase() + '":';
  });
  const jsonB = JSON.parse(newJson);

  if (
    "fact" in jsonB ||
    "json" in jsonB ||
    "jason" in jsonB ||
    "bateman" in jsonB
  ) {
    res.send({ status: "ok", fact: "added", info: "Thanks for the fact!", });
  } else {
    res.send({
      status: "ok",
      fact: "not added",
      info: "to add a fact, send a JSON with 'fact' as a key",
    });
  }
});


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

app.get("/something", (req, res) => {
  res.status(418)
		res.set("X-tea-preference", "Earl Gray");
	res.send('teapot?? Are you a British Chap??');
});

app.listen(port, () => console.log(`JSON_B running on port: ${port}`));
