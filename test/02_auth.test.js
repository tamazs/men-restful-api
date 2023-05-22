const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

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
            let token = res.body.data.token;
            let userID = res.body.data.id;
            let userEmail = res.body.data.email;

            done();
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
    };
    chai.request(server)
      .post('/api/user/register')
      .send(user)
      .end((err, res) => {
        // Asserts
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body.error.message).to.be.equal("\"password\" length must be at least 6 characters long");
        done();
      });
  });
});