import express from 'express'
import request from 'supertest'
import { describe, test, expect, vi } from 'vitest'
import { makeOrdersRouter } from '../../src/routes/orders'
import { OrdersService } from '../../src/services/ordersService'
import { errorHandler } from '../../src/middleware/errors'

vi.mock('../../src/services/ordersService.js', async (importOriginal) => {
  const Actual = await importOriginal<typeof import('../../src/services/ordersService.js')>();
  return {
    ...Actual,
    OrdersService: class extends Actual.OrdersService {
      calcPrice() {
        return 5000;
      }
    }
  }
})

function makeTestApp() {
  const app = express()
  app.use(express.json())
  const service = new OrdersService()
  app.use('/orders', makeOrdersRouter(service))
  app.use(errorHandler)
  return { app, service }
}

describe('API Orders Routes', () => {
  test('deberia POST /orders crear un pedido valido', async () => {
    const { app } = makeTestApp()
    const res = await request(app).post('/orders').send({
      size: 'M',
      toppings: ['jamon'],
      items: ['napolitana'],
      address: 'Belgrano 456, Bahia Blanca'
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id')
  })

  test('deberia POST /orders con body invalido devolver 422 con un mensaje de error de validacion', async () => {
    const { app } = makeTestApp();
    const res = await request(app).post('/orders').send({
      size: 'XL',
      toppings: new Array(10).fill('x'),
      items: [],
      address: 'corta'
    });
    expect(res.status).toBe(422)
    expect(res.body.error).toBe('ErrorDeValidacion')
  })

  test('debería GET /orders?status=delivered filtrar las ordenes por estado', async () => {
    const { app, service } = makeTestApp()
    const orderA = service.create(
      { size: 'S', toppings: [], items: ['muzza'], address: 'Dir 1, BB' }
    )
    const orderB = service.create(
      { size: 'L', toppings: [], items: ['faina'], address: 'Dir 2, BB' }
    )
    service.markDelivered(orderB.id);

    const res = await request(app).get('/orders').query({ status: 'delivered' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].id).toBe(orderB.id)
  })

  test('deberia GET /orders/:id devolver 404 si no existe', async () => {
    const { app } = makeTestApp()
    const res = await request(app).get('/orders/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('No encontrado')
  })

  test('deberia POST /orders/:id/cancel devolver 409 si el pedido no tiene status "new"', async () => {
    const { app, service } = makeTestApp()
    const order = service.create(
      { size: 'M', toppings: [], items: ['fugazzeta'], address: 'Dir 3, BB' }
    )
    service.markDelivered(order.id)
    const res = await request(app).post(`/orders/${order.id}/cancel`).send()
    expect(res.status).toBe(409)
  })
})
