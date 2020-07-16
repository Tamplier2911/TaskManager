const { Router } = require("express");
const {
  getAllTasks,
  createOneTask,
  getOneTask,
  updateOneTask,
  deleteOneTask,
} = require("../controllers/taskController");

const router = Router();

router.route("/").get(getAllTasks).post(createOneTask);

router.route("/:id").get(getOneTask).patch(updateOneTask).delete(deleteOneTask);

module.exports = router;
