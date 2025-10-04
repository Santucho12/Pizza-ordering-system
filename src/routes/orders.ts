import { Router } from 'express';
import { createOrder, getOrderById, cancelOrder, getOrdersByStatus, Order } from '../services/orderService';
import { z } from 'zod';

const router = Router();

// Esquema Zod para validar el body
const orderSchema = z.object({
	size: z.enum(['S', 'M', 'L']),
	toppings: z.array(z.string()).max(5),
	items: z.array(z.string()).min(1),
	address: z.string().min(10)
});

// Almacén en memoria de pedidos
function getOrdersArray(req: any): Order[] {
	return req.orders ?? orders;
}
const orders: Order[] = [];

// ...existing code...
/**
 * GET /orders?status
 * Lista pedidos filtrados por estado
 */
router.get('/', (req, res) => {
	const { status } = req.query;
	if (typeof status !== 'string') {
		return res.status(400).json({ error: 'Falta el parámetro status' });
	}
		const filtered = getOrdersByStatus(getOrdersArray(req), status as any);
	res.status(200).json(filtered);
});

/**
 * POST /orders
 * Crea un nuevo pedido y lo almacena en memoria
 */
router.post('/', (req, res) => {
	const parse = orderSchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(422).json({ error: 'Datos inválidos', details: parse.error.issues });
	}
		try {
			const order = createOrder(parse.data);
			getOrdersArray(req).push(order);
			res.status(201).json(order);
		} catch (err: any) {
			res.status(400).json({ error: err.message });
		}
});

/**
 * GET /orders/:id
 * Devuelve el pedido por id
 */
router.get('/:id', (req, res) => {
		const order = getOrderById(getOrdersArray(req), req.params.id);
	if (!order) {
		return res.status(404).json({ error: 'Pedido no encontrado' });
	}
	res.status(200).json(order);
});

/**
 * POST /orders/:id/cancel
 * Cancela el pedido si está en estado 'new'
 */
router.post('/:id/cancel', (req, res) => {
		const pedidosArr = getOrdersArray(req);
		const pedido = pedidosArr.find(o => o.id === req.params.id);
	if (!pedido) {
		return res.status(404).json({ error: 'Pedido no encontrado' });
	}
	if (pedido.status === 'delivered') {
		return res.status(409).json({ error: 'No se puede cancelar un pedido entregado' });
	}
		const order = cancelOrder(pedidosArr, req.params.id);
		res.status(200).json(order);
});

export default router;
