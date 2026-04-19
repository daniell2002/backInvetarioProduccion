const permisoSchema = {
  type: "object",
  properties: {
    modulo: { type: "string" },
    accion: {
      type: "string",
      enum: ["ver", "crear", "actualizar", "eliminar"],
    },
  },
  required: ["modulo", "accion"],
  additionalProperties: false,
};

const schemaCrearRol = {
  summary: "Crear rol",
  description: "Crear nuevo rol con permisos",
  tags: ["Roles"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 50 },
      descripcion: { type: "string", maxLength: 200 },
      permisos: { type: "array", items: permisoSchema },
      esPredeterminado: { type: "boolean", default: false },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Rol creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarRoles = {
  summary: "Listar roles",
  description: "Listar todos los roles activos",
  tags: ["Roles"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Roles obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            roles: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Roles obtenidos",
        data: {
          roles: [
            {
              _id: "67f9fdbb2f44a6c9c22af001",
              nombre: "operativo",
              descripcion: "Rol operativo de bodega",
              permisos: [{ modulo: "inventario", accion: "ver" }],
              esPredeterminado: false,
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarRolesPaginado = {
  summary: "Listar roles paginado",
  description: "Listar roles activos con paginación y filtros",
  tags: ["Roles"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 50 },
      nombre: { type: "string" },
      descripcion: { type: "string" },
    },
  },
  response: {
    200: {
      description: "Roles obtenidos",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            roles: {
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
        message: "Roles obtenidos",
        data: {
          roles: [
            {
              _id: "67f9fdbb2f44a6c9c22af001",
              nombre: "operativo",
              descripcion: "Rol operativo de bodega",
              permisos: [{ modulo: "inventario", accion: "ver" }],
              esPredeterminado: false,
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

const schemaObtenerRol = {
  summary: "Obtener rol",
  description: "Obtener rol por ID",
  tags: ["Roles"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Rol obtenido" },
    404: { description: "Rol no encontrado" },
  },
};

const schemaActualizarRol = {
  summary: "Actualizar rol",
  description: "Actualizar rol y sus permisos",
  tags: ["Roles"],
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
      nombre: { type: "string", minLength: 2, maxLength: 50 },
      descripcion: { type: "string", maxLength: 200 },
      permisos: { type: "array", items: permisoSchema },
      esPredeterminado: { type: "boolean" },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Rol actualizado" },
    404: { description: "Rol no encontrado" },
  },
};

const schemaEliminarRol = {
  summary: "Eliminar rol",
  description: "Eliminar rol (soft delete)",
  tags: ["Roles"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Rol desactivado" },
    404: { description: "Rol no encontrado" },
  },
};

const rolTags = [{ name: "Roles", description: "Gestión de roles y permisos" }];

export {
  schemaCrearRol,
  schemaListarRoles,
  schemaListarRolesPaginado,
  schemaObtenerRol,
  schemaActualizarRol,
  schemaEliminarRol,
  rolTags,
};
