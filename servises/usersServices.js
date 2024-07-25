const User = require("../models/usersSchema");

const fetchUsers = () => {
  return User.getAll();
};

module.exports = fetchUsers;
