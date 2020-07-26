const { Router } = require("express");
const {
  getAllTasks,
  createOneTask,
  getOneTask,
  updateOneTask,
  deleteOneTask,
  getUserTasks,
  addUserTask,
  getUserTask,
  updateUserTask,
  deleteUserTask,
} = require("../controllers/taskController");

const { protect, restrictTo } = require("../controllers/authController");

const router = Router();

// PROTECTED
router.use(protect);

router.route("/userTask").get(getUserTasks).post(addUserTask);

router
  .route("/userTask/:id")
  .get(getUserTask)
  .patch(updateUserTask)
  .delete(deleteUserTask);

// RESTRICTED
router.use(restrictTo("admin", "owner"));

router.route("/").get(getAllTasks).post(createOneTask);

router.route("/:id").get(getOneTask).patch(updateOneTask).delete(deleteOneTask);

module.exports = router;
