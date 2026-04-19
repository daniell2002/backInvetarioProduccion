import BaseRepository from "./BaseRepository.js";
import Produccion from "../models/Produccion.js";

class ProduccionRepository extends BaseRepository {
  constructor() {
    super(Produccion);
  }

  async findAllActivas(filtros = {}) {
    const consulta = { activo: true, ...filtros };
    return this.model
      .find(consulta)
      .populate("fichaProduccionId", "codigo nombre productoFinalId")
      .populate("sedeId", "nombre codigo")
      .populate("creadoPor", "nombre")
      .sort({ createdAt: -1 });
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate({
          path: "fichaProduccionId",
          select: "codigo nombre productoFinalId",
          populate: { path: "productoFinalId", select: "nombre codigoInterno" },
        })
        .populate("sedeId", "nombre codigo")
        .populate("creadoPor", "nombre")
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
      .populate({
        path: "fichaProduccionId",
        populate: [
          {
            path: "productoFinalId",
            select: "nombre codigoInterno presentaciones",
          },
          {
            path: "materiales.productoId",
            select: "nombre codigoInterno presentaciones",
          },
        ],
      })
      .populate("sedeId", "nombre codigo")
      .populate("materiales.productoId", "nombre codigoInterno presentaciones")
      .populate("materiales.lotes.proveedorId", "razonSocial")
      .populate("creadoPor", "nombre")
      .populate("salidaId", "codigo")
      .populate("entradaId", "codigo");
  }

  construirFiltros(filtros) {
    const consulta = { activo: true };
    if (filtros.estado) consulta.estado = filtros.estado;
    if (filtros.sedeId) consulta.sedeId = filtros.sedeId;
    if (filtros.fichaProduccionId)
      consulta.fichaProduccionId = filtros.fichaProduccionId;
    if (filtros.codigo) {
      consulta.codigo = { $regex: filtros.codigo, $options: "i" };
    }
    if (filtros.fechaDesde || filtros.fechaHasta) {
      consulta.createdAt = {};
      if (filtros.fechaDesde)
        consulta.createdAt.$gte = new Date(filtros.fechaDesde);
      if (filtros.fechaHasta)
        consulta.createdAt.$lte = new Date(filtros.fechaHasta);
    }
    return consulta;
  }
}

export default new ProduccionRepository();
