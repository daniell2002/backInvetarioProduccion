const schemaSincronizarUnidades = {
  summary: "Sincronizar unidades de medida",
  description:
    "Carga o actualiza las unidades de medida desde el archivo estático `unidadesMedidas.json`. " +
    "Hace upsert por código — no elimina registros. Solo accesible para administradores.",
  tags: ["Unidades de Medida"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Sincronización completada",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            resultado: {
              type: "object",
              properties: {
                totalArchivo: { type: "integer" },
                insertadas: { type: "integer" },
                actualizadas: { type: "integer" },
                sinCambios: { type: "integer" },
              },
            },
          },
        },
      },
    },
  },
};

const schemaListarUnidades = {
  summary: "Listar unidades de medida",
  description:
    "Retorna todas las unidades de medida activas ordenadas por nombre.",
  tags: ["Unidades de Medida"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Unidades obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            unidades: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
  },
};

const schemaObtenerUnidad = {
  summary: "Obtener unidad de medida por ID",
  description: "Retorna una unidad de medida por su ID.",
  tags: ["Unidades de Medida"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", minLength: 24, maxLength: 24 },
    },
  },
  response: {
    200: { description: "Unidad de medida obtenida" },
    404: { description: "Unidad de medida no encontrada" },
  },
};

export { schemaSincronizarUnidades, schemaListarUnidades, schemaObtenerUnidad };
