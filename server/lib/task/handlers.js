'use strict';

const tasksDb = require('./object');
const Boom = require('boom');

exports.getHelloWord = getHelloWord;
exports.getAllTasks = getAllTasks;
exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;

function getHelloWord(request, reply) {
  reply('Learn Angular/Node');
}

function getAllTasks(request, reply) {
  reply(tasksDb.getAll());
}

function getTaskById(request, reply) {
  const taskID = tasksDb.getById(request.params.id);

  if (taskID === undefined) {
    return reply(Boom.notFound("This task doesn't exist"));
  }

  return reply(taskID);
}

function createTask(request, reply) {
  const newTask = {
    id: request.payload.id,
    title: request.payload.title,
    content: request.payload.content,
    tags: request.payload.tags,
  };

  tasksDb.addTask(newTask);

  reply('Task added');
}

function updateTask(request, reply) {
  const taskToUpdateID = tasksDb.getById(request.params.id);

  if (taskToUpdateID === undefined) {
    return reply(Boom.notFound("This task doesn't exist"));
  }

  var taskUpdated = {
    id: request.params.id,
    title: request.payload.title,
    content: request.payload.content,
    tags: request.payload.tags,
  };

  tasksDb.updateTask(taskUpdated);

  reply('Task updated');
}

function deleteTask(request, reply) {
  const taskToDeleteID = tasksDb.getById(request.params.id);

  if (taskToDeleteID === undefined) {
    return reply(Boom.notFound("This task doesn't exist"));
  }

  tasksDb.deleteTask(taskToDeleteID);

  reply('Task deleted');
}
