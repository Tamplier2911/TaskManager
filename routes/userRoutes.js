const { Router } = require("express");
const {
  getAllUsers,
  createOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} = require("../controllers/userController");

const router = Router();

router.route("/").get(getAllUsers).post(createOneUser);

router.route("/:id").get(getOneUser).patch(updateOneUser).delete(deleteOneUser);

module.exports = router;
