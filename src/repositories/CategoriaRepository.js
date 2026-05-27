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

  /**
   * Busca una subcategoría por nombre dentro de una categoría.
   * Si no existe, la agrega. Retorna el documento de subcategoría.
   */
  async agregarSubcategoriaObtener(categoriaId, nombreSubcat) {
    // Intentar agregar solo si no existe (filter $ne evita duplicados)
    const catActualizada = await this.model.findOneAndUpdate(
      { _id: categoriaId, "subcategorias.nombre": { $ne: nombreSubcat } },
      { $push: { subcategorias: { nombre: nombreSubcat, activo: true } } },
      { new: true },
    );

    if (catActualizada) {
      return (
        catActualizada.subcategorias.find((s) => s.nombre === nombreSubcat) ??
        null
      );
    }

    // Ya existía — solo buscar
    const cat = await this.model.findById(categoriaId);
    return cat?.subcategorias.find((s) => s.nombre === nombreSubcat) ?? null;
  }
}

export default new CategoriaRepository();
