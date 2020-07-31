const catchAsync = require("../utils/catchAsync");
const sanitizeFields = require("../utils/sanitizeFields");
const User = require("../models/userModel");
const Task = require("../models/taskModel");
const AppError = require("../utils/appError");

const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// handlers
const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("./handlesFactory");

// user manipulation function

// creating storage - saving image in memory buffer
const multerStorage = multer.memoryStorage();

// filter properties - is file an image? is file properly sized?
const multerFiilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("File must be an image.", 400), false);
  }
};

// apply storage and filter properties
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiilter,
});

// image upload middleware - "photo" refer photo field name
exports.uploadUserPhoto = upload.single("photo");

// image resizing and conversion
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  // if no file in req jump to next middleware
  if (!req.file) return next();

  // store image filename in req.file.filename
  req.file.filename = `static/uploads/images/users/user-${
    req.user._id
  }-${Date.now()}.jpeg`;

  // perform sharpening and conversion
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 50 })
    .toFile(`${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const sanitizedBody = sanitizeFields(req.body, ["name", "email"]);

  // if there is req.file
  if (req.file) {
    // save path to new user photo in update object
    sanitizedBody.photo = req.file.filename;

    // get old user photo
    const oldPhoto = req.user.photo.split("/").pop();

    // built path to where old user photo is stored
    const oldPhotoPath = path.join(
      __dirname,
      "..",
      "static/uploads/images/users",
      oldPhoto
    );

    // remove old user photo - if its not default
    if (oldPhoto !== "default.png" && oldPhotoPath.endsWith(".jpeg")) {
      await fs.unlink(oldPhotoPath, (err) => {
        if (err) {
          return next(
            new AppError(`Old photo "${oldPhoto}" was not cleaned.`, 400)
          );
        }
        console.log(`Old photo "${oldPhoto}" was successfully removed.`);
      });
    }
  }

  // perform chages
  const user = await User.findByIdAndUpdate(req.user._id, sanitizedBody, {
    new: true,
    runValidators: true,
  });

  // if no user object returned - no changes were made
  if (!user)
    return next(
      new AppError("Updates not applied, please try again later.", 400)
    );

  // return changed user object
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    active: false,
    photo: "static/uploads/images/users/default.png",
  });
  // await Task.deleteMany({ author: req.user._id });

  if (!user) return next(new AppError("User with that id is not found.", 404));

  // clean up users data

  // get old user photo
  const oldPhoto = req.user.photo.split("/").pop();

  // built path to where old user photo is stored
  const oldPhotoPath = path.join(
    __dirname,
    "..",
    "static/uploads/images/users",
    oldPhoto
  );

  // remove old user photo - if its not default
  if (oldPhoto !== "default.png" && oldPhotoPath.endsWith(".jpeg")) {
    await fs.unlink(oldPhotoPath, (err) => {
      if (err) {
        return next(
          new AppError(`Old photo "${oldPhoto}" was not cleaned.`, 400)
        );
      }
      console.log(`Old photo "${oldPhoto}" was successfully removed.`);
    });
  }

  // clean up users tasks
  await Task.deleteMany({ author: req.user._id });

  // log user out and clean up his cookie
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
