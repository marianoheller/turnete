const express = require("express");
const morgan = require("morgan");

const handler = require("./handler");
const app = express();

app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.use("/", handler);

module.exports = app;