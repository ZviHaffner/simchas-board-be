const {
  insertSigPerson,
  updateSigPersonById,
  deleteSigPersonByID,
} = require("../models/sig-persons.models");

exports.addSigPerson = (req, res, next) => {
  const newSigPerson = req.body;
  insertSigPerson(newSigPerson)
    .then((sigPerson) => {
      res.status(201).send({ sigPerson });
    })
    .catch(next);
};

exports.patchSigPersonById = (req, res, next) => {
  const { id } = req.params;
  const { column, value } = req.body;
  updateSigPersonById(id, column, value)
    .then((updatedSigPerson) => {
      res.status(200).send({ updatedSigPerson });
    })
    .catch(next);
};

exports.eraseSigPersonById = (req, res, next) => {
  const { id } = req.params;
  deleteSigPersonByID(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
