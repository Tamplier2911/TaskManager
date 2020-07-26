const AppError = require("../utils/appError");

// invalid id - www
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// duplicates
const handleDuplicateFieldDB = (err) => {
  const duplicate = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${duplicate}. Pleasae use another value.`;
  return new AppError(message, 400);
};

// validations
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// jwt error
const handleJWTError = (err) => {
  const message = `${err.message[0].toUpperCase()}${err.message.slice(
    1
  )}, please log in again.`;
  return new AppError(message, 400);
};

// jwt expired
const handleJWTExpired = (err) => {
  const message = `${err.message.toUpperCase().slice(0, 3)} ${err.message.slice(
    4
  )}, please try to relog.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  console.log(
    `Status: ${err.status} \n Name: ${err.name} \n StatusCode: ${err.statusCode} \n Code: ${err.code} \n Message: ${err.message} \n ${err.stack}`
  );

  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERED WEBPAGE
  /* return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  }); */
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // operational errors
    if (err.isOperational)
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

    // programmatic or other uknown errors - no detail leaks

    // 1) log error in server logs
    console.error("Non-operational API ERROR ಥ_ಥ", err);

    // 2) send generic message
    return res.status(500).json({
      status: "error",
      message: "Something is not quite right ಥ_ಥ!",
    });
  }

  // RENDERED WEBPAGE
  /*
  // operational
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // programmatic or other uknown errors - no detail leaks

  // 1) log error in server logs
  console.error("Non-operational RENDERED ERROR ಥ_ಥ", err);

  // 2) render generic error
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Something is not quite right ಥ_ಥ!",
  });
  */
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack); <-- stack trace
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    // Take copy of original error object, and work with it since now
    // error = JSON.parse(JSON.stringify(err));
    error = Object.assign({}, err);

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
    } else if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    } else if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    } else if (error.name === "TokenExpiredError") {
      error = handleJWTExpired(error);
    }

    sendErrorProd(error.message ? error : err, req, res);
  }
};
