const Contact = require("../models/contactsSchema");

const checkContactOwnership = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (String(contact.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: not the owner" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkContactOwnership;
