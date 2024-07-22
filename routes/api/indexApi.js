const express = require("express");
const contactsRouter = require("./contactsRouter");
const authMiddleware = require("../../middelware/jwt");

const router = express.Router();

const authRouter = require("./authRouter");

router.use("/auth", authRouter);
router.use("/contacts", authMiddleware, contactsRouter);

module.exports = router;
