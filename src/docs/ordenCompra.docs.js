const itemOCSchema = {
  type: "object",
  required: ["productoId", "cantidadSolicitada"],
  properties: {
    productoId: { type: "string" },
    cantidadSolicitada: { type: "number", minimum: 1 },
    costoUnitario: { type: "number", minimum: 0 },
    observacion: { type: "string", maxLength: 200 },
  },
};

const schemaCrearOrdenCompra = {
  summary: "Crear orden de compra",
  description: "Crear orden de compra",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["proveedorId", "sedeId", "items"],
    properties: {
      proveedorId: { type: "string" },
      sedeId: { type: "string" },
      items: { type: "array", items: itemOCSchema, minItems: 1 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Orden de compra creada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarOrdenesCompra = {
  summary: "Listar órdenes de compra",
  description: "Listar órdenes de compra",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Órdenes de compra obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ordenesCompra: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Órdenes de compra obtenidas",
        data: {
          ordenesCompra: [
            {
              _id: "67f9fdbb2f44a6c9c2351001",
              codigo: "OC00001",
              estado: "enviada",
            },
          ],
        },
      },
    },
  },
};

const schemaListarOrdenesCompraPaginado = {
  summary: "Listar órdenes de compra paginado",
  description: "Listar órdenes de compra con paginación y filtros",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      proveedorId: { type: "string" },
      sedeId: { type: "string" },
      estado: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Órdenes de compra obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ordenesCompra: {
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
        message: "Órdenes de compra obtenidas",
        data: {
          ordenesCompra: [
            {
              _id: "67f9fdbb2f44a6c9c2351001",
              codigo: "OC00001",
              estado: "enviada",
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

const schemaObtenerOrdenCompra = {
  summary: "Obtener orden de compra",
  description: "Obtener orden de compra por ID",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Orden de compra obtenida" },
    404: { description: "Orden de compra no encontrada" },
  },
};

const schemaActualizarOrdenCompra = {
  summary: "Actualizar orden de compra",
  description: "Actualizar orden en borrador",
  tags: ["Órdenes de Compra"],
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
      proveedorId: { type: "string" },
      items: { type: "array", items: itemOCSchema },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Orden de compra actualizada" },
    404: { description: "Orden de compra no encontrada" },
  },
};

const schemaEnviarOrdenCompra = {
  summary: "Enviar orden de compra",
  description: "Enviar orden de compra al proveedor",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Orden de compra enviada" },
    404: { description: "Orden de compra no encontrada" },
  },
};

const schemaRecepcionOrdenCompra = {
  summary: "Recepción de orden de compra",
  description: "Registrar recepción de productos (parcial o total)",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          required: ["itemId", "cantidadRecibida"],
          properties: {
            itemId: { type: "string" },
            cantidadRecibida: { type: "number", minimum: 0 },
          },
        },
      },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Recepción registrada" },
    404: { description: "Orden de compra no encontrada" },
  },
};

const schemaAnularOrdenCompra = {
  summary: "Anular orden de compra",
  description: "Anular orden de compra",
  tags: ["Órdenes de Compra"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Orden de compra anulada" },
    404: { description: "Orden de compra no encontrada" },
  },
};

const ordenCompraTags = [
  {
    name: "Órdenes de Compra",
    description: "Compras a proveedores con recepción",
  },
];

export {
  schemaCrearOrdenCompra,
  schemaListarOrdenesCompra,
  schemaListarOrdenesCompraPaginado,
  schemaObtenerOrdenCompra,
  schemaActualizarOrdenCompra,
  schemaEnviarOrdenCompra,
  schemaRecepcionOrdenCompra,
  schemaAnularOrdenCompra,
  ordenCompraTags,
};
