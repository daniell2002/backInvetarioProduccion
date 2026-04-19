// ─── Fichas de Producción ─────────────────────────────────

const schemaCrearFichaProduccion = {
  summary: "Crear ficha de producción",
  description:
    "Crear una ficha (receta/BOM) que define los materiales necesarios " +
    "para producir un producto final. La ficha queda en estado 'pendiente' " +
    "hasta ser aprobada.",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: [
      "nombre",
      "productoFinalId",
      "unidadMedidaResultante",
      "materiales",
    ],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 200 },
      descripcion: { type: "string", maxLength: 500 },
      productoFinalId: { type: "string" },
      cantidadResultante: { type: "number", minimum: 1, default: 1 },
      unidadMedidaResultante: { type: "string", maxLength: 30 },
      materiales: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["productoId", "cantidad", "unidadMedida"],
          properties: {
            productoId: { type: "string" },
            cantidad: { type: "number", minimum: 0.001 },
            unidadMedida: { type: "string", maxLength: 30 },
            presentacionId: { type: ["string", "null"] },
            observacion: { type: "string", maxLength: 200 },
          },
          additionalProperties: false,
        },
      },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Ficha de producción creada" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarFichasProduccion = {
  summary: "Listar fichas de producción",
  description: "Obtener todas las fichas de producción activas",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Fichas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            fichas: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
    },
  },
};

const schemaListarFichasProduccionPaginado = {
  summary: "Listar fichas de producción paginado",
  description: "Listar fichas con paginación y filtros",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      estado: { type: "string", enum: ["pendiente", "aprobada", "obsoleta"] },
      productoFinalId: { type: "string" },
      nombre: { type: "string" },
      codigo: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Fichas obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            fichas: {
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
    },
  },
};

