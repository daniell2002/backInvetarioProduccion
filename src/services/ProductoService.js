import ProductoRepository from "../repositories/ProductoRepository.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
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

  async obtenerProductos(filtros = {}) {
    return await ProductoRepository.findAll({ ...filtros, activo: true });
  }

  async obtenerProductosPaginado(pagina, limite, filtros = {}) {
    return await ProductoRepository.findPaginado(
      { ...filtros, activo: true },
      pagina,
      limite,
    );
  }

  async obtenerProductoPorId(id) {
    const producto = await ProductoRepository.findById(id);
    if (!producto || !producto.activo)
      throw new ErrorApi(404, "Producto no encontrado");
    return producto;
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
}

export default new ProductoService();
