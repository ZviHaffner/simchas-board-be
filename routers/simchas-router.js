const simchasRouter = require("express").Router();
const {
  getSimchasByTypeWithHostAndDate,
  getAllSimchas,
  getCompleteSimchaById,
  addSimcha,
  patchSimchaById,
  eraseSimchaById,
} = require("../controllers/simchas.controllers");

simchasRouter.route("/").get(getAllSimchas).post(addSimcha);

simchasRouter.route("/:id").patch(patchSimchaById).delete(eraseSimchaById);

simchasRouter.route("/:id/details").get(getCompleteSimchaById);

simchasRouter.route("/types/:simcha_type").get(getSimchasByTypeWithHostAndDate);

module.exports = simchasRouter;
