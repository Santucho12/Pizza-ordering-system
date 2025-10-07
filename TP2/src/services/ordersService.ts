import type { Order, OrderStatus, Size } from '../types'
import { ListFilter } from './interface/listFilter.interface'

export class OrdersService {
  private orders: Order[] = []

  calcPrice(size: Size, toppings: string[]): number {
    const basePrice = size === 'S' ? 2000 : size === 'M' ? 3000 : 4000
    const toppingsPrice = (toppings?.length ?? 0) * 300
    return basePrice + toppingsPrice
  }

  create(input: Omit<Order, 'id'|'status'|'total'|'createdAt'>): Order {
    const total = this.calcPrice(input.size, input.toppings)
    const order: Order = {
      id: Math.random().toString(36).substring(2, 10),
      size: input.size,
      toppings: input.toppings ?? [],
      items: input.items,
      address: input.address,
      status: 'new',
      total,
      createdAt: new Date()
    }
    this.orders.push(order)
    return order
  }

  getById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id)
  }

  list(filter: ListFilter = {}): Order[] {
    const { status } = filter
    return status ? this.orders.filter(order => order.status === status) : [...this.orders]
  }

cancel(id: string) {
  const order = this.getById(id)
  if (!order) throw new Error('No encontrado')

  if (order.status === 'delivered') {
    throw new Error('error: no se puede cancelar un pedido entregado')
  }

  if (order.status !== 'new') {
    throw new Error('error: no se puede cancelar un pedido que no está en estado new')
  }

  return order
}



  markDelivered(id: string): Order {
    const order = this.getById(id)
    if (!order) {
      throw new Error('No encontrado')
    }
    order.status = 'delivered'
    return order
  }

  clear() {
    this.orders = []
  }
}
