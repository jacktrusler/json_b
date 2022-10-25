const { Client } = require('pg')
require('dotenv').config();
console.log(process.env.DB_USERNAME);
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

const getContact = (req, res) => {
  client.query("SELECT * FROM ohbsd_contact;", (err, dbres) => {
	  if (err){
      res.send(err)
      console.log(err);
	  }
    res.send(dbres.rows);
  });
};
const postContact = (req, res) => {
  //make keys lowercase to case check
  const b = req.body 
  
  client.query(
    `INSERT INTO ohbsd_contact(full_name, email, phone, message) 
     VALUES ($1, $2, $3, $4);`,
    [b.name, b.email, b.phone, b.message]
  )

  res.send({ status: 200, something: "yo" });
};

module.exports = {
  postContact,
  getContact,
};
