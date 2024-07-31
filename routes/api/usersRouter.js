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

const {
  verifyUser,
  resendVerificationEmail,
} = require("../../controllers/verificationController");

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

router.get("/verify/:verificationToken", verifyUser);

router.post("/verify", resendVerificationEmail);

module.exports = router;
