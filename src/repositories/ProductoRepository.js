import BaseRepository from "./BaseRepository.js";
import Producto from "../models/Producto.js";

class ProductoRepository extends BaseRepository {
  constructor() {
    super(Producto);
  }

  async findByCodigoInterno(codigo) {
    return this.model.findOne({ codigoInterno: codigo, activo: true });
  }

  async findByCodigoExterno(codigo) {
    return this.model.findOne({ codigoExterno: codigo, activo: true });
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = this.construirFiltros(filtros);
    const saltar = (pagina - 1) * limite;

    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate("categoriaId", "nombre")
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
    const consulta = { activo: true };
    if (filtros.nombre)
      consulta.nombre = { $regex: filtros.nombre, $options: "i" };
    if (filtros.categoriaId) consulta.categoriaId = filtros.categoriaId;
    if (filtros.subcategoriaId)
      consulta.subcategoriaId = filtros.subcategoriaId;
    if (filtros.codigoInterno)
      consulta.codigoInterno = { $regex: filtros.codigoInterno, $options: "i" };
    if (filtros.codigoExterno)
      consulta.codigoExterno = { $regex: filtros.codigoExterno, $options: "i" };
    return consulta;
  }
}

export default new ProductoRepository();
