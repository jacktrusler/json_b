const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

//Middleware to parse requests
app.use(express.json());
app.use(cors())

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

let lastAvaxCallTime = 0;
let lastUsdcCallTime = 0;
let cachedAvaxRes;
let cachedUsdcRes;

async function fetchAvaxPrice() {
  const response = await axiosInstance.get(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=AVAX'
  )
  return response;
}

async function fetchUsdcPrice() {
  const response = await axiosInstance.get(
    'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=USDC'
  )
  return response;
}

//Get Current Avax Price, cache for 5 minutes
app.get("/avax_price", async (req, res) => {
  if (Date.now() - lastAvaxCallTime > FIVE_MINUTES) {
    const response = await fetchAvaxPrice();
    lastAvaxCallTime = Date.now()
    cachedAvaxRes = response.data.data
  }
  res.send({
    price: cachedAvaxRes.AVAX.quote.USD.price,
    fullResponse: cachedAvaxRes,
  })
});

//Get Current Usdc Price, cache for 5 minutes
app.get("/usdc_price", async (req, res) => {
  if (Date.now() - lastUsdcCallTime > FIVE_MINUTES) {
    const response = await fetchUsdcPrice();
    lastUsdcCallTime = Date.now()
    cachedUsdcRes = response.data.data
  }
  res.send({
    price: cachedUsdcRes.USDC.quote.USD.price,
    fullResponse: cachedUsdcRes,
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
