import { z } from 'zod'

export const createOrderSchema = z.object({
  size: z.enum(['S','M','L']),
  toppings: z.array(z.string()).max(5).default([]),
  items: z.array(z.string()).min(1),
  address: z.string().min(10).trim()
}).strict()

export const idParamSchema = z.object({
  id: z.string().min(1)
}).strict()

export const listOrdersQuerySchema = z.object({
  status: z.enum(['new','preparing','delivered']).optional()
}).strict()

export const cancelParamSchema = z.object({
  id: z.string().min(1) 
}).strict();
