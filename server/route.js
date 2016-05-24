'use strict';

var tasksDb = require('./object');
var Boom = require('boom');
var Joi = require('joi');

var schema = Joi.object().keys({
    title: Joi.string().min(1).max(255).required(),
    content: Joi.string().min(1),
    tags: Joi.array()
});

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
        config: {
            handler: function(request, reply) {
                tasksDb.addTask(request.payload);
                reply("Task added");
            },

            validate: {
                payload: schema
            }
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
        config: {
            handler: function(request, reply) {
                if (tasksDb.getById(request.params.id) === undefined) {
                    return reply(Boom.notFound("This task doesn't exist"));
                }
                tasksDb.updateTask(request.payload, request.params);
                reply("Task updated");
            },

            validate: {
                payload: schema
            }
        }
    }
];
