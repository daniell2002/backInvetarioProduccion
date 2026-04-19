# 📋 Convenciones de Desarrollo — Sistema de Inventario Industrial

> **IMPORTANTE**: Este documento define las reglas, patrones y convenciones que **DEBEN** seguirse en este proyecto. NO modificar la estructura existente sin consultar primero.

---

## 🌐 Convención de Nombres

### ⚠️ REGLA FUNDAMENTAL:

**Todos los nombres de variables, funciones, clases, archivos y carpetas deben estar en ESPAÑOL, sin excepción.**

### ✅ Correcto

```javascript
// Variables y constantes
const productoActivo = true;
const listaEntradas = [];
const totalStock = 0;

// Funciones
async function obtenerProductosPorSede(sedeId) {}
function calcularStockDisponible(producto, sedeId) {}

// Clases
class ProductoRepository extends BaseRepository {}
class EntradaService {}

// Constantes de dominio
const ESTADOS_TRASLADO = { PENDIENTE: "pendiente", APROBADO: "aprobado" };
const ACCIONES_PERMISO = { VER: "ver", CREAR: "crear" };
```

### ❌ Nunca usar inglés para nombres del dominio

```javascript
const activeProduct = true; // ❌
const entryList = []; // ❌
async function getProducts() {} // ❌
class ProductService {} // ❌ (usar ProductoService)
```

### Nombres de archivos — siempre en español

```
✅ ProductoService.js                   ❌ ProductService.js
✅ entrada.routes.js                    ❌ entry.routes.js
✅ UsuarioRepository.js                 ❌ UserRepository.js
✅ traslado.docs.js                     ❌ transfer.docs.js
```

### Excepciones permitidas

Las siguientes palabras son técnicas universales y **no se traducen**:

- Nombres de librerías: `fastify`, `mongoose`, `pino`, `nodemailer`
- Palabras técnicas: `middleware`, `slug`, `token`, `hash`, `payload`, `webhook`, `socket`, `plugin`, `hook`, `schema`
- Métodos de librerías: `findOne`, `updateMany`, `populate`, `register`, `decorate`
- Propiedades de configuración de terceros: `httpOnly`, `sameSite`, `bearerFormat`, `preHandler`, `onRequest`
- Parámetros de Fastify: `request`, `reply`, `fastify`, `opciones`

### Campos de modelos Mongoose y query params — en español

```javascript
const productoSchema = new mongoose.Schema({
  nombre: String,
  codigoInterno: String,
  codigoExterno: String,
  stockActual: Number,
  stockMinimo: Number,
  activo: Boolean,
  sedeId: ObjectId,
  categoriaId: ObjectId,
});

// GET /api/v1/productos?categoria=laminas&sede=sede01   ✅
// GET /api/v1/products?category=sheets&branch=branch01  ❌
```

---

## 📦 Dependencias del Proyecto

```bash
# Core
npm install fastify
npm install mongoose

# Plugins de seguridad Fastify
npm install @fastify/helmet
npm install @fastify/cors
npm install @fastify/rate-limit
npm install @fastify/cookie
npm install @fastify/jwt

# Documentación
npm install @fastify/swagger
npm install @scalar/fastify-api-reference

# Notificaciones
npm install nodemailer

# Utilidades
npm install bcryptjs
npm install pino-pretty       # Solo desarrollo

# Variables de entorno
npm install dotenv
```

---

## 📂 Estructura de Carpetas

