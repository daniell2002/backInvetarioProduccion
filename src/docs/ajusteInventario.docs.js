const schemaCrearAjuste = {
  summary: "Crear ajuste de inventario",
  description: "Crear ajuste de inventario (requiere aprobación admin)",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["sedeId", "items"],
    properties: {
      sedeId: { type: "string" },
      items: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["productoId", "cantidadNueva"],
          properties: {
            productoId: { type: "string" },
            cantidadNueva: { type: "number", minimum: 0 },
            motivo: { type: "string", maxLength: 200 },
          },
        },
      },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Ajuste creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarAjustes = {
  summary: "Listar ajustes",
  description: "Listar ajustes de inventario",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Ajustes obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ajustes: {
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
        message: "Ajustes obtenidos",
        data: {
          ajustes: [
            {
              _id: "67f9fdbb2f44a6c9c2341001",
              codigo: "AJU00001",
              estado: "pendiente",
            },
          ],
        },
      },
    },
  },
};

const schemaListarAjustesPaginado = {
  summary: "Listar ajustes paginado",
  description: "Listar ajustes de inventario con paginación y filtros",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sedeId: { type: "string" },
      estado: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Ajustes obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            ajustes: {
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
        message: "Ajustes obtenidos",
        data: {
          ajustes: [
            {
              _id: "67f9fdbb2f44a6c9c2341001",
              codigo: "AJU00001",
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

const schemaObtenerAjuste = {
  summary: "Obtener ajuste",
  description: "Obtener ajuste por ID",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ajuste obtenido" },
    404: { description: "Ajuste no encontrado" },
  },
};

const schemaAprobarAjuste = {
  summary: "Aprobar ajuste",
  description: "Aprobar y aplicar ajuste (solo admin)",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ajuste aprobado" },
    404: { description: "Ajuste no encontrado" },
  },
};

const schemaRechazarAjuste = {
  summary: "Rechazar ajuste",
  description: "Rechazar ajuste (solo admin)",
  tags: ["Ajustes de Inventario"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ajuste rechazado" },
    404: { description: "Ajuste no encontrado" },
  },
};

const ajusteInventarioTags = [
  {
    name: "Ajustes de Inventario",
    description: "Ajustes con aprobación de admin",
  },
];

export {
  schemaCrearAjuste,
  schemaListarAjustes,
  schemaListarAjustesPaginado,
  schemaObtenerAjuste,
  schemaAprobarAjuste,
  schemaRechazarAjuste,
  ajusteInventarioTags,
};
