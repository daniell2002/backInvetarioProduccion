const itemEntradaSchema = {
  type: "object",
  required: ["productoId", "cantidad"],
  properties: {
    productoId: { type: "string" },
    cantidad: { type: "number", minimum: 1 },
    costoUnitario: { type: "number", minimum: 0 },
    observacion: { type: "string", maxLength: 200 },
  },
};

const schemaCrearEntrada = {
  summary: "Registrar entrada",
  description: "Registrar entrada de inventario",
  tags: ["Entradas"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["sedeId", "items"],
    properties: {
      tipo: {
        type: "string",
        enum: ["compra", "traslado", "ajuste", "devolucion", "produccion"],
      },
      sedeId: { type: "string" },
      proveedorId: { type: "string" },
      ordenCompraId: { type: "string" },
      trasladoId: { type: "string" },
      items: { type: "array", items: itemEntradaSchema, minItems: 1 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Entrada registrada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarEntradas = {
  summary: "Listar entradas",
  description: "Listar entradas",
  tags: ["Entradas"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Entradas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            entradas: {
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
        message: "Entradas obtenidas",
        data: {
          entradas: [
            {
              _id: "67f9fdbb2f44a6c9c2311001",
              codigo: "ENT00001",
              tipo: "compra",
              estado: "aplicada",
            },
          ],
        },
      },
    },
  },
};

const schemaListarEntradasPaginado = {
  summary: "Listar entradas paginado",
  description: "Listar entradas con filtros y paginación",
  tags: ["Entradas"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sedeId: { type: "string" },
      tipo: { type: "string" },
      estado: { type: "string" },
      proveedorId: { type: "string" },
      fechaDesde: { type: "string", format: "date" },
      fechaHasta: { type: "string", format: "date" },
    },
  },
  response: {
    200: {
      description: "Entradas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            entradas: {
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
        message: "Entradas obtenidas",
        data: {
          entradas: [
            {
              _id: "67f9fdbb2f44a6c9c2311001",
              codigo: "ENT00001",
              tipo: "compra",
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

const schemaObtenerEntrada = {
  summary: "Obtener entrada",
  description: "Obtener entrada por ID",
  tags: ["Entradas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Entrada obtenida" },
    404: { description: "Entrada no encontrada" },
  },
};

const schemaAnularEntrada = {
  summary: "Anular entrada",
  description: "Anular entrada y revertir stock",
  tags: ["Entradas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Entrada anulada" },
    404: { description: "Entrada no encontrada" },
  },
};

const entradaTags = [
  { name: "Entradas", description: "Ingresos al inventario" },
];

export {
  schemaCrearEntrada,
  schemaListarEntradas,
  schemaListarEntradasPaginado,
  schemaObtenerEntrada,
  schemaAnularEntrada,
  entradaTags,
};
