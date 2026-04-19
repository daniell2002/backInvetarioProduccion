import SedeRepository from "../repositories/SedeRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class SedeService {
  async crearSede(datos, adminId) {
    const existente = await SedeRepository.findByNombre(datos.nombre);
    if (existente) throw new ErrorApi(400, "Ya existe una sede con ese nombre");

    const codigo = await generarCodigo("SDE", SedeRepository.model, "codigo");

    const sede = await SedeRepository.create({
      nombre: datos.nombre,
      codigo,
      direccion: datos.direccion || "",
      ciudad: datos.ciudad || "",
      telefono: datos.telefono || "",
      responsableId: datos.responsableId || null,
      trazabilidad: [crearTrazabilidad(adminId, "creacion", "Sede creada")],
    });

    logAccionUsuario(adminId, "CREAR_SEDE", { sedeCreada: sede._id });
    return sede;
  }

  async obtenerSedes() {
    return await SedeRepository.findAllActivas();
  }

  async obtenerSedesPaginado(pagina, limite, filtros = {}) {
    const filtroConsulta = { activo: true };

    if (filtros.nombre) {
      filtroConsulta.nombre = { $regex: filtros.nombre, $options: "i" };
    }
    if (filtros.ciudad) {
      filtroConsulta.ciudad = { $regex: filtros.ciudad, $options: "i" };
    }
    if (filtros.codigo) {
      filtroConsulta.codigo = { $regex: filtros.codigo, $options: "i" };
    }

    return await SedeRepository.findPaginado(filtroConsulta, pagina, limite, {
      nombre: 1,
    });
  }

  async obtenerSedePorId(id) {
    const sede = await SedeRepository.findByIdConResponsable(id);
    if (!sede || !sede.activo) throw new ErrorApi(404, "Sede no encontrada");
    return sede;
  }

  async actualizarSede(id, datos, adminId) {
    const sede = await SedeRepository.findById(id);
    if (!sede || !sede.activo) throw new ErrorApi(404, "Sede no encontrada");

    if (datos.nombre && datos.nombre !== sede.nombre) {
      const existente = await SedeRepository.findByNombre(datos.nombre);
      if (existente)
        throw new ErrorApi(400, "Ya existe una sede con ese nombre");
    }

    delete datos.activo;
    delete datos.codigo; // No permitir cambiar código

    const actualizada = await SedeRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "actualizacion",
          "Sede actualizada",
        ),
      },
    });
    logAccionUsuario(adminId, "ACTUALIZAR_SEDE", { sedeActualizada: id });
    return actualizada;
  }

  async eliminarSede(id, adminId) {
    const sede = await SedeRepository.findById(id);
    if (!sede || !sede.activo) throw new ErrorApi(404, "Sede no encontrada");

    await SedeRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "eliminacion",
          "Sede desactivada",
        ),
      },
    });
    logAccionUsuario(adminId, "ELIMINAR_SEDE", { sedeEliminada: id });
  }
}

export default new SedeService();
