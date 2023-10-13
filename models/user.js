import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { log } from "console";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  email: {
    type: String,
    required: [true, "Please enter a name"],
    unique: [true, "Email already exists"],
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minilength: [6, "Password must be at least 6 character"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  // if the password is modified then only this hash function will run otherwise it will call the next function

  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
// we can add the cookie in the controller also

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex"); // this will generate a token

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); // we are hashing the token so that we can store it in the database which is sent to the email

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;       // token will expire in 10 mins

  return resetToken;     // we are sending the unhashed token to the user
};

const User = mongoose.model("User", userSchema);

export default User;

// compare method will compare the entered password with the encrypted password in the schema and this will return true or false

// password mein select ka use karege kyuki jab bhi data reload ho to sabhi field filled hone chaiye expect password

// Posts will be a array since har ek user ke post ka array hoga jisme pura post hoga

// this.password means the password store in the userSchema
