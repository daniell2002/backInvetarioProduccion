import MaquinaRepository from "../repositories/MaquinaRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class MaquinaService {
  async crearMaquina(datos, usuarioId) {
    const codigo = await generarCodigo(
      "MAQ",
      MaquinaRepository.model,
      "codigo",
    );

    const maquina = await MaquinaRepository.create({
      codigo,
      nombre: datos.nombre,
      marca: datos.marca || "",
      modelo: datos.modelo || "",
      serie: datos.serie || "",
      sedeId: datos.sedeId,
      estado: datos.estado || "operativa",
      ubicacion: datos.ubicacion || "",
      observaciones: datos.observaciones || "",
      trazabilidad: [
        crearTrazabilidad(usuarioId, "creacion", "Máquina creada"),
      ],
    });

    logAccionUsuario(usuarioId, "CREAR_MAQUINA", {
      maquinaCreada: maquina._id,
    });
    return maquina;
  }

  async obtenerMaquinas(filtros = {}) {
    return await MaquinaRepository.findAll({ ...filtros, activo: true });
  }

  async obtenerMaquinasPaginado(pagina, limite, filtros = {}) {
    return await MaquinaRepository.findPaginado(
      { ...filtros, activo: true },
      pagina,
      limite,
    );
  }

  async obtenerMaquinaPorId(id) {
    const maquina = await MaquinaRepository.findById(id);
    if (!maquina || !maquina.activo)
      throw new ErrorApi(404, "Máquina no encontrada");
    return maquina;
  }

  async actualizarMaquina(id, datos, usuarioId) {
    const maquina = await MaquinaRepository.findById(id);
    if (!maquina || !maquina.activo)
      throw new ErrorApi(404, "Máquina no encontrada");

    delete datos.activo;
    delete datos.codigo;

    const actualizada = await MaquinaRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          "Máquina actualizada",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ACTUALIZAR_MAQUINA", {
      maquinaActualizada: id,
    });
    return actualizada;
  }

  async eliminarMaquina(id, usuarioId) {
    const maquina = await MaquinaRepository.findById(id);
    if (!maquina || !maquina.activo)
      throw new ErrorApi(404, "Máquina no encontrada");

    await MaquinaRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "eliminacion",
          "Máquina desactivada",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ELIMINAR_MAQUINA", { maquinaEliminada: id });
  }
}

export default new MaquinaService();
