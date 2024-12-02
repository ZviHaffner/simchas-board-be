const usersRouter = require("express").Router();
const {
  getUserById,
  getAllUsers,
  addUser,
  patchUserById,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(addUser);
usersRouter.route("/:id").get(getUserById).patch(patchUserById);

module.exports = usersRouter;
