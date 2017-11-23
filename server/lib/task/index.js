'use strict';

const handlers = require('./handlers');
const validate = require('./validate');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: handlers.getHelloWord,
    },
    {
      method: 'GET',
      path: '/tasks',
      handler: handlers.getAllTasks,
    },
    {
      method: 'GET',
      path: '/tasks/{id}',
      handler: handlers.getTaskById,
      config: {
        validate: {
          params: {
            id: validate.id,
          },
        },
      },
    },
    {
      method: 'POST',
      path: '/tasks/create',
      handler: handlers.createTask,
      config: {
        validate: {
          payload: validate.newTask,
        },
      },
    },
    {
      method: 'PUT',
      path: '/tasks/update/{id}',
      handler: handlers.updateTask,
      config: {
        validate: {
          params: {
            id: validate.id,
          },
          payload: validate.updateTask,
        },
      },
    },
    {
      method: 'DELETE',
      path: '/tasks/delete/{id}',
      handler: handlers.deleteTask,
      config: {
        validate: {
          params: {
            id: validate.id,
          },
        },
      },
    },
  ]);

  next();
};

exports.register.attributes = {
  version: '1.0.0',
  name: 'TaskPlugin',
};
