# Learn Angular/Node
Project used to teach basic concepts of using angular and node for a REST API development. It is mainly used for our new comers that are new to JavaScript full-stack.

This project is split into 2 parts:
* The server (backend)
* The client (frontend)

## Goal

We are going to build a TODO application. For simplicity sake, we are going to have only one entity which is __Task__.

At the end of the project we will have a simple application to handle TODO tasks that contact a REST API on the server.

## The server
Node is a JavaScript runtime to be used on the server. You can do as much as you would do with Python or another scripting language. In this project we are using Node for web development. In that context, we are going to use a web framework: [Hapi](http://hapijs.com/).

There are other alternatives such as [Express](http://expressjs.com/) but that's not what we are going to learn.

### Section 1: Basic commands
This section suppose you already have __Node__ and __NPM__ installed and configured on your local machine. If it is not the case, please refer to Dixeed's internal documentation.

NPM uses a file named `package.json` to store information about your project.

The commands below are to use in your own terminal.

1. `node index.js` to start your server. Another way of running your server is using NPM's script: `npm start` which is just an alias for the previous command. Prefer using the last as it is a way to standardize your server starting command.

2. `node` to access a node CLI where you can execute JavaScript code. It is useful to make quick tests on something without writing a proper file for it.

3. `npm install [packageName]` to install a package in your project. If you don't provide a package name it will install all the dependencies written in your `package.json`. This will download the package into the `node_modules` folder at your project root. If you want to mark this package as a dependency in your project you need to add the flag `--save` and respectively `--save-dev` for a development dependency. When using the above flags, the dependency will be written in your __package.json__ along with their [semver](https://github.com/npm/node-semver) version notation.

#### Notes

NPM's commands are registered in the package.json scripts section of your project. Some keywords are registered for npm such as `start`, `test`, amongst others. If you want to use a script you defined that is not using NPM's keywords, you need to run: `npm run yourScriptName`.

### Section 2: Build your API endpoints
Simply put, a REST API is collection of [Web Services](https://en.wikipedia.org/wiki/Web_service) accessible through the HTTP(s) protocol.

Let's now dive into our server needs ... For the client to interact with our server, it needs to call the Web Services methods to communicate with it that's what we call __endpoints__. Here is the list of the endpoints we want to use:

* `/tasks` [GET] : returns a list of the tasks
* `/tasks/{id}` [GET] : returns the complete information of a task referenced by its id.
* `/tasks/create` [POST] : receives the data of the task to be created.
* `/tasks/delete/{id}` [DELETE] : delete the task referenced by the id.
* `/tasks/update/{id}` [PUT] : updates the information of the task referenced by the id.

Now that's your job to implement these routes! For the moment we are not using any database, we will dive into that later. If you need data, just use JS objects with dummy information. For example:
````javascript

function getUser(id) {
  return {
    id: id,
    name: 'Jesus',
    surname: 'Christ',
    email: 'j.christ@heaven.org'
  };
}
````

You can find some help in [Hapi's routing tutorial](http://hapijs.com/tutorials/routing) and in [Hapi's API](http://hapijs.com/api).
