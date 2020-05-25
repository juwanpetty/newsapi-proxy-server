const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());

app.get("/sources", (req, res) => {
  const url = `https://newsapi.org/v2/sources?country=us`;
  fetch(`${url}&apiKey=${process.env.NEWS_API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

app.get("/articles", (req, res) => {
  const sources = req.query.sources;
  console.log(sources);

  const url = `https://newsapi.org/v2/top-headlines`;
  fetch(`${url}?sources=${sources}&apiKey=${process.env.NEWS_API_KEY}`)
    .then((response) => response.json())
    .then((json) => {
      res.json(json);
    });
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found");
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(
    `Server is running on port ${port} \nVisit http://localhost:${port}`
  );
});
