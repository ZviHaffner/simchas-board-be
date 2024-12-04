const sigPersonsRouter = require("express").Router();
const { addSigPerson, patchSigPersonById } = require("../controllers/sig-persons.controllers");

sigPersonsRouter.route("/").post(addSigPerson);

sigPersonsRouter.route("/:id").patch(patchSigPersonById);

module.exports = sigPersonsRouter;
