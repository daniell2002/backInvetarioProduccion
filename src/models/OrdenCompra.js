import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const itemOrdenCompraSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidadSolicitada: { type: Number, required: true, min: 1 },
    cantidadRecibida: { type: Number, default: 0, min: 0 },
    costoUnitario: { type: Number, default: 0, min: 0 },
    observacion: { type: String, trim: true, maxlength: 200 },
  },
  { _id: true },
);

const ordenCompraSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, trim: true, uppercase: true },
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tercero",
      required: true,
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    items: [itemOrdenCompraSchema],
    estado: {
      type: String,
      enum: [
        "borrador",
        "enviada",
        "recibida_parcial",
        "recibida_total",
        "anulada",
      ],
      default: "borrador",
    },
    observaciones: { type: String, trim: true, maxlength: 500 },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    fechaEnvio: { type: Date, default: null },
    fechaRecepcion: { type: Date, default: null },
    trazabilidad: {
      type: [trazabilidadSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

ordenCompraSchema.index({ proveedorId: 1, estado: 1 });
ordenCompraSchema.index({ sedeId: 1 });

const OrdenCompra = mongoose.model("OrdenCompra", ordenCompraSchema);
export default OrdenCompra;
