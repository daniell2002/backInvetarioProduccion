import InventarioService from "../services/InventarioService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class InventarioController {
  async stockPorSede(request, reply) {
    const { sedeId } = request.params;
    const { productoId } = request.query;
    const filtros = {};
    if (productoId) filtros.productoId = productoId;

    const stock = await InventarioService.obtenerStockPorSede(sedeId, filtros);
    return RespuestaApi.exito(reply, "Stock por sede obtenido", { stock });
  }

  async stockGlobal(request, reply) {
    const { productoId } = request.query;
    const filtros = {};
    if (productoId) filtros.productoId = productoId;

    const stock = await InventarioService.obtenerStockGlobal(filtros);
    return RespuestaApi.exito(reply, "Stock global obtenido", { stock });
  }

  async stockProducto(request, reply) {
    const stock = await InventarioService.obtenerStockProducto(
      request.params.productoId,
    );
    return RespuestaApi.exito(reply, "Stock del producto obtenido", { stock });
  }
}

export default new InventarioController();
