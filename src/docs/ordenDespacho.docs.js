const schemaCrearOrdenDespacho = {
  summary: "Crear orden de despacho",
  description: "Crear orden de despacho",
  tags: ["Órdenes de Despacho"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["sedeId", "items"],
    properties: {
      sedeId: { type: "string" },
      clienteId: { type: "string" },
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["productoId", "cantidad"],
          properties: {
            productoId: { type: "string" },
            cantidad: { type: "number", minimum: 1 },
            observacion: { type: "string", maxLength: 200 },
          },
        },
      },
      direccionEntrega: { type: "string", maxLength: 300 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Orden de despacho creada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarOrdenesDespacho = {
  summary: "Listar órdenes de despacho",
  description: "Listar órdenes de despacho",
  tags: ["Órdenes de Despacho"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Órdenes de despacho obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ordenesDespacho: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Órdenes de despacho obtenidas",
        data: {
          ordenesDespacho: [
            {
              _id: "67f9fdbb2f44a6c9c2361001",
              codigo: "DSP00001",
              estado: "pendiente",
            },
          ],
        },
      },
    },
  },
};

const schemaListarOrdenesDespachoPaginado = {
  summary: "Listar órdenes de despacho paginado",
  description: "Listar órdenes de despacho con paginación y filtros",
  tags: ["Órdenes de Despacho"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sedeId: { type: "string" },
      estado: { type: "string" },
      clienteId: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Órdenes de despacho obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ordenesDespacho: {
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
        message: "Órdenes de despacho obtenidas",
        data: {
          ordenesDespacho: [
            {
              _id: "67f9fdbb2f44a6c9c2361001",
              codigo: "DSP00001",
              estado: "pendiente",
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

const schemaObtenerOrdenDespacho = {
  summary: "Obtener orden de despacho",
  description: "Obtener orden de despacho por ID",
  tags: ["Órdenes de Despacho"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Orden de despacho obtenida" },
    404: { description: "Orden de despacho no encontrada" },
  },
};

const schemaCambiarEstadoDespacho = {
  summary: "Cambiar estado de despacho",
  description: "Cambiar estado de orden de despacho",
  tags: ["Órdenes de Despacho"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Estado actualizado" },
    404: { description: "Orden de despacho no encontrada" },
  },
};

const ordenDespachoTags = [
  {
    name: "Órdenes de Despacho",
    description: "Órdenes para despachar productos",
  },
];

export {
  schemaCrearOrdenDespacho,
  schemaListarOrdenesDespacho,
  schemaListarOrdenesDespachoPaginado,
  schemaObtenerOrdenDespacho,
  schemaCambiarEstadoDespacho,
  ordenDespachoTags,
};
