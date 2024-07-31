const { sendVerificationEmail } = require("../controllers/email");
const User = require("../models/usersSchema");

const verifyUser = async (req, res, next) => {
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
      res.status(200).send({ message: "Verification successful" });
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      throw saveError;
    }
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res) => {
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
};

module.exports = {
  verifyUser,
  resendVerificationEmail,
};
