import BaseRepository from "./BaseRepository.js";
import Grupo from "../models/Grupo.js";

class GrupoRepository extends BaseRepository {
  constructor() {
    super(Grupo);
  }

  async findByNombre(nombre) {
    return this.model.findOne({ nombre, activo: true });
  }

  async findAllActivos() {
    return this.model.find({ activo: true }).sort({ nombre: 1 });
  }
}

export default new GrupoRepository();
