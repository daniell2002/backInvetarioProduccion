import MaquinaService from "../services/MaquinaService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class MaquinaController {
  async crear(request, reply) {
    const maquina = await MaquinaService.crearMaquina(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Máquina creada", { maquina }, 201);
  }

  async listar(request, reply) {
    const maquinas = await MaquinaService.obtenerMaquinas();
    return RespuestaApi.exito(reply, "Máquinas obtenidas", { maquinas });
  }

  async listarPaginado(request, reply) {
    const { pagina = 1, limite = 20, sedeId, estado, nombre } = request.query;
    const filtros = {};
    if (sedeId) filtros.sedeId = sedeId;
    if (estado) filtros.estado = estado;
    if (nombre) filtros.nombre = nombre;

    const resultado = await MaquinaService.obtenerMaquinasPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Máquinas obtenidas", {
      maquinas: resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const maquina = await MaquinaService.obtenerMaquinaPorId(request.params.id);
    return RespuestaApi.exito(reply, "Máquina obtenida", { maquina });
  }

  async actualizar(request, reply) {
    const maquina = await MaquinaService.actualizarMaquina(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Máquina actualizada", { maquina });
  }

  async eliminar(request, reply) {
    await MaquinaService.eliminarMaquina(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Máquina eliminada");
  }
}

export default new MaquinaController();
