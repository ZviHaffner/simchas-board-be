const { insertEvent } = require("../models/events.models");

exports.addEvent = (req, res, next) => {
  const newEvent = req.body;
  insertEvent(newEvent)
    .then((event) => {
      res.status(201).send({ event });
    })
    .catch(next);
};