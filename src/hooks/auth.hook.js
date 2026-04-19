import ErrorApi from "../utils/ErrorApi.js";

/**
 * Hook preHandler que verifica el JWT e inyecta request.usuarioId y request.usuario.
 */
export const autenticar = async (request, reply) => {
  try {
    await request.jwtVerify();
    request.usuarioId = request.user.id;
    request.usuario = request.user;
  } catch (error) {
    throw new ErrorApi(401, "Token inválido o expirado");
  }
};
