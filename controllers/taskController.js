const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const Task = require("../models/taskModel");
const AppError = require("../utils/appError");

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find();

  res.status(200).json({
    status: "success",
    data: tasks,
  });
});

exports.createOneTask = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["title", "description"]);
  const task = await Task.create(sanitizedBody);

  if (!task)
    return next(
      new AppError("Document was not created, please try again later.", 400)
    );

  res.status(201).json({
    status: "success",
    data: task,
  });
});

exports.getOneTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) return next(new AppError("No document found with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.updateOneTask = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["isComplited"]);

  const task = await Task.findByIdAndUpdate(req.params.id, sanitizedBody, {
    new: true,
    runValidators: true,
  });

  if (!task) return next(new AppError("No document found with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.deleteOneTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) return next(new AppError("No document found with that ID.", 404));

  res.status(204).json({
    status: "success",
    data: task,
  });
});
