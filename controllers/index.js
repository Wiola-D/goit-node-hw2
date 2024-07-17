const {
  fetchContacts,
  // fetchContact,
  // insertContact,
  // updateContact,
  // removeContact,
} = require("./services");

const getAllContacts = async (req, res, next) => {
  try {
    const tasks = await fetchContacts();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// const getContact = async (req, res, next) => {
//   try {
//     const task = await fetchContact(req.params.id);
//     if (task) {
//       res.json({
//         ...task.toObject(),
//         html: task.htmlify(),
//       });
//     } else {
//       next();
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const createContact = async (req, res, next) => {
//   const { name, email, phone, favorite } = req.body;
//   try {
//     const result = await insertContact({ name, email, phone, favorite });
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const putContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const result = await updateContact({
//       id,
//       toUpdate: req.body,
//       upsert: true,
//     });
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// };
// const patchContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const result = await updateContact({ id, toUpdate: req.body });
//     if (!result) {
//       next();
//     } else {
//       res.json(result);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteContact = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     await removeContact(id);
//     res.status(204).send({ message: "Task deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getAllContacts,
  // getContact,
  // createContact,
  // patchContact,
  // putContact,
  // deleteContact,
};
