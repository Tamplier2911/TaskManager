// init
const express = require("express");
const path = require("path");

// security
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// parse and compress
const cookieParser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");

// cors and https
const cors = require("cors");
const enforce = require("express-sslify");

// error handling
// const AppError = require('./utils');
// const globalErrorHandler = require('./controllers')

// routers
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");

// html engine

const app = express();
app.enable("trust proxy");

app.use(cors());
app.options("*", cors());

app.use(helmet());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// limiters
app.use(express.json({ limit: "10kb" }));
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in a hour.",
});
app.use("/api", limiter);

// parsers
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// protection
app.use(xss());
app.use(mongoSanitize());
app.use(hpp({ whitelist: [] }));

// observer logs
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // CONSOLE LOG COOKIES ON EACH REQUEST
  if (process.env.NODE_ENV === "development") {
    // if (req.body) console.log(req.body);
    // if (req.cookies) console.log(req.cookies);
    console.log(req.requestTime);
  }
  next();
});

// server static assets
app.use("/static", express.static(path.join(__dirname, "static")));

// html rendering engine and views
// app.set("view engine", "...");
// app.set("views", path.join(__dirname, "views"));

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

if (process.env.NODE_ENV === "production") {
  // compress all response bodies
  app.use(compression());

  // enforce https whenever http are made
  app.use(enforce.HTTPS({ trustProtoHeader: true }));

  // serving static files
  app.use(
    express.static(path.join(__dirname, "client/build"), {
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");
        if (path.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (hashRegExp.test(path)) {
          res.setHeader("Cache-Control", "max-age=31536000");
        }
      },
    })
  );

  // on request to any route that is not covered - send index html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
} else {
  // on request to any route that is not covered - send 404 html
  app.get("*", (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        message: "You are in development mode!",
      },
    });
  });
}

// GLOBAL ERROR HANDLING MIDDLEWARE
// app.use(globalErrorHandler);

module.exports = app;
