import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const itemTrasladoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidadSolicitada: {
      type: Number,
      required: true,
      min: 1,
    },
    cantidadAprobada: {
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

const trasladoSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    sedeOrigenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    sedeDestinoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    items: [itemTrasladoSchema],
    estado: {
      type: String,
      enum: [
        "pendiente",
        "aprobado",
        "aprobado_parcial",
        "rechazado",
        "en_transito",
        "recibido",
        "anulado",
      ],
      default: "pendiente",
    },
    observaciones: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    solicitadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
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
    fechaRecepcion: {
      type: Date,
      default: null,
    },
    recibidoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
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

trasladoSchema.index({ sedeOrigenId: 1, estado: 1 });
trasladoSchema.index({ sedeDestinoId: 1, estado: 1 });

const Traslado = mongoose.model("Traslado", trasladoSchema);
export default Traslado;