const schemaObtenerFichaProduccion = {
  summary: "Obtener ficha de producción",
  description: "Obtener ficha de producción por ID con todos los detalles",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ficha obtenida" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaActualizarFichaProduccion = {
  summary: "Actualizar ficha de producción",
  description: "Actualizar datos de una ficha en estado pendiente",
  tags: ["Fichas de Producción"],
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
      nombre: { type: "string", minLength: 2, maxLength: 200 },
      descripcion: { type: "string", maxLength: 500 },
      productoFinalId: { type: "string" },
      cantidadResultante: { type: "number", minimum: 1 },
      unidadMedidaResultante: { type: "string", maxLength: 30 },
      materiales: {
        type: "array",
        minItems: 1,
        items: {
          type: "object",
          required: ["productoId", "cantidad", "unidadMedida"],
          properties: {
            productoId: { type: "string" },
            cantidad: { type: "number", minimum: 0.001 },
            unidadMedida: { type: "string", maxLength: 30 },
            presentacionId: { type: ["string", "null"] },
            observacion: { type: "string", maxLength: 200 },
          },
          additionalProperties: false,
        },
      },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Ficha actualizada" },
    400: { description: "Datos inválidos o ficha no editable" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaAprobarFichaProduccion = {
  summary: "Aprobar ficha de producción",
  description:
    "Aprobar una ficha pendiente para que pueda usarse en producciones",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ficha aprobada" },
    400: { description: "Ficha no aprobable" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaObsoletarFichaProduccion = {
  summary: "Marcar ficha como obsoleta",
  description:
    "Marcar una ficha como obsoleta para que no pueda usarse en nuevas producciones",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ficha obsoletada" },
    400: { description: "Ficha ya obsoleta" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaEliminarFichaProduccion = {
  summary: "Eliminar ficha de producción",
  description: "Desactivar ficha de producción (soft delete)",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Ficha eliminada" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaListarFichasAprobadas = {
  summary: "Listar fichas aprobadas por producto",
  description:
    "Obtener las fichas aprobadas que producen un producto final específico",
  tags: ["Fichas de Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { productoFinalId: { type: "string" } },
    required: ["productoFinalId"],
  },
  response: {
    200: { description: "Fichas aprobadas obtenidas" },
  },
};

const fichaProduccionTags = [
  {
    name: "Fichas de Producción",
    description:
      "Recetas / BOM (Bill of Materials) para definir materiales de producción",
  },
];

// ─── Producción ───────────────────────────────────────────

const schemaCrearProduccion = {
  summary: "Crear orden de producción",
  description:
    "Crear una orden de producción seleccionando una ficha aprobada " +
    "y la cantidad a producir. Calcula automáticamente los materiales necesarios.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["fichaProduccionId", "sedeId", "cantidadPlanificada"],
    properties: {
      fichaProduccionId: { type: "string" },
      sedeId: { type: "string" },
      cantidadPlanificada: { type: "integer", minimum: 1 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Producción creada" },
    400: { description: "Datos inválidos o ficha no aprobada" },
  },
};

const schemaListarProducciones = {
  summary: "Listar producciones",
  description: "Obtener todas las producciones activas",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Producciones obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            producciones: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
    },
  },
};

const schemaListarProduccionesPaginado = {
  summary: "Listar producciones paginado",
  description: "Listar producciones con paginación y filtros",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      estado: {
        type: "string",
        enum: ["borrador", "en_proceso", "completada", "anulada"],
      },
      sedeId: { type: "string" },
      fichaProduccionId: { type: "string" },
      codigo: { type: "string" },
      fechaDesde: { type: "string", format: "date" },
      fechaHasta: { type: "string", format: "date" },
    },
  },
  response: {
    200: {
      description: "Producciones obtenidas",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            producciones: {
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
    },
  },
};

const schemaObtenerProduccion = {
  summary: "Obtener producción",
  description:
    "Obtener producción por ID con detalles completos de materiales, costos y movimientos",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Producción obtenida" },
    404: { description: "Producción no encontrada" },
  },
};

const schemaIniciarProduccion = {
  summary: "Iniciar producción",
  description:
    "Cambiar producción a estado 'en_proceso'. " +
    "Valida que haya stock suficiente para todos los materiales.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Producción iniciada" },
    400: { description: "Stock insuficiente o estado inválido" },
    404: { description: "Producción no encontrada" },
  },
};

const schemaCompletarProduccion = {
  summary: "Completar producción",
  description:
    "Completar la producción: consume materiales (genera salida), " +
    "registra producto fabricado (genera entrada) y calcula costos. " +
    "Se puede ajustar la cantidad real producida y el consumo real de materiales.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      cantidadProducida: { type: "integer", minimum: 1 },
      materiales: {
        type: "array",
        items: {
          type: "object",
          required: ["productoId", "cantidadUtilizada"],
          properties: {
            productoId: { type: "string" },
            cantidadUtilizada: { type: "number", minimum: 0 },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Producción completada" },
    400: { description: "Estado inválido o stock insuficiente" },
    404: { description: "Producción no encontrada" },
  },
};

const schemaAnularProduccion = {
  summary: "Anular producción",
  description:
    "Anular una producción. Si estaba completada, revierte los movimientos de stock.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Producción anulada" },
    400: {
      description: "Producción ya anulada o stock insuficiente para revertir",
    },
    404: { description: "Producción no encontrada" },
  },
};

const schemaProyectarProduccion = {
  summary: "Proyectar producción",
  description:
    "Calcula cuántas unidades se pueden producir con el stock actual " +
    "de una sede, considerando las equivalencias de presentaciones. " +
    "Identifica el material cuello de botella.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    required: ["fichaId", "sedeId"],
    properties: {
      fichaId: { type: "string" },
      sedeId: { type: "string" },
    },
  },
  response: {
    200: { description: "Proyección calculada" },
    400: { description: "Ficha no aprobada" },
    404: { description: "Ficha no encontrada" },
  },
};

const schemaEstimarCostoProduccion = {
  summary: "Estimar costo de producción",
  description:
    "Estima el costo de producción para una cantidad dada, " +
    "basándose en el costo promedio ponderado de las entradas recientes. " +
    "Detalla costo por material y costo unitario del producto final.",
  tags: ["Producción"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    required: ["fichaId", "sedeId", "cantidad"],
    properties: {
      fichaId: { type: "string" },
      sedeId: { type: "string" },
      cantidad: { type: "integer", minimum: 1 },
    },
  },
  response: {
    200: { description: "Estimación calculada" },
    404: { description: "Ficha no encontrada" },
  },
};

const produccionTags = [
  {
    name: "Producción",
    description:
      "Órdenes de producción — transformación de materia prima en producto terminado",
  },
];

export {
  // Fichas
  schemaCrearFichaProduccion,
  schemaListarFichasProduccion,
  schemaListarFichasProduccionPaginado,
  schemaObtenerFichaProduccion,
  schemaActualizarFichaProduccion,
  schemaAprobarFichaProduccion,
  schemaObsoletarFichaProduccion,
  schemaEliminarFichaProduccion,
  schemaListarFichasAprobadas,
  fichaProduccionTags,
  // Producción
  schemaCrearProduccion,
  schemaListarProducciones,
  schemaListarProduccionesPaginado,
  schemaObtenerProduccion,
  schemaIniciarProduccion,
  schemaCompletarProduccion,
  schemaAnularProduccion,
  schemaProyectarProduccion,
  schemaEstimarCostoProduccion,
  produccionTags,
};
