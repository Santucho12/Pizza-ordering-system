# 🍕 Pizza Ordering System API

## Descripción
API REST para gestión de pedidos de pizzería. Implementada en TypeScript, Express y Zod, siguiendo el enfoque TDD (Test Driven Development).

---

## Enfoque TDD
Este proyecto se desarrolló siguiendo el ciclo TDD:
1. **Rojo:** Se escribe primero el test unitario para la regla de negocio o endpoint, asegurando que falle.
2. **Verde:** Se implementa el mínimo código necesario para que el test pase.
3. **Refactor:** Se mejora el código (nombres, helpers, duplicación) manteniendo los tests en verde.
4. Se repite el ciclo por cada historia de usuario y caso relevante.

Se escribieron tests unitarios para la lógica de servicios y tests de integración para los endpoints HTTP, cubriendo status, body y errores.
La cobertura obtenida es superior al 80% en todos los archivos modificados.

---

## Instalación y ejecución

### Requisitos
- Node.js 18+
- npm

### Scripts principales
```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage

# Iniciar la API (por defecto en puerto 3000)
npm start
```
La API se ejecuta en el puerto definido en el archivo `.env` (por defecto 3000).

---

## Uso de la API (ejemplos curl)

**1. Crear pedido (POST /orders):**
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"size":"M","toppings":["queso"],"items":["pizza"],"address":"Calle 1234"}'
```
_Respuesta esperada:_
```json
{
  "id": "abc123",
  "size": "M",
  "toppings": ["queso"],
  "items": ["pizza"],
  "address": "Calle 1234",
  "price": 1200,
  "status": "new"
}
```

**2. Consultar pedido por id (GET /orders/:id):**
```bash
curl http://localhost:3000/orders/<ID_DEL_PEDIDO>
```
_Reemplaza `<ID_DEL_PEDIDO>` por el id real devuelto al crear el pedido._
_Respuesta esperada:_
```json
{
  "id": "abc123",
  "size": "M",
  "toppings": ["queso"],
  "items": ["pizza"],
  "address": "Calle 1234",
  "price": 1200,
  "status": "new"
}
```

**3. Cancelar pedido (POST /orders/:id/cancel):**
```bash
curl -X POST http://localhost:3000/orders/<ID_DEL_PEDIDO>/cancel
```
_Respuesta esperada:_
```json
{
  "id": "abc123",
  "size": "M",
  "toppings": ["queso"],
  "items": ["pizza"],
  "address": "Calle 1234",
  "price": 1200,
  "status": "cancelled"
}
```

**4. Listar pedidos por estado (GET /orders?status):**
```bash
curl "http://localhost:3000/orders?status=new"
```
_Respuesta esperada:_
```json
[
  {
    "id": "abc123",
    "size": "M",
    "toppings": ["queso"],
    "items": ["pizza"],
    "address": "Calle 1234",
    "price": 1200,
    "status": "new"
  }
  // ...otros pedidos
]
```

---

## Matriz de casos de prueba

| ID   | Caso / Descripción                                      | Precondición         | Input                                                      | Acción                        | Resultado esperado                                 | Test (archivo/función)               |
|------|--------------------------------------------------------|----------------------|------------------------------------------------------------|-------------------------------|----------------------------------------------------|--------------------------------------|
| CA1  | Crear pedido válido                                    | -                    | size: M, toppings: [queso], items: [pizza], address: ...   | POST /orders                  | Pedido creado, status 201, body con id y precio    | integration/orders.test.ts: 'debería crear un pedido y devolver 201' |
| CA2  | Consultar pedido existente                             | Pedido creado        | id válido                                                  | GET /orders/:id               | Status 200, body con datos del pedido              | integration/orders.test.ts: 'debería devolver el pedido por id' |
| CA3  | Cancelar pedido en estado 'new'                        | Pedido en estado new | id válido                                                  | POST /orders/:id/cancel       | Status 200, body con status 'cancelled'            | integration/orders.test.ts: 'debería cancelar el pedido y devolverlo con estado cancelled' |
| CA4  | Listar pedidos por estado                              | Pedidos existentes   | status=new                                                 | GET /orders?status=new        | Status 200, array de pedidos con ese estado        | integration/orders.test.ts: 'debería listar pedidos por estado' |
| ER1  | Error por items vacío                                  | -                    | items: []                                                  | POST /orders                  | Status 422, error en body                         | integration/orders.test.ts: 'debería devolver 422 si items está vacío' |
| ER2  | Error por cancelar pedido entregado                    | Pedido entregado     | id entregado                                               | POST /orders/:id/cancel       | Status 409, error en body                         | integration/orders.test.ts: 'debería devolver 409 si el pedido ya está entregado' |
| ER3  | Error por pedido no encontrado                         | -                    | id inexistente                                             | GET /orders/:id, POST /orders/:id/cancel | Status 404, error en body                         | integration/orders.test.ts: 'debería devolver 404 si el pedido no existe' |

---

## Coverage

Para ver el reporte de cobertura ejecuta:
```bash
npm test -- --coverage
```
Esto genera la carpeta `coverage` con el reporte en formato HTML y texto.

**Cobertura obtenida:**
- Líneas: 94.66%
- Branches: 83.33%
- Funciones: 100%


---
