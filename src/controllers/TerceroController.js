import TerceroService from "../services/TerceroService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class TerceroController {
  async crear(request, reply) {
    const tercero = await TerceroService.crearTercero(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Tercero creado", { tercero }, 201);
  }

  async listar(request, reply) {
    const incluirInactivos = request.query?.incluirInactivos === true;
    const terceros = await TerceroService.obtenerTerceros(
      {},
      incluirInactivos,
    );
    return RespuestaApi.exito(reply, "Terceros obtenidos", { terceros });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      tipo,
      razonSocial,
      numeroDocumento,
      incluirInactivos,
    } = request.query;
    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (razonSocial) filtros.razonSocial = razonSocial;
    if (numeroDocumento) filtros.numeroDocumento = numeroDocumento;
    if (incluirInactivos !== undefined) {
      filtros.incluirInactivos = incluirInactivos === true;
    }

    const resultado = await TerceroService.obtenerTercerosPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Terceros obtenidos", {
      terceros: resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const tercero = await TerceroService.obtenerTerceroPorId(request.params.id);
    return RespuestaApi.exito(reply, "Tercero obtenido", { tercero });
  }

  async actualizar(request, reply) {
    const tercero = await TerceroService.actualizarTercero(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Tercero actualizado", { tercero });
  }

  async eliminar(request, reply) {
    await TerceroService.eliminarTercero(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Tercero desactivado");
  }

  async actualizarEstado(request, reply) {
    const tercero = await TerceroService.actualizarEstadoTercero(
      request.params.id,
      request.body?.activo,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Estado de tercero actualizado", {
      tercero,
    });
  }

  async eliminarFisico(request, reply) {
    await TerceroService.eliminarTerceroFisico(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Tercero eliminado permanentemente");
  }
}

export default new TerceroController();
