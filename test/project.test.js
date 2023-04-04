process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

describe('/First test collection', function() {
    it('should test two values', function() {
        //actual test content in here
        let expectedVal = 10;
        let actualVal = 10;

        expect(actualVal).to.be.equal(expectedVal);
    })
})