'use strict';

module.exports = {
  data: {
    1: {
      id: 1,
      title: 'My little task',
      content: 'I must wash my clothes before going to bed!',
      tags: ['before', 'bed', 'wash']
    },
    10: {
      id: 10,
      title: 'TODO',
      content: 'Clean the house, buy pizza, buy beer',
      tags: ['evening', 'todo', 'YAY']
    }
  },

  getById: function(id) {
    return this.data[id];
  },

  addTask: function(payload) {
    var keys = Object.keys(this.data);
    var newID = parseInt(keys[keys.length-1])+1;
    var newTask = {
        id: newID,
        title: payload.title,
        content: payload.content,
        tags: payload.tags,
    };
    this.data[newID]=newTask;
  },

  deleteTask: function(id) {
    delete this.data[id];
  },

  updateTask: function(payload, params) {
    var task = {
        id: params.id,
        title: payload.title,
        content: payload.content,
        tags: payload.tags,
    };
    this.data[params.id]=task;
  },

  getAll: function() {
    var ret = [];
    for (var id in this.data) {
      ret.push(this.data[id]);
    }
    return ret;
  }
};
