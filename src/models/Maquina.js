import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const maquinaSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true, trim: true, uppercase: true },
    nombre: { type: String, required: true, trim: true, maxlength: 150 },
    marca: { type: String, trim: true, maxlength: 100 },
    modelo: { type: String, trim: true, maxlength: 100 },
    serie: { type: String, trim: true, maxlength: 100 },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    estado: {
      type: String,
      enum: ["operativa", "mantenimiento", "fuera_servicio", "baja"],
      default: "operativa",
    },
    ubicacion: { type: String, trim: true, maxlength: 100 },
    observaciones: { type: String, trim: true, maxlength: 500 },
    activo: { type: Boolean, default: true },
    trazabilidad: {
      type: [trazabilidadSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

maquinaSchema.index({ sedeId: 1 });

const Maquina = mongoose.model("Maquina", maquinaSchema);
export default Maquina;
