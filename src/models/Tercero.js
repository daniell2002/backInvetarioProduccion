import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const terceroSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: ["proveedor", "cliente", "ambos"],
      default: "proveedor",
    },
    tipoDocumento: {
      type: String,
      enum: ["NIT", "CC", "CE", "PASAPORTE", "OTRO"],
      default: "NIT",
    },
    numeroDocumento: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    razonSocial: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    nombreContacto: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    direccion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    ciudad: {
      type: String,
      trim: true,
      maxlength: 100,
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

terceroSchema.index({ razonSocial: 1 });
terceroSchema.index({ tipo: 1 });

const Tercero = mongoose.model("Tercero", terceroSchema);
export default Tercero;
