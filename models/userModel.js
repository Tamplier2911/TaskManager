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
    /*
    // saving
    // user.tokens = user.tokens.concat({ token });
    // await user.save();
    // searching
    // await User.findOne({ "tokens.token": token })
    tokens: [
      {
        token: {
          type: String,
          require: true,
        },
      },
    ],
    */
  },
  {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// userSchema.set("toObject", { virtuals: true });
// userSchema.set("toJSON", { virtuals: true });

// arguments - virtual field name, configuration obj
// ref - which model we reference
// localField - which field of local model we use
// foreignField - which field of referenced model we use
userSchema.virtual("tasks", {
  ref: "Task",
  foreignField: "author",
  localField: "_id",
});

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
  if (!this.isNew) return next();
  const md5hash = crypto.createHash("md5").update(this.email).digest("hex");
  this.photo = `https://gravatar.com/avatar/${md5hash}?d=identicon`;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // if JWT less than changed - return true password was changed
    // if JWT greater than changed - return false password wasn't changed
    return JWTTimeStamp < changedTimeStamp;
  }

  // false means password not been changed - so we good to continue
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // create reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // reset token hashing and storing in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // token expires in 10 minutes after since it was issued
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000;

  // returning plain (non hashed) token
  return resetToken;
};

const User = model("User", userSchema);
module.exports = User;
