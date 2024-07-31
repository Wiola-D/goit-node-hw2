const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../models/usersSchema");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const {
  fetchUsers,
  fetchUser,
  fetchUserbyId,
} = require("../servises/usersServices");
const { isImageAndTransform } = require("../servises/imagesServices");
const { sendVerificationEmail } = require("./email");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await fetchUser(email).lean();

  try {
    if (user) {
      return res.status(409).json({ message: "This email is already taken." });
    }
    const verificationToken = uuidv4();

    const newUser = new User({ email, verificationToken });
    await newUser.setPassword(password);
    newUser.avatarURL = gravatar.url(email, { protocol: "https", s: "100" });

    try {
      await sendVerificationEmail(email, verificationToken);
      await newUser.save();
      return res.status(201).json({
        message: "Create a account",
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
        verificationToken: newUser.verificationToken,
        verify: newUser.verify,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send verification email" });
      return err;
    }
  } catch (e) {
    next(e);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await fetchUser(email);

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
      verificationToken: user.verificationToken,
      verify: user.verify,
    });
  } else {
    return res.status(401).json({ message: "Wrong password" });
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await fetchUserbyId(userId);

    user.token = null;
    await user.save();

    return res.status(200).json(`Logout ${user.email}`);
  } catch (e) {
    next(e);
  }
};

const currentUser = async (req, res) => {
  return res.status(200).json({
    user: {
      email: req.user.email,
      subscription: req.user.subscription,
    },
  });
};

const changeAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No avatar uploaded." });
  }

  const userId = req.user._id;
  const { path: temporaryPath } = req.file;
  const avatarName = `${userId}_${req.file.originalname.replace(/\s+/g, "")}`; // Unikalna nazwa pliku
  const avatarPath = path.join(
    __dirname,
    "../",
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
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeAvatar,
};
