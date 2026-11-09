import RolRepository from "../repositories/RolRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class RolService {
  async crearRol(datos, adminId, actor = null) {
    if (actor && datos.esPredeterminado && !actor.esSuperAdmin) {
      throw new ErrorApi(403, "Solo el superadministrador puede crear roles predeterminados");
    }
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

  async obtenerRolesPaginado(
    pagina,
    limite,
    filtros = {},
    incluirInactivos = false,
  ) {
    const filtroConsulta = incluirInactivos ? {} : { activo: true };

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

  async actualizarRol(id, datos, adminId, actor = null) {
    const rol = await RolRepository.findById(id);
    if (!rol || !rol.activo) throw new ErrorApi(404, "Rol no encontrado");

    // El rol predeterminado (Administrador) solo lo edita el superadmin, y
    // solo el superadmin cambia qué rol es predeterminado.
    if (actor && !actor.esSuperAdmin) {
      if (rol.esPredeterminado) {
        throw new ErrorApi(403, "Solo el superadministrador puede modificar el rol predeterminado");
      }
      if (datos.esPredeterminado !== undefined && Boolean(datos.esPredeterminado) !== Boolean(rol.esPredeterminado)) {
        throw new ErrorApi(403, "Solo el superadministrador puede marcar roles como predeterminados");
      }
    }

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
    if (rol?.esPredeterminado) {
      throw new ErrorApi(403, "El rol predeterminado no se puede desactivar ni eliminar");
    }
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

  async reactivarRol(id, adminId) {
    const rol = await RolRepository.findById(id);
    if (!rol) throw new ErrorApi(404, "Rol no encontrado");
    if (rol.activo) throw new ErrorApi(400, "El rol ya está activo");

    const actualizado = await RolRepository.updateById(id, {
      $set: { activo: true },
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "actualizacion",
          "Rol reactivado",
        ),
      },
    });

    logAccionUsuario(adminId, "REACTIVAR_ROL", { rolReactivado: id });
    return actualizado;
  }

  async eliminarRolFisico(id, adminId) {
    const rol = await RolRepository.findById(id);
    if (rol?.esPredeterminado) {
      throw new ErrorApi(403, "El rol predeterminado no se puede desactivar ni eliminar");
    }
    if (!rol) throw new ErrorApi(404, "Rol no encontrado");

    await RolRepository.deleteById(id);
    logAccionUsuario(adminId, "ELIMINAR_ROL_FISICO", { rolEliminado: id });
  }
}

export default new RolService();
