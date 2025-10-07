import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ error: 'ErrorDeValidacion', details: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ErrorDeValidacion', details: parsed.error.flatten() });
    }
    req.query = parsed.data;
    next();
  };
}

export function validateParams(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ error: 'ErrorDeValidacion', details: parsed.error.flatten() });
    }
    req.params = parsed.data;
    next();
  };
}
