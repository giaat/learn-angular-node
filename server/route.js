var tasksDb = require('./object');

module.exports = [
  {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply('Learn Angular/Node');
        }
  },

  {
      method: 'GET',
      path: '/tasks',
      handler: function (request, reply) {
        reply(tasksDb.getAll());
      }
  },

  {
    method: 'GET',
    path: '/tasks/{id}',
    handler: function (request, reply) {
      if (tasksDb.getById(request.params.id) == undefined) {
        return reply('No task found.').code(404);
      }
      return reply(tasksDb.getById(request.params.id));
    }
  },

  {
    method: 'POST',
    path: '/tasks/create',
    handler: function (request, reply) {
      var newTask = {
        id: request.payload.id,
        title: request.payload.title,
        content: request.payload.content,
        tags: request.payload.tags,
      };
      tasksDb.addTask(newTask);
      reply(tasksDb.getAll());
    }
  },

  {
    method: 'DELETE',
    path: '/tasks/delete/{id}',
    handler: function (request, reply) {
      tasksDb.deleteTask(request.params.id);
      reply(tasksDb.getAll());
    }
  },

  {
    method: 'PUT',
    path: '/tasks/update/{id}',
    handler: function (request, reply) {
      var task = {
        id: request.params.id,
        title: request.payload.title,
        content: request.payload.content,
        tags: request.payload.tags,
      };
      tasksDb.updateTask(task);
      reply(tasksDb.getAll());
    }
  }
];
