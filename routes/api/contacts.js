const express = require("express");
const router = express.Router();
const joi = require("joi");

const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const schema = joi.object({
  name: joi.string().min(3).max(30).required().messages({
    "any.required": "Missing required name field",
  }),
  email: joi.string().email().required().messages({
    "any.required": "Missing required email field",
    "string.email": "Email must be a valid email address",
  }),
  phone: joi.string().min(9).required().messages({
    "any.required": "Missing required phone field",
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      contacts,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getById(req.params.contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(contact);
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const errorJoi = schema.validate(req.body);
    if (errorJoi.error) {
      return res
        .status(400)
        .json({ message: errorJoi.error.details[0].message });
    }
    const contact = await addContact(req.body);
    if (contact) {
      res.status(201).json(contact);
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (result === "Contact deleted") {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const errorJoi = schema.validate(req.body);
    if (errorJoi.error) {
      return res
        .status(400)
        .json({ message: errorJoi.error.details[0].message });
    }
    const result = await updateContact(req.params.contactId, req.body);
    if (result === "Contact update") {
      res.status(200).json({ message: result });
    } else {
      res.status(201).json({ message: "Add Contact" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
