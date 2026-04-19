import ProductoService from "../services/ProductoService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class ProductoController {
  async crear(request, reply) {
    const producto = await ProductoService.crearProducto(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producto creado", { producto }, 201);
  }

  async listar(request, reply) {
    const productos = await ProductoService.obtenerProductos();
    return RespuestaApi.exito(reply, "Productos obtenidos", { productos });
  }

  async listarPaginado(request, reply) {
    const {
      pagina = 1,
      limite = 20,
      nombre,
      categoriaId,
      subcategoriaId,
      codigoInterno,
      codigoExterno,
    } = request.query;
    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (categoriaId) filtros.categoriaId = categoriaId;
    if (subcategoriaId) filtros.subcategoriaId = subcategoriaId;
    if (codigoInterno) filtros.codigoInterno = codigoInterno;
    if (codigoExterno) filtros.codigoExterno = codigoExterno;

    const resultado = await ProductoService.obtenerProductosPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );
    return RespuestaApi.exito(reply, "Productos obtenidos", {
      productos: resultado.documentos || [],
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const producto = await ProductoService.obtenerProductoPorId(
      request.params.id,
    );
    return RespuestaApi.exito(reply, "Producto obtenido", { producto });
  }

  async actualizar(request, reply) {
    const producto = await ProductoService.actualizarProducto(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producto actualizado", { producto });
  }

  async eliminar(request, reply) {
    await ProductoService.eliminarProducto(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Producto eliminado");
  }
}

export default new ProductoController();
