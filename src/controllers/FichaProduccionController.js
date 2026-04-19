import FichaProduccionService from "../services/FichaProduccionService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class FichaProduccionController {
  async crear(request, reply) {
    const ficha = await FichaProduccionService.crearFicha(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(
      reply,
      "Ficha de producción creada",
      { ficha },
      201,
    );
  }

  async listar(request, reply) {
    const fichas = await FichaProduccionService.obtenerFichas();
    return RespuestaApi.exito(reply, "Fichas obtenidas", { fichas });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      estado,
      productoFinalId,
      nombre,
      codigo,
    } = request.query;
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (productoFinalId) filtros.productoFinalId = productoFinalId;
    if (nombre) filtros.nombre = nombre;
    if (codigo) filtros.codigo = codigo;

    const resultado = await FichaProduccionService.obtenerFichasPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Fichas obtenidas", {
      fichas: resultado.datos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const ficha = await FichaProduccionService.obtenerFichaPorId(
      request.params.id,
    );
    return RespuestaApi.exito(reply, "Ficha obtenida", { ficha });
  }

  async actualizar(request, reply) {
    const ficha = await FichaProduccionService.actualizarFicha(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Ficha actualizada", { ficha });
  }

  async aprobar(request, reply) {
    const ficha = await FichaProduccionService.aprobarFicha(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Ficha aprobada", { ficha });
  }

  async obsoletar(request, reply) {
    const ficha = await FichaProduccionService.obsoletarFicha(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Ficha marcada como obsoleta", { ficha });
  }

  async eliminar(request, reply) {
    await FichaProduccionService.eliminarFicha(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Ficha eliminada");
  }

  async listarAprobadas(request, reply) {
    const fichas = await FichaProduccionService.obtenerFichasAprobadas(
      request.params.productoFinalId,
    );
    return RespuestaApi.exito(reply, "Fichas aprobadas obtenidas", { fichas });
  }
}

export default new FichaProduccionController();
