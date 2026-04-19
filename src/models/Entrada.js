import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const itemEntradaSchema = new mongoose.Schema(
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
    costoUnitario: {
      type: Number,
      default: 0,
      min: 0,
    },
    observacion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  { _id: true },
);

const entradaSchema = new mongoose.Schema(
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
      enum: ["compra", "traslado", "ajuste", "devolucion", "produccion"],
      default: "compra",
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tercero",
      default: null,
    },
    ordenCompraId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrdenCompra",
      default: null,
    },
    trasladoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traslado",
      default: null,
    },
    items: [itemEntradaSchema],
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

entradaSchema.index({ sedeId: 1, createdAt: -1 });
entradaSchema.index({ tipo: 1 });

const Entrada = mongoose.model("Entrada", entradaSchema);
export default Entrada;
