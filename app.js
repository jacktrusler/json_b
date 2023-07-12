const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
require('dotenv').config();

const apiKey = process.env.CMC_PRO_API_KEY;
const FIVE_MINUTES = 1000 * 60 * 5;

const axiosInstance = axios.create({
  timeout: 3000,
  headers: { 
    "Content-Type": "application/json",
    "X-CMC_PRO_API_KEY": apiKey,
  }
})

let lastApiCallTime = 0;
let cachedAvaxRes;

async function fetchAvaxPrice() {
  const response = await axiosInstance.get(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=AVAX'
  )
  return response;
}

//Middleware to parse requests
app.use(express.json());

//Get Current Avax Price, cache for 5 minutes
app.get("/avax_price", async (req, res) => {
  if (Date.now() - lastApiCallTime > FIVE_MINUTES) {
    const response = await fetchAvaxPrice();
    lastApiCallTime = Date.now()
    cachedAvaxRes = response.data.data
  }
  res.send({
    price: cachedAvaxRes.AVAX.quote.USD.price,
    fullResponse: cachedAvaxRes,
  })
});

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
