const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
