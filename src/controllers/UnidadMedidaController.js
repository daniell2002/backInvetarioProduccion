import UnidadMedidaService from "../services/UnidadMedidaService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class UnidadMedidaController {
  async sincronizar(request, reply) {
    const resultado = await UnidadMedidaService.sincronizarDesdeArchivo();
    return RespuestaApi.exito(
      reply,
      "Sincronización completada",
      { resultado },
      200,
    );
  }

  async listar(request, reply) {
    const unidades = await UnidadMedidaService.obtenerUnidades();
    return RespuestaApi.exito(reply, "Unidades de medida obtenidas", {
      unidades,
    });
  }

  async obtenerPorId(request, reply) {
    const unidad = await UnidadMedidaService.obtenerPorId(request.params.id);
    return RespuestaApi.exito(reply, "Unidad de medida obtenida", { unidad });
  }
}

export default new UnidadMedidaController();
