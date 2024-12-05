const {
  fetchAllUsers,
  fetchUserById,
  insertUser,
  updateUserById,
  deleteUserByID,
} = require("../models/users.models");

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

exports.patchUserById = (req, res, next) => {
  const { id } = req.params;
  const { column, value } = req.body;
  updateUserById(id, column, value)
    .then((updatedUser) => {
      res.status(200).send({ updatedUser });
    })
    .catch(next);
};

exports.eraseUserById = (req, res, next) => {
  const { id } = req.params;
  deleteUserByID(id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
