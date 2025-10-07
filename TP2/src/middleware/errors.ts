import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'Error inesperado';
  const lower = message.toLowerCase()

  let status = 400

  if (lower.includes('no encontrado')) {
    status = 404
  } else {
    const conflictWords = [
      'error',
      'no se puede cancelar',
      'entregado'
    ]
    if (conflictWords.some(w => lower.includes(w))) {
      status = 409;
    }
  }

  res.status(status).json({ error: message })
}
