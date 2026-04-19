const itemSalidaSchema = {
  type: "object",
  required: ["productoId", "cantidad"],
  properties: {
    productoId: { type: "string" },
    cantidad: { type: "number", minimum: 1 },
    observacion: { type: "string", maxLength: 200 },
  },
};

const schemaCrearSalida = {
  summary: "Registrar salida",
  description: "Registrar salida de inventario",
  tags: ["Salidas"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["sedeId", "items"],
    properties: {
      tipo: {
        type: "string",
        enum: [
          "venta",
          "produccion",
          "merma",
          "traslado",
          "ajuste",
          "devolucion_proveedor",
        ],
      },
      sedeId: { type: "string" },
      clienteId: { type: "string" },
      trasladoId: { type: "string" },
      items: { type: "array", items: itemSalidaSchema, minItems: 1 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Salida registrada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarSalidas = {
  summary: "Listar salidas",
  description: "Listar salidas",
  tags: ["Salidas"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Salidas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            salidas: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Salidas obtenidas",
        data: {
          salidas: [
            {
              _id: "67f9fdbb2f44a6c9c2321001",
              codigo: "SAL00001",
              tipo: "venta",
              estado: "aplicada",
            },
          ],
        },
      },
    },
  },
};

const schemaListarSalidasPaginado = {
  summary: "Listar salidas paginado",
  description: "Listar salidas con filtros y paginación",
  tags: ["Salidas"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sedeId: { type: "string" },
      tipo: { type: "string" },
      estado: { type: "string" },
      clienteId: { type: "string" },
      fechaDesde: { type: "string", format: "date" },
      fechaHasta: { type: "string", format: "date" },
    },
  },
  response: {
    200: {
      description: "Salidas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            salidas: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
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
        message: "Salidas obtenidas",
        data: {
          salidas: [
            {
              _id: "67f9fdbb2f44a6c9c2321001",
              codigo: "SAL00001",
              tipo: "venta",
              estado: "aplicada",
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

const schemaObtenerSalida = {
  summary: "Obtener salida",
  description: "Obtener salida por ID",
  tags: ["Salidas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Salida obtenida" },
    404: { description: "Salida no encontrada" },
  },
};

const schemaAnularSalida = {
  summary: "Anular salida",
  description: "Anular salida y devolver stock",
  tags: ["Salidas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Salida anulada" },
    404: { description: "Salida no encontrada" },
  },
};

const salidaTags = [{ name: "Salidas", description: "Egresos del inventario" }];

export {
  schemaCrearSalida,
  schemaListarSalidas,
  schemaListarSalidasPaginado,
  schemaObtenerSalida,
  schemaAnularSalida,
  salidaTags,
};
