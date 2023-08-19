const Joi = require("joi");

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

 module.exports = {
   contactSchema,
   contactUpdateSchema,
 };