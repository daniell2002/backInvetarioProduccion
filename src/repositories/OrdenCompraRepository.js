import BaseRepository from "./BaseRepository.js";
import OrdenCompra from "../models/OrdenCompra.js";

class OrdenCompraRepository extends BaseRepository {
  constructor() {
    super(OrdenCompra);
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate("proveedorId", "razonSocial")
        .populate("sedeId", "nombre codigo")
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
    if (filtros.proveedorId) consulta.proveedorId = filtros.proveedorId;
    if (filtros.sedeId) consulta.sedeId = filtros.sedeId;
    if (filtros.estado) consulta.estado = filtros.estado;
    return consulta;
  }
}

export default new OrdenCompraRepository();
