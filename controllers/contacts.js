const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");

const contactsPath = path.join(__dirname, "../data/contacts.json");

const readContactsFile = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};

const writeContactsFile = async (contacts) => {
  try {
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
  } catch (error) {
    throw error;
  }
};

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
});

const listContacts = async (req, res) => {
  try {
    const contacts = await readContactsFile();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const contacts = await readContactsFile();
    const contact = contacts.find((c) => c.id === req.params.contactId);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = contactSchema.validate(req.body); // Валідація даних
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const contacts = await readContactsFile();
    const newContact = { id: Date.now().toString(), name, email, phone };
    contacts.push(newContact);
    await writeContactsFile(contacts);

    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeContact = async (req, res) => {
  try {
    const contacts = await readContactsFile();
    const index = contacts.findIndex((c) => c.id === req.params.contactId);

    if (index !== -1) {
      contacts.splice(index, 1);
      await writeContactsFile(contacts);
      res.json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { error } = contactUpdateSchema.validate(req.body); // Валідація даних
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const contacts = await readContactsFile();
    const index = contacts.findIndex((c) => c.id === req.params.contactId);

    if (index !== -1) {
      const updatedContact = { ...contacts[index], name, email, phone };
      contacts[index] = updatedContact;
      await writeContactsFile(contacts);
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
