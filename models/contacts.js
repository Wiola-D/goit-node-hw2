const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const contactsPath = path.join(__dirname, "..", "models", "contacts.json");

const readContacts = async (path) => {
  try {
    const data = await fs.readFile(path);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts: ", error);
    throw error;
  }
};

const writeContacts = async (contacts, path) => {
  try {
    await fs.writeFile(path, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error("Error writing contacts: ", error);
    throw error;
  }
};

const listContacts = async () => {
  try {
    return await readContacts(contactsPath);
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

const getById = async (contactId) => {
  try {
    const contacts = await readContacts(contactsPath);
    return contacts.find((contact) => contact.id === contactId) || null;
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await readContacts(contactsPath);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index !== -1) {
      contacts.splice(index, 1);
      await writeContacts(contacts, contactsPath);
      return "Contact deleted";
    }
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const contacts = await readContacts(contactsPath);
    const newContact = { id: body.id ? body.id : uuidv4(), ...body };
    contacts.push(newContact);
    await writeContacts(contacts, contactsPath);
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readContacts(contactsPath);
    const contact = contacts.find((contact) => contact.id === contactId);
    if (contact) {
      contact.name = body.name;
      contact.email = body.email;
      contact.phone = body.phone;
      await writeContacts(contacts, contactsPath);
      return "Contact update";
    } else {
      const newContact = { id: contactId, ...body };
      contacts.push(newContact);
      await writeContacts(contacts, contactsPath);
    }
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
