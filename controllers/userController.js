const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: users,
  });
});

exports.createOneUser = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, [
    "name",
    "email",
    "password",
    "passwordConfirm",
  ]);

  const user = await User.create(sanitizedBody);

  if (!user)
    return next(
      new AppError("Document was not created, please try again later.", 400)
    );

  const { _id, photo, name, email, role } = user;
  const filteredUser = { _id, photo, name, email, role };

  res.status(201).json({
    status: "success",
    data: filteredUser,
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("No document found with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.updateOneUser = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["name", "email"]);

  const user = await User.findByIdAndUpdate(req.params.id, sanitizedBody, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError("No document found with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteOneUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError("No document found with that ID.", 404));

  res.status(204).json({
    status: "success",
    data: user,
  });
});
