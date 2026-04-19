import FichaProduccionRepository from "../repositories/FichaProduccionRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class FichaProduccionService {
  /**
   * Crear ficha de producción (receta / BOM).
   * Queda en estado 'pendiente' hasta que un usuario con permisos la apruebe.
   */
  async crearFicha(datos, usuarioId) {
    if (!datos.materiales || datos.materiales.length === 0) {
      throw new ErrorApi(400, "La ficha debe tener al menos un material");
    }

    // Validar que el producto final no esté entre los materiales
    const productoFinalEnMateriales = datos.materiales.some(
      (m) => m.productoId.toString() === datos.productoFinalId.toString(),
    );
    if (productoFinalEnMateriales) {
      throw new ErrorApi(
        400,
        "El producto final no puede estar como material de la ficha",
      );
    }

    const codigo = await generarCodigo(
      "FPR",
      FichaProduccionRepository.model,
      "codigo",
    );

    const ficha = await FichaProduccionRepository.create({
      codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion || "",
      productoFinalId: datos.productoFinalId,
      cantidadResultante: datos.cantidadResultante || 1,
      unidadMedidaResultante: datos.unidadMedidaResultante,
      materiales: datos.materiales,
      estado: "pendiente",
      creadoPor: usuarioId,
      observaciones: datos.observaciones || "",
      trazabilidad: [
        crearTrazabilidad(
          usuarioId,
          "creacion",
          `Ficha de producción ${codigo} creada`,
        ),
      ],
    });

    logAccionUsuario(usuarioId, "CREAR_FICHA_PRODUCCION", {
      fichaCreada: ficha._id,
      codigo,
    });

    return ficha;
  }

  async obtenerFichas(filtros = {}) {
    return await FichaProduccionRepository.findAllActivas(filtros);
  }

  async obtenerFichasPaginado(pagina, limite, filtros = {}) {
    return await FichaProduccionRepository.findAllPaginado(
      pagina,
      limite,
      filtros,
    );
  }

  async obtenerFichaPorId(id) {
    const ficha = await FichaProduccionRepository.findByIdConDetalles(id);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    return ficha;
  }

  /**
   * Actualizar ficha — solo si está en estado 'pendiente'.
   */
  async actualizarFicha(id, datos, usuarioId) {
    const ficha = await FichaProduccionRepository.findById(id);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    if (ficha.estado !== "pendiente") {
      throw new ErrorApi(
        400,
        "Solo se pueden editar fichas en estado pendiente",
      );
    }

    if (datos.materiales && datos.productoFinalId) {
      const productoFinalEnMateriales = datos.materiales.some(
        (m) => m.productoId.toString() === datos.productoFinalId.toString(),
      );
      if (productoFinalEnMateriales) {
        throw new ErrorApi(
          400,
          "El producto final no puede estar como material de la ficha",
        );
      }
    }

    delete datos.estado;
    delete datos.aprobadoPor;
    delete datos.fechaAprobacion;

    const actualizada = await FichaProduccionRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          "Ficha de producción actualizada",
        ),
      },
    });

    logAccionUsuario(usuarioId, "ACTUALIZAR_FICHA_PRODUCCION", {
      fichaActualizada: id,
    });

    return actualizada;
  }

  /**
   * Aprobar ficha — cambia estado a 'aprobada'.
   * Una vez aprobada, puede usarse como receta para crear producciones.
   */
  async aprobarFicha(id, usuarioId) {
    const ficha = await FichaProduccionRepository.findById(id);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    if (ficha.estado !== "pendiente") {
      throw new ErrorApi(400, "Solo se pueden aprobar fichas pendientes");
    }

    const aprobada = await FichaProduccionRepository.updateById(id, {
      $set: {
        estado: "aprobada",
        aprobadoPor: usuarioId,
        fechaAprobacion: new Date(),
      },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "aprobacion",
          "Ficha de producción aprobada",
        ),
      },
    });

    logAccionUsuario(usuarioId, "APROBAR_FICHA_PRODUCCION", {
      fichaAprobada: id,
    });

    return aprobada;
  }

  /**
   * Marcar ficha como obsoleta — ya no se puede usar en nuevas producciones.
   */
  async obsoletarFicha(id, usuarioId) {
    const ficha = await FichaProduccionRepository.findById(id);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    if (ficha.estado === "obsoleta") {
      throw new ErrorApi(400, "La ficha ya está obsoleta");
    }

    const obsoleta = await FichaProduccionRepository.updateById(id, {
      $set: { estado: "obsoleta" },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "cambio_estado",
          "Ficha marcada como obsoleta",
        ),
      },
    });

    logAccionUsuario(usuarioId, "OBSOLETAR_FICHA_PRODUCCION", {
      fichaObsoletada: id,
    });

    return obsoleta;
  }

  /**
   * Eliminar ficha (soft delete).
   */
  async eliminarFicha(id, usuarioId) {
    const ficha = await FichaProduccionRepository.findById(id);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }

    await FichaProduccionRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "eliminacion",
          "Ficha de producción desactivada",
        ),
      },
    });

    logAccionUsuario(usuarioId, "ELIMINAR_FICHA_PRODUCCION", {
      fichaEliminada: id,
    });
  }

  /**
   * Obtener fichas aprobadas para un producto final específico.
   */
  async obtenerFichasAprobadas(productoFinalId) {
    return await FichaProduccionRepository.findAprobadasPorProducto(
      productoFinalId,
    );
  }
}

export default new FichaProduccionService();
