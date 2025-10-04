import { getOrdersByStatus } from '../../src/services/orderService';
// Test unitario para filtrar pedidos por estado
describe('getOrdersByStatus', () => {
  it('debería devolver solo los pedidos con el estado indicado', () => {
    const pedidos: Order[] = [
      { id: '1', size: 'M', toppings: [], items: ['pizza'], address: 'A', price: 100, status: 'new' },
      { id: '2', size: 'L', toppings: [], items: ['pizza'], address: 'B', price: 200, status: 'cancelled' },
      { id: '3', size: 'S', toppings: [], items: ['pizza'], address: 'C', price: 50, status: 'new' }
    ];
    const result = getOrdersByStatus(pedidos, 'new');
    expect(result).toHaveLength(2);
    expect(result.every(o => o.status === 'new')).toBe(true);
  });

  it('debería devolver un array vacío si no hay pedidos con ese estado', () => {
    const pedidos: Order[] = [
      { id: '1', size: 'M', toppings: [], items: ['pizza'], address: 'A', price: 100, status: 'new' }
    ];
    const result = getOrdersByStatus(pedidos, 'cancelled');
    expect(result).toEqual([]);
  });
});
// Importamos las funciones y tipos del servicio de pedidos
import { createOrder, getOrderById, Order } from '../../src/services/orderService';

// Grupo de tests para el servicio de pedidos
describe('Order Service', () => {
  it('debería devolver el pedido por id', () => {
    const pedido = createOrder({
      size: 'M',
      toppings: ['queso'],
      items: ['pizza'],
      address: 'Calle 1234'
    });
    const pedidos: Order[] = [pedido];
    const result = getOrderById(pedidos, pedido.id);
    expect(result).toEqual(pedido);
  });

  it('debería devolver undefined si el id no existe', () => {
    const pedidos: Order[] = [];
    const result = getOrderById(pedidos, 'no-existe');
    expect(result).toBeUndefined();
  });
  // Test: crear pedido y verificar que tiene id
  it('debería crear un pedido con id', () => {
    const order = createOrder({ items: ['pizza'], size: 'M', toppings: ['queso'], address: 'Calle 1234' });
    expect(order).toHaveProperty('id');
  });
  // Test: crear pedido válido y verificar precio y estado
  it('debería crear un pedido válido', () => {
    const order = createOrder({
      size: 'M',
      toppings: ['queso'],
      items: ['pizza'],
      address: 'Calle 1234'
    });
    expect(order).toHaveProperty('id');
    expect(order.price).toBe(800 + 100); // M + 1 topping
    expect(order.status).toBe('new');
  });

  // Test: error si items está vacío
  it('debería lanzar error si items está vacío', () => {
    expect(() => createOrder({
      size: 'M',
      toppings: ['queso'],
      items: [],
      address: 'Calle 1234'
    })).toThrow('items vacío');
  });

  // Test: error si la dirección es muy corta
  it('debería lanzar error si address es muy corta', () => {
    expect(() => createOrder({
      size: 'M',
      toppings: ['queso'],
      items: ['pizza'],
      address: 'Calle'
    })).toThrow('address muy corta');
  });

  // Test: error si el tamaño es inválido
  it('debería lanzar error si size es inválido', () => {
    expect(() => createOrder({
      size: 'X',
      toppings: ['queso'],
      items: ['pizza'],
      address: 'Calle 1234'
    } as any)).toThrow('size inválido');
  });

  // Test: error si hay más de 5 toppings
  it('debería lanzar error si hay más de 5 toppings', () => {
    expect(() => createOrder({
      size: 'M',
      toppings: ['a','b','c','d','e','f'],
      items: ['pizza'],
      address: 'Calle 1234'
    })).toThrow('máx 5 toppings');
  });
  // Test: buscar pedido por id
  it('debería devolver el pedido por id', () => {
    const pedido = createOrder({
      size: 'M',
      toppings: ['queso'],
      items: ['pizza'],
      address: 'Calle 1234'
    });
    const pedidos: Order[] = [pedido];
    const result = getOrderById(pedidos, pedido.id);
    expect(result).toEqual(pedido);
  });

  // Test: buscar pedido por id inexistente
  it('debería devolver undefined si el id no existe', () => {
    const pedidos: Order[] = [];
    const result = getOrderById(pedidos, 'no-existe');
    expect(result).toBeUndefined();
  });
});