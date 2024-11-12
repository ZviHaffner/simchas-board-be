const { getAllEndpoints } = require("../controllers/api.controllers");
const apiRouter = require("express").Router();

const simchasRouter = require("./simchas-router");

apiRouter.route("/").get(getAllEndpoints);

apiRouter.use("/simchas", simchasRouter);

module.exports = apiRouter;
