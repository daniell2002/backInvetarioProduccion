import BaseRepository from "./BaseRepository.js";
import Rol from "../models/Rol.js";

class RolRepository extends BaseRepository {
  constructor() {
    super(Rol);
  }

  async findByNombre(nombre) {
    return await this.model.findOne({ nombre, activo: true });
  }

  async findAllActivos() {
    return await this.model.find({ activo: true }).sort({ nombre: 1 });
  }
}

export default new RolRepository();
