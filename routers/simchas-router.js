const simchasRouter = require("express").Router();
const {
  getSimchasByTypeWithHost,
} = require("../controllers/simchas.controllers");

simchasRouter.route("/:simcha_type").get(getSimchasByTypeWithHost);

module.exports = simchasRouter;
