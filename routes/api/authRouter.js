const express = require("express");
const User = require("../../models/usersSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.json("something");
});

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, { _id: 1 }).lean();

  if (user) {
    return res.status(409).json({ message: "This email is already taken." });
  }
  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);
    await newUser.save();
    return res.status(201).json({ message: "Created" });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  res.json("hello by login");
});

module.exports = router;
