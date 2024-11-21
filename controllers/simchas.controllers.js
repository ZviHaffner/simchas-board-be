const {
  fetchSimchasByTypeWithHostAndDate,
  fetchAllSimchas,
  fetchCompleteSimchaById,
  insertSimcha,
} = require("../models/simchas.models");

exports.getAllSimchas = (req, res, next) => {
  fetchAllSimchas()
    .then(({ rows }) => {
      res.status(200).send({ simchas: rows });
    })
    .catch(next);
};

exports.getCompleteSimchaById = (req, res, next) => {
  const { id } = req.params;
  fetchCompleteSimchaById(id)
    .then((simcha) => {
      res.status(200).send({ simcha });
    })
    .catch(next);
};

exports.getSimchasByTypeWithHostAndDate = (req, res, next) => {
  const { simcha_type } = req.params;
  const { start_date, end_date } = req.query;
  fetchSimchasByTypeWithHostAndDate(simcha_type, start_date, end_date)
    .then((simchas) => {
      res.status(200).send({ simchas });
    })
    .catch(next);
};

exports.addSimcha = (req, res, next) => {
  const newSimcha = req.body;
  insertSimcha(newSimcha)
    .then((simcha) => {
      res.status(201).send({ simcha });
    })
    .catch(next);
};
