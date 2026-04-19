import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

/**
 * Material necesario dentro de una ficha de producción (receta).
 * Cada material define un producto y la cantidad requerida
 * para producir la cantidadResultante del producto final.
 */
const materialFichaSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0.001,
    },
    unidadMedida: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    presentacionId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: true },
);

/**
 * Ficha de Producción — Receta / BOM (Bill of Materials).
 *
 * Define qué materiales y en qué cantidades se necesitan
 * para producir una cantidad determinada de un producto final.
 *
 * Flujo: pendiente → aprobada | obsoleta
 * - Solo fichas aprobadas pueden usarse en producciones.
 */
const fichaProduccionSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    productoFinalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidadResultante: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unidadMedidaResultante: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    materiales: {
      type: [materialFichaSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "La ficha debe tener al menos un material",
      },
    },
    estado: {
      type: String,
      enum: ["pendiente", "aprobada", "obsoleta"],
      default: "pendiente",
    },
    aprobadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
    fechaAprobacion: {
      type: Date,
      default: null,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    trazabilidad: {
      type: [trazabilidadSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

fichaProduccionSchema.index({ productoFinalId: 1 });
fichaProduccionSchema.index({ estado: 1 });
fichaProduccionSchema.index({ codigo: 1 });

const FichaProduccion = mongoose.model(
  "FichaProduccion",
  fichaProduccionSchema,
);
export default FichaProduccion;
