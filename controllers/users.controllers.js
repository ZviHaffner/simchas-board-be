const { fetchAllUsers, fetchUserById, insertUser } = require("../models/users.models");

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

exports.addUser = (req, res, next) => {
  const newUser = req.body;
  insertUser(newUser)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};