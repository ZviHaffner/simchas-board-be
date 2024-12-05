const usersRouter = require("express").Router();
const {
  getUserById,
  getAllUsers,
  addUser,
  patchUserById,
  eraseUserById,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(addUser);
usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(patchUserById)
  .delete(eraseUserById);

module.exports = usersRouter;
