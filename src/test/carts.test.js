const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../server');

describe('Carts Router', () => {
  it('Debería obtener un carrito por ID', (done) => {
    const cartId = 'someCartId'; // Reemplaza con un ID válido

    request(app)
      .get(`/api/carts/${cartId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('id').equal(cartId);
        done();
      });
  });

  it('Debería agregar un producto a un carrito', (done) => {
    const cartId = 'someCartId'; // Reemplaza con un ID válido
    const productId = 'someProductId'; // Reemplaza con un ID válido

    request(app)
      .post(`/api/carts/${cartId}/products`)
      .send({ productId })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('products').that.includes(productId);
        done();
      });
  });

  it('Debería vaciar un carrito', (done) => {
    const cartId = 'someCartId'; // Reemplaza con un ID válido

    request(app)
      .delete(`/api/carts/${cartId}/products`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property('products').that.is.empty;
        done();
      });
  });
});
