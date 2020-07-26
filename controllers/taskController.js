const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const Task = require("../models/taskModel");
const AppError = require("../utils/appError");
const User = require("../models/userModel");

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
  const sanitizedBody = sanitizeFields(req.body, ["isCompleted"]);

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

exports.getUserTasks = catchAsync(async (req, res, next) => {
  // case 1
  // or looking for tasks with currently logged user authority
  /* const tasks = await Task.find({ author: req.user._id }).populate({
    path: "author",
    select: "name email photo",
  }); */

  // case 2
  // or creating virtually populated field - tasks
  // virtually populated objects are stored in tasks document
  // but we virtually drag them into imageinary user.tasks field on user object
  const user = await User.findById(req.user._id).populate({
    path: "tasks",
    select: "",
    // nested population
    populate: {
      path: "author",
      select: "name email photo",
    },
  });

  res.status(200).json({
    status: "success",
    // data: tasks, // case 1
    data: user.tasks, // case 2
  });
});

exports.addUserTask = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["title", "description"]);
  sanitizedBody.author = req.user._id;
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

exports.getUserTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, author: req.user._id });

  if (!task) return next(new AppError("There is no task with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.updateUserTask = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["isCompleted"]);

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, author: req.user._id },
    sanitizedBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) return next(new AppError("No document found with that ID.", 404));

  res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.deleteUserTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    author: req.user._id,
  });

  if (!task) return next(new AppError("No document found with that ID.", 404));

  res.status(204).json({
    status: "success",
    data: task,
  });
});
