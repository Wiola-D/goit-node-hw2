const Contact = require("../models/contactsSchema");

const fetchContacts = () => {
  return Contact.getAll();
};

const fetchContact = (id) => {
  return Contact.findById({ _id: id });
};

const insertContact = ({ name, email, phone, favorite }, owner) => {
  return Contact.create({ name, email, phone, favorite, owner });
};

const updateContact = ({ id, toUpdate, upsert = false }) => {
  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: toUpdate },
    { new: true, runValidators: true, strict: "throw", upsert }
  );
};

const removeContact = (id) => Contact.deleteOne({ _id: id });

const updateStatusContact = async (id, update) => {
  const contact = await Contact.findByIdAndUpdate(
    { _id: id },
    { $set: { favorite: update.favorite } },
    { new: true, runValidators: true, strict: "throw" }
  );

  if (!contact) {
    throw new Error("Not found");
  }

  return contact;
};

module.exports = {
  fetchContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
