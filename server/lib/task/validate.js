'use strict';

const Joi = require('joi');

const id = Joi.number()
  .min(1)
  .required();

const newTask = Joi.object().keys({
  id: Joi.number()
    .min(1)
    .required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});

const updateTask = Joi.object().keys({
  id: Joi.number()
    .min(1)
    .required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()),
});

module.exports = {
  id,
  newTask,
  updateTask,
};
