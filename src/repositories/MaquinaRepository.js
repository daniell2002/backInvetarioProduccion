import BaseRepository from "./BaseRepository.js";
import Maquina from "../models/Maquina.js";

class MaquinaRepository extends BaseRepository {
  constructor() {
    super(Maquina);
  }

  async findAllPaginado(pagina, limite, filtros = {}) {
    const consulta = { activo: true };
    if (filtros.sedeId) consulta.sedeId = filtros.sedeId;
    if (filtros.estado) consulta.estado = filtros.estado;
    if (filtros.nombre)
      consulta.nombre = { $regex: filtros.nombre, $options: "i" };

    const saltar = (pagina - 1) * limite;
    const [datos, total] = await Promise.all([
      this.model
        .find(consulta)
        .populate("sedeId", "nombre codigo")
        .sort({ nombre: 1 })
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
}

export default new MaquinaRepository();