```
backSistema/
├── server.js                          # Punto de entrada
├── package.json
├── .env
├── .env.example
│
├── src/
│   ├── config/
│   │   ├── db.js                      # Conexión MongoDB (Replica Set obligatorio)
│   │   ├── logger.js                  # Pino logger
│   │   ├── openapi.js                 # Configuración OpenAPI 3.1.0 + Scalar
│   │   └── smtp.js                    # Configuración nodemailer
│   │
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── UsuarioController.js
│   │   ├── RolController.js
│   │   ├── SedeController.js
│   │   ├── CategoriaController.js
│   │   ├── ProductoController.js
│   │   ├── TerceroController.js
│   │   ├── OrdenCompraController.js
│   │   ├── EntradaController.js
│   │   ├── SalidaController.js
│   │   ├── TrasladoController.js
│   │   ├── AjusteInventarioController.js
│   │   ├── OrdenDespachoController.js
│   │   ├── MaquinaController.js
│   │   └── InventarioController.js
│   │
│   ├── docs/
│   │   ├── common.docs.js
│   │   ├── auth.docs.js
│   │   ├── usuario.docs.js
│   │   ├── rol.docs.js
│   │   ├── sede.docs.js
│   │   ├── categoria.docs.js
│   │   ├── producto.docs.js
│   │   ├── tercero.docs.js
│   │   ├── ordenCompra.docs.js
│   │   ├── entrada.docs.js
│   │   ├── salida.docs.js
│   │   ├── traslado.docs.js
│   │   ├── ajusteInventario.docs.js
│   │   ├── ordenDespacho.docs.js
│   │   ├── maquina.docs.js
│   │   └── inventario.docs.js
│   │
│   ├── hooks/
│   │   ├── auth.hook.js               # autenticar
│   │   ├── permisos.hook.js           # verificarPermiso(modulo, accion)
│   │   └── rateLimiter.hook.js        # Limitadores por tipo
│   │
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Rol.js
│   │   ├── Sede.js
│   │   ├── Categoria.js
│   │   ├── Subcategoria.js
│   │   ├── UnidadMedida.js
│   │   ├── Producto.js
│   │   ├── Presentacion.js
│   │   ├── Stock.js
│   │   ├── Tercero.js
│   │   ├── OrdenCompra.js
│   │   ├── DetalleOrdenCompra.js
│   │   ├── RecepcionCompra.js
│   │   ├── Entrada.js
│   │   ├── Salida.js
│   │   ├── SolicitudTraslado.js
│   │   ├── DetalleSolicitudTraslado.js
│   │   ├── RecepcionTraslado.js
│   │   ├── AjusteInventario.js
│   │   ├── OrdenDespacho.js
│   │   ├── DetalleOrdenDespacho.js
│   │   └── Maquina.js
│   │
│   ├── repositories/
│   │   ├── BaseRepository.js
│   │   ├── UsuarioRepository.js
│   │   ├── RolRepository.js
│   │   ├── SedeRepository.js
│   │   ├── CategoriaRepository.js
│   │   ├── SubcategoriaRepository.js
│   │   ├── ProductoRepository.js
│   │   ├── StockRepository.js
│   │   ├── TerceroRepository.js
│   │   ├── OrdenCompraRepository.js
│   │   ├── EntradaRepository.js
│   │   ├── SalidaRepository.js
│   │   ├── TrasladoRepository.js
│   │   ├── AjusteInventarioRepository.js
│   │   ├── OrdenDespachoRepository.js
│   │   ├── MaquinaRepository.js
│   │   └── InventarioRepository.js
│   │
│   ├── routes/
│   │   ├── index.js                   # Registro central de todas las rutas
│   │   ├── auth.routes.js
│   │   ├── usuario.routes.js
│   │   ├── rol.routes.js
│   │   ├── sede.routes.js
│   │   ├── categoria.routes.js
│   │   ├── producto.routes.js
│   │   ├── tercero.routes.js
│   │   ├── ordenCompra.routes.js
│   │   ├── entrada.routes.js
│   │   ├── salida.routes.js
│   │   ├── traslado.routes.js
│   │   ├── ajusteInventario.routes.js
│   │   ├── ordenDespacho.routes.js
│   │   ├── maquina.routes.js
│   │   └── inventario.routes.js
│   │
│   ├── services/
│   │   ├── notificaciones/
│   │   │   ├── CorreoService.js
│   │   │   └── templates/
│   │   │       ├── credencialesUsuario.template.js
│   │   │       └── recuperarContrasena.template.js
│   │   ├── AuthService.js
│   │   ├── UsuarioService.js
│   │   ├── RolService.js
│   │   ├── SedeService.js
│   │   ├── CategoriaService.js
│   │   ├── ProductoService.js
│   │   ├── TerceroService.js
│   │   ├── OrdenCompraService.js
│   │   ├── EntradaService.js
│   │   ├── SalidaService.js
│   │   ├── TrasladoService.js
│   │   ├── AjusteInventarioService.js
│   │   ├── OrdenDespachoService.js
│   │   ├── MaquinaService.js
│   │   └── InventarioService.js
│   │
│   └── utils/
│       ├── ErrorApi.js
│       ├── RespuestaApi.js
│       ├── permisos.util.js
│       └── generadorCodigo.util.js
```

