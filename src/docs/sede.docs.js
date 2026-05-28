const schemaCrearSede = {
  summary: "Crear sede",
  description: "Crear nueva sede/sucursal",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 100 },
      direccion: { type: "string", maxLength: 200 },
      ciudad: { type: "string", maxLength: 100 },
      telefono: { type: "string", maxLength: 20 },
      responsableId: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Sede creada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarSedes = {
  summary: "Listar sedes",
  description: "Listar sedes (activas por defecto)",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      incluirInactivas: { type: "boolean", default: false },
    },
  },
  response: {
    200: {
      description: "Sedes obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            sedes: {
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
        message: "Sedes obtenidas",
        data: {
          sedes: [
            {
              _id: "67f9fdbb2f44a6c9c22a1001",
              nombre: "Sede Principal",
              codigo: "SDE00001",
              ciudad: "Bogota",
              telefono: "6011234567",
              direccion: "Cra 10 # 20-30",
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarSedesPaginado = {
  summary: "Listar sedes paginado",
  description: "Listar sedes con paginación y filtros",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 50 },
      nombre: { type: "string" },
      ciudad: { type: "string" },
      codigo: { type: "string" },
      incluirInactivas: { type: "boolean", default: false },
    },
  },
  response: {
    200: {
      description: "Sedes obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            sedes: {
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
        message: "Sedes obtenidas",
        data: {
          sedes: [
            {
              _id: "67f9fdbb2f44a6c9c22a1001",
              nombre: "Sede Principal",
              codigo: "SDE00001",
              ciudad: "Bogota",
              telefono: "6011234567",
              direccion: "Cra 10 # 20-30",
              activo: true,
            },
          ],
          paginacion: {
            pagina: 1,
            limite: 50,
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

const schemaObtenerSede = {
  summary: "Obtener sede",
  description: "Obtener sede por ID con responsable",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Sede obtenida" },
    404: { description: "Sede no encontrada" },
  },
};

const schemaActualizarSede = {
  summary: "Actualizar sede",
  description: "Actualizar datos de una sede",
  tags: ["Sedes"],
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
      nombre: { type: "string", minLength: 2, maxLength: 100 },
      direccion: { type: "string", maxLength: 200 },
      ciudad: { type: "string", maxLength: 100 },
      telefono: { type: "string", maxLength: 20 },
      responsableId: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Sede actualizada" },
    404: { description: "Sede no encontrada" },
  },
};

const schemaEliminarSede = {
  summary: "Desactivar sede",
  description: "Desactivar sede (soft delete)",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Sede desactivada" },
    404: { description: "Sede no encontrada" },
  },
};

const schemaActualizarEstadoSede = {
  summary: "Actualizar estado de sede",
  description: "Activar o desactivar una sede",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  body: {
    type: "object",
    required: ["activo"],
    properties: {
      activo: { type: "boolean" },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Estado actualizado" },
    404: { description: "Sede no encontrada" },
  },
};

const schemaEliminarSedeFisica = {
  summary: "Eliminar sede permanentemente",
  description: "Eliminar sede de forma física",
  tags: ["Sedes"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Sede eliminada permanentemente" },
    404: { description: "Sede no encontrada" },
  },
};

const sedeTags = [
  { name: "Sedes", description: "Gestión de sedes/sucursales" },
];

export {
  schemaCrearSede,
  schemaListarSedes,
  schemaListarSedesPaginado,
  schemaObtenerSede,
  schemaActualizarSede,
  schemaEliminarSede,
  schemaActualizarEstadoSede,
  schemaEliminarSedeFisica,
  sedeTags,
};
