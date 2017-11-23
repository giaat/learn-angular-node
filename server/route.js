'use strict';

const handlers = require('./handlers');

module.exports = [
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
  },
  {
    method: 'POST',
    path: '/tasks/create',
    handler: handlers.createTask,
  },
  {
    method: 'PUT',
    path: '/tasks/update/{id}',
    handler: handlers.updateTask,
  },
  {
    method: 'DELETE',
    path: '/tasks/delete/{id}',
    handler: handlers.deleteTask,
  },
];