### Reglas de estructura

- **NO mover archivos** entre carpetas sin justificación clara
- Cada módulo nuevo debe tener: modelo, repositorio, servicio, controlador, rutas y docs
- Los archivos de `config/` **NO** deben contener lógica de negocio
- Los hooks en `src/hooks/` son funciones puras reutilizables, no clases

---

## 📖 Documentación

### ⚠️ REGLA FUNDAMENTAL:

**❌ NO crear archivos README para documentar endpoints**

**✅ TODA la documentación de API en:**

- `src/docs/` — Archivos con schemas por módulo
- Scalar UI en `/docs` — Generado automáticamente

### Herramienta: OpenAPI 3.1.0 + Scalar

**No se usa Swagger UI.** Se usa Scalar como UI de documentación.

### Patrón: Schemas unificados por operación

Cada operación tiene su propio schema exportado: `schema[Modulo][Operacion]`

```javascript
// src/docs/producto.docs.js

export const schemaProductoListar = {
  tags: ["Producto"],
  summary: "Listar todos los productos",
  description: "Devuelve todos los productos activos. Filtros opcionales.",
  querystring: {
    type: "object",
    properties: {
      sedeId: { type: "string" },
      categoriaId: { type: "string" },
      nombre: { type: "string" },
    },
  },
  response: {
    200: { description: "Productos obtenidos" },
  },
};

export const schemaProductoCrear = {
  tags: ["Producto"],
  summary: "Crear producto",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre", "categoriaId", "unidadMedidaId"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 200 },
      categoriaId: { type: "string", minLength: 24, maxLength: 24 },
      unidadMedidaId: { type: "string", minLength: 24, maxLength: 24 },
      codigoExterno: { type: "string", maxLength: 50 },
      descripcion: { type: "string", maxLength: 500 },
      stockMinimo: { type: "number", minimum: 0 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Producto creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

export const productoSchemas = {};
export const productoPaths = {};
export const productoTags = [
  { name: "Producto", description: "Gestión de productos del inventario" },
];
```

### Propiedades del schema

| Propiedad     | Uso              | Descripción                                        |
| :------------ | :--------------- | :------------------------------------------------- |
| `tags`        | Obligatorio      | Array con nombre del módulo para agrupar en Scalar |
| `summary`     | Obligatorio      | Título corto de la operación                       |
| `description` | Obligatorio      | Descripción detallada con restricciones            |
| `security`    | Si requiere auth | `[{ bearerAuth: [] }]`                             |
| `body`        | POST/PATCH/PUT   | Schema JSON del body                               |
| `params`      | Si tiene :id     | Schema JSON de parámetros de URL                   |
| `querystring` | Si tiene query   | Schema JSON de query strings                       |
| `response`    | Recomendado      | Códigos HTTP y descripciones                       |

### Reglas

1. **UN schema por operación** — Cada endpoint tiene su propio schema exportado
2. **additionalProperties: false** — SIEMPRE en `body`
3. **minProperties: 1** — En PATCH para requerir al menos un campo
4. **Tags siempre exportar** — `[modulo]Tags` es obligatorio

---

## 🔒 Seguridad

### Plugins y orden obligatorio en `server.js`

```javascript
// 1. Helmet (PRIMERO)
// 2. CORS
// 3. Rate Limiting general
// 4. Cookies
// 5. JWT
// 6. Documentación OpenAPI + Scalar
// 7. Decoradores de request
// 8. Rutas
```

### Limitadores de rate

```javascript
// src/hooks/rateLimiter.hook.js
export const configuracionLimitadorAuth = {
  max: 5,
  timeWindow: "15 minutes",
};
export const configuracionLimitadorCreacion = {
  max: 30,
  timeWindow: "1 hour",
};
export const configuracionLimitadorEstricto = {
  max: 10,
  timeWindow: "1 hour",
};
```

