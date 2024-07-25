const fetchUsers = require("../servises/usersServices");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllUsers;
