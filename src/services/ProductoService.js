import ProductoRepository from "../repositories/ProductoRepository.js";
import RackRepository from "../repositories/RackRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { esPosicionValida } from "../utils/rackPosiciones.util.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

class ProductoService {
  async crearProducto(datos, usuarioId) {
    const codigoInterno = await generarCodigo(
      "PRD",
      ProductoRepository.model,
      "codigoInterno",
    );
    const codigoExterno = String(datos.codigoExterno || "").trim();

    const producto = await ProductoRepository.create({
      codigoInterno,
      referencia: codigoExterno || codigoInterno,
      codigoExterno,
      nombre: datos.nombre,
      descripcion: datos.descripcion || "",
      categoriaId: datos.categoriaId,
      subcategoriaId: datos.subcategoriaId || null,
      unidadMedidaId: datos.unidadMedidaId,
      stockMinimo: datos.stockMinimo || 0,
      stockMaximo: datos.stockMaximo || 0,
      imagen: datos.imagen || "",
      trazabilidad: [
        crearTrazabilidad(usuarioId, "creacion", "Producto creado"),
      ],
    });

    logAccionUsuario(usuarioId, "CREAR_PRODUCTO", {
      productoCreado: producto._id,
    });
    return producto;
  }

  async obtenerProductos(filtros = {}, incluirInactivos = false) {
    return await ProductoRepository.findAll(
      incluirInactivos ? { ...filtros } : { ...filtros, activo: true },
    );
  }

  async obtenerProductosPaginado(pagina, limite, filtros = {}) {
    const filtroConsulta = { ...filtros };
    if (!filtros.incluirInactivos) {
      filtroConsulta.activo = true;
    }
    delete filtroConsulta.incluirInactivos;

    const consulta = ProductoRepository.construirFiltros(filtroConsulta);

    return await ProductoRepository.findPaginado(consulta, pagina, limite);
  }

  async obtenerProductoPorId(id) {
    const producto = await ProductoRepository.findById(id);
    if (!producto || !producto.activo)
      throw new ErrorApi(404, "Producto no encontrado");
    return producto;
  }

  async buscarPorCodigoExterno(codigo) {
    const producto = await ProductoRepository.findByCodigoExterno(codigo);
    if (!producto) throw new ErrorApi(404, "Producto no encontrado");
    return producto;
  }

  async asignarUbicacion(id, { rackId, posicion }, usuarioId) {
    const producto = await ProductoRepository.findById(id);
    if (!producto || !producto.activo)
      throw new ErrorApi(404, "Producto no encontrado");

    // Quitar ubicación: rackId vacío limpia el campo
    if (!rackId) {
      const actualizado = await ProductoRepository.updateById(id, {
        $set: { ubicacion: { rackId: null, posicion: "" } },
        $push: {
          trazabilidad: crearTrazabilidad(usuarioId, "actualizacion", "Ubicación de rack removida"),
        },
      });
      logAccionUsuario(usuarioId, "QUITAR_UBICACION_PRODUCTO", { productoId: id });
      return actualizado;
    }

    const rack = await RackRepository.findById(rackId);
    if (!rack || !rack.activo) throw new ErrorApi(404, "Rack no encontrado");

    if (!esPosicionValida(posicion, rack.filas, rack.columnas)) {
      throw new ErrorApi(
        400,
        `Posición "${posicion}" inválida para un rack de ${rack.filas} filas x ${rack.columnas} columnas`,
      );
    }

    const posicionNormalizada = String(posicion).toUpperCase().trim();

    const actualizado = await ProductoRepository.updateById(id, {
      $set: { ubicacion: { rackId, posicion: posicionNormalizada } },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          `Ubicación asignada: ${rack.nombre} ${posicionNormalizada}`,
        ),
      },
    });

    logAccionUsuario(usuarioId, "ASIGNAR_UBICACION_PRODUCTO", {
      productoId: id,
      rackId,
      posicion: posicionNormalizada,
    });
    return actualizado;
  }

  async actualizarProducto(id, datos, usuarioId) {
    const producto = await ProductoRepository.findById(id);
    if (!producto || !producto.activo)
      throw new ErrorApi(404, "Producto no encontrado");

    if (Object.prototype.hasOwnProperty.call(datos, "codigoExterno")) {
      const codigoExterno = String(datos.codigoExterno || "").trim();
      datos.codigoExterno = codigoExterno;
      datos.referencia = codigoExterno || producto.codigoInterno;
    }

    delete datos.activo;
    delete datos.codigoInterno; // No permitir cambiar código interno

    const actualizado = await ProductoRepository.updateById(id, {
      $set: datos,
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          "Producto actualizado",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ACTUALIZAR_PRODUCTO", {
      productoActualizado: id,
    });
    return actualizado;
  }

  async eliminarProducto(id, usuarioId) {
    const producto = await ProductoRepository.findById(id);
    if (!producto || !producto.activo)
      throw new ErrorApi(404, "Producto no encontrado");

    await ProductoRepository.updateById(id, {
      $set: { activo: false },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "eliminacion",
          "Producto desactivado",
        ),
      },
    });
    logAccionUsuario(usuarioId, "ELIMINAR_PRODUCTO", { productoEliminado: id });
  }

  async actualizarEstadoProducto(id, activo, usuarioId) {
    const producto = await ProductoRepository.findById(id);
    if (!producto) throw new ErrorApi(404, "Producto no encontrado");

    const nuevoEstado = Boolean(activo);
    if (Boolean(producto.activo) === nuevoEstado) {
      return producto;
    }

    const actualizado = await ProductoRepository.updateById(id, {
      $set: { activo: nuevoEstado },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "actualizacion",
          nuevoEstado ? "Producto reactivado" : "Producto desactivado",
        ),
      },
    });

    logAccionUsuario(
      usuarioId,
      nuevoEstado ? "REACTIVAR_PRODUCTO" : "DESACTIVAR_PRODUCTO",
      { productoActualizado: id, activo: nuevoEstado },
    );

    return actualizado;
  }

  async eliminarProductoFisico(id, usuarioId) {
    const producto = await ProductoRepository.findById(id);
    if (!producto) throw new ErrorApi(404, "Producto no encontrado");

    await ProductoRepository.deleteById(id);
    logAccionUsuario(usuarioId, "ELIMINAR_PRODUCTO_FISICO", {
      productoEliminado: id,
    });
  }
}

export default new ProductoService();
