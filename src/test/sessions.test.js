const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');

describe('Sessions Router', () => {
  it('Debería iniciar sesión con credenciales válidas', (done) => {
    const userCredentials = {
      username: 'userTest',
      password: 'passwordTest'
    };

    request(app)
      .post('/api/sessions/login')
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Debería fallar al iniciar sesión con credenciales inválidas', (done) => {
    const userCredentials = {
      username: 'userTest',
      password: 'wrongPassword'
    };

    request(app)
      .post('/api/sessions/login')
      .send(userCredentials)
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('Debería cerrar sesión correctamente', (done) => {
    request(app)
      .post('/api/sessions/logout')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('message').equal('Logout successful');
        done();
      });
  });
});
