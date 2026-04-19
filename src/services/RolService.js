import RolRepository from "../repositories/RolRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class RolService {
  async crearRol(datos, adminId) {
    const existente = await RolRepository.findByNombre(datos.nombre);
    if (existente) throw new ErrorApi(400, "Ya existe un rol con ese nombre");

    const rol = await RolRepository.create({
      nombre: datos.nombre,
      descripcion: datos.descripcion || "",
      permisos: datos.permisos || [],
      esPredeterminado: datos.esPredeterminado || false,
      trazabilidad: [crearTrazabilidad(adminId, "creacion", "Rol creado")],
    });

    logAccionUsuario(adminId, "CREAR_ROL", { rolCreado: rol._id });
    return rol;
  }

  async obtenerRoles() {
    return await RolRepository.findAllActivos();
  }

  async obtenerRolesPaginado(pagina, limite, filtros = {}) {
    const filtroConsulta = { activo: true };

    if (filtros.nombre) {
      filtroConsulta.nombre = { $regex: filtros.nombre, $options: "i" };
    }
    if (filtros.descripcion) {
      filtroConsulta.descripcion = {
        $regex: filtros.descripcion,
        $options: "i",
      };
    }

    return await RolRepository.findPaginado(filtroConsulta, pagina, limite, {
      nombre: 1,
    });
  }

  async obtenerRolPorId(id) {
    const rol = await RolRepository.findById(id);
    if (!rol || !rol.activo) throw new ErrorApi(404, "Rol no encontrado");
    return rol;
  }

  async actualizarRol(id, datos, adminId) {
    const rol = await RolRepository.findById(id);
    if (!rol || !rol.activo) throw new ErrorApi(404, "Rol no encontrado");

    // Si cambia nombre, verificar duplicado
    if (datos.nombre && datos.nombre !== rol.nombre) {
      const existente = await RolRepository.findByNombre(datos.nombre);
      if (existente) throw new ErrorApi(400, "Ya existe un rol con ese nombre");
    }

    delete datos.activo;
    const actualizado = await RolRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "actualizacion",
          "Rol actualizado",
        ),
      },
    });
    logAccionUsuario(adminId, "ACTUALIZAR_ROL", { rolActualizado: id });
    return actualizado;
  }

  async eliminarRol(id, adminId) {
    const rol = await RolRepository.findById(id);
    if (!rol || !rol.activo) throw new ErrorApi(404, "Rol no encontrado");

    await RolRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "eliminacion",
          "Rol desactivado",
        ),
      },
    });
    logAccionUsuario(adminId, "ELIMINAR_ROL", { rolEliminado: id });
  }
}

export default new RolService();
