const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
      maxlength: [40, "Name must not consist of more than 40 characters."],
      minlength: [1, "Name must consist of 1 character or more."],
    },
    email: {
      type: String,
      require: [true, "Please enter your email."],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email must be valid."],
    },
    photo: {
      type: String,
      default: "static/images/users/default.jpg",
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [8, "Password must consist of at least 8 characters."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Confirmation must match original.",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("email") || this.isNew) {
    const md5hash = crypto.createHash("md5").update(this.email).digest("hex");
    this.photo = `https://gravatar.com/avatar/${md5hash}?d=identicon`;
    return next();
  }
  next();
});

const User = model("User", userSchema);
module.exports = User;
