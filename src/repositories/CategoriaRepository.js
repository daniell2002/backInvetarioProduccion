import BaseRepository from "./BaseRepository.js";
import Categoria from "../models/Categoria.js";

class CategoriaRepository extends BaseRepository {
  constructor() {
    super(Categoria);
  }

  async findByNombre(nombre) {
    return this.model.findOne({ nombre, activo: true });
  }

  async findAllActivas() {
    return this.model.find({ activo: true }).sort({ nombre: 1 });
  }
}

export default new CategoriaRepository();
