const Joi = require("joi");

const schemas = {
  newUser: Joi.object().keys({
    first_name: Joi.string().min(2).required(),
    last_name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).alphanum().required(),
  }),
};

const validateInput = (schema, property) => {
  return (req, res, next) => {
    try {
      schema.validate(req[property]);
      next();
    } catch (err) {
      res.status(422).json({ error: err });
    }
  };
};

module.exports = {
  schemas,
  validateInput,
};
