const express = require("express");
const contactsRouter = require("./contactsRouter");
const authMiddleware = require("../../middelware/auth");

const router = express.Router();

const authRouter = require("./usersRouter");

router.use("/users", authRouter);
router.use("/contacts", authMiddleware, contactsRouter);

module.exports = router;
