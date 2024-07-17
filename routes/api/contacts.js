const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  //   getContact,
  //   createContact,
  //   patchContact,
  //   putContact,
  //   deleteContact,
} = require("../../controllers/index");

router.get("/contacts", getAllContacts);
// router.get("/contacts:id", getContact);
// router.post("/contacts/", createContact);
// router.put("/contacts/:id", putContact);
// router.patch("/contacts/:id", patchContact);
// router.delete("/contacts/:id", deleteContact);

// router.get("/", async (req, res, next) => {
//   res.json({ message: "helllllo" });
// });

// router.get("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.post("/", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.delete("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

module.exports = router;

//hello
