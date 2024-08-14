const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');  // Asegúrate de que apunte a tu servidor

describe('Products Router', () => {
  it('Debería obtener todos los productos', (done) => {
    request(app)
      .get('/api/products')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Debería agregar un nuevo producto', (done) => {
    const newProduct = {
      name: 'Producto de prueba',
      price: 99.99,
      category: 'Electrónica'
    };

    request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id');
        done();
      });
  });

  it('Debería validar campos obligatorios al agregar un producto', (done) => {
    const newProduct = {
      price: 99.99
    };

    request(app)
      .post('/api/products')
      .send(newProduct)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});
