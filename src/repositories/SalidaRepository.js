import BaseRepository from "./BaseRepository.js";
import Salida from "../models/Salida.js";

class SalidaRepository extends BaseRepository {
  constructor() {
    super(Salida);
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate("sedeId", "nombre codigo")
        .populate("clienteId", "razonSocial")
        .populate("creadoPor", "nombre")
        .populate("items.productoId", "nombre codigoInterno")
        .sort({ createdAt: -1 })
        .skip(saltar)
        .limit(limite),
      this.model.countDocuments(consulta),
    ]);

    return {
      datos,
      paginacion: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite),
        tieneAnterior: pagina > 1,
        tieneSiguiente: pagina < Math.ceil(total / limite),
      },
    };
  }

  construirFiltros(filtros) {
    const consulta = {};
    if (filtros.sedeId) consulta.sedeId = filtros.sedeId;
    if (filtros.tipo) consulta.tipo = filtros.tipo;
    if (filtros.estado) consulta.estado = filtros.estado;
    if (filtros.clienteId) consulta.clienteId = filtros.clienteId;
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

export default new SalidaRepository();
