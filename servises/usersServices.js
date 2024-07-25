const User = require("../models/usersSchema");

const fetchUsers = () => {
  return User.getAll();
};

const fetchUser = (email) => {
  return User.findOne({ email });
};

const fetchUserbyId = (userId) => {
  return User.findById({ _id: userId });
};

module.exports = { fetchUsers, fetchUser, fetchUserbyId };
