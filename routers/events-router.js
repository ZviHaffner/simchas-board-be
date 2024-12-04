const eventsRouter = require("express").Router();
const { addEvent, patchEventById } = require("../controllers/events.controllers");

eventsRouter.route("/").post(addEvent);

eventsRouter.route("/:id").patch(patchEventById);

module.exports = eventsRouter;
