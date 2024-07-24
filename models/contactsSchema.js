const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

contactSchema.index({ name: 1 });

contactSchema.statics.getAll = function (ownerid) {
  return Contact.find({ owner: ownerid }).lean();
};

contactSchema.methods.htmlify = function () {
  return `<h3>Hello</h3>`;
};

const Contact = mongoose.model("contact", contactSchema, "contacts");

module.exports = Contact;
