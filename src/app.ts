import express from 'express';
import ordersRouter from './routes/orders';

// makeApp: crea la app Express sin levantar el server
export function makeApp() {
  const app = express();
  app.use(express.json());
  // Inicializar almacén de pedidos en app.locals
  app.locals.orders = [];
  // Inyectar orders en el router
  app.use('/orders', (req, res, next) => {
    req.orders = app.locals.orders;
    next();
  }, ordersRouter);
  return app;
}
