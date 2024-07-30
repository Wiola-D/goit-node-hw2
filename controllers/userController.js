const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../models/usersSchema");
const { v4: uuidv4 } = require("uuid");

const {
  fetchUsers,
  fetchUser,
  fetchUserbyId,
} = require("../servises/usersServices");
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

    await newUser.save();

    try {
      await sendVerificationEmail(email, verificationToken);
      return res.status(201).json({
        message: "Create a account",
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatarURL,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send verification email" });
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

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
};
