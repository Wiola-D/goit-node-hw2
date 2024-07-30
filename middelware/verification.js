const User = require("../models/usersSchema");

const checkVerification = async (req, res, next) => {
  const user = await User.findOne(req.params.id);

  if (!user.verify) {
    return res.status(403).json({ message: "Email not verified" });
  }

  next();
};

module.exports = checkVerification;
