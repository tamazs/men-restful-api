process.env.NODE_ENV = 'test';

const Project = require('../models/project');
const User = require('../models/user');


beforeEach((done) => {
    Project.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});

afterEach((done) => {
    Project.deleteMany({}, function(err) {});
    User.deleteMany({}, function(err) {});
    done();
});