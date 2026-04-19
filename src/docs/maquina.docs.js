const schemaCrearMaquina = {
  summary: "Crear máquina",
  description: "Crear nueva máquina",
  tags: ["Máquinas"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre", "sedeId"],
    properties: {
      nombre: { type: "string", maxLength: 150 },
      marca: { type: "string", maxLength: 100 },
      modelo: { type: "string", maxLength: 100 },
      serie: { type: "string", maxLength: 100 },
      sedeId: { type: "string" },
      estado: {
        type: "string",
        enum: ["operativa", "mantenimiento", "fuera_servicio", "baja"],
      },
      ubicacion: { type: "string", maxLength: 100 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Máquina creada exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarMaquinas = {
  summary: "Listar máquinas",
  description: "Listar máquinas activas",
  tags: ["Máquinas"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Máquinas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            maquinas: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Máquinas obtenidas",
        data: {
          maquinas: [
            {
              _id: "67f9fdbb2f44a6c9c22f1001",
              codigo: "MAQ00001",
              nombre: "Cortadora CNC",
              estado: "operativa",
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarMaquinasPaginado = {
  summary: "Listar máquinas paginado",
  description: "Listar máquinas con filtros y paginación",
  tags: ["Máquinas"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      sedeId: { type: "string" },
      estado: { type: "string" },
      nombre: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Máquinas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            maquinas: {
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
        message: "Máquinas obtenidas",
        data: {
          maquinas: [
            {
              _id: "67f9fdbb2f44a6c9c22f1001",
              codigo: "MAQ00001",
              nombre: "Cortadora CNC",
              estado: "operativa",
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

const schemaObtenerMaquina = {
  summary: "Obtener máquina",
  description: "Obtener máquina por ID",
  tags: ["Máquinas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Máquina obtenida" },
    404: { description: "Máquina no encontrada" },
  },
};

const schemaActualizarMaquina = {
  summary: "Actualizar máquina",
  description: "Actualizar máquina",
  tags: ["Máquinas"],
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
      nombre: { type: "string", maxLength: 150 },
      marca: { type: "string", maxLength: 100 },
      modelo: { type: "string", maxLength: 100 },
      serie: { type: "string", maxLength: 100 },
      sedeId: { type: "string" },
      estado: {
        type: "string",
        enum: ["operativa", "mantenimiento", "fuera_servicio", "baja"],
      },
      ubicacion: { type: "string", maxLength: 100 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Máquina actualizada" },
    404: { description: "Máquina no encontrada" },
  },
};

const schemaEliminarMaquina = {
  summary: "Eliminar máquina",
  description: "Eliminar máquina (soft delete)",
  tags: ["Máquinas"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Máquina desactivada" },
    404: { description: "Máquina no encontrada" },
  },
};

const maquinaTags = [
  { name: "Máquinas", description: "Gestión de maquinaria" },
];

export {
  schemaCrearMaquina,
  schemaListarMaquinas,
  schemaListarMaquinasPaginado,
  schemaObtenerMaquina,
  schemaActualizarMaquina,
  schemaEliminarMaquina,
  maquinaTags,
};
