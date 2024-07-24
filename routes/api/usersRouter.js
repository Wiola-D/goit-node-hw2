const express = require("express");
const User = require("../../models/usersSchema");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middelware/auth");
const getAllUsers = require("../../controllers/userController");
const gravatar = require("gravatar");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const jimp = require("jimp");
const multer = require("multer");

const upload = multer({
  dest: "tmp/", // Ustaw folder tymczasowy
});

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
    newUser.avatarURL = gravatar.url(email, { protocol: "https", s: "100" });
    console.log(email);
    await newUser.save();
    await newUser.save();
    return res.status(201).json({
      message: "Create a account",
      email: newUser.email,
      subscription: newUser.subscription,
      avatar: newUser.avatarURL,
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

// Endpoint do aktualizacji awatara
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    try {
      // Przetwarzanie obrazu
      const image = await jimp.read(req.file.path);
      await image.resize(250, 250); // Zmień rozmiar do 250x250px
      const avatarName = `${userId}_${Date.now()}${path.extname(
        req.file.originalname
      )}`; // Unikalna nazwa pliku
      const avatarPath = path.join(
        __dirname,
        "../..",
        "public",
        "avatars",
        avatarName
      );

      await image.write(avatarPath); // Zapisz przetworzony obraz

      // Zaktualizuj URL awatara w bazie danych
      const avatarURL = `/avatars/${avatarName}`;
      await User.findByIdAndUpdate(userId, { avatarURL });

      return res.status(200).json({ avatarURL });
    } catch (error) {
      await fs.unlink(req.file.path); // Usuń przesłany plik w przypadku błędu
      next(error);
    }
  }
);

module.exports = router;
