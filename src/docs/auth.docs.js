export const schemaLogin = {
  tags: ["Auth"],
  summary: "Iniciar sesión",
  description:
    "Autentica al usuario y devuelve un access token JWT + refresh token en cookie HttpOnly.",
  body: {
    type: "object",
    required: ["email", "contrasena"],
    properties: {
      email: { type: "string", format: "email", maxLength: 200 },
      contrasena: { type: "string", minLength: 6, maxLength: 100 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Login exitoso" },
    401: { description: "Credenciales inválidas" },
  },
};

export const schemaRenovarToken = {
  tags: ["Auth"],
  summary: "Renovar token",
  description:
    "Renueva el access token usando el refresh token almacenado en la cookie HttpOnly.",
  response: {
    200: { description: "Token renovado" },
    401: { description: "Refresh token inválido o expirado" },
  },
};

export const schemaLogout = {
  tags: ["Auth"],
  summary: "Cerrar sesión",
  description:
    "Revoca todos los refresh tokens del usuario y limpia la cookie.",
  security: [{ bearerAuth: [] }],
  response: {
    200: { description: "Sesión cerrada" },
  },
};

export const schemaCambiarContrasena = {
  tags: ["Auth"],
  summary: "Cambiar contraseña",
  description: "Permite al usuario autenticado cambiar su contraseña.",
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["contrasenaActual", "nuevaContrasena"],
    properties: {
      contrasenaActual: { type: "string", minLength: 6, maxLength: 100 },
      nuevaContrasena: { type: "string", minLength: 6, maxLength: 100 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Contraseña actualizada" },
    400: { description: "Contraseña actual incorrecta" },
  },
};

export const schemaSolicitarRecuperacion = {
  tags: ["Auth"],
  summary: "Solicitar recuperación de contraseña",
  description:
    "Envía un correo con instrucciones para restablecer la contraseña.",
  body: {
    type: "object",
    required: ["email"],
    properties: {
      email: { type: "string", format: "email", maxLength: 200 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Instrucciones enviadas (si el correo existe)" },
  },
};

export const schemaRestablecerContrasena = {
  tags: ["Auth"],
  summary: "Restablecer contraseña",
  description: "Restablece la contraseña usando el token recibido por correo.",
  params: {
    type: "object",
    required: ["token"],
    properties: {
      token: { type: "string", minLength: 1 },
    },
  },
  body: {
    type: "object",
    required: ["nuevaContrasena"],
    properties: {
      nuevaContrasena: { type: "string", minLength: 6, maxLength: 100 },
    },
    additionalProperties: false,
  },
  response: {
    200: { description: "Contraseña restablecida" },
    400: { description: "Token inválido o expirado" },
  },
};

export const schemaPerfil = {
  tags: ["Auth"],
  summary: "Obtener perfil",
  description: "Devuelve los datos del usuario autenticado.",
  security: [{ bearerAuth: [] }],
  response: {
    200: { description: "Perfil obtenido" },
  },
};

export const authSchemas = {};
export const authPaths = {};
export const authTags = [
  {
    name: "Auth",
    description: "Autenticación, sesión y recuperación de contraseña",
  },
];
