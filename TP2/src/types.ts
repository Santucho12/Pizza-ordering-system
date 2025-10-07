export type Size = 'S' | 'M' | 'L'
export type OrderStatus = 'new' | 'preparing' | 'delivered'

export interface Order {
  id: string;
  size: Size;
  toppings: string[];
  items: string[];
  address: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
}
