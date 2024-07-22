const express = require("express");
const contactsRouter = require("./contactsRouter");

const router = express.Router();

// const authRouter = require("./authRouter");

// import authMiddleware from '../middleware/jwt.js'

// router.use("/auth", authRouter);
router.use("/contacts", contactsRouter);

module.exports = router;
