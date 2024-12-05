const {
  fetchSimchasByTypeWithHostAndDate,
  fetchAllSimchas,
  fetchCompleteSimchaById,
  insertSimcha,
  updateSimchaById,
  deleteSimchaByID,
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

exports.patchSimchaById = (req, res, next) => {
  const { id } = req.params;
  const { column, value } = req.body;
  updateSimchaById(id, column, value)
    .then((updatedSimcha) => {
      res.status(200).send({ updatedSimcha });
    })
    .catch(next);
};

exports.eraseSimchaById = (req, res, next) => {
  const { id } = req.params;
  deleteSimchaByID(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
