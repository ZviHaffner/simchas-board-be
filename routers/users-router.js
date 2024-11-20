const usersRouter = require("express").Router();
const {
  getUserById,
  getAllUsers,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:id").get(getUserById);

module.exports = usersRouter;
