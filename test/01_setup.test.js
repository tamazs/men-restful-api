process.env.NODE_ENV = 'test';

const Project = require('../models/project');
const User = require('../models/user');
const Task = require('../models/task');


beforeEach((done) => {
    Task.deleteMany({}, function(err) {});
    Project.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    Task.deleteMany({}, function(err) {});
    Project.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});