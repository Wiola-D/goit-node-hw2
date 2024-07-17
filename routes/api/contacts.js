const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getContact,
  createContact,
  patchContact,
  updateFavorite,
  putContact,
  deleteContact,
} = require("../../controllers/index");

router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContact);
router.post("/contacts/", createContact);
router.put("/contacts/:id", putContact);
router.patch("/contacts/:id", patchContact);
router.patch("/contacts/:id/favorite", updateFavorite);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
