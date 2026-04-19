import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

/**
 * Lote de consumo — registra de dónde vino cada porción de material
 * (entrada, proveedor, costo), para calcular costo real de producción
 * cuando hay mezcla de precios.
 */
const loteConsumoSchema = new mongoose.Schema(
  {
    entradaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrada",
      default: null,
    },
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tercero",
      default: null,
    },
    costoUnitario: {
      type: Number,
      required: true,
      min: 0,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true },
);

/**
 * Material consumido en una producción.
 * cantidadRequerida = lo que dice la ficha × cantidadPlanificada.
 * cantidadUtilizada = lo que realmente se usó.
 * unidadesStockConsumidas = unidades enteras descontadas del inventario.
 * equivalenteRestante = contenido sobrante de unidad parcial.
 */
const materialProduccionSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidadRequerida: {
      type: Number,
      required: true,
      min: 0,
    },
    cantidadUtilizada: {
      type: Number,
      default: 0,
      min: 0,
    },
    unidadMedida: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    unidadesStockConsumidas: {
      type: Number,
      default: 0,
      min: 0,
    },
    equivalenteRestante: {
      type: Number,
      default: 0,
      min: 0,
    },
    costoTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    lotes: [loteConsumoSchema],
    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: true },
);

/**
 * Producción — Orden de producción / fabricación.
 *
 * Flujo: borrador → en_proceso → completada | anulada
 *
 * - borrador: calculada pero sin afectar inventario.
 * - en_proceso: producción en curso.
 * - completada: materiales consumidos (salida) + producto final sumado (entrada).
 * - anulada: revertida si ya había afectado inventario.
 */
const produccionSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    fichaProduccionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FichaProduccion",
      required: true,
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    cantidadPlanificada: {
      type: Number,
      required: true,
      min: 1,
    },
    cantidadProducida: {
      type: Number,
      default: 0,
      min: 0,
    },
    materiales: [materialProduccionSchema],
    costoTotalProduccion: {
      type: Number,
      default: 0,
      min: 0,
    },
    costoUnitarioProduccion: {
      type: Number,
      default: 0,
      min: 0,
    },
    estado: {
      type: String,
      enum: ["borrador", "en_proceso", "completada", "anulada"],
      default: "borrador",
    },
    salidaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Salida",
      default: null,
    },
    entradaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrada",
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

produccionSchema.index({ fichaProduccionId: 1 });
produccionSchema.index({ sedeId: 1, createdAt: -1 });
produccionSchema.index({ estado: 1 });

const Produccion = mongoose.model("Produccion", produccionSchema);
export default Produccion;
