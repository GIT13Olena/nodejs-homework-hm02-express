const Contact = require("../models/contacts");

const listContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
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
    const newContact = await Contact.create({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeContact = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.contactId);
    if (deletedContact) {
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
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { name, email, phone },
      { new: true }
    );
    if (updatedContact) {
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatusContact = async (req, res) => {
  try {
    const { favorite } = req.body;
    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { favorite },
      { new: true }
    );
    if (updatedContact) {
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
  updateStatusContact,
};
