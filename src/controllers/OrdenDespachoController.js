import OrdenDespachoService from "../services/OrdenDespachoService.js";
import RespuestaApi from "../utils/RespuestaApi.js";
import { limitarFiltrosASede, verificarLecturaSede } from "../utils/accesoSede.util.js";

class OrdenDespachoController {
  async crear(request, reply) {
    const orden = await OrdenDespachoService.crearOrden(
      request.body,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(
      reply,
      "Orden de despacho creada",
      { orden },
      201,
    );
  }

  async listar(request, reply) {
    const ordenesDespacho = await OrdenDespachoService.obtenerOrdenes(
      limitarFiltrosASede(request.usuario, {}),
    );
    return RespuestaApi.exito(reply, "Órdenes de despacho obtenidas", {
      ordenesDespacho,
    });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      sedeId,
      estado,
      clienteId,
    } = request.query;
    const filtros = {};
    if (sedeId) filtros.sedeId = sedeId;
    if (estado) filtros.estado = estado;
    if (clienteId) filtros.clienteId = clienteId;

    const filtrosSede = limitarFiltrosASede(request.usuario, filtros);

    const resultado = await OrdenDespachoService.obtenerOrdenesPaginado(
      Number(pagina),
      Number(limite),
      filtrosSede,
    );
    return RespuestaApi.exito(reply, "Órdenes de despacho obtenidas", {
      ordenesDespacho: resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const orden = await OrdenDespachoService.obtenerOrdenPorId(
      request.params.id,
    );
    verificarLecturaSede(request.usuario, orden, ["sedeId"]);
    return RespuestaApi.exito(reply, "Orden obtenida", { orden });
  }

  async preparar(request, reply) {
    const orden = await OrdenDespachoService.prepararOrden(
      request.params.id,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Orden en preparación", { orden });
  }

  async despachar(request, reply) {
    const orden = await OrdenDespachoService.despacharOrden(
      request.params.id,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Orden despachada", { orden });
  }

  async confirmarEntrega(request, reply) {
    const orden = await OrdenDespachoService.confirmarEntrega(
      request.params.id,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Entrega confirmada", { orden });
  }

  async anular(request, reply) {
    const orden = await OrdenDespachoService.anularOrden(
      request.params.id,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Orden anulada", { orden });
  }
}

export default new OrdenDespachoController();
