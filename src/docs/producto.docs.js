const schemaCrearProducto = {
  summary: "Crear producto",
  description: "Crear nuevo producto",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre", "unidadMedidaId"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 150 },
      descripcion: { type: "string", maxLength: 500 },
      codigoExterno: { type: "string" },
      categoriaId: { type: "string" },
      subcategoriaId: { type: "string" },
      unidadMedidaId: { type: "string", minLength: 24, maxLength: 24 },
      valorUnitario: { type: "number", minimum: 0 },
      stockMinimo: { type: "number", minimum: 0 },
      stockMaximo: { type: "number", minimum: 0 },
      imagen: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Producto creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarProductos = {
  summary: "Listar productos",
  description: "Listar productos activos",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Productos obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            productos: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Productos obtenidos",
        data: {
          productos: [
            {
              _id: "67f9fdbb2f44a6c9c22d1001",
              codigoInterno: "PRD00001",
              referencia: "PRD00001",
              nombre: "Disco de corte 7 pulgadas",
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarProductosPaginado = {
  summary: "Listar productos paginado",
  description: "Listar productos con paginación y filtros",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 10000, default: 20 },
      nombre: { type: "string" },
      categoriaId: { type: "string" },
      subcategoriaId: { type: "string" },
      codigoInterno: { type: "string" },
      codigoExterno: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Productos obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            productos: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
            paginacion: {
              type: "object",
              properties: {
                pagina: { type: "integer" },
                limite: { type: "integer" },
                total: { type: "integer" },
                totalPaginas: { type: "integer" },
                hayPaginaSiguiente: { type: "boolean" },
                hayPaginaAnterior: { type: "boolean" },
              },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Productos obtenidos",
        data: {
          productos: [
            {
              _id: "67f9fdbb2f44a6c9c22d1001",
              codigoInterno: "PRD00001",
              referencia: "PRD00001",
              nombre: "Disco de corte 7 pulgadas",
              activo: true,
            },
          ],
          paginacion: {
            pagina: 1,
            limite: 20,
            total: 1,
            totalPaginas: 1,
            hayPaginaSiguiente: false,
            hayPaginaAnterior: false,
          },
        },
      },
    },
  },
};

const schemaObtenerProducto = {
  summary: "Obtener producto",
  description: "Obtener producto por ID",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Producto obtenido" },
    404: { description: "Producto no encontrado" },
  },
};

const schemaActualizarProducto = {
  summary: "Actualizar producto",
  description: "Actualizar producto",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  body: {
    type: "object",
    minProperties: 1,
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 150 },
      descripcion: { type: "string", maxLength: 500 },
      codigoExterno: { type: "string" },
      categoriaId: { type: "string" },
      subcategoriaId: { type: "string" },
      unidadMedidaId: { type: "string", minLength: 24, maxLength: 24 },
      valorUnitario: { type: "number", minimum: 0 },
      stockMinimo: { type: "number", minimum: 0 },
      stockMaximo: { type: "number", minimum: 0 },
      imagen: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Producto actualizado" },
    404: { description: "Producto no encontrado" },
  },
};

const schemaEliminarProducto = {
  summary: "Eliminar producto",
  description: "Eliminar producto (soft delete)",
  tags: ["Productos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Producto desactivado" },
    404: { description: "Producto no encontrado" },
  },
};

const productoTags = [
  { name: "Productos", description: "Gestión de productos e inventario base" },
];

export {
  schemaCrearProducto,
  schemaListarProductos,
  schemaListarProductosPaginado,
  schemaObtenerProducto,
  schemaActualizarProducto,
  schemaEliminarProducto,
  productoTags,
};
