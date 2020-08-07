const { Router } = require("express");

// user controller
const {
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
  getAllUsers,
  createOneUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} = require("../controllers/userController");

// auth controller
const {
  signUp,
  logIn,
  logOut,
  forgotPassword,
  resetPassword,
  protect,
  isLoggedIn,
  getUserObject,
  updatePassword,
  restrictTo,
} = require("../controllers/authController");

const router = Router();

// signup
router.post("/signup", signUp);

// login
router.post("/login", logIn);

// logout
router.get("/logout", logOut);

// forgot password
router.post("/forgotPassword", forgotPassword);

// reset password
router.patch("/resetPassword/:token", resetPassword);

// get user object
router.get("/getMe", isLoggedIn, getUserObject);

// PROTECTED
router.use(protect);

// update user data
router.route("/updateMe").patch(uploadUserPhoto, resizeUserPhoto, updateMe);

// update user password
router.route("/updateMyPassword").patch(updatePassword);

// make user inactive
router.route("/deleteMe").delete(deleteMe);

// RESTRICTED
router.use(restrictTo("admin", "owner"));

router.route("/").get(getAllUsers).post(createOneUser);

router.route("/:id").get(getOneUser).patch(updateOneUser).delete(deleteOneUser);

module.exports = router;
