const configuracionBase = {
  openapi: "3.1.0",
  info: {
    title: "API Sistema de Inventario Industrial",
    version: "1.0.0",
    description:
      "API REST para gestión de inventario industrial multi-sede. " +
      "Incluye gestión de productos, entradas, salidas, traslados entre sedes, " +
      "órdenes de compra, despacho, ajustes de inventario y maquinaria.",
    contact: {
      name: "Soporte Sistema de Inventario",
    },
  },
  servers: [
    { url: "http://localhost:3080", description: "Servidor de desarrollo" },
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
    { name: "Máquinas", description: "Gestión de maquinaria" },
    { name: "Inventario", description: "Vista de stock por sede y global" },
  ],
  paths: {},
};

export const especificacionOpenApi = configuracionBase;
