const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const Task = require("../models/taskModel");

exports.getAllTasks = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.createOneTask = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["title", "description"]);
  const task = await Task.create(sanitizedBody);

  res.status(201).json({
    status: "success",
    data: task,
  });
});

exports.getOneTask = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.updateOneTask = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};

exports.deleteOneTask = (req, res, next) => {
  const { originalUrl, method, headers } = req;
  res.status(200).json({
    success: true,
    method: method,
    path: originalUrl,
    languages: headers["accept-language"],
  });
};
