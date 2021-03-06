const express = require("express");
const morgan = require("morgan");

const handler = require("./handler");
const app = express();

if (process.env.appenv === "dev") {
  app.set("port", process.env.PORT || 3000);
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
}

app.get("/api", handler);

module.exports = app;
