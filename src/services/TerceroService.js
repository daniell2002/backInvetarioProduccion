import TerceroRepository from "../repositories/TerceroRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class TerceroService {
  async crearTercero(datos, usuarioId) {
    const existente = await TerceroRepository.findByDocumento(
      datos.numeroDocumento,
    );
    if (existente)
      throw new ErrorApi(400, "Ya existe un tercero con ese documento");

    const tercero = await TerceroRepository.create({
      ...datos,
      trazabilidad: [
        crearTrazabilidad(usuarioId, "creacion", "Tercero creado"),
      ],
    });
    logAccionUsuario(usuarioId, "CREAR_TERCERO", {
      terceroCreado: tercero._id,
    });
    return tercero;
  }

  async obtenerTerceros(filtros = {}) {
    return await TerceroRepository.findAll({ ...filtros, activo: true });
  }

  async obtenerTercerosPaginado(pagina, limite, filtros = {}) {
    return await TerceroRepository.findPaginado(
      { ...filtros, activo: true },
      pagina,
      limite,
    );
  }

  async obtenerTerceroPorId(id) {
    const tercero = await TerceroRepository.findById(id);
    if (!tercero || !tercero.activo)
      throw new ErrorApi(404, "Tercero no encontrado");
    return tercero;
  }

  async actualizarTercero(id, datos, usuarioId) {
    const tercero = await TerceroRepository.findById(id);
    if (!tercero || !tercero.activo)
      throw new ErrorApi(404, "Tercero no encontrado");

    if (
      datos.numeroDocumento &&
      datos.numeroDocumento !== tercero.numeroDocumento
    ) {
      const existente = await TerceroRepository.findByDocumento(
        datos.numeroDocumento,
      );
      if (existente)
        throw new ErrorApi(400, "Ya existe un tercero con ese documento");
    }

    delete datos.activo;
    const actualizado = await TerceroRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          "Tercero actualizado",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ACTUALIZAR_TERCERO", {
      terceroActualizado: id,
    });
    return actualizado;
  }

  async eliminarTercero(id, usuarioId) {
    const tercero = await TerceroRepository.findById(id);
    if (!tercero || !tercero.activo)
      throw new ErrorApi(404, "Tercero no encontrado");

    await TerceroRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "eliminacion",
          "Tercero desactivado",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ELIMINAR_TERCERO", { terceroEliminado: id });
  }
}

export default new TerceroService();
