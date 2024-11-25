const sigPersonsRouter = require("express").Router();
const { addSigPerson } = require("../controllers/sig-persons.controllers");

sigPersonsRouter.route("/").post(addSigPerson);

module.exports = sigPersonsRouter;
