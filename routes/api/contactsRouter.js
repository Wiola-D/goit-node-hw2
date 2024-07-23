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
} = require("../../controllers/contactController");

const authMiddleware = require("../../middelware/auth");
const checkContactOwnership = require("../../middelware/owner");

router.use(authMiddleware);

router.get("/", getAllContacts);
router.get("/:id", checkContactOwnership, getContact);
router.post("/", createContact);
router.put("/:id", checkContactOwnership, putContact);
router.patch("/:id", checkContactOwnership, patchContact);
router.patch("/:id/favorite", checkContactOwnership, updateFavorite);
router.delete("/:id", checkContactOwnership, deleteContact);

module.exports = router;
