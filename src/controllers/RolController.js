import RolService from "../services/RolService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class RolController {
  async crear(request, reply) {
    const rol = await RolService.crearRol(request.body, request.usuarioId);
    return RespuestaApi.exito(reply, "Rol creado exitosamente", { rol }, 201);
  }

  async listar(request, reply) {
    const roles = await RolService.obtenerRoles();
    return RespuestaApi.exito(reply, "Roles obtenidos", { roles });
  }

  async listarPaginado(request, reply) {
    const { pagina = 1, limite = 50, nombre, descripcion } = request.query;

    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (descripcion) filtros.descripcion = descripcion;

    const resultado = await RolService.obtenerRolesPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );

    return RespuestaApi.exito(reply, "Roles obtenidos", {
      roles: resultado.roles || resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const rol = await RolService.obtenerRolPorId(request.params.id);
    return RespuestaApi.exito(reply, "Rol obtenido", { rol });
  }

  async actualizar(request, reply) {
    const rol = await RolService.actualizarRol(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Rol actualizado", { rol });
  }

  async eliminar(request, reply) {
    await RolService.eliminarRol(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Rol eliminado exitosamente");
  }
}

export default new RolController();
