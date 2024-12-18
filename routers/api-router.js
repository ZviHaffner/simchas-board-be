const { getAllEndpoints } = require("../controllers/api.controllers");
const apiRouter = require("express").Router();

const simchasRouter = require("./simchas-router");
const sigPersonsRouter = require("./sig-persons-router");
const usersRouter = require("./users-router");
const eventsRouter = require("./events-router");

apiRouter.route("/").get(getAllEndpoints);

apiRouter.use("/users", usersRouter);
apiRouter.use("/simchas", simchasRouter);
apiRouter.use("/sig-persons", sigPersonsRouter);
apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
