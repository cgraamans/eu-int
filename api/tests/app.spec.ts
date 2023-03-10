import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API ping request', () => {
  it('should return response on call', () => {
    return chai.request("http://localhost:3000").get('/')
      .then(res => {
        expect(res).to.have.status(200);
      })
  })
});


describe('API version ping request', () => {
  it('should return response on call', () => {
    return chai.request("http://localhost:3000/v1.0").get('/')
      .then(res => {
        expect(res).to.have.status(200);
      })
  })
});
