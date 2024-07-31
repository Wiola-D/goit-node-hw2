const express = require("express");
// const fs = require("fs").promises;
// const path = require("path");
// const User = require("../../models/usersSchema");
const authMiddleware = require("../../middelware/auth");
const {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeAvatar,
} = require("../../controllers/userController");

const upload = require("../../middelware/upload");

const {
  verifyUser,
  resendVerificationEmail,
} = require("../../controllers/verificationController");

const checkVerification = require("../../middelware/verification");

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
router.patch("/avatars", authMiddleware, upload.single("avatar"), changeAvatar);

router.get("/verify/:verificationToken", verifyUser);

router.post("/verify", resendVerificationEmail);

module.exports = router;
