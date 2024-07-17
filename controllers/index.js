const {
  fetchContacts,
  fetchContact,
  insertContact,
  updateContact,
  removeContact,
  updateStatusContact,
} = require("./services");

const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await fetchContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await fetchContact(req.params.id);
    if (contact) {
      res.json({
        ...contact.toObject(),
        html: contact.htmlify(),
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await insertContact({ name, email, phone, favorite });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const putContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await updateContact({
      id,
      toUpdate: req.body,
      upsert: true,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const patchContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await updateContact({ id, toUpdate: req.body });
    if (!result) {
      next();
    } else {
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  const { id } = req.params;

  if (!req.body.hasOwnProperty("favorite")) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const result = await updateStatusContact(id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    await removeContact(id);
    res.status(200).send("Task deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContact,
  createContact,
  patchContact,
  updateFavorite,
  putContact,
  deleteContact,
};
