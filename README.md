# About

`form-endpoint` is an API built with express.js responsible for posting forms from statically generated sites. Key
features include:

- Rate limiting
- CORS
- Handles `Content-Type: multipart/form-data`
- Joi schema validation for email

# Run

1. Add necessary variables to `/config`.
2. Edit `app.js/corsOption/origin` and add the allowed domains.
3. Edit the post route in `app.js` && `schemas/joi.js` and match the body variables with client side.
4. `npm run start`
