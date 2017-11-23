'use strict';

var assert = require('assert');
var tasksDb = require('../object');
var server = {};

describe('Task [endpoint]:', function() {
  // we clear the variable to make sure every test is independent from the others
  beforeEach('Set up the server', function() {
    server = require('../server');
  });

  afterEach('Close the server', function(done) {
    server.stop(function(err) {
      if (err) {
        return done(err);
      }

      done();
    });
    // could be simplified to server.stop(done);
  });

  it('should return tasks list when contacted on /tasks', function(done) {
    var options = {
      method: 'GET',
      url: '/tasks',
    };

    server.inject(options, function(response) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.constructor, Array);
      done();
    });
  });

  it('should return the complete information of a task referenced by its id when contacted on /task/{id}', function(
    done
  ) {
    var options = {
      method: 'GET',
      url: '/tasks/1',
    };

    server.inject(options, function(response) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result, tasksDb.data[1]);
      done();
    });
  });

  it('should return "Task added" when contacted on /task/create with params', function(done) {
    var options = {
      method: 'POST',
      url: '/tasks/create',
      payload: {
        id: 2,
        title: 'Aller au Berthom',
        content: 'RDV avec les potos',
        tags: ['berthom', 'biere', 'saoul'],
      },
    };

    server.inject(options, function(response) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result, 'Task added');
      done();
    });
  });

  it('should return "Task deleted" when contacted on /task/delete/{id}', function(done) {
    var options = {
      method: 'DELETE',
      url: '/tasks/delete/2',
    };

    server.inject(options, function(response) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result, 'Task deleted');
      done();
    });
  });

  it('should return "Task updated" when contacted on /task/update/{id}', function(done) {
    var options = {
      method: 'PUT',
      url: '/tasks/update/1',
      payload: {
        id: 1,
        title: 'My little task before going to bed',
        content: 'I must wash my clothes and my kitchen before going to bed!',
        tags: ['before', 'bed', 'wash', 'kitchen'],
      },
    };

    server.inject(options, function(response) {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result, 'Task updated');
      done();
    });
  });

  it("should return 'This task doesn't exist' when contacted on /task/tasks/{id} when id doesn't exist", function(
    done
  ) {
    var options = {
      method: 'GET',
      url: '/tasks/22',
    };

    server.inject(options, function(response) {
      var payload = JSON.parse(response.payload);
      assert.equal(payload.statusCode, 404);
      assert.equal(payload.message, "This task doesn't exist");
      done();
    });
  });
});
