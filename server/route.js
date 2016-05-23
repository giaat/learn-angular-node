'use strict';

var tasksDb = require('./object');
var Boom = require('boom');

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('Learn Angular/Node');
        },
    },

    {
        method: 'GET',
        path: '/tasks',
        handler: function(request, reply) {
            reply(tasksDb.getAll());
        },
    },

    {
        method: 'GET',
        path: '/tasks/{id}',
        handler: function(request, reply) {
            if (tasksDb.getById(request.params.id) === undefined) {
                return reply(Boom.notFound("This task doesn't exist"));
            }
            return reply(tasksDb.getById(request.params.id));
        }
    },

    {
        method: 'POST',
        path: '/tasks/create',
        handler: function(request, reply) {
            var newTask = {
                id: request.payload.id,
                title: request.payload.title,
                content: request.payload.content,
                tags: request.payload.tags,
            };
            tasksDb.addTask(newTask);
            reply("Task added");
        }
    },

    {
        method: 'DELETE',
        path: '/tasks/delete/{id}',
        handler: function(request, reply) {
            if (tasksDb.getById(request.params.id) === undefined) {
                return reply(Boom.notFound("This task doesn't exist"));
            }
            tasksDb.deleteTask(request.params.id);
            reply("Task deleted");
        }
    },

    {
        method: 'PUT',
        path: '/tasks/update/{id}',
        handler: function(request, reply) {
            if (tasksDb.getById(request.params.id) === undefined) {
                return reply(Boom.notFound("This task doesn't exist"));
            }
            var task = {
                id: request.params.id,
                title: request.payload.title,
                content: request.payload.content,
                tags: request.payload.tags,
            };

            tasksDb.updateTask(task);
            reply("Task updated");
        }
    }
];
