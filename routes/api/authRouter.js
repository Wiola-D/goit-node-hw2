const express = require("express");
const User = require("../../models/usersSchema");
const jwt = require("jsonwebtoken");

const router = express.Router();

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
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "No such user" });
  }
  const isPasswordCorrect = await user.validatePassword(password);

  if (isPasswordCorrect) {
    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "wrong password" });
  }
});

module.exports = router;
