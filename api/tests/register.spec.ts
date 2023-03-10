import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Register', () => {

  it('should return randomized user object on call', ()=>{

    return chai.request("http://localhost:3000")
      .post('/v1.0/register')
      .send({
        username:'test',
        password:'123huh',
        email:'graamans@gmail.com'
      })
      .then(function (res) {
        expect(res).to.have.status(200);
      })
      .catch(function (err) {
        throw err;
      });
  });

});
