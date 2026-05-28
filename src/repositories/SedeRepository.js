import BaseRepository from "./BaseRepository.js";
import Sede from "../models/Sede.js";

class SedeRepository extends BaseRepository {
  constructor() {
    super(Sede);
  }

  async findByNombre(nombre) {
    return this.model.findOne({ nombre, activo: true });
  }

  async findByCodigo(codigo) {
    return this.model.findOne({ codigo, activo: true });
  }

  async findAllActivas() {
    return this.model.find({ activo: true }).sort({ nombre: 1 });
  }

  async findAll(filtro = {}) {
    return this.model.find(filtro).sort({ nombre: 1 });
  }

  async findByIdConResponsable(id) {
    return this.model.findById(id).populate("responsableId", "nombre email");
  }
}

export default new SedeRepository();
