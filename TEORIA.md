# Trabajo Práctico 2 - Teoría

## 1. Ciclo Rojo → Verde → Refactor

El ciclo TDD consiste en tres pasos: **Rojo** (escribir un test que falle), **Verde** (escribir el mínimo código para que pase) y **Refactor** (mejorar el código manteniendo los tests verdes). El tamaño de los pasos es crucial porque pasos pequeños reducen la superficie de error, facilitan el debug y mantienen el feedback loop corto. Pasos grandes pueden introducir múltiples cambios simultáneamente, haciendo difícil identificar qué causó una falla.

El tamaño pequeño de incrementos también permite mantener un ritmo sostenible y confianza en el código, ya que siempre hay un conjunto de tests que verifican el comportamiento esperado.

## 2. Tipos de Tests en APIs

**Tests unitarios** prueban una sola unidad de código (función, clase) en aislamiento, usando mocks para dependencias. **Tests de integración** verifican la interacción entre múltiples componentes (controlador + servicio + base de datos). **Tests E2E** prueban el flujo completo desde la perspectiva del usuario, incluyendo red, base de datos real y UI.

En APIs REST, un test unitario probaría la lógica de un servicio, un test de integración verificaría un endpoint completo con base de datos de prueba, y un E2E haría requests HTTP reales a la API desplegada.

## 3. Dobles de Prueba

Un **doble de prueba** es un objeto que reemplaza una dependencia real durante testing. **Mock**: verifica que se llamaron métodos específicos con parámetros correctos (comportamiento). **Stub**: devuelve valores predeterminados sin verificar llamadas (estado). **Spy**: combina ambos, registra llamadas y puede devolver valores.

Use mocks para verificar interacciones críticas, stubs para simular respuestas de servicios externos, y spies cuando necesite tanto verificar llamadas como controlar respuestas.

## 4. Separación App de Server

Separar la aplicación Express del servidor permite testear sin abrir puertos reales. `makeApp()` retorna la instancia de Express configurada, mientras que `server.ts` la ejecuta con `.listen()`.

```typescript
// app.ts
export function makeApp() {
  const app = express();
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  return app;
}

// server.ts
const app = makeApp();
app.listen(3000);

// test
import request from 'supertest';
import { makeApp } from '../src/app';

test('health endpoint', async () => {
  const response = await request(makeApp()).get('/health');
  expect(response.status).toBe(200);
});
```

## 5. Zod: parse vs safeParse

`parse()` lanza excepción si la validación falla, útil cuando queremos que el flujo se interrumpa inmediatamente. `safeParse()` retorna un objeto con `success` y `error`, permitiendo manejo granular de errores sin try/catch.

En rutas Express, use `safeParse()` para retornar errores 400 con detalles específicos al cliente, y `parse()` en middleware de validación donde una excepción se maneje centralizadamente.

## 6. Reglas de Dominio para Tests Unitarios

**Ejemplo 1**: En un sistema de e-commerce, validar que no se puede crear un pedido con cantidad negativa de productos o con productos inexistentes. **Ejemplo 2**: En gestión de tareas, una tarea no puede marcarse como completada si tiene subtareas pendientes, y la fecha de vencimiento no puede ser anterior a la fecha de creación.

Estas reglas van más allá de validación de entrada y representan invariantes del negocio que deben mantenerse siempre.

## 7. Malos Olores en Tests

**Naming poco descriptivo**: tests como `test1()` o `should work()` no comunican qué verifican. **Duplicación**: copiar/pegar setup sin extraer helpers reutilizables. **Asserts débiles**: usar `toBeTruthy()` en lugar de verificar valores específicos, o no validar propiedades importantes del resultado.

Otros olores incluyen mocks frágiles acoplados a implementación, tests lentos sin reason clara, y tests que prueban implementación en lugar de comportamiento.

## 8. Criterios de Aceptación ↔ Tests

| Criterio de Aceptación | Test Correspondiente |
|------------------------|---------------------|
| "Como usuario, puedo crear una tarea con título y descripción" | `POST /tasks` retorna 201 con task creada |
| "El sistema rechaza tareas sin título con error descriptivo" | `POST /tasks` sin título retorna 400 con mensaje de error |

La trazabilidad asegura que cada funcionalidad requerida tiene verificación automatizada y cada test tiene justificación de negocio.

## 9. Limitaciones de 100% Cobertura

Perseguir 100% cobertura puede llevar a tests sin valor que solo ejercitan código sin verificar comportamiento correcto. También puede incentivar escribir código innecesariamente complejo para alcanzar métricas. La cobertura no detecta lógica faltante ni bugs en código no ejecutado durante tests.

Es mejor enfocarse en cobertura de casos críticos y edge cases relevantes, priorizando calidad sobre cantidad de líneas cubiertas.

## 10. Helpers/Builders para Tests

Un **helper** es una función que encapsula setup común de tests. Un **builder** usa patrón Builder para crear objetos de prueba con valores por defecto.

```typescript
// Helper
function createTestUser(overrides = {}) {
  return {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

// Builder
class TaskBuilder {
  private task = { title: 'Default Task', completed: false };
  
  withTitle(title: string) { this.task.title = title; return this; }
  completed() { this.task.completed = true; return this; }
  build() { return { ...this.task }; }
}

// Uso: new TaskBuilder().withTitle('Important').completed().build()
```