const { insertEvent, updateEventById } = require("../models/events.models");

exports.addEvent = (req, res, next) => {
  const newEvent = req.body;
  insertEvent(newEvent)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch(next);
};

exports.patchEventById = (req, res, next) => {
  const { id } = req.params;
  const { column, value } = req.body;
  updateEventById(id, column, value)
    .then((updatedEvent) => {
      res.status(200).send({ updatedEvent });
    })
    .catch(next);
};
