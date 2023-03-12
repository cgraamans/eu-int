import chai from 'chai';
import chaiHttp from 'chai-http';
// import chaiJson from 'chai-json';

import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

// describe('API Register DUP NAME', () => {

//   it('should have error 400 and message bad email', ()=>{

//     return chai.request("http://localhost:3000")
//       .post('/v1.0/register')
//       .send({
//         username:'test',
//         password:'123huh',
//         email:'graamans'
//       })
//       .then(function (res) {
//         expect(res).to.have.status(400);
//         console.log(res);
//       })
//       .catch(function (err) {
//         throw err;
//       });

//   });

// });

describe('API Register BAD EMAIL', () => {

  it('should have error 400 and message bad email', ()=>{

    return chai.request("http://localhost:3000")
      .post('/v1.0/register')
      .send({
        username:"test_"+Math.random().toString(),
        password:'123huh',
        email:(Math.random().toString())
      })
      .then(function (res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.eql({error: "Invalid email"});
      })
      .catch(function (err) {
        throw err;
      });

  });

});

describe('API Register Username > 64char', () => {

  it('should have error 400 and message username too long', ()=>{

    return chai.request("http://localhost:3000")
      .post('/v1.0/register')
      .send({
        username:'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest',
        password:'123huh',
        email:(Math.random().toString())+'@gmail.com'
      })
      .then(function (res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.eql({error: "Username too long"});
      })
      .catch(function (err) {
        throw err;
      });

  });

});

describe('API Register Username taken', () => {

  it('should have error 400 and message username taken', ()=>{

    return chai.request("http://localhost:3000")
      .post('/v1.0/register')
      .send({
        username:"test",
        password:'123huh',
        email:(Math.random().toString())
      })
      .then(function (res) {
        expect(res).to.have.status(400);
        expect(res).to.be.json;
        expect(res.body).to.eql({error: "Username taken"});
      })
      .catch(function (err) {
        throw err;
      });

  });

});


describe('API Register SUCCESS', () => {

  it('should return randomized user object and json token on call', ()=>{

    return chai.request("http://localhost:3000")
      .post('/v1.0/register')
      .send({
        username:"test_"+Math.random().toString(),
        password:'123huh',
        email:(Math.random().toString())+'@gmail.com'
      })
      .then(function (res) {
        expect(res).to.have.status(200);
      })
      .catch(function (err) {
        throw err;
      });

  });

});


