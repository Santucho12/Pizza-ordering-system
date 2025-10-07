import express from 'express';
import { makeOrdersRouter } from './routes/orders';
import { OrdersService } from './services/ordersService';
import { errorHandler } from './middleware/errors';

export function makeApp() { //Quizas seria mejor implementarlo en un objeto
  const app = express();
  app.use(express.json());
  const ordersService = new OrdersService();
  app.use('/orders', makeOrdersRouter(ordersService));
  app.use(errorHandler);
  return app;
}
