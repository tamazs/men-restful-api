const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Project workflow tests', () => {



    // POST Create functional test
    it('should register + login a user, create project and verify in DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter McLovin",
            email: "mail@mclovin.com",
            password: "123456"
        }
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
                        let token = res.body.data.token;
                        let userID = res.body.id;

                        // 3) Create new project
                        let project =
                        {
                            title: "Test Project",
                            ownerID: userID,
                            members: userID
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
                                expect(savedProject.members[0]).to.be.equal(project.members);


                                // 4) Verify one project in test DB
                                chai.request(server)
                                    .get('/api/projects/')
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                
                                        expect(res.body).to.be.a('array');                                
                                        expect(res.body.length).to.be.eql(1);
                                
                                        // 3) Create new task
                                        let projectId = res.body[0]._id
                                        let task =
                                        {
                                            title: "Test Task",
                                            assignedTo: userID,
                                            projectID: projectId
                                        };

                                        chai.request(server)
                                            .post('/api/tasks/new')
                                            .set({ "auth-token": token })
                                            .send(task)
                                            .end((err, res) => {
                                                
                                                // Asserts
                                                expect(res.status).to.be.equal(200);                                
                                                expect(res.body).to.be.a('object');
                                                
                                                let savedTask = res.body;
                                                expect(savedTask.title).to.be.equal(task.title);
                                                expect(savedTask.assignedTo).to.be.equal(task.assignedTo);
                                                expect(savedTask.projectID).to.be.equal(task.projectID);

                                                
                                                // 4) Verify task in test DB
                                                
                                                chai.request(server)
                                                    .get('/api/tasks/' + projectId + '/ToDo')
                                                    .set({ "auth-token": token })
                                                    .end((err, res) => {
                                                        
                                                        // Asserts
                                                        expect(res.status).to.be.equal(200);                                
                                                        expect(res.body).to.be.a('array');                                
                                                        expect(res.body.length).to.be.eql(1);
                                                
                                                        done();
                                                    });
                                                    });
                                                })
                                            });
                                    });
                            });
                    });
    
    // Valid input test (register, login, )
    it('should register + login a user, create project and delete it from DB', (done) => {

        // 1) Register new user
        let user = {
            name: "Peter McLovin",
            email: "mail@mclovin.com",
            password: "123456"
        }
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
                        let token = res.body.data.token;
                        let userID = res.body.id;

                        // 3) Create new project
                        let project =
                        {
                            title: "Test Project",
                            ownerID: userID,
                            members: userID
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
                                expect(savedProject.members[0]).to.be.equal(project.members);

                                // 4) Delete product
                                chai.request(server)
                                    .delete('/api/projects/delete/' + savedProject._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {
                                        
                                        // Asserts
                                        expect(res.status).to.be.equal(200);                                             
                                        done();
                                    });
                            });
                    });
            });
    });
    
    

    // Invalid input test
    it('invalid user input test', (done) => {

        // 1) Register new user with invalid inputs
        let user = {
            name: "Peter McLovin",
            email: "mail@mclovin.com",
            password: "123" //Faulty password - Joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                                
                // Asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"Status is not 400 (NOT FOUND)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.error.message).to.be.equal("\"password\" length must be at least 6 characters long");
                done();              
            });
    });
    

    
});