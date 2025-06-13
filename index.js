require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const url = require("url");
const { json } = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// my app

const urlMap = new Map();

let counter = 1;

app.use(express.urlencoded({ extended: true }));

// Your first API endpoint
app.post("/api/shorturl", (req, res) => {
  let original;
try {
  original = new URL(req.body.url);  
} catch (e) {
  return res.json({ error: "invalid url" });
}

  dns.lookup(original.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      urlMap.set(counter++, original);
      res.json({ original_url: original, short_url: counter -1});
    }
  });
});

app.get("/api/shorturl/:count?", (req, res) => {
  let query = Number(req.params.count);
  if (urlMap.get(query)) {
    res.redirect(urlMap.get(query));
    return;
  }
  return res.json({ error: "No short URL found for the given input" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
