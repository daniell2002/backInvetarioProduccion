const schemaCrearGrupo = {
  summary: "Crear grupo",
  description: "Crear nuevo grupo de clasificación",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 100 },
      descripcion: { type: "string", maxLength: 200 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Grupo creado exitosamente" },
    400: { description: "Datos inválidos o nombre duplicado" },
  },
};

const schemaListarGrupos = {
  summary: "Listar grupos",
  description: "Listar todos los grupos activos",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Grupos obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            grupos: { type: "array", items: { type: "object", additionalProperties: true } },
          },
        },
      },
    },
  },
};

const schemaListarGruposPaginado = {
  summary: "Listar grupos paginado",
  description: "Listar grupos con paginación y filtros",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      nombre: { type: "string" },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Grupos obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            grupos: { type: "array", items: { type: "object", additionalProperties: true } },
            paginacion: { type: "object", additionalProperties: true },
          },
        },
      },
    },
  },
};

const schemaObtenerGrupo = {
  summary: "Obtener grupo por ID",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Grupo obtenido" },
    404: { description: "Grupo no encontrado" },
  },
};

const schemaActualizarGrupo = {
  summary: "Actualizar grupo",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 100 },
      descripcion: { type: "string", maxLength: 200 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Grupo actualizado" },
    404: { description: "Grupo no encontrado" },
  },
};

const schemaEliminarGrupo = {
  summary: "Eliminar grupo",
  tags: ["Grupos"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Grupo eliminado" },
    404: { description: "Grupo no encontrado" },
  },
};

export {
  schemaCrearGrupo,
  schemaListarGrupos,
  schemaListarGruposPaginado,
  schemaObtenerGrupo,
  schemaActualizarGrupo,
  schemaEliminarGrupo,
};
