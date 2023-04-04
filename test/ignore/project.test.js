const chai = require('chai');
const Project = require('../../models/project');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const server = require('../../server');

chai.use(chaiHttp);



describe('/First test collection', () => {
    it('test default welcome API route', (done) => {
        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal("Welcome to the MEN RESTful API");
            done();
        });
    });

    it('should verify that we have 0 products in the database', (done) => {
        chai.request(server)
        .get('/api/projects')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.equal(0);
            done();
        });
    });

    it('should post a valid product', (done) => {
        let project = {
            title: "Test Project",
            members: "Test Project Members",
            description: "Test Project Description"
        }
        chai.request(server)
        .post('/api/projects')
        .send(project)
        .end((err, res) => {
            res.should.have.status(201);
            done();
        });
    });

    it('should verify that we have 1 products in the database', (done) => {
        chai.request(server)
        .get('/api/projects')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.equal(1);
            done();
        });
    });

    it('should test two values', () => {
        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    });
});