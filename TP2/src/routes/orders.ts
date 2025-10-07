import { Router } from 'express'
import type { OrdersService } from '../services/ordersService'
import { validateBody, validateParams, validateQuery } from '../middleware/validate'
import { createOrderSchema, idParamSchema, listOrdersQuerySchema, cancelParamSchema } from '../schemas/orderSchemas'
import { OrdersController } from '../controllers/ordersController'

export function makeOrdersRouter(service: OrdersService) {
  const orderRouter = Router()
  const orderController: OrdersController = new OrdersController(service)

  orderRouter.get('/', validateQuery(listOrdersQuerySchema), orderController.getlist)
  orderRouter.post('/', validateBody(createOrderSchema), orderController.create)
  orderRouter.get('/:id', validateParams(idParamSchema), orderController.getById)
  orderRouter.post('/:id/cancel', validateParams(cancelParamSchema), orderController.cancel)

  return orderRouter
}
