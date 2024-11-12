const express = require("express");
const apiRouter = require("./routers/api-router");
const app = express();

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;
