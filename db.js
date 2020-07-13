/*  

// REFERENCE TO DB MANIPULATION USING DRIVER

const mongodb = require("mongodb");
const dotenv = require("dotenv");

// access to envirnoment variables
dotenv.config({ path: "./.env" });

// initialize mongodb
const MongoClient = mongodb.MongoClient;

// const connectionURL = "mongodb://127.0.0.1:27017";
const connectionURL = process.env.DB.replace(
  "*PASSWORD*",
  process.env.DB_PASSWORD
);
const dbName = "TaskManager";

// mongodb course
// https://university.mongodb.com/courses/M220JS/about
// node js driver
// https://docs.mongodb.com/drivers/node/
// api docks
// http://mongodb.github.io/node-mongodb-native/3.5/api/

// objectid 12 bytes -  4 bytes timestamp, 5 bytes random, 3 bytes increment
console.log(new mongodb.ObjectID());
// raw binary .id.length === 12
console.log(new mongodb.ObjectID().id.length);
// converted to string data .id.toHexString().length === 24
console.log(new mongodb.ObjectID().toHexString());
// first 4 bytes timestamp
console.log(new mongodb.ObjectID().getTimestamp());

// connect using MongoClient
MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.log("Unable to connect to databse.");

    console.log("Connected to database via mongodb driver!");

    // access db
    const db = client.db(dbName);

    // close session
    // client.close(() => console.log("Session closed gracefully!"));

    // INSERT ONE OBJECT to the collection

    db.collection("users").insertOne(
      {
        name: "Thomas White",
        email: "test@example.com",
      },

      (err, res) => {
        if (err) return console.log(err.message);
        console.log(
          `Document was successfuly inserted, objectId - ${res.ops[0]._id}!`
        );
        // client.close();
      }
    );

    // INSERT MULTIPLE OBJECTS to the collection

    db.collection("users").insertMany(
      [
        {
          name: "Rick Sanchez",
          email: "rick@prick.com",
          age: 51,
        },
        {
          name: "Summer",
          email: "summer@boomer.com",
          age: 22,
        },
        {
          name: "Morty",
          email: "morty@losmuertos.com",
          age: 16,
        },
        {
          name: "Dorothy",
          email: "toogood@2betrue.com",
          age: 22,
        },
      ],
      (err, res) => {
        if (err) return console.log(err.message);
        console.log("All documents was successfuly inserte, objectId's are - ");
        res.ops.forEach((obj) => console.log(obj._id));
        // client.close();
      }
    );

    // FIND ONE OBJECTS to the collection

    db.collection("users").findOne(
      { _id: new mongodb.ObjectID("5f09e43a02ec3b45ccc0182f") },
      (err, res) => {
        if (err) return console.log(err.message);
        // res - stores data of single object (first found object that matched cretiea)
        console.log(res);
        // client.close();
      }
    );

    // FIND MULTIPLE OBJECTS to the collection

    // returns a cursor (db reference) - which then can be used to travers over data
    const cursor = db.collection("users").find({ age: 22 });

    // we then can use cursor to perform certain methods on reference
    cursor.toArray((err, users) => {
      if (err) return console.log(err.message);
      // toArray method converts data that matched criteria to array of documents
      console.log(users);
      // client.close();
    });

    // we then can use cursor to perform certain methods on reference
    cursor.count((err, amount) => {
      if (err) return console.log(err.message);
      // count method amount of object that matched criteria we set
      console.log(amount);
      // client.close();
    });

    // UPDATE ONE OBJECT IN COLLECTION

    // atomic operators
    // https://docs.mongodb.com/manual/reference/operator/update/

    // returns a promise if no callback is passed in
    // res object is a large object of properties and methods
    db.collection("users").updateOne(
      { name: "Summer" },
      {
        $inc: {
          age: 1,
        },
      },
      (err, res) => {
        if (err) return console.log(err.message);
        console.log(
          `Matched ${res.matchedCount} documets, modified ${res.modifiedCount}.`
        );
        // client.close();
      }
    );

    // approach using promise
    db.collection("users")
      .updateOne(
        { email: "dorry@lorry.com" },
        {
          $set: {
            email: "dorry@lorry.com",
          },
        }
      )
      .then((data) =>
        console.log(
          `Matched ${data.matchedCount} documets, modified ${data.modifiedCount}.`
        )
      )
      .catch((err) => console.log(err.message));

    // UPDATE MANY OBJECTS IN COLLECTION

    // also returns a promise if no cb passed
    // and res is in shape of object with required properties and methods
    db.collection("users").updateMany(
      { age: 26 },
      {
        $inc: {
          age: 1,
        },
      },
      (err, res) => {
        if (err) return console.log(err.message);
        console.log(
          `Matched ${res.matchedCount} documets, modified ${res.modifiedCount}.`
        );
        // client.close();
      }
    );

    db.collection("users")
      .updateMany(
        { name: "Dorothy" },
        {
          $inc: {
            age: 1,
          },
        }
      )
      .then((data) =>
        console.log(
          `Matched ${data.matchedCount} documets, modified ${data.modifiedCount}.`
        )
      )
      .catch((err) => console.log(err.message));

    // DELETE ONE DOCUMENT FROM COLLECTION

    // returns a promise if no callback passed
    // res contains object with required properties and methods
    db.collection("users").deleteOne({ name: "Rob" }, (err, res) => {
      if (err) return console.log(err.message);
      console.log(res.deletedCount);
      // client.close();
    });

    // using promises
    db.collection("users")
      .deleteOne({ name: "Rob" })
      .then((data) => console.log(data.deletedCount))
      .catch((err) => console.log(err.message));

    // DELETE MANY DOCUMENTS FROM COLLECTION

    // same returns promise if no callback passed
    // res contains object with required properties and methods
    db.collection("users").deleteMany({ name: "Rob" }, (err, res) => {
      if (err) return console.log(err.message);
      console.log(res.deletedCount);
      // client.close();
    });

    // using promises
    db.collection("users")
      .deleteMany({ name: "Rob" })
      .then((data) => console.log(data.deletedCount))
      .catch((err) => console.log(err.message));
  }
);

*/
