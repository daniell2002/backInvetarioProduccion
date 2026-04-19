import mongoose from "mongoose";

/**
 * Schema de trazabilidad — se embebe como array en todos los modelos del dominio.
 * Cada acción sobre el documento agrega una entrada al array.
 */
export const trazabilidadSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    accion: {
      type: String,
      required: true,
      enum: [
        "creacion",
        "actualizacion",
        "cambio_estado",
        "eliminacion",
        "anulacion",
        "aprobacion",
        "rechazo",
      ],
    },
    descripcion: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

/**
 * Crea una entrada de trazabilidad lista para push.
 * @param {string} usuarioId - ID del usuario que realiza la acción
 * @param {string} accion - Tipo de acción (creacion, actualizacion, cambio_estado, etc.)
 * @param {string} descripcion - Descripción legible de lo que pasó
 * @returns {object} Objeto de trazabilidad
 */
export function crearTrazabilidad(usuarioId, accion, descripcion) {
  return {
    usuario: usuarioId,
    accion,
    descripcion,
    fecha: new Date(),
  };
}
