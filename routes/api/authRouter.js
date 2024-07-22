const express = require("express");

const router = express.Router();

router.use("/register", async (req, res, next) => {
  res.json("hello by register");
});

router.use("/login", async (req, res, next) => {
  res.json("hello by login");
});

module.exports = router;
