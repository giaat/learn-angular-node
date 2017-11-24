'use strict';

const Boom = require('boom');
const Q = require('q');

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
  const db = request.getDb();
  const { sequelize } = db;
  const { Task, Tag } = db.getModels();

  const promise = Task.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  }).catch(err => {
    throw Boom.boomify(err);
  });

  reply(promise);
}

function getTaskById(request, reply) {
  const db = request.getDb();
  const { sequelize } = db;
  const { Task, Tag } = db.getModels();

  const taskID = request.params.id;

  const promise = Task.findOne({
    where: {
      id: taskID,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  })
    .then(task => {
      if (task === null) {
        throw Boom.notFound(`La tâche n'existe pas (id: ${taskID})`);
      }

      return task;
    })
    .catch(err => {
      throw Boom.boomify(err);
    });

  reply(promise);
}

function createTask(request, reply) {
  const db = request.getDb();
  const { sequelize } = db;
  const { Task, Tag } = db.getModels();

  const payloadTags = request.payload.tags;
  delete request.payload.tags;
  const payloadTask = request.payload;

  let newTask;

  const promise = sequelize.transaction(transaction => {
    const insidePromise = Task.create(payloadTask, { transaction })
      .then(taskDb => {
        newTask = taskDb;
        const promises = payloadTags.map(tag => {
          return taskDb.createTag({ title: tag }, { transaction });
        });

        return Q.all(promises);
      })
      .then(TagsDb => {
        return Task.findOne({
          where: {
            id: newTask.id,
          },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: Tag,
              as: 'tags',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          transaction,
        });
      })
      .catch(err => {
        throw Boom.boomify(err);
      });

    return insidePromise;
  });

  reply(promise);
}

function updateTask(request, reply) {
  const db = request.getDb();
  const { sequelize } = db;
  const { Task, Tag } = db.getModels();

  const taskID = request.params.id;
  const payloadTags = request.payload.tags;
  delete request.payload.tags;
  const payloadTask = request.payload;

  let updatedTask;

  const promise = sequelize.transaction(transaction => {
    const insidePromise = Task.findOne({
      where: {
        id: taskID,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Tag,
          as: 'tags',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
      transaction,
    })
      .then(task => {
        if (task === null) {
          throw Boom.notFound(`La tâche n'existe pas (id: ${taskID})`);
        }

        return task.update(payloadTask, { transaction });
      })
      .then(taskDb => {
        updatedTask = taskDb;

        const promisesDestroy = updatedTask.tags.map(tag => {
          return tag.destroy({ transaction });
        });

        return Q.all(promisesDestroy);
      })
      .then(() => {
        const promisesCreate = payloadTags.map(tag => {
          return updatedTask.createTag({ title: tag }, { transaction });
        });

        return Q.all(promisesCreate);
      })
      .then(() =>
        Task.findOne({
          where: { id: taskID },
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: Tag,
              as: 'tags',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
          transaction,
        })
      )
      .catch(err => {
        throw Boom.boomify(err);
      });

    return insidePromise;
  });

  reply(promise);
}

function deleteTask(request, reply) {
  const db = request.getDb();
  const { sequelize } = db;
  const { Task, Tag } = db.getModels();

  const taskID = request.params.id;

  const promise = Task.findOne({
    where: {
      id: taskID,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
  })
    .then(task => {
      if (task === null) {
        throw Boom.notFound(`La tâche n'existe pas (id: ${taskID})`);
      }

      return task.destroy();
    })
    .then(() => {
      return 'Task deleted';
    })
    .catch(err => {
      throw Boom.boomify(err);
    });

  reply(promise);
}
