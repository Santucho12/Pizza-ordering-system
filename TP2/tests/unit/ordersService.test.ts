import { describe, test, expect, beforeEach, vi } from 'vitest'
import { OrdersService } from '../../src/services/ordersService'

vi.mock('../../src/services/ordersService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/services/ordersService')>();
  return {
    ...actual,
    OrdersService: class extends actual.OrdersService {
      calcPrice() {
        return 5000;
      }
    }
  };
});

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    service = new OrdersService();
  });

  test('create service', () => {
    const order = service.create({
      size: 'M',
      toppings: ['queso extra', 'aceitunas'],
      items: ['muzza'],
      address: 'Alsina 123, Bahia Blanca'
    });
    expect(order.total).toBe(5000);
    expect(order.size).toBe('M');
    expect(order.status).toBe('new');
  });

  test('filtra por estado "delivered"', () => {
    const orderB = service.create(
      { size: 'L', toppings: ['jamon'], items: ['napolitana'], address: 'Demo 2, BB' }
    );
    service.markDelivered(orderB.id);
    const delivered = service.list(
      { status: 'delivered' }
    );
    expect(delivered).toHaveLength(1);
    expect(delivered[0].id).toBe(orderB.id);
  });

  test('no permite cancelar si no está en estado "new"', () => {
    const order = service.create(
      { size: 'S', toppings: [], items: ['calabresa'], address: 'X 123, BB' }
    );
    service.markDelivered(order.id);
    expect(() => service.cancel(order.id)).toThrow('error: no se puede cancelar un pedido entregado');
  });
});

