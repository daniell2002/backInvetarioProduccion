import UsuarioService from "../services/UsuarioService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class UsuarioController {
  resolverBoolean(valor, porDefecto = false) {
    if (valor === undefined || valor === null) return porDefecto;
    if (typeof valor === "boolean") return valor;
    if (typeof valor === "string") return valor.toLowerCase() === "true";
    return porDefecto;
  }

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
    const incluirInactivos = this.resolverBoolean(
      request.query?.incluirInactivos,
      false,
    );
    const usuarios = await UsuarioService.obtenerUsuarios({}, incluirInactivos);
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
      incluirInactivos,
    } = request.query;
    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (email) filtros.email = email;
    if (sedeId) filtros.sedeId = sedeId;
    if (rolId) filtros.rolId = rolId;
    if (esAdmin !== undefined) filtros.esAdmin = esAdmin;
    filtros.incluirInactivos = this.resolverBoolean(incluirInactivos, false);

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

  async actualizarEstado(request, reply) {
    const usuario = await UsuarioService.actualizarEstadoUsuario(
      request.params.id,
      request.body?.activo,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Estado de usuario actualizado", {
      usuario,
    });
  }

  async eliminarFisico(request, reply) {
    await UsuarioService.eliminarUsuarioFisico(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Usuario eliminado permanentemente");
  }
}

export default new UsuarioController();
