const { insertSigPerson } = require("../models/sig-persons.models");

exports.addSigPerson = (req, res, next) => {
  const newSigPerson = req.body;
  insertSigPerson(newSigPerson)
    .then((sigPerson) => {
      res.status(201).send({ sigPerson });
    })
    .catch(next);
};