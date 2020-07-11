const dotenv = require("dotenv");
const mongoose = require("mongoose");

// error is thrown and didn't catched in sync code
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION", err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
const app = require("./app");

// DB CONNECTION
const db = process.env.DB.replace("*PASSWORD*", process.env.DB_PASSWORD);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfuly connected to DB!");
  });

// SERVER
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Node.js http server is up and listening for incoming requests at port ${PORT}!`
  );
});

// error is thrown and didn't catched in promise
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// sigterm shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM RECIEVED. Shutting down...");
  server.exit(() => {
    console.log("Process terminated...");
  });
});
