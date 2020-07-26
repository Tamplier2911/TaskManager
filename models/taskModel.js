const { Schema, model } = require("mongoose");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task must have a title."],
      trim: true,
      maxlength: [
        80,
        "Task title must not consist of more than 80 characters.",
      ],
      minlength: [1, "Task title must consist of 1 character or more."],
    },
    description: {
      type: String,
      required: [true, "Task must have a description."],
      trim: true,
      maxlength: [
        5000,
        "Task description must not consist of more than 5000 characters.",
      ],
      minlength: [1, "Task description must consist of 1 character or more."],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    author: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Task must have an author."],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Task = model("Task", taskSchema);
module.exports = Task;
