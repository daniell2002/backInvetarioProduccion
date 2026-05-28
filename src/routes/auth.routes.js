import AuthController from "../controllers/AuthController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { configuracionLimitadorAuth } from "../hooks/rateLimiter.hook.js";
import {
  schemaLogin,
  schemaRenovarToken,
  schemaLogout,
  schemaCambiarContrasena,
  schemaSolicitarRecuperacion,
  schemaRestablecerContrasena,
  schemaPerfil,
} from "../docs/auth.docs.js";

const rutasAuth = async (fastify, opciones) => {
  // POST /api/v1/auth/login
  fastify.post(
    "/login",
    {
      config: { rateLimit: configuracionLimitadorAuth },
      schema: schemaLogin,
    },
    AuthController.login,
  );

  // POST /api/v1/auth/renovar-token (límite alto — se invoca automáticamente al renovar sesión)
  fastify.post(
    "/renovar-token",
    {
      config: { rateLimit: { max: 60, timeWindow: "15 minutes" } },
      schema: schemaRenovarToken,
    },
    AuthController.renovarToken,
  );

  // POST /api/v1/auth/logout
  fastify.post(
    "/logout",
    {
      preHandler: [autenticar],
      schema: schemaLogout,
    },
    AuthController.logout,
  );

  // PUT /api/v1/auth/cambiar-contrasena
  fastify.put(
    "/cambiar-contrasena",
    {
      preHandler: [autenticar],
      schema: schemaCambiarContrasena,
    },
    AuthController.cambiarContrasena,
  );

  // POST /api/v1/auth/solicitar-recuperacion
  fastify.post(
    "/solicitar-recuperacion",
    {
      config: { rateLimit: configuracionLimitadorAuth },
      schema: schemaSolicitarRecuperacion,
    },
    AuthController.solicitarRecuperacion,
  );

  // POST /api/v1/auth/restablecer-contrasena/:token
  fastify.post(
    "/restablecer-contrasena/:token",
    {
      schema: schemaRestablecerContrasena,
    },
    AuthController.restablecerContrasena,
  );

  // GET /api/v1/auth/perfil (límite alto — se invoca en cada carga de página)
  fastify.get(
    "/perfil",
    {
      config: { rateLimit: { max: 120, timeWindow: "15 minutes" } },
      preHandler: [autenticar],
      schema: schemaPerfil,
    },
    AuthController.perfil,
  );
};

export default rutasAuth;
