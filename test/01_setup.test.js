process.env.NODE_ENV = 'test';

const Project = require('../models/project');
const User = require('../models/user');
const Task = require('../models/task');


beforeEach((done) => {
    Project.deleteMany({}, function(err) {});
    Task.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    Project.deleteMany({}, function(err) {});
    Task.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});