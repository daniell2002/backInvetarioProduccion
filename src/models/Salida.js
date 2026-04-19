import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const itemSalidaSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: true },
);

const salidaSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    tipo: {
      type: String,
      required: true,
      enum: [
        "venta",
        "produccion",
        "merma",
        "traslado",
        "ajuste",
        "devolucion_proveedor",
      ],
      default: "venta",
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tercero",
      default: null,
    },
    trasladoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traslado",
      default: null,
    },
    items: [itemSalidaSchema],
    observaciones: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "aplicada", "anulada"],
      default: "aplicada",
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

salidaSchema.index({ sedeId: 1, createdAt: -1 });
salidaSchema.index({ tipo: 1 });

const Salida = mongoose.model("Salida", salidaSchema);
export default Salida;
