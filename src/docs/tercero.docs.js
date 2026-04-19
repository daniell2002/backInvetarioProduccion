const schemaCrearTercero = {
  summary: "Crear tercero",
  description: "Crear tercero (proveedor/cliente)",
  tags: ["Terceros"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["razonSocial", "numeroDocumento", "tipo"],
    properties: {
      tipo: { type: "string", enum: ["proveedor", "cliente", "ambos"] },
      tipoDocumento: {
        type: "string",
        enum: ["NIT", "CC", "CE", "PASAPORTE", "OTRO"],
      },
      numeroDocumento: { type: "string" },
      razonSocial: { type: "string", maxLength: 200 },
      nombreContacto: { type: "string", maxLength: 100 },
      email: { type: "string", format: "email" },
      telefono: { type: "string", maxLength: 20 },
      direccion: { type: "string", maxLength: 200 },
      ciudad: { type: "string", maxLength: 100 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Tercero creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarTerceros = {
  summary: "Listar terceros",
  description: "Listar terceros activos",
  tags: ["Terceros"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Terceros obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            terceros: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Terceros obtenidos",
        data: {
          terceros: [
            {
              _id: "67f9fdbb2f44a6c9c22e1001",
              razonSocial: "Proveedor Industrial SAS",
              numeroDocumento: "900123456",
              tipo: "proveedor",
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarTercerosPaginado = {
  summary: "Listar terceros paginado",
  description: "Listar terceros con paginación y filtros",
  tags: ["Terceros"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      tipo: { type: "string", enum: ["proveedor", "cliente", "ambos"] },
      razonSocial: { type: "string" },
      numeroDocumento: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Terceros obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            terceros: {
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
        message: "Terceros obtenidos",
        data: {
          terceros: [
            {
              _id: "67f9fdbb2f44a6c9c22e1001",
              razonSocial: "Proveedor Industrial SAS",
              numeroDocumento: "900123456",
              tipo: "proveedor",
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

const schemaObtenerTercero = {
  summary: "Obtener tercero",
  description: "Obtener tercero por ID",
  tags: ["Terceros"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Tercero obtenido" },
    404: { description: "Tercero no encontrado" },
  },
};

const schemaActualizarTercero = {
  summary: "Actualizar tercero",
  description: "Actualizar tercero",
  tags: ["Terceros"],
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
      tipo: { type: "string", enum: ["proveedor", "cliente", "ambos"] },
      tipoDocumento: {
        type: "string",
        enum: ["NIT", "CC", "CE", "PASAPORTE", "OTRO"],
      },
      numeroDocumento: { type: "string" },
      razonSocial: { type: "string", maxLength: 200 },
      nombreContacto: { type: "string", maxLength: 100 },
      email: { type: "string", format: "email" },
      telefono: { type: "string", maxLength: 20 },
      direccion: { type: "string", maxLength: 200 },
      ciudad: { type: "string", maxLength: 100 },
      observaciones: { type: "string", maxLength: 500 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Tercero actualizado" },
    404: { description: "Tercero no encontrado" },
  },
};

const schemaEliminarTercero = {
  summary: "Eliminar tercero",
  description: "Eliminar tercero (soft delete)",
  tags: ["Terceros"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Tercero desactivado" },
    404: { description: "Tercero no encontrado" },
  },
};

const terceroTags = [
  { name: "Terceros", description: "Gestión de proveedores y clientes" },
];

export {
  schemaCrearTercero,
  schemaListarTerceros,
  schemaListarTercerosPaginado,
  schemaObtenerTercero,
  schemaActualizarTercero,
  schemaEliminarTercero,
  terceroTags,
};
