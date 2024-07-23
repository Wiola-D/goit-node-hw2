const express = require("express");
const User = require("../../models/usersSchema");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middelware/auth");
const getAllUsers = require("../../controllers/userController");

const router = express.Router();

// Endpoint do uzyskiwania wszystkich użytkowników
router.get("/", getAllUsers);

// Endpoint do rejestracji użytkownika
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();

  if (user) {
    return res.status(409).json({ message: "This email is already taken." });
  }
  try {
    const newUser = new User({ email });
    await newUser.setPassword(password);

    await newUser.save();
    return res.status(201).json({
      message: "Create a account",
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (e) {
    next(e);
  }
});

// Endpoint do logowania użytkownika
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "No such user" });
  }
  const isPasswordCorrect = await user.validatePassword(password);

  if (isPasswordCorrect) {
    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "12h" });
    user.token = token;
    await user.save();
    return res.status(200).json({
      message: "Login",
      token,
      email: user.email,
      subscription: user.subscription,
    });
  } else {
    return res.status(401).json({ message: "Wrong password" });
  }
});

// Endpoint do wylogowania
router.get("/logout", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id; // id zalogowanego użytkownika
    const user = await User.findById(userId);

    user.token = null;
    await user.save();

    return res.status(204).send();
  } catch (e) {
    next(e);
  }
});

//Endpoint do pobrania danych aktualnego użytkownika
router.get("/current", authMiddleware, async (req, res) => {
  return res.status(200).json({
    user: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
});

module.exports = router;
