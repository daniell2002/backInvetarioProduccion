import { createRequire } from "module";
import UnidadMedidaRepository from "../repositories/UnidadMedidaRepository.js";
import ErrorApi from "../utils/ErrorApi.js";

const require = createRequire(import.meta.url);
const { unitMeasures } = require("../utils/unidadesMedidas.json");

class UnidadMedidaService {
  /**
   * Sincroniza las unidades de medida del archivo estático con la base de datos.
   * Inserta las nuevas y actualiza las existentes (upsert por codigo).
   * No elimina registros existentes.
   */
  async sincronizarDesdeArchivo() {
    if (!Array.isArray(unitMeasures) || unitMeasures.length === 0) {
      throw new ErrorApi("El archivo de unidades de medida está vacío", 500);
    }

    const unidades = unitMeasures.map((u) => ({
      codigo: String(u.code).trim(),
      nombre: String(u.name).trim(),
    }));

    const resultado = await UnidadMedidaRepository.upsertMuchas(unidades);

    return {
      totalArchivo: unidades.length,
      insertadas: resultado.upsertedCount,
      actualizadas: resultado.modifiedCount,
      sinCambios: resultado.matchedCount - resultado.modifiedCount,
    };
  }

  async obtenerUnidades() {
    return await UnidadMedidaRepository.findAll(
      { activo: true },
      { sort: { nombre: 1 } },
    );
  }

  async obtenerPorId(id) {
    const unidad = await UnidadMedidaRepository.findById(id);
    if (!unidad) throw new ErrorApi("Unidad de medida no encontrada", 404);
    return unidad;
  }
}

export default new UnidadMedidaService();
