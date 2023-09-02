const Joi = require('joi');

const emailSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string(),
});

module.exports = {emailSchema};
