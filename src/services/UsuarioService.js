import bcrypt from "bcryptjs";
import crypto from "crypto";
import UsuarioRepository from "../repositories/UsuarioRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class UsuarioService {
  normalizarIdRelacion(valor, permitirUndefined = false) {
    if (valor === undefined) {
      return permitirUndefined ? undefined : null;
    }

    if (valor === null) return null;
    if (typeof valor === "string" && valor.trim() === "") return null;

    return valor;
  }

  /**
   * Crear usuario — Solo admin. Genera contraseña temporal y la envía por correo.
   */
  /**
   * Quién puede gestionar a quién. `actor` es request.usuario; si no viene
   * (llamadas internas: seed, scripts) no se aplican estas reglas.
   * - Al superadmin nadie lo desactiva ni elimina; solo él edita su cuenta.
   * - Solo el superadmin gestiona administradores.
   */
  verificarPuedeGestionar(objetivo, actor, accion) {
    if (!actor || !objetivo) return;
    if (objetivo.esSuperAdmin && accion !== "editar") {
      throw new ErrorApi(403, "El superadministrador no se puede desactivar ni eliminar");
    }
    if (objetivo.esSuperAdmin && !actor.esSuperAdmin) {
      throw new ErrorApi(403, "Solo el superadministrador puede modificar su cuenta");
    }
    if (objetivo.esAdmin && !actor.esSuperAdmin) {
      throw new ErrorApi(403, "Solo el superadministrador puede gestionar administradores");
    }
  }

  async crearUsuario(datos, adminId, actor = null) {
    // esSuperAdmin nunca se asigna desde la API (solo seed/script).
    delete datos.esSuperAdmin;
    if (actor && datos.esAdmin && !actor.esSuperAdmin) {
      throw new ErrorApi(403, "Solo el superadministrador puede crear administradores");
    }

    const existente = await UsuarioRepository.findByEmail(datos.email);
    if (existente)
      throw new ErrorApi(400, "Ya existe un usuario con ese email");

    // Generar contraseña temporal
    const contrasenaTemporal = crypto.randomBytes(4).toString("hex"); // 8 caracteres
    const passwordHash = await bcrypt.hash(contrasenaTemporal, 12);

    const usuario = await UsuarioRepository.create({
      nombre: datos.nombre,
      email: datos.email,
      passwordHash,
      rolId: this.normalizarIdRelacion(datos.rolId),
      sedeId: this.normalizarIdRelacion(datos.sedeId),
      esAdmin: datos.esAdmin || false,
      debeCambiarContrasena: true,
      trazabilidad: [crearTrazabilidad(adminId, "creacion", "Usuario creado")],
    });

    logAccionUsuario(adminId, "CREAR_USUARIO", {
      usuarioCreado: usuario._id,
      email: datos.email,
    });

    // TODO: enviar correo con credenciales
    // CorreoService.enviarCredenciales({ email, contrasenaTemporal })

    return {
      usuario: {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rolId: usuario.rolId,
        sedeId: usuario.sedeId,
        esAdmin: usuario.esAdmin,
        activo: usuario.activo,
      },
      contrasenaTemporal, // Solo para desarrollo, en prod se envía por correo
    };
  }

  async obtenerUsuarios(filtros = {}, incluirInactivos = false) {
    return await UsuarioRepository.findAll(
      incluirInactivos ? filtros : { ...filtros, activo: true },
    );
  }

  async obtenerUsuariosPaginado(pagina, limite, filtros = {}) {
    const filtroConsulta = { ...filtros };
    if (!filtros.incluirInactivos) {
      filtroConsulta.activo = true;
    }
    delete filtroConsulta.incluirInactivos;

    return await UsuarioRepository.findAllPaginado(
      pagina,
      limite,
      filtroConsulta,
    );
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await UsuarioRepository.findByIdConRol(id);
    if (!usuario) throw new ErrorApi(404, "Usuario no encontrado");
    return usuario;
  }

  async actualizarUsuario(id, datos, adminId, actor = null) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario || !usuario.activo)
      throw new ErrorApi(404, "Usuario no encontrado");

    delete datos.esSuperAdmin;
    // Editar la propia cuenta (nombre/email) se permite; sus límites van abajo.
    const esPropia = String(usuario._id) === String(adminId);
    if (!esPropia) this.verificarPuedeGestionar(usuario, actor, "editar");
    if (actor && !actor.esSuperAdmin) {
      const cambiaAdmin = datos.esAdmin !== undefined && Boolean(datos.esAdmin) !== Boolean(usuario.esAdmin);
      if (cambiaAdmin) {
        throw new ErrorApi(403, "Solo el superadministrador puede dar o quitar el rol de administrador");
      }
      // Nadie se cambia a sí mismo rol o sede (evita que se suba privilegios).
      if (esPropia) {
        const cambia = (campo) =>
          datos[campo] !== undefined &&
          String(this.normalizarIdRelacion(datos[campo], true) ?? "") !== String(usuario[campo] ?? "");
        if (cambia("rolId") || cambia("sedeId")) {
          throw new ErrorApi(403, "No puedes cambiar tu propio rol o sede");
        }
      }
    }
    // El superadmin siempre es admin.
    if (usuario.esSuperAdmin) datos.esAdmin = true;

    // Si cambia email, verificar que no exista
    if (datos.email && datos.email !== usuario.email) {
      const existente = await UsuarioRepository.findByEmail(datos.email);
      if (existente)
        throw new ErrorApi(400, "Ya existe un usuario con ese email");
    }

    // No permitir cambiar passwordHash por aquí
    delete datos.passwordHash;
    delete datos.activo;

    const rolIdNormalizado = this.normalizarIdRelacion(datos.rolId, true);
    const sedeIdNormalizada = this.normalizarIdRelacion(datos.sedeId, true);

    if (rolIdNormalizado !== undefined) datos.rolId = rolIdNormalizado;
    if (sedeIdNormalizada !== undefined) datos.sedeId = sedeIdNormalizada;

    const actualizado = await UsuarioRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "actualizacion",
          "Usuario actualizado",
        ),
      },
    });
    logAccionUsuario(adminId, "ACTUALIZAR_USUARIO", { usuarioActualizado: id });
    return actualizado;
  }

  async eliminarUsuario(id, adminId, actor = null) {
    const usuario = await UsuarioRepository.findById(id);
    this.verificarPuedeGestionar(usuario, actor, "desactivar");
    if (!usuario || !usuario.activo)
      throw new ErrorApi(404, "Usuario no encontrado");

    if (usuario._id.toString() === adminId) {
      throw new ErrorApi(400, "No puedes desactivar tu propia cuenta");
    }

    await UsuarioRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "eliminacion",
          "Usuario desactivado",
        ),
      },
    });
    logAccionUsuario(adminId, "ELIMINAR_USUARIO", { usuarioEliminado: id });
  }

  async actualizarEstadoUsuario(id, activo, adminId, actor = null) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) throw new ErrorApi(404, "Usuario no encontrado");
    this.verificarPuedeGestionar(usuario, actor, "desactivar");

    if (usuario._id.toString() === adminId && activo === false) {
      throw new ErrorApi(400, "No puedes desactivar tu propia cuenta");
    }

    const nuevoEstado = Boolean(activo);
    if (Boolean(usuario.activo) === nuevoEstado) {
      return usuario;
    }

    const actualizado = await UsuarioRepository.updateById(id, {
      $set: { activo: nuevoEstado },
      $push: {
        trazabilidad: crearTrazabilidad(
          adminId,
          "actualizacion",
          nuevoEstado ? "Usuario reactivado" : "Usuario desactivado",
        ),
      },
    });

    logAccionUsuario(
      adminId,
      nuevoEstado ? "REACTIVAR_USUARIO" : "DESACTIVAR_USUARIO",
      { usuarioActualizado: id, activo: nuevoEstado },
    );

    return actualizado;
  }

  async eliminarUsuarioFisico(id, adminId, actor = null) {
    const usuario = await UsuarioRepository.findById(id);
    if (!usuario) throw new ErrorApi(404, "Usuario no encontrado");
    this.verificarPuedeGestionar(usuario, actor, "eliminar");

    if (usuario._id.toString() === adminId) {
      throw new ErrorApi(400, "No puedes eliminar tu propia cuenta");
    }

    await UsuarioRepository.deleteById(id);
    logAccionUsuario(adminId, "ELIMINAR_USUARIO_FISICO", {
      usuarioEliminado: id,
    });
  }
}

export default new UsuarioService();
