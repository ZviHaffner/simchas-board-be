const usersRouter = require("express").Router();
const {
  getUserById,
  getAllUsers,
  addUser,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(addUser);
usersRouter.route("/:id").get(getUserById);

module.exports = usersRouter;
