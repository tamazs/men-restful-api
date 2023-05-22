const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('task tests', () => {

    var token;
    var userID;
    var userEmail;
    var projectID;
    var taskID;

    it('register and login user', (done) => {
        // 1) Register new user
        let user = {
            name: "Peter McLovin",
            email: "mail@mclovin.com",
            password: "123456"
        };
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                // 2) Login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "mail@mclovin.com",
                        "password": "123456"
                    })
                    .end((err, res) => {
                        // Asserts
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);
                        token = res.body.data.token;
                        userID = res.body.data.id;
                        userEmail = res.body.data.email;

                        done();
                    });
            });
    });

    it('should create a project and verify it in the DB', (done) => {

        let project =
        {
            title: "Test Project",
            ownerID: userID,
            members: [userID]
        };

        chai.request(server)
            .post('/api/projects/new')
            .set({ "auth-token": token })
            .send(project)
            .end((err, res) => {

                // Asserts
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');

                let savedProject = res.body;
                expect(savedProject.title).to.be.equal(project.title);
                expect(savedProject.ownerID).to.be.equal(project.ownerID);
                expect(savedProject.members[0]).to.be.equal(project.members[0]);


                // 4) Verify one project in test DB
                chai.request(server)
                    .get('/api/projects')
                    .end((err, res) => {
                        // Asserts
                        expect(res.status).to.be.equal(200);
                        expect(res.body).to.be.a('array');
                        expect(res.body.length).to.be.eql(1);

                        projectID = res.body[0]._id
                        done()
                    })
            });
    });

    it('should add task to project', (done) => {

        let task =
        {
            title: "Test Task",
            detail: "Test Task detail",
            assignedTo: userEmail,
            projectID: projectID
        };

        chai.request(server)
            .post('/api/projects/tasks/new')
            .set({ "auth-token": token })
            .send(task)
            .end((err, res) => {
                expect(res.status).to.be.equal(201);
                expect(res.body).to.be.a('object');

                let savedTask = res.body;
                expect(savedTask.title).to.be.equal(task.title);
                expect(savedTask.detail).to.be.equal(task.detail);
                expect(savedTask.projectID).to.be.equal(task.projectID);
                done()
            });
    });

});