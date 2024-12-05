const eventsRouter = require("express").Router();
const { addEvent, patchEventById, eraseEventById } = require("../controllers/events.controllers");

eventsRouter.route("/").post(addEvent);

eventsRouter.route("/:id").patch(patchEventById).delete(eraseEventById);

module.exports = eventsRouter;
