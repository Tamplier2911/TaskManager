const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const User = require("../models/userModel");

exports.getAllUsers = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.createOneUser = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, [
    "name",
    "email",
    "password",
    "passwordConfirm",
  ]);

  const { _id, photo, name, email, role } = await User.create(sanitizedBody);
  const filteredUser = { _id, photo, name, email, role };

  res.status(201).json({
    status: "success",
    data: filteredUser,
  });
});

exports.getOneUser = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.updateOneUser = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.deleteOneUser = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};
