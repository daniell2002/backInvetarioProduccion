import VentaService from "../services/VentaService.js";
import RespuestaApi from "../utils/RespuestaApi.js";
import { limitarFiltrosASede, verificarLecturaSede } from "../utils/accesoSede.util.js";

class VentaController {
  async crear(request, reply) {
    const venta = await VentaService.crearVenta(
      request.body,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Venta registrada", { venta }, 201);
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      sedeId,
      estado,
      fechaDesde,
      fechaHasta,
    } = request.query;
    const filtros = {};
    if (sedeId) filtros.sedeId = sedeId;
    if (estado) filtros.estado = estado;
    if (fechaDesde) filtros.fechaDesde = fechaDesde;
    if (fechaHasta) filtros.fechaHasta = fechaHasta;

    const filtrosSede = limitarFiltrosASede(request.usuario, filtros);

    const resultado = await VentaService.obtenerVentasPaginado(
      Number(pagina),
      Number(limite),
      filtrosSede,
    );
    return RespuestaApi.exito(reply, "Ventas obtenidas", resultado);
  }

  async obtenerPorId(request, reply) {
    const venta = await VentaService.obtenerVentaPorId(request.params.id);
    verificarLecturaSede(request.usuario, venta, ["sedeId"]);
    return RespuestaApi.exito(reply, "Venta obtenida", { venta });
  }

  async actualizar(request, reply) {
    const venta = await VentaService.actualizarVenta(
      request.params.id,
      request.body,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Venta actualizada", { venta });
  }

  async anular(request, reply) {
    const venta = await VentaService.anularVenta(
      request.params.id,
      request.usuarioId,
      request.usuario,
    );
    return RespuestaApi.exito(reply, "Venta anulada", { venta });
  }
}

export default new VentaController();
