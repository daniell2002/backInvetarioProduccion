import GrupoService from "../services/GrupoService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class GrupoController {
  async crear(request, reply) {
    const grupo = await GrupoService.crearGrupo(request.body, request.usuarioId);
    return RespuestaApi.exito(reply, "Grupo creado", { grupo }, 201);
  }

  async listar(request, reply) {
    const grupos = await GrupoService.obtenerGrupos();
    return RespuestaApi.exito(reply, "Grupos obtenidos", { grupos });
  }

  async listarPaginado(request, reply) {
    const { pagina = 1, limite = 20, nombre } = request.query;

    const filtros = {};
    if (nombre) filtros.nombre = nombre;

    const resultado = await GrupoService.obtenerGruposPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );

    return RespuestaApi.exito(reply, "Grupos obtenidos", {
      grupos: resultado.documentos,
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const grupo = await GrupoService.obtenerGrupoPorId(request.params.id);
    return RespuestaApi.exito(reply, "Grupo obtenido", { grupo });
  }

  async actualizar(request, reply) {
    const grupo = await GrupoService.actualizarGrupo(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Grupo actualizado", { grupo });
  }

  async eliminar(request, reply) {
    await GrupoService.eliminarGrupo(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Grupo eliminado");
  }
}

export default new GrupoController();
