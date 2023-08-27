const Joi = require('joi');
//TODO Fix schema
const emailSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string(),
    message: Joi.string(),
});

module.exports = {emailSchema};
