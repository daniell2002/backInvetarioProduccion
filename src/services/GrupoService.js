import GrupoRepository from "../repositories/GrupoRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class GrupoService {
  async crearGrupo(datos, usuarioId) {
    const existente = await GrupoRepository.findByNombre(datos.nombre);
    if (existente) throw new ErrorApi(400, "Ya existe un grupo con ese nombre");

    const grupo = await GrupoRepository.create({
      nombre: datos.nombre,
      descripcion: datos.descripcion || "",
      trazabilidad: [crearTrazabilidad(usuarioId, "creacion", "Grupo creado")],
    });

    logAccionUsuario(usuarioId, "CREAR_GRUPO", { grupoCreado: grupo._id });
    return grupo;
  }

  async obtenerGrupos() {
    return await GrupoRepository.findAllActivos();
  }

  async obtenerGruposPaginado(pagina, limite, filtros = {}) {
    const filtroConsulta = { activo: true };

    if (filtros.nombre) {
      filtroConsulta.nombre = { $regex: filtros.nombre, $options: "i" };
    }

    return await GrupoRepository.findPaginado(
      filtroConsulta,
      pagina,
      limite,
      { nombre: 1 },
    );
  }

  async obtenerGrupoPorId(id) {
    const grupo = await GrupoRepository.findById(id);
    if (!grupo || !grupo.activo) throw new ErrorApi(404, "Grupo no encontrado");
    return grupo;
  }

  async actualizarGrupo(id, datos, usuarioId) {
    const grupo = await GrupoRepository.findById(id);
    if (!grupo || !grupo.activo) throw new ErrorApi(404, "Grupo no encontrado");

    if (datos.nombre && datos.nombre !== grupo.nombre) {
      const existente = await GrupoRepository.findByNombre(datos.nombre);
      if (existente) throw new ErrorApi(400, "Ya existe un grupo con ese nombre");
    }

    delete datos.activo;

    const actualizado = await GrupoRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(usuarioId, "actualizacion", "Grupo actualizado"),
      },
    });

    logAccionUsuario(usuarioId, "ACTUALIZAR_GRUPO", { grupoActualizado: id });
    return actualizado;
  }

  async eliminarGrupo(id, usuarioId) {
    const grupo = await GrupoRepository.findById(id);
    if (!grupo || !grupo.activo) throw new ErrorApi(404, "Grupo no encontrado");

    await GrupoRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(usuarioId, "eliminacion", "Grupo desactivado"),
      },
    });

    logAccionUsuario(usuarioId, "ELIMINAR_GRUPO", { grupoEliminado: id });
  }
}

export default new GrupoService();
