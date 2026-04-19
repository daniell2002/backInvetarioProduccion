# 📊 Progreso Backend — Sistema de Inventario Industrial

> Última actualización: 19 de abril de 2026

---

## 📈 Estado General

| Métrica                 | Valor     |
| ----------------------- | --------- |
| Módulos completados     | 17 / 17   |
| Endpoints implementados | ~89       |
| Modelos creados         | 16        |
| Tests                   | Pendiente |

---

## ✅ Infraestructura Base

- [x] Convenciones de desarrollo (`CONVENCIONES_DESARROLLO.md`)
- [x] Agente especializado (`backInventario.agent.md`)
- [x] Archivo de progreso (`PROGRESO_BACK.md`)
- [x] Inicialización proyecto (`package.json`)
- [x] Variables de entorno (`.env.example`)
- [x] Servidor Fastify (`server.js`)
- [x] Conexión MongoDB (`src/config/db.js`)
- [x] Logger Pino (`src/config/logger.js`)
- [x] OpenAPI + Scalar (`src/config/openapi.js`)
- [x] Configuración SMTP (`src/config/smtp.js`)
- [x] ErrorApi (`src/utils/ErrorApi.js`)
- [x] RespuestaApi (`src/utils/RespuestaApi.js`)
- [x] Permisos util (`src/utils/permisos.util.js`)
- [x] Generador de código (`src/utils/generadorCodigo.util.js`)
- [x] BaseRepository (`src/repositories/BaseRepository.js`)
- [x] Hook autenticar (`src/hooks/auth.hook.js`)
- [x] Hook permisos (`src/hooks/permisos.hook.js`)
- [x] Hook rate limiter (`src/hooks/rateLimiter.hook.js`)
- [x] Registro central rutas (`src/routes/index.js`)
- [ ] Seed de datos iniciales (admin, roles base)

---

## 📦 Módulos

### 1. Auth ✅

- Modelo Usuario, RefreshToken
- AuthService (login, refresh, logout, cambiar/recuperar contraseña)
- 7 rutas: login, renovar-token, logout, cambiar-contrasena, solicitar-recuperacion, restablecer-contrasena, perfil

### 2. Usuarios ✅

- UsuarioService (CRUD, solo admin crea, contraseña temporal)
- 5 rutas protegidas (soloAdmin): POST, GET, GET/:id, PUT/:id, DELETE/:id

### 3. Roles y Permisos ✅

- Modelo Rol con permisos [{modulo, accion}]
- 6 rutas protegidas (soloAdmin): CRUD completo + listado paginado

### 4. Sedes ✅

- Modelo Sede con código auto (SDE-00001)
- 6 rutas protegidas (soloAdmin): CRUD completo + listado paginado

### 5. Categorías ✅

- Modelo con subcategorías embebidas
- 9 rutas: CRUD categorías + CRUD subcategorías (nested /:id/subcategorias) + listado paginado

### 6. Productos ✅

- Modelo con presentaciones embebidas, código auto (PRD-00001), código externo opcional
- 5 rutas con permisos por módulo

### 7. Terceros ✅

- Modelo con tipo (proveedor/cliente/ambos), documento único
- 5 rutas con permisos por módulo

### 8. Órdenes de Compra ✅

- Modelo con items, estados (borrador→enviada→recibida_parcial/total→anulada)
- 7 rutas: CRUD + enviar + recepción + anular
- Recepción genera entrada automática

### 9. Entradas ✅

- Modelo con items, tipos (compra/traslado/ajuste/devolucion/produccion)
- 4 rutas: crear, listar, obtener, anular
- Incrementa stock automáticamente

### 10. Salidas ✅

- Modelo con items, tipos (venta/produccion/merma/traslado/ajuste/devolucion_proveedor)
- 4 rutas: crear, listar, obtener, anular
- Verifica y decrementa stock

### 11. Traslados ✅

- Flujo: pendiente→aprobado/parcial/rechazado→en_transito→recibido
- 6 rutas: crear, listar, obtener, aprobar, despachar, recibir
- Despachar genera salida en origen, recibir genera entrada en destino

### 12. Ajustes de Inventario ✅

- Requiere aprobación admin para aplicar
- 5 rutas: crear, listar, obtener, aprobar, rechazar
- Calcula diferencias automáticamente

### 13. Órdenes de Despacho ✅

- Flujo: pendiente→en_preparacion→despachada→entregada
- 7 rutas: crear, listar, obtener, preparar, despachar, confirmar-entrega, anular
- Despachar genera salida automática

### 14. Máquinas ✅

- Modelo con estados (operativa/mantenimiento/fuera_servicio/baja)
- 5 rutas: CRUD completo

### 15. Inventario/Stock ✅

- Modelo Stock {productoId, sedeId} con índice compuesto único
- 3 rutas: stock por sede, stock global (aggregation), stock por producto

### 16. Fichas de Producción ✅

- Modelo FichaProduccion con materiales embebidos (receta / BOM)
- Flujo: pendiente → aprobada → obsoleta
- 9 rutas: CRUD + aprobar + obsoletar + fichas aprobadas por producto + paginado
- Solo fichas aprobadas pueden usarse en producciones
- Código auto: FPR-00001

### 17. Producción ✅

- Modelo Produccion con materiales, lotes de costo y equivalencias
- Flujo: borrador → en_proceso → completada | anulada
- 9 rutas: crear, listar, paginado, obtener, iniciar, completar, anular, proyectar, estimar-costo
- Completar genera salida (materiales) + entrada (producto fabricado) en transacción
- Anular revierte movimientos si estaba completada
- Cálculo de costos por promedio ponderado de entradas (maneja precios mixtos de proveedores)
- Equivalencias de presentaciones (rollos→metros, cajas→unidades, etc.)
- Proyección: cuánto puedo fabricar con el stock actual + cuello de botella
- Estimación de costo previo a producir
- Código auto: PROD-00001

---

## 🔮 Módulos Futuros

| Módulo                 | Prioridad | Notas                             |
| ---------------------- | --------- | --------------------------------- |
| Reportes avanzados     | Media     | Kardex, movimientos, valorización |
| Dashboard estadísticas | Media     | KPIs del backend                  |

---

## 📝 Notas del Desarrollo

- El frontend actual usa Pinia stores en memoria (sin API). Hay que conectarlo al backend.
- El sistema NO es multi-tenant. Es una sola empresa con múltiples sedes.
- Los productos soportan presentaciones (cajas, rollos, láminas) que el módulo de producción usa para equivalencias.
- El módulo de producción calcula costos reales considerando mezcla de proveedores/precios.