### Checklist de seguridad para nuevos endpoints

- [ ] ¿Está protegido con `autenticar`?
- [ ] ¿Tiene rate limiting apropiado?
- [ ] ¿Los errores se manejan con `ErrorApi`?
- [ ] ¿Requiere permiso específico? Usar `verificarPermiso(modulo, accion)`
- [ ] ¿Valida body con JSON Schema?

---

## 📦 Importaciones

### ✅ Patrón correcto (ESM)

```javascript
import mongoose from "mongoose";
import ProductoService from "../services/ProductoService.js";
import RespuestaApi from "../utils/RespuestaApi.js";
import ErrorApi from "../utils/ErrorApi.js";
```

### ❌ NUNCA

```javascript
import ProductoService from "../services/ProductoService"; // ❌ Sin .js
const ProductoService = require("../services/ProductoService.js"); // ❌ CommonJS
```

### Orden de importaciones

1. Paquetes externos (fastify, mongoose, bcryptjs)
2. Configuraciones (`config/`)
3. Hooks (`hooks/`)
4. Servicios / Repositorios / Modelos
5. Utilidades (`utils/`)

---

## 🏗️ Arquitectura en Capas

### Controller → Service → Repository → Model

```javascript
// Controller — maneja request/reply, llama a servicios
// Service — lógica de negocio, llama a repositorios
// Repository — acceso a datos (extiende BaseRepository)
// Model — esquema Mongoose
```

### Reglas de controladores

- NUNCA usar `reply.send()` directamente → usar `RespuestaApi`
- NUNCA usar `console.log()` → usar el logger
- NUNCA poner lógica de negocio → va en servicios
- Los errores `throw` en funciones `async` los captura `setErrorHandler`

### Reglas de servicios

- TODA la lógica de negocio aquí
- NO accede a `request`/`reply`
- Llama a repositorios, NUNCA a modelos directamente
- Lanza errores con `ErrorApi`

### Reglas de repositorios

- Heredan de `BaseRepository`
- ÚNICAMENTE acceden a la base de datos
- NO contienen lógica de negocio
- Soportan transacciones mediante `opciones = {}`

---

## 🔀 Rutas — Prefijos

```
/api/v1/auth/...                    → Autenticación
/api/v1/usuarios/...                → Gestión de usuarios
/api/v1/roles/...                   → Gestión de roles
/api/v1/sedes/...                   → Gestión de sedes
/api/v1/categorias/...              → Categorías y subcategorías
/api/v1/productos/...               → Productos
/api/v1/terceros/...                → Proveedores/clientes
/api/v1/ordenes-compra/...          → Órdenes de compra
/api/v1/entradas/...                → Entradas de inventario
/api/v1/salidas/...                 → Salidas de inventario
/api/v1/traslados/...               → Traslados entre sedes
/api/v1/ajustes-inventario/...      → Ajustes de inventario
/api/v1/ordenes-despacho/...        → Órdenes de despacho
/api/v1/maquinas/...                → Máquinas
/api/v1/inventario/...              → Consulta de inventario
```

---

## 🔑 Sistema de Roles y Permisos

### Roles predeterminados

```javascript
// Roles base del sistema (el usuario puede crear más)
const ROLES_BASE = {
  ADMIN: "admin", // Admin general — ve todo
  ADMIN_SEDE: "admin_sede", // Admin de una sede específica
};
```

### Permisos por acción

```javascript
// Acciones disponibles para cada módulo
const ACCIONES = Object.freeze({
  VER: "ver",
  CREAR: "crear",
  ACTUALIZAR: "actualizar",
  ELIMINAR: "eliminar", // Soft delete siempre
});

// Módulos del sistema
const MODULOS = Object.freeze({
  USUARIOS: "usuarios",
  ROLES: "roles",
  SEDES: "sedes",
  CATEGORIAS: "categorias",
  PRODUCTOS: "productos",
  TERCEROS: "terceros",
  ORDENES_COMPRA: "ordenes_compra",
  ENTRADAS: "entradas",
  SALIDAS: "salidas",
  TRASLADOS: "traslados",
  AJUSTES_INVENTARIO: "ajustes_inventario",
  ORDENES_DESPACHO: "ordenes_despacho",
  MAQUINAS: "maquinas",
  INVENTARIO: "inventario",
});
```

