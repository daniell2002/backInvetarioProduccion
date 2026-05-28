import BaseRepository from "./BaseRepository.js";
import UnidadMedida from "../models/UnidadMedida.js";

class UnidadMedidaRepository extends BaseRepository {
  constructor() {
    super(UnidadMedida);
  }

  async findByCodigo(codigo) {
    return await this.model.findOne({ codigo });
  }

  async upsertMuchas(unidades) {
    const operaciones = unidades.map((u) => ({
      updateOne: {
        filter: { codigo: u.codigo },
        update: { $set: { nombre: u.nombre } },
        upsert: true,
      },
    }));
    return await this.model.bulkWrite(operaciones, { ordered: false });
  }
}

export default new UnidadMedidaRepository();
