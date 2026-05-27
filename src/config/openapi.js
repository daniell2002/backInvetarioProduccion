const configuracionBase = {
  openapi: "3.1.0",
  info: {
    title: "API Sistema de Inventario Industrial",
    version: "1.0.0",
    description:
      "API REST para gestión de inventario industrial multi-sede. " +
      "Incluye gestión de productos, entradas, salidas, traslados entre sedes, " +
      "órdenes de compra, despacho y ajustes de inventario.",
    contact: {
      name: "Soporte Sistema de Inventario",
    },
  },
  servers: [
    { url: "http://localhost:3080/api", description: "Desarrollo — localhost" },
    {
      url: "http://192.168.0.104:3080/api",
      description: "Desarrollo — red local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Token JWT obtenido al hacer login. Formato: Bearer <token>",
      },
    },
    schemas: {},
  },
  tags: [
    { name: "Auth", description: "Autenticación y gestión de sesiones" },
    { name: "Usuarios", description: "Gestión de usuarios del sistema" },
    { name: "Roles", description: "Gestión de roles y permisos" },
    { name: "Sedes", description: "Gestión de sedes/sucursales" },
    {
      name: "Categorías",
      description: "Gestión de categorías y subcategorías",
    },
    {
      name: "Unidades de Medida",
      description:
        "Unidades de medida de productos — cargadas desde archivo estático",
    },
    {
      name: "Productos",
      description: "Gestión de productos e inventario base",
    },
    { name: "Terceros", description: "Gestión de proveedores y clientes" },
    {
      name: "Órdenes de Compra",
      description: "Compras a proveedores con recepción",
    },
    { name: "Entradas", description: "Ingresos al inventario" },
    { name: "Salidas", description: "Egresos del inventario" },
    { name: "Traslados", description: "Solicitudes de traslado entre sedes" },
    {
      name: "Ajustes de Inventario",
      description: "Ajustes con aprobación de admin",
    },
    {
      name: "Órdenes de Despacho",
      description: "Órdenes para despachar productos",
    },
    { name: "Inventario", description: "Vista de stock por sede y global" },
    {
      name: "Importación Productos",
      description:
        "Importación masiva de productos desde archivo Excel (.xlsx) o CSV",
    },
  ],
  paths: {},
};

export const especificacionOpenApi = configuracionBase;