### Hook de permisos

```javascript
// src/hooks/permisos.hook.js
export const verificarPermiso = (modulo, accion) => {
  return async (request, reply) => {
    // Verificar que el usuario tiene el permiso {modulo, accion}
    // en su rol asignado
  };
};
```

---

## 📦 Modelo de Stock Multi-Sede

```javascript
// Stock se maneja en colección separada
// Un producto puede existir globalmente pero el stock es por sede
const stockSchema = new mongoose.Schema({
  productoId: { type: ObjectId, ref: "Producto", required: true },
  sedeId: { type: ObjectId, ref: "Sede", required: true },
  cantidadDisponible: { type: Number, default: 0, min: 0 },
  cantidadReservada: { type: Number, default: 0, min: 0 }, // Para despachos pendientes
  stockMinimo: { type: Number, default: 0, min: 0 },
});

// Índice compuesto único: un registro de stock por producto por sede
stockSchema.index({ productoId: 1, sedeId: 1 }, { unique: true });
```

### Reglas de inventario

1. **Entradas suman** → compra, traslado recibido, ajuste positivo
2. **Salidas restan** → venta, producción, merma, ajuste negativo
3. **Traslados** → resta en sede origen + suma en sede destino (al ser recibido)
4. **Stock global** = suma de stock de todas las sedes (solo visible para admin general)
5. **Admin de sede** solo ve y gestiona stock de su sede

---

## 🔄 Flujo de Traslados

```
1. Sede solicitante crea SolicitudTraslado (estado: pendiente)
2. Sede origen recibe la solicitud
3. Sede origen puede:
   a) Aprobar totalmente → estado: aprobado
   b) Rechazar totalmente → estado: rechazado
   c) Aprobar parcialmente → aprueba/rechaza por producto y/o ajusta cantidades
4. Si aprobado → sede origen prepara y envía (estado: enviado)
5. Sede destino recibe y hace check (estado: recibido)
   - Verifica que lo recibido coincide con lo enviado
   - Puede reportar diferencias
6. Al confirmar recepción → se actualiza stock en ambas sedes
```

---

## 📝 Flujo de Órdenes de Compra

```
1. Se crea OrdenCompra con DetallesOrdenCompra (estado: pendiente)
2. Se envía al proveedor (estado: enviada)
3. Llega la mercancía → RecepcionCompra
   - Se hace check: lo recibido vs lo pedido
   - Se pueden reportar diferencias (faltantes, sobrantes, dañados)
4. Al confirmar recepción → se generan Entradas automáticamente
5. Las Entradas actualizan el Stock de la sede correspondiente
```

---

## 🚨 Manejo de Errores

```javascript
// ✅ Siempre usar ErrorApi
throw new ErrorApi(404, "Producto no encontrado");
throw new ErrorApi(400, "Stock insuficiente para esta operación");
throw new ErrorApi(403, "No tienes permisos para esta acción");

// ❌ Nunca
throw new Error("Producto no encontrado"); // Devuelve 500
```

---

## ✅ Respuestas HTTP

### Estructura exitosa

```json
{
  "statusCode": 200,
  "status": "success",
  "message": "Productos obtenidos exitosamente",
  "data": { "productos": [], "total": 5 }
}
```

### Estructura paginada

```json
{
  "statusCode": 200,
  "status": "success",
  "message": "Productos obtenidos exitosamente",
  "data": {
    "productos": [],
    "paginacion": {
      "pagina": 1,
      "limite": 50,
      "total": 100,
      "totalPaginas": 2,
      "hayPaginaSiguiente": true,
      "hayPaginaAnterior": false
    }
  }
}
```

### Reglas de paginación

- SIEMPRE implementar **DOS métodos**: con y sin paginación
- Objeto `paginacion` con los **6 campos obligatorios**
- Límite por defecto: `50`
- Usar `Promise.all()` para query y count en paralelo
- Strings: `$regex` case-insensitive | Números/booleanos: exacto

---

## 🔐 Autenticación

### Tokens

