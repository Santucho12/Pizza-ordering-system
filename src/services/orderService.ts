// --- Servicio para filtrar pedidos por estado ---
export function getOrdersByStatus(orders: Order[], status: OrderStatus): Order[] {
  return orders.filter(order => order.status === status);
}
// --- Servicio para cancelar pedido ---
export function cancelOrder(orders: Order[], id: string): Order | undefined {
  const order = orders.find(o => o.id === id);
  // Solo se puede cancelar si está en estado 'new'
  if (order && order.status === 'new') {
    order.status = 'cancelled';
    return order;
  }
  return undefined;
}
// --- Tipos para pedido y datos de entrada ---

// Solo se permiten estos tamaños de pizza
export type OrderSize = 'S' | 'M' | 'L';

// Estados posibles de un pedido
export type OrderStatus = 'new' | 'cancelled' | 'delivered';

// Estructura de los datos que se reciben para crear un pedido
export interface CreateOrderInput {
  size: OrderSize;         // Tamaño de la pizza
  toppings: string[];      // Lista de toppings
  items: string[];         // Lista de items (ej: pizzas)
  address: string;         // Dirección de entrega
}

// Estructura completa de un pedido (incluye id, precio y estado)
export interface Order extends CreateOrderInput {
  id: string;              // Identificador único
  price: number;           // Precio calculado
  status: OrderStatus;     // Estado del pedido
}

// --- Lógica de precios ---

// Precios base según tamaño
const SIZE_PRICES: Record<OrderSize, number> = {
  S: 500,   // Pequeña
  M: 800,   // Mediana
  L: 1200,  // Grande
};

// Precio extra por cada topping
const TOPPING_PRICE = 100;

// --- Validación de datos para crear pedido ---
function validateOrderInput(data: CreateOrderInput) {
  if (!data.items || data.items.length === 0) throw new Error('items vacío');
  if (data.address.length < 10) throw new Error('address muy corta');
  if (!['S', 'M', 'L'].includes(data.size)) throw new Error('size inválido');
  if (data.toppings.length > 5) throw new Error('máx 5 toppings');
}

// --- Servicio principal para crear pedido ---
export function createOrder(data: CreateOrderInput): Order {
  validateOrderInput(data);
  // Calcular el precio: base por tamaño + extra por toppings
  const price = SIZE_PRICES[data.size] + TOPPING_PRICE * data.toppings.length;
  // Retornar el pedido creado
  return {
    ...data,
    id: Math.random().toString(36).slice(2, 10), // id aleatorio
    price,
    status: 'new', // Estado inicial
  };
}

// --- Servicio para obtener pedido por id ---
export function getOrderById(orders: Order[], id: string): Order | undefined {
  return orders.find(order => order.id === id);
}