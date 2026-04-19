import SedeService from "../services/SedeService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class SedeController {
  async crear(request, reply) {
    const sede = await SedeService.crearSede(request.body, request.usuarioId);
    return RespuestaApi.exito(reply, "Sede creada exitosamente", { sede }, 201);
  }

  async listar(request, reply) {
    const sedes = await SedeService.obtenerSedes();
    return RespuestaApi.exito(reply, "Sedes obtenidas", { sedes });
  }

  async listarPaginado(request, reply) {
    const { pagina = 1, limite = 50, nombre, ciudad, codigo } = request.query;

    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (ciudad) filtros.ciudad = ciudad;
    if (codigo) filtros.codigo = codigo;

    const resultado = await SedeService.obtenerSedesPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );

    return RespuestaApi.exito(reply, "Sedes obtenidas", {
      sedes: resultado.documentos,
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const sede = await SedeService.obtenerSedePorId(request.params.id);
    return RespuestaApi.exito(reply, "Sede obtenida", { sede });
  }

  async actualizar(request, reply) {
    const sede = await SedeService.actualizarSede(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Sede actualizada", { sede });
  }

  async eliminar(request, reply) {
    await SedeService.eliminarSede(request.params.id, request.usuarioId);
    return RespuestaApi.exito(reply, "Sede desactivada exitosamente");
  }
}

export default new SedeController();
