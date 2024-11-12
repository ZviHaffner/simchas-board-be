const { fetchSimchasByTypeWithHost } = require("../models/simchas.models");

exports.getSimchasByTypeWithHost = (req, res, next) => {
  const { simcha_type } = req.params;  
  fetchSimchasByTypeWithHost(simcha_type)
    .then((simchas) => {
      res.status(200).send({ simchas });
    })
    .catch(next);
};