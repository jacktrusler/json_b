const { Client } = require('pg')
require('dotenv').config();
const client = new Client({
  user: process.env.DB_USERNAME,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
})

client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
//CRUD Functions
const getFacts = (req, res) => {
  client.query("SELECT * FROM bateman_facts;", (err, dbres) => {
    if (err){
      res.send(err)
      console.log(err);
    }
    res.send(dbres.rows);
  });
};

const postFact = (req, res) => {
  //make keys lowercase to case check
  console.log(req.body);
  const json = JSON.stringify(req.body);
  const newJson = json.replace(/"([\w]+)":/g, function ($0, $1) {
    return '"' + $1.toLowerCase() + '":';
  });
  const jsonB = JSON.parse(newJson);

  if ("fact" in jsonB) {
    client.query(
      "INSERT INTO bateman_facts(fact) VALUES ($1);",
      [jsonB.fact],
      (err, res) => {
        if (err) {
          throw err
        }
        console.log("db updated --- fact: ", jsonB.fact);
        res.send({ status: 201, fact: "added", info: "Thanks for the fact!" });
      }
    );
  } else {
    res.send({
      status: 200,
      fact: "not added",
      info: "to add a fact, send JSON with 'fact' as a key",
    });
  }
};

const updateFact = (req, res) => {
  const id = parseInt(req.params.id);
  //make keys lowercase to case check

  const json = JSON.stringify(req.body);
  const newJson = json.replace(/"([\w]+)":/g, function ($0, $1) {
    return '"' + $1.toLowerCase() + '":';
  });
  const jsonB = JSON.parse(newJson);

  if ("fact" in jsonB) {
    client.query(
      "UPDATE bateman_facts SET fact = $1 WHERE id = $2",
      [jsonB.fact, id],
      (error, results) => {
        if (error) {
          throw error
        }
        res.status(200).send(`Fact modified with ID: ${id}`);
      }
    );
  }
};

const deleteFact = (req, res) => {
  const id = parseInt(req.params.id);

  client.query(
    "DELETE FROM bateman_facts WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Fact deleted with ID: ${id}`);
    }
  );
};
module.exports = {
  query: (text, params, callback) => {
    return client.query(text, params, callback);
  },
  getFacts,
  postFact,
  updateFact,
  deleteFact,
};
