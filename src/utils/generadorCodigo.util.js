import mongoose from "mongoose";

/**
 * Genera códigos automáticos incrementales por prefijo.
 * Ejemplo: PRD-00001, ENT-00001, SAL-00001
 *
 * @param {string} prefijo - Prefijo del código (ej: 'PRD', 'ENT', 'SAL')
 * @param {mongoose.Model} modelo - Modelo Mongoose donde buscar el último código
 * @param {string} campoCodigo - Nombre del campo que contiene el código (default: 'codigoInterno')
 * @returns {Promise<string>} Código generado
 */
export const generarCodigo = async (
  prefijo,
  modelo,
  campoCodigo = "codigoInterno",
) => {
  const ultimo = await modelo
    .findOne({ [campoCodigo]: { $regex: `^${prefijo}-` } })
    .sort({ [campoCodigo]: -1 })
    .select(campoCodigo)
    .lean();

  let siguiente = 1;

  if (ultimo && ultimo[campoCodigo]) {
    const partes = ultimo[campoCodigo].split("-");
    const numero = parseInt(partes[partes.length - 1], 10);
    if (!isNaN(numero)) {
      siguiente = numero + 1;
    }
  }

  return `${prefijo}-${String(siguiente).padStart(5, "0")}`;
};
