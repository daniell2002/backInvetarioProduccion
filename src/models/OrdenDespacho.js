import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const itemDespachoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: { type: Number, required: true, min: 1 },
    observacion: { type: String, trim: true, maxlength: 200 },
  },
  { _id: true },
);

const ordenDespachoSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, trim: true, uppercase: true },
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
    items: [itemDespachoSchema],
    estado: {
      type: String,
      enum: [
        "pendiente",
        "en_preparacion",
        "despachada",
        "entregada",
        "anulada",
      ],
      default: "pendiente",
    },
    direccionEntrega: { type: String, trim: true, maxlength: 300 },
    observaciones: { type: String, trim: true, maxlength: 500 },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    fechaDespacho: { type: Date, default: null },
    fechaEntrega: { type: Date, default: null },
    trazabilidad: {
      type: [trazabilidadSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

ordenDespachoSchema.index({ sedeId: 1, estado: 1 });

const OrdenDespacho = mongoose.model("OrdenDespacho", ordenDespachoSchema);
export default OrdenDespacho;
