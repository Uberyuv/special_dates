const mongoose = require("mongoose");
const constants = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    dob: Date,
    phone: Number,
    fullName: String,
    userType: {
      type: String,
      enum: [constants.userType.customer, constants.userType.admin],
      default: constants.userType.customer,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
