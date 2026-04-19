import UsuarioService from "../services/UsuarioService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class UsuarioController {
  async crear(request, reply) {
    const resultado = await UsuarioService.crearUsuario(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(
      reply,
      "Usuario creado exitosamente",
      resultado,
      201,
    );
  }

  async listar(request, reply) {
    const usuarios = await UsuarioService.obtenerUsuarios();
    return RespuestaApi.exito(reply, "Usuarios obtenidos", { usuarios });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      nombre,
      email,
      sedeId,
      rolId,
      esAdmin,
    } = request.query;
    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (email) filtros.email = email;
    if (sedeId) filtros.sedeId = sedeId;
    if (rolId) filtros.rolId = rolId;
    if (esAdmin !== undefined) filtros.esAdmin = esAdmin;

    const resultado = await UsuarioService.obtenerUsuariosPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Usuarios obtenidos", {
      usuarios: resultado.usuarios || resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const usuario = await UsuarioService.obtenerUsuarioPorId(request.params.id);
    return RespuestaApi.exito(reply, "Usuario obtenido", { usuario });
  }

  async actualizar(request, reply) {
    const usuario = await UsuarioService.actualizarUsuario(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Usuario actualizado", { usuario });
  }

  async eliminar(request, reply) {
    await UsuarioService.eliminarUsuario(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Usuario desactivado exitosamente");
  }
}

export default new UsuarioController();
