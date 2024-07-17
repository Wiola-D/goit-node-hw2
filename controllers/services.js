const Contact = require("../models/Contacts1");

const fetchContacts = () => {
  return Contact.getAll();
};

// const fetchContact = (id) => {
//   return Contact.findById({ _id: id });
// };

// const insertContact = ({ name, email, phone, favorite }) => {
//   return Contact.create({ name, email, phone, favorite });
// };

// const updateContact = ({ id, toUpdate, upsert = false }) => {
//   return Contact.findByIdAndUpdate(
//     { _id: id },
//     { $set: toUpdate },
//     { new: true, runValidators: true, strict: "throw", upsert }
//   );
// };

// const removeContact = (id) => Contact.deleteOne({ _id: id });

module.exports = {
  fetchContacts,
  // fetchContact,
  // insertContact,
  // updateContact,
  // removeContact,
};
