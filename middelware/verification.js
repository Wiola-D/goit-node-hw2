const User = require("../models/usersSchema");

const checkVerification = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });

  console.log(user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!user.verify) {
    return res.status(403).json({ message: "Email not verified" });
  }

  next();
};

module.exports = checkVerification;
