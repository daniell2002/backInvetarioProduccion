import ProduccionService from "../services/ProduccionService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class ProduccionController {
  async crear(request, reply) {
    const produccion = await ProduccionService.crearProduccion(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producción creada", { produccion }, 201);
  }

  async listar(request, reply) {
    const producciones = await ProduccionService.obtenerProducciones();
    return RespuestaApi.exito(reply, "Producciones obtenidas", {
      producciones,
    });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      estado,
      sedeId,
      fichaProduccionId,
      codigo,
      fechaDesde,
      fechaHasta,
    } = request.query;
    const filtros = {};
    if (estado) filtros.estado = estado;
    if (sedeId) filtros.sedeId = sedeId;
    if (fichaProduccionId) filtros.fichaProduccionId = fichaProduccionId;
    if (codigo) filtros.codigo = codigo;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    const resultado = await ProduccionService.obtenerProduccionesPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Producciones obtenidas", {
      producciones: resultado.datos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const produccion = await ProduccionService.obtenerProduccionPorId(
      request.params.id,
    );
    return RespuestaApi.exito(reply, "Producción obtenida", { produccion });
  }

  async iniciar(request, reply) {
    const produccion = await ProduccionService.iniciarProduccion(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producción iniciada", { produccion });
  }

  async completar(request, reply) {
    const produccion = await ProduccionService.completarProduccion(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producción completada", { produccion });
  }

  async anular(request, reply) {
    const produccion = await ProduccionService.anularProduccion(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producción anulada", { produccion });
  }

  async proyectar(request, reply) {
    const { fichaId, sedeId } = request.query;
    const proyeccion = await ProduccionService.proyectarProduccion(
      fichaId,
      sedeId,
    );
    return RespuestaApi.exito(reply, "Proyección calculada", { proyeccion });
  }

  async estimarCosto(request, reply) {
    const { fichaId, sedeId, cantidad } = request.query;
    const estimacion = await ProduccionService.estimarCosto(
      fichaId,
      sedeId,
      Number(cantidad),
    );
    return RespuestaApi.exito(reply, "Estimación de costo calculada", {
      estimacion,
    });
  }
}

export default new ProduccionController();
