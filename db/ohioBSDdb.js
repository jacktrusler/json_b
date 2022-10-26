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
    `INSERT INTO ohbsd_contact(full_name, email, phone, message, created_on) 
     VALUES ($1, $2, $3, $4, $5);`,
    [b.name, b.email, b.phone, b.message, b.date],
    (error, response) => {
      if (error) {
        res.send({status: 400, message: error.detail})
        throw (error)
        console.log(error)
      } else {
        res.send({ status: 200, message: "contact added to database" });
      }
      client.end()
    }
  )
};

module.exports = {
  postContact,
  getContact,
};
