const eventsRouter = require("express").Router();
const { addEvent } = require("../controllers/events.controllers");

eventsRouter.route("/").post(addEvent);

module.exports = eventsRouter;
