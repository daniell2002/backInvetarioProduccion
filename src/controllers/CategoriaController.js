import CategoriaService from "../services/CategoriaService.js";
import RespuestaApi from "../utils/RespuestaApi.js";

class CategoriaController {
  async crear(request, reply) {
    const categoria = await CategoriaService.crearCategoria(
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Categoría creada", { categoria }, 201);
  }

  async listar(request, reply) {
    const categorias = await CategoriaService.obtenerCategorias();
    return RespuestaApi.exito(reply, "Categorías obtenidas", { categorias });
  }

  async listarPaginado(request, reply) {
    const { pagina = 1, limite = 50, nombre, descripcion, subcategoriaNombre, busqueda } = request.query;

    const filtros = {};
    if (nombre) filtros.nombre = nombre;
    if (descripcion) filtros.descripcion = descripcion;
    if (subcategoriaNombre) filtros.subcategoriaNombre = subcategoriaNombre;
    if (busqueda) filtros.busqueda = busqueda;

    const resultado = await CategoriaService.obtenerCategoriasPaginado(
      Number(pagina),
      Number(limite),
      filtros,
    );

    return RespuestaApi.exito(reply, "Categorías obtenidas", {
      categorias: resultado.documentos,
      paginacion: resultado.paginacion,
    });
  }

  async obtenerPorId(request, reply) {
    const categoria = await CategoriaService.obtenerCategoriaPorId(
      request.params.id,
    );
    return RespuestaApi.exito(reply, "Categoría obtenida", { categoria });
  }

  async actualizar(request, reply) {
    const categoria = await CategoriaService.actualizarCategoria(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Categoría actualizada", { categoria });
  }

  async eliminar(request, reply) {
    await CategoriaService.eliminarCategoria(
      request.params.id,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Categoría eliminada");
  }

  // ─── Subcategorías ──────────────────────────────────────
  async agregarSubcategoria(request, reply) {
    const categoria = await CategoriaService.agregarSubcategoria(
      request.params.id,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(
      reply,
      "Subcategoría agregada",
      { categoria },
      201,
    );
  }

  async actualizarSubcategoria(request, reply) {
    const categoria = await CategoriaService.actualizarSubcategoria(
      request.params.id,
      request.params.subId,
      request.body,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Subcategoría actualizada", { categoria });
  }

  async eliminarSubcategoria(request, reply) {
    await CategoriaService.eliminarSubcategoria(
      request.params.id,
      request.params.subId,
      request.usuarioId,
    );
    return RespuestaApi.exito(reply, "Subcategoría eliminada");
  }
}

export default new CategoriaController();
