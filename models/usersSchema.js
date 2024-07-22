const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    phone: { type: String, required: [true, "Phone number is required"] },
    email: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.index({ name: 1 });

userSchema.statics.getAll = function () {
  return Contact.find().lean();
};

userSchema.methods.htmlify = function () {
  return `<h3>Hello</h3>`;
};

const Contact = mongoose.model("user", userSchema, "users");

module.exports = Contact;
