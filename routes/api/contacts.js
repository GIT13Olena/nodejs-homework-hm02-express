const express = require("express");
const router = express.Router();
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../../controllers/contacts");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", listContacts);

router.get("/:contactId", getById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

module.exports = router;
