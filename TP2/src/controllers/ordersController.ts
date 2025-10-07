import type { Request, Response, NextFunction } from 'express';
import type { OrdersService } from '../services/ordersService';

interface orderControllerInterface {
  getlist(req: Request, res: Response): void
}

export class OrdersController implements orderControllerInterface {
  constructor(private readonly service: OrdersService) {}

  public getlist = (req: Request, res: Response) => {
    const { status } = req.query as { status?: 'new' | 'preparing' | 'delivered' };
    const orders = this.service.list({ status });
    res.json(orders);
  };

  create = (req: Request, res: Response) => {
    const order = this.service.create(req.body);
    res.status(201).json(order);
  };

  getById = (req: Request, res: Response) => {
    const order = this.service.getById(req.params.id);
    if (!order) return res.status(404).json({ error: 'No encontrado' });
    res.json(order);
  };

  cancel = (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = this.service.cancel(req.params.id);
      res.json(order);
    } catch (err) {
      next(err);
    }
  };
}
