const sigPersonsRouter = require("express").Router();
const { addSigPerson, patchSigPersonById, eraseSigPersonById } = require("../controllers/sig-persons.controllers");

sigPersonsRouter.route("/").post(addSigPerson);

sigPersonsRouter.route("/:id").patch(patchSigPersonById).delete(eraseSigPersonById);

module.exports = sigPersonsRouter;
