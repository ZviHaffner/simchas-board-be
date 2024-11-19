const simchasRouter = require("express").Router();
const {
  getSimchasByTypeWithHostAndDate,
  getAllSimchas,
} = require("../controllers/simchas.controllers");

simchasRouter.route("/").get(getAllSimchas);

simchasRouter.route("/types/:simcha_type").get(getSimchasByTypeWithHostAndDate);

module.exports = simchasRouter;
