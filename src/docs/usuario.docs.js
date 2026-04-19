const schemaCrearUsuario = {
  summary: "Crear usuario",
  description:
    "Crear nuevo usuario (solo admin). Se genera contraseña temporal.",
  tags: ["Usuarios"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["nombre", "email"],
    properties: {
      nombre: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", format: "email" },
      rolId: { type: ["string", "null"] },
      sedeId: { type: ["string", "null"] },
      esAdmin: { type: "boolean", default: false },
    },
    additionalProperties: false,
  },
  response: {
    201: { description: "Usuario creado exitosamente" },
    400: { description: "Datos inválidos" },
  },
};

const schemaListarUsuarios = {
  summary: "Listar usuarios",
  description: "Listar usuarios activos",
  tags: ["Usuarios"],
  security: [{ bearerAuth: [] }],
  response: {
    200: {
      description: "Usuarios obtenidos exitosamente",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            usuarios: {
              type: "array",
              items: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      example: {
        statusCode: 200,
        status: "success",
        message: "Usuarios obtenidos",
        data: {
          usuarios: [
            {
              _id: "67f9fdbb2f44a6c9c22c1001",
              nombre: "Administrador",
              email: "admin@empresa.com",
              esAdmin: true,
              activo: true,
            },
          ],
        },
      },
    },
  },
};

const schemaListarUsuariosPaginado = {
  summary: "Listar usuarios paginado",
  description: "Listar usuarios con paginación y filtros",
  tags: ["Usuarios"],
  security: [{ bearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      pagina: { type: "integer", minimum: 1, default: 1 },
      limite: { type: "integer", minimum: 1, maximum: 100, default: 20 },
      nombre: { type: "string" },
      email: { type: "string" },
      sedeId: { type: "string" },
      rolId: { type: "string" },
      esAdmin: { type: "boolean" },
    },
  },
  response: {
    200: {
      description: "Usuarios obtenidos exitosamente",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            usuarios: {
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
        message: "Usuarios obtenidos",
        data: {
          usuarios: [
            {
              _id: "67f9fdbb2f44a6c9c22c1001",
              nombre: "Administrador",
              email: "admin@empresa.com",
              esAdmin: true,
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

const schemaObtenerUsuario = {
  summary: "Obtener usuario",
  description: "Obtener usuario por ID",
  tags: ["Usuarios"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Usuario obtenido" },
    404: { description: "Usuario no encontrado" },
  },
};

const schemaActualizarUsuario = {
  summary: "Actualizar usuario",
  description: "Actualizar datos de usuario",
  tags: ["Usuarios"],
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
      email: { type: "string", format: "email" },
      rolId: { type: ["string", "null"] },
      sedeId: { type: ["string", "null"] },
      esAdmin: { type: "boolean" },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Usuario actualizado" },
    404: { description: "Usuario no encontrado" },
  },
};

const schemaEliminarUsuario = {
  summary: "Eliminar usuario",
  description: "Desactivar usuario (soft delete)",
  tags: ["Usuarios"],
  security: [{ bearerAuth: [] }],
  params: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  response: {
    200: { description: "Usuario desactivado" },
    404: { description: "Usuario no encontrado" },
  },
};

const usuarioTags = [
  { name: "Usuarios", description: "Gestión de usuarios del sistema" },
];

export {
  schemaCrearUsuario,
  schemaListarUsuarios,
  schemaListarUsuariosPaginado,
  schemaObtenerUsuario,
  schemaActualizarUsuario,
  schemaEliminarUsuario,
  usuarioTags,
};
