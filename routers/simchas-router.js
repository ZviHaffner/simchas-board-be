const simchasRouter = require("express").Router();
const {
  getSimchasByTypeWithHostAndDate,
} = require("../controllers/simchas.controllers");

simchasRouter.route("/:simcha_type").get(getSimchasByTypeWithHostAndDate);

module.exports = simchasRouter;
