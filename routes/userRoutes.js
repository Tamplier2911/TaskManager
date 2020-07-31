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
router.route("/signup").post(signUp);

// login
router.route("/login").post(logIn);

// logout
router.route("/logout").get(logOut);

// forgot password
router.route("/forgotPassword").post(forgotPassword);

// reset password
router.route("/resetPassword/:token").patch(resetPassword);

// get user object
router.route("/getMe").get(isLoggedIn, getUserObject);

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
