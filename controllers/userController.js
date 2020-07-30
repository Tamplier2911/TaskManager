const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

// handlers
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlesFactory");

// user manipulation function

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  // await Task.deleteMany({ author: req.user._id });

  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  if (req.secure || req.headers["x-forwarded-proto"] === "https")
    cookieOptions.secure = true;

  res.status(204).json({
    status: "success",
    msg: "User successfuly deleted.",
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["name", "email"]);

  const user = await User.findByIdAndUpdate(req.user._id, sanitizedBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// admin manipulation functions
exports.getAllUsers = getAll(User);

exports.createOneUser = createOne(
  User,
  ["name", "email", "password", "passwordConfirm"],
  ["_id", "photo", "name", "email", "role"]
);

exports.getOneUser = getOne(User);

exports.updateOneUser = updateOne(User, ["name", "email"]);

exports.deleteOneUser = deleteOne(User);
