import mongoose from "mongoose";
import { MODULOS, ACCIONES } from "../utils/permisos.util.js";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const permisoSchema = new mongoose.Schema(
  {
    modulo: {
      type: String,
      required: [true, "El módulo es requerido"],
      enum: Object.values(MODULOS),
    },
    accion: {
      type: String,
      required: [true, "La acción es requerida"],
      enum: Object.values(ACCIONES),
    },
  },
  { _id: false },
);

const rolSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del rol es requerido"],
      trim: true,
      unique: true,
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [300, "La descripción no puede exceder 300 caracteres"],
    },
    permisos: {
      type: [permisoSchema],
      default: [],
    },
    esPredeterminado: {
      type: Boolean,
      default: false,
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
  { timestamps: true, versionKey: false },
);

export default mongoose.model("Rol", rolSchema);
