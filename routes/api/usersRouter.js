const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const User = require("../../models/usersSchema");
const authMiddleware = require("../../middelware/auth");
const {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} = require("../../controllers/userController");

const upload = require("../../middelware/upload");
const { isImageAndTransform } = require("../../servises/imagesServices");

const { verifyUser } = require("../../controllers/verification");

const checkVerification = require("../../middelware/verification");
const { sendVerificationEmail } = require("../../controllers/email");

const router = express.Router();

// Endpoint do uzyskiwania wszystkich użytkowników
router.get("/", getAllUsers);

// Endpoint do rejestracji użytkownika
router.post("/signup", registerUser);

// Endpoint do logowania użytkownika
router.post("/login", checkVerification, loginUser);

// Endpoint do wylogowania
router.get("/logout", authMiddleware, logoutUser);

//Endpoint do pobrania danych aktualnego użytkownika
router.get("/current", authMiddleware, currentUser);

// Endpoint do aktualizacji awatara
router.patch(
  "/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar uploaded." });
    }

    const userId = req.user._id;
    const { path: temporaryPath } = req.file;
    const avatarName = `${userId}_${req.file.originalname.replace(/\s+/g, "")}`; // Unikalna nazwa pliku
    const avatarPath = path.join(
      __dirname,
      "../../",
      "public",
      "avatars",
      avatarName
    );

    try {
      await fs.rename(temporaryPath, avatarPath);
      const avatarURL = `/avatars/${avatarName}`;
      const isValidAndTransform = await isImageAndTransform(avatarPath);
      if (!isValidAndTransform) {
        await fs.unlink(avatarPath);
        return res.status(400).json({ message: "File isnt a photo" });
      }

      await User.findByIdAndUpdate(userId, { avatarURL });
      return res.status(200).json({ avatarURL });
    } catch (error) {
      await fs.unlink(temporaryPath); // Usuń przesłany plik w przypadku błędu
      return next(error);
    }
  }
);

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).send({ message: "Not found" });
    }

    user.verify = true;
    user.verificationToken = null;

    try {
      await user.save();
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res.status(500).send({ message: "Error updating user" });
    }

    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }

    await sendVerificationEmail(user.email, user.verificationToken);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
