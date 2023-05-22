const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../../server');

chai.use(chaiHttp);


describe('/First Test Collection', () => {

    it ('test default API welcome route', (done) => {

        //actual test content in here

        chai.request(server)
        .get('/api/welcome')
        .end((err, res) => {

            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.a('object');
            
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal("Welcome to the MEN RESTful API");

            console.log(res.body.message);
            
            done();

        })        
    })



    it ('should test two values', (done) => {

        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
        done();
    })
})



// Update user
let user =
    {
        email: "mail2@mclovin.com",
    };

chai.request(server)
    .put('/api/user/' + userID)
    .set({"auth-token": token})
    .send(user)
    .end((err, res) => {

        // Asserts
        expect(res.status).to.be.equal(200);
        expect(res.body).to.be.a('object');

        let updatedUser = res.body;
        expect(updatedUser.email).to.be.equal(user.email); })