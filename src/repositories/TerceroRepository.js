import BaseRepository from "./BaseRepository.js";
import Tercero from "../models/Tercero.js";

class TerceroRepository extends BaseRepository {
  constructor() {
    super(Tercero);
  }

  async findByDocumento(numeroDocumento) {
    return this.model.findOne({ numeroDocumento, activo: true });
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .sort({ razonSocial: 1 })
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
    const consulta = { activo: true };
    if (filtros.tipo) consulta.tipo = filtros.tipo;
    if (filtros.razonSocial)
      consulta.razonSocial = { $regex: filtros.razonSocial, $options: "i" };
    if (filtros.numeroDocumento)
      consulta.numeroDocumento = {
        $regex: filtros.numeroDocumento,
        $options: "i",
      };
    return consulta;
  }
}

export default new TerceroRepository();
