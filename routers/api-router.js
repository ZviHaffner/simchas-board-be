const apiRouter = require("express").Router();
const { getAllEndpoints } = require("../controllers/api.controllers");

apiRouter.route("/").get(getAllEndpoints);

module.exports = apiRouter;
