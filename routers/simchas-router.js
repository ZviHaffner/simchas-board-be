const simchasRouter = require("express").Router();
const {
  getSimchasByTypeWithHostAndDate,
  getAllSimchas,
  getCompleteSimchaById,
  addSimcha,
} = require("../controllers/simchas.controllers");

simchasRouter.route("/").get(getAllSimchas).post(addSimcha);

simchasRouter.route("/:id/details").get(getCompleteSimchaById);

simchasRouter.route("/types/:simcha_type").get(getSimchasByTypeWithHostAndDate);

module.exports = simchasRouter;
