const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContact,
  createContact,
  patchContact,
  putContact,
    deleteContact,
} = require("../../controllers/index");

router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContact);
router.post("/contacts/", createContact);
router.put("/contacts/:id", putContact);
router.patch("/contacts/:id", patchContact);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
