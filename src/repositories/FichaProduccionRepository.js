import BaseRepository from "./BaseRepository.js";
import FichaProduccion from "../models/FichaProduccion.js";

class FichaProduccionRepository extends BaseRepository {
  constructor() {
    super(FichaProduccion);
  }

  async findAllActivas(filtros = {}) {
    const consulta = { activo: true, ...filtros };
    return this.model
      .find(consulta)
      .populate("productoFinalId", "nombre codigoInterno presentaciones")
      .populate("materiales.productoId", "nombre codigoInterno presentaciones")
      .populate("creadoPor", "nombre")
      .populate("aprobadoPor", "nombre")
      .sort({ createdAt: -1 });
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate("productoFinalId", "nombre codigoInterno")
        .populate("creadoPor", "nombre")
        .populate("aprobadoPor", "nombre")
        .sort({ createdAt: -1 })
        .skip(saltar)
        .limit(limite),
      this.model.countDocuments(consulta),
    ]);

    return {
      datos,
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        totalPaginas: Math.ceil(total / limite),
        hayPaginaSiguiente: pagina * limite < total,
        hayPaginaAnterior: pagina > 1,
      },
    };
  }

  async findByIdConDetalles(id) {
    return this.model
      .findById(id)
      .populate(
        "productoFinalId",
        "nombre codigoInterno presentaciones categoriaId",
      )
      .populate(
        "materiales.productoId",
        "nombre codigoInterno presentaciones categoriaId",
      )
      .populate("creadoPor", "nombre")
      .populate("aprobadoPor", "nombre");
  }

  async findAprobadasPorProducto(productoFinalId) {
    return this.model
      .find({ productoFinalId, estado: "aprobada", activo: true })
      .populate("productoFinalId", "nombre codigoInterno")
      .populate("materiales.productoId", "nombre codigoInterno presentaciones")
      .sort({ createdAt: -1 });
  }

  construirFiltros(filtros) {
    const consulta = { activo: true };
    if (filtros.estado) consulta.estado = filtros.estado;
    if (filtros.productoFinalId)
      consulta.productoFinalId = filtros.productoFinalId;
    if (filtros.nombre) {
      consulta.nombre = { $regex: filtros.nombre, $options: "i" };
    }
    if (filtros.codigo) {
      consulta.codigo = { $regex: filtros.codigo, $options: "i" };
    }
    return consulta;
  }
}

export default new FichaProduccionRepository();