| Token         | Duración | Transporte                             |
| :------------ | :------- | :------------------------------------- |
| Access Token  | 15 min   | Header `Authorization: Bearer <token>` |
| Refresh Token | 7 días   | Cookie HttpOnly                        |

### Flujo de creación de usuarios

```
1. Solo un admin puede crear usuarios
2. Admin crea usuario → se genera contraseña temporal
3. Se envía correo con credenciales al nuevo usuario
4. Usuario inicia sesión con credenciales temporales
5. (Opcional) Usuario cambia contraseña en primer login
```

---

## 🧪 Variables de Entorno

```env
# ─── Base de datos ────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/inventario?replicaSet=rs0

# ─── JWT ─────────────────────────────────────────────────
JWT_SECRET=secreto_inventario_muy_seguro
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# ─── SMTP ────────────────────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=noreply@empresa.com
SMTP_PASS=contrasena_app
SMTP_FROM=noreply@empresa.com

# ─── Frontend ────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ─── Servidor ────────────────────────────────────────────
PORT=3080
NODE_ENV=development
```

---

## 🗄️ Transacciones MongoDB

**Requisito:** MongoDB en modo **Replica Set** obligatorio.

### Casos de uso obligatorios

1. Recepción de orden de compra → generar entradas + actualizar stock
2. Aprobación de traslado → restar stock sede origen
3. Recepción de traslado → sumar stock sede destino
4. Ajuste de inventario aprobado → actualizar stock
5. Registro de salida → restar stock + crear movimiento
6. Creación de orden de despacho → reservar stock

### Patrón obligatorio

```javascript
const sesion = await mongoose.startSession();
sesion.startTransaction();
try {
  // operaciones con { session: sesion }
  await sesion.commitTransaction();
} catch (error) {
  await sesion.abortTransaction();
  throw error;
} finally {
  sesion.endSession();
}
```

---

## 🎯 Checklist al Agregar Nueva Funcionalidad

### Base — siempre aplica

- [ ] Crear modelo en `src/models/`
- [ ] Crear repositorio en `src/repositories/` extendiendo `BaseRepository`
- [ ] Crear servicio en `src/services/`
- [ ] Crear controlador en `src/controllers/`
- [ ] Crear rutas en `src/routes/`
- [ ] Registrar rutas en `src/routes/index.js`
- [ ] Crear schemas en `src/docs/[modulo].docs.js`
- [ ] Registrar tags en `src/config/openapi.js`
- [ ] Usar `ErrorApi` para errores controlados
- [ ] Usar `RespuestaApi` para respuestas exitosas
- [ ] Loggear acciones con `logAccionUsuario`
- [ ] Loggear errores con `logError`
- [ ] Actualizar `PROGRESO_BACK.md`

### Seguridad

- [ ] ¿La ruta modifica datos? → `schema.body` con JSON Schema
- [ ] ¿Requiere autenticación? → `preHandler: [autenticar]`
- [ ] ¿Requiere permiso? → `preHandler: [autenticar, verificarPermiso(modulo, accion)]`
- [ ] ¿Operación sensible? → Rate limiting específico

---

## 🚫 Cosas que NUNCA hacer

1. ❌ **NO usar `require()`** → Usar `import`
2. ❌ **NO omitir extensión `.js`** en imports locales
3. ❌ **NO usar `reply.send()` directamente** → Usar `RespuestaApi`
4. ❌ **NO usar `console.log()`** → Usar logger Pino
5. ❌ **NO lanzar `new Error()`** → Usar `ErrorApi`
6. ❌ **NO poner lógica de negocio en controladores**
7. ❌ **NO acceder directamente a modelos desde servicios** → Usar repositorios
8. ❌ **NO crear archivos README para documentar endpoints**
9. ❌ **NO usar TypeScript**
10. ❌ **NO nombrar variables o archivos en inglés**
11. ❌ **NO manipular stock sin transacción** cuando hay múltiples operaciones
12. ❌ **NO permitir stock negativo**
13. ❌ **NO hacer hard delete** → Siempre soft delete con campo `activo`
14. ❌ **NO devolver refreshToken en JSON** → Solo en cookie HttpOnly
15. ❌ **NO crear solo un método de listado** → Siempre dos: con y sin paginación
