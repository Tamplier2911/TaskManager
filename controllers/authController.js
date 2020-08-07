const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sanitizeFields = require("../utils/sanitizeFields");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const Email = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (req.secure || req.headers["x-forwarded-proto"] === "https")
    cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  const { _id, photo, name, email, role } = user;
  const filteredData = { _id, photo, name, email, role };

  res.status(statusCode).json({
    status: "success",
    token: token,
    data: filteredData,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const sanitizedFields = sanitizeFields(req.body, [
    "name",
    "email",
    "password",
    "passwordConfirm",
  ]);

  const user = await User.create(sanitizedFields);

  // send email logic
  const url =
    process.env.NODE_ENV === "production"
      ? `https://tasks-manager-s.herokuapp.com/profile`
      : `http://localhost:3000/profile`;

  // create instance of Email with user, url and data objects
  const sendEmail = new Email(user, url, {});

  // send email
  await sendEmail.sendWelcome();

  // create and send jwt
  createSendToken(user, 201, req, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if fields exists
  if (!email || !password)
    return next(new AppError("Please provide email and password.", 400));

  // check if user with this email is exists
  const user = await User.findOne({ email }).select("+password +active");

  // if no user with this email or password is not correct return error
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password.", 401));

  // if user is currently inactive return an error
  if (!user.active)
    return next(new AppError("This account is no longer active.", 404));

  // create and sign jwt and send it to user
  createSendToken(user, 200, req, res);
});

exports.logOut = (req, res, next) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  if (req.secure || req.headers["x-forwarded-proto"] === "https")
    cookieOptions.secure = true;

  res.status(200).json({
    status: "success",
    msg: "You have logged out securely.",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // check if token exists in authorization header or in cookies
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // if no token throw error that route is protected
  if (!token)
    return next(
      new AppError("You have to login, in order to view this route.", 401)
    );

  // if there is a token verify that token is not changed
  // if so verification will return payload with user id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user with certain id is still exists
  const user = await User.findById(decoded.id);

  // if no user found - inform with an error
  if (!user)
    return next(new AppError("User with that ID is no longer exists.", 401));

  // check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError("User recently changed password. Please log in again.", 401)
    );

  // grant access to protected routes
  req.user = user;
  // res.locals.user = user;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // check if token exists in authorization header or in cookies
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // if no token jump to next middleware
  if (!token || token === null || String(token) === "null") return next();

  // if there is a token verify that token is not changed
  // if so verification will return payload with user id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user with certain id is still exists
  const user = await User.findById(decoded.id);

  // if no user found jump to next middleware
  if (!user) return next();

  // check if user changed password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) return next();

  // if we get here user is logged in
  req.user = user;
  // jump to next middleware with user attached to req
  next();
});

exports.getUserObject = catchAsync(async (req, res, next) => {
  const { user } = req;

  // if user is not authenticated return null
  if (!user)
    return res.status(200).json({
      status: "success",
      data: {
        userObject: null,
      },
    });

  // else filter fields we interested in
  const userObject = sanitizeFields(user, [
    "_id",
    "name",
    "email",
    "photo",
    "role",
  ]);

  // and return user object
  res.status(200).json({
    status: "success",
    data: {
      userObject,
    },
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permissions to perform this action.", 403)
      );
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError("User with that email address does not exists.", 404)
    );

  // generate random token
  const resetToken = user.createPasswordResetToken();

  // saving token and exiration date caused by method above
  // deactivating validation
  await user.save({ validateBeforeSave: false });

  // defining urls for email
  const url =
    process.env.NODE_ENV === "production"
      ? `https://tasks-manager-s.herokuapp.com/restore/${resetToken}`
      : `http://localhost:3000/restore/${resetToken}`;

  // create instance of email with current user and rest url
  const sendEmail = new Email(user, url, { resetToken, resetToken });

  // perform password reset method on email instance
  await sendEmail.sendPasswordReset();

  res.status(200).json({
    status: "success",
    message: "Reset token was sent to your email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    return next(
      new AppError("You must provide new password and confirm it.", 400)
    );

  // get user token from params and hash it
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // find user comparing hashed token to token stored in db
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });

  // if there is no user or token has expired send error
  if (!user) return next(new AppError("Token is invalid or has expired.", 400));

  // if we get here we may perform password changes
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpired = undefined;
  await user.save();

  // log user in by sending jwt
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm)
    return next(
      new AppError(
        "Please, provide your password, new password and confirmation.",
        400
      )
    );

  // get user from collection, user project we get from protect middleware
  const userId = req.user._id;
  const user = await User.findById(userId).select("+password");

  // if there is no user or if password is not correct throw an error
  if (!user || !(await user.correctPassword(currentPassword, user.password)))
    return next(new AppError("Your password is incorrect.", 401));

  // if we got user and password is correct, we can update users password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  // log user in
  createSendToken(user, 200, req, res);
});
