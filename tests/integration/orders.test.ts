import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /orders?status', () => {
  it('debería listar pedidos por estado', async () => {
    const app = makeApp();
    // Crear dos pedidos con estado 'new'
    await request(app)
      .post('/orders')
      .send({
        size: 'M',
        toppings: ['queso'],
        items: ['pizza'],
        address: 'Calle 1234'
      });
    await request(app)
      .post('/orders')
      .send({
        size: 'L',
        toppings: ['jamón'],
        items: ['pizza'],
        address: 'Calle 5678'
      });
    // Consultar pedidos con estado 'new'
    const resNew = await request(app)
      .get('/orders?status=new');
    expect(resNew.status).toBe(200);
    expect(Array.isArray(resNew.body)).toBe(true);
    expect(resNew.body.every(o => o.status === 'new')).toBe(true);
  });

  it('debería devolver array vacío si no hay pedidos con ese estado', async () => {
    const app = makeApp();
    const res = await request(app)
      .get('/orders?status=cancelled');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('POST /orders', () => {
  it('debería crear un pedido y devolver 201', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/orders')
      .send({
        size: 'M',
        toppings: ['queso'],
        items: ['pizza'],
        address: 'Calle 1234'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.price).toBeGreaterThan(0);
  });
});

describe('GET /orders/:id', () => {
  it('debería devolver el pedido por id', async () => {
    const app = makeApp();
    // Primero creamos un pedido
    const resPost = await request(app)
      .post('/orders')
      .send({
        size: 'M',
        toppings: ['jamón'],
        items: ['pizza'],
        address: 'Calle 5678'
      });
    const id = resPost.body.id;
    // Ahora consultamos el pedido por id
    const resGet = await request(app)
      .get(`/orders/${id}`);
    expect(resGet.status).toBe(200);
    expect(resGet.body).toHaveProperty('id', id);
    expect(resGet.body).toHaveProperty('size', 'M');
  });

  it('debería devolver 404 si el pedido no existe', async () => {
    const app = makeApp();
    const res = await request(app)
      .get('/orders/no-existe');
    expect(res.status).toBe(404);
  });
});

describe('POST /orders/:id/cancel', () => {
  it('debería cancelar el pedido y devolverlo con estado cancelled', async () => {
    const app = makeApp();
    // Crear pedido
    const resPost = await request(app)
      .post('/orders')
      .send({
        size: 'L',
        toppings: ['aceitunas'],
        items: ['pizza'],
        address: 'Calle 9999'
      });
    const id = resPost.body.id;
    // Cancelar pedido
    const resCancel = await request(app)
      .post(`/orders/${id}/cancel`);
    expect(resCancel.status).toBe(200);
    expect(resCancel.body).toHaveProperty('id', id);
    expect(resCancel.body).toHaveProperty('status', 'cancelled');
  });

  it('debería devolver 409 si el pedido ya está entregado', async () => {
    const app = makeApp();
    // Crear pedido
    const resPost = await request(app)
      .post('/orders')
      .send({
        size: 'M',
        toppings: ['jamón'],
        items: ['pizza'],
        address: 'Calle 8888'
      });
    const id = resPost.body.id;
    // Simular entrega del pedido
    const pedido = app.locals.orders.find((o: any) => o.id === id);
    pedido.status = 'delivered';
    // Intentar cancelar pedido entregado
    const resCancel = await request(app)
      .post(`/orders/${id}/cancel`);
    expect(resCancel.status).toBe(409);
    expect(resCancel.body).toHaveProperty('error');
  });

  it('debería devolver 404 si el pedido no existe', async () => {
    const app = makeApp();
    const res = await request(app)
      .post('/orders/no-existe/cancel');
    expect(res.status).toBe(404);
  });
});