const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

var userID;
var token;

describe('Auth tests', () => {
    // POST Create functional test
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

                        done();
                    });
            });
    });

    it('should update user', (done) => {
        // 1) Register new user
        let updatedUser = {
            name: "Peterson McLovin",
        };
        chai.request(server)
            .put('/api/user/' + userID)
            .send(updatedUser)
            .end((err, res) => {
                // Asserts
                expect(res.status).to.be.equal(200);
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);

                let updateUser = res.body;
                expect(updateUser.name).to.be.equal(updatedUser.name);

                done();
            });
    });
});