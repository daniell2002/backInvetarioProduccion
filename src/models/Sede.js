import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const sedeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    codigo: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
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
    telefono: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    responsableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
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

sedeSchema.index({ nombre: 1 });

const Sede = mongoose.model("Sede", sedeSchema);
export default Sede;
