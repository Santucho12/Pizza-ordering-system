# GRUPO 15

## 👥 INTEGRANTES 
- Cordano, Nicolas
- Grgurich, Abner
- Nicaise, Raphael
- Rozas, Manuel
- Segal, Santiago


---

# User stories abordadas
- Crear un pedido válido: el sistema permite registrar un nuevo pedido con datos correctos (CA1).  
- Listar pedidos por estado: el usuario puede obtener solo los pedidos entregados o en curso según filtro (CA2).  
- Obtener pedido por ID: se puede consultar un pedido específico y recibir un error si no existe (CA3).  
- Cancelar un pedido: solo se permite cancelar si el pedido aún no fue entregado (CA5 / ERR2).  
- Validaciones de datos: el sistema devuelve errores apropiados ante datos inválidos o intentos no permitidos (CA4 / ERR1 / ERR2).  
- Lógica interna validada: los servicios (`OrdersService`) calculan precios, filtran y validan correctamente (UT1–UT3).  

---

# Scripts


`npm i`: Instalar dependencias
`npm run dev`: Correr el server en modo desarrollo
`npm test`: Ejecutar todos los tests
`npm run coverage`: Ejecutar tests con reporte de cobertura (usa Vitest) 

**Framework de testing:** Vitest
**Cobertura:** manejada con `--coverage` (con motor v8).  

---

# ⚙️ Instrucciones de ejecución

1. Clonar el repositorio:  
   ```bash
   git clone https://github.com/RaphaelNicaise/Programacion-4.git
   cd TP2
   npm i
   ```

2. Correr el servidor:  
   ```bash
   npm run dev
   ```
   El servidor corre por defecto en **http://localhost:3000**

3. Ejecutar los tests:  
   ```bash
   npm test
   ```

4. Ver cobertura:  
   ```bash
   npm run coverage
   ```

---

# Ejemplos con `curl` (Linux)


### Crear un pedido valido
```bash
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{
  "size": "M",
  "toppings": ["jamon", "aceitunas"],
  "items": ["napolitana"],
  "address": "Belgrano 456, Bahía Blanca"
}'
```

### Obtener pedido(order) por ID
```bash
curl http://localhost:3000/orders/<id>
```

### Cancelar pedido(order)
```bash
curl -X POST http://localhost:3000/orders/<id>/cancel
```

### Filtrar pedidos(orders) por estado
```bash
curl http://localhost:3000/orders?status=delivered
```

### Buscar pedidos(orders)

```bash 
curl http://localhost:3000/orders
```
---
#  Matriz de casos de prueba
| ID   | Caso / Descripción                                            | Precondición (estado/mocks)                                          | Input (query/body/params)                                                                                                                                           | Acción (HTTP) / Método        | Resultado esperado                                                         | Test (archivo · nombre) |
|------|----------------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|---------------------------------------------------------------------------|--------------------------|
| **CA1** | Crear pedido válido → **201**                                  | Servicio en memoria vacío o con datos iniciales                       | **body**: `{ "size":"M", "toppings":["jamon"], "items":["napolitana"], "address":"Belgrano 456, Bahia Blanca" }`                                                  | **POST** `/orders`             | 201 y body con `id`, `status:"new"`, `total`, `createdAt`                 | `tests/integration/orders.routes.test.ts` · “deberia POST /orders crear un pedido valido” |
| **CA2** | Filtrar pedidos por estado `delivered` → **200**               | Al menos un pedido con estado `delivered`                             | **query**: `?status=delivered`                                                                                                                                     | **GET** `/orders?status=delivered` | 200 y body solo con pedidos `status:"delivered"`                         | `tests/integration/orders.routes.test.ts` · “debería GET /orders?status=delivered filtrar las ordenes por estado” |
| **CA3** | Obtener pedido inexistente → **404**                           | Ningún pedido con ese ID                                              | **params**: `/:id` con un ID inexistente                                                                                                                          | **GET** `/orders/:id`          | 404 `{ "error": "No encontrado" }`                                        | `tests/integration/orders.routes.test.ts` · “deberia GET /orders/:id devolver 404 si no existe” |
| **CA4** | Body inválido (size inválido / address corto / items vacío) → **422** | —                                                                    | **body**: `{ "size":"XL", "toppings":[...10], "items":[], "address":"corta" }`                                              | **POST** `/orders`             | 422 `{ "error": "ErrorDeValidacion" }`                                   | `tests/integration/orders.routes.test.ts` · “deberia POST /orders con body invalido devolver 400 con un mensaje de error de validacion” *(actualizado a 422)* |
| **CA5** | Cancelar pedido entregado → **409**                           | Existe un pedido creado y marcado como `delivered`                    | **params**: `/:id` del pedido entregado                                                                                                                           | **POST** `/orders/:id/cancel`  | 409 `{ "error": "Error: no se puede cancelar un pedido entregado" }`     | `tests/integration/orders.routes.test.ts` · “deberia POST /orders/:id/cancel devolver 409 si el pedido no tiene status "new"” |
| **UT1** | Calcular precio correctamente según tamaño y toppings          | —                                                                    | **size/toppings** varios a través de `create()`                                                                             | Método interno `OrdersService.create()` | Retorna total calculado correctamente                              | `tests/unit/ordersService.test.ts` · “create service” |
| **UT2** | Filtrar pedidos por estado `delivered` (unit test)             | Existen pedidos con distintos estados                                 | —                                                                                                                           | Método interno `OrdersService.list({status:'delivered'})` | Devuelve solo pedidos entregados                         | `tests/unit/ordersService.test.ts` · “filtra por estado 'delivered'” |
| **UT3** | No permite cancelar si no está en estado `new`                 | Pedido creado y luego marcado como `delivered`                        | **id** del pedido entregado                                                                                                 | Método interno `OrdersService.cancel(id)` | Lanza error “solo se pueden cancelar pedidos en estado nuevo”  | `tests/unit/ordersService.test.ts` · “no permite cancelar si no está en estado nuevo” |
| **ERR1** | Validación de body incorrecto → **422**                       | —                                                                    | **body** incompleto o inválido                                                                                              | **POST** `/orders`             | 422 `{ "error": "ErrorDeValidacion" }`                                   | `tests/integration/orders.routes.test.ts` · “body inválido” |
| **ERR2** | Cancelación no permitida → **409**                            | Pedido con estado `delivered`                                         | **params**: `/:id`                                                                                                          | **POST** `/orders/:id/cancel`  | 409 `{ "error": no se puede cancelar un pedido entregado" }`     | `tests/integration/orders.routes.test.ts` · “cancelar entregado” |


---

#  Cobertura
✅ **Cobertura >=** **80 %** en archivos modificados. 
