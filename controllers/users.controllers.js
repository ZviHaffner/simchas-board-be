const { fetchAllUsers, fetchUserById } = require("../models/users.models");

exports.getAllUsers = (req, res) => {
  fetchAllUsers().then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
};

exports.getUserById = (req, res, next) => {
  const { id } = req.params;
  fetchUserById(id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
