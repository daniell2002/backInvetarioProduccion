import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const subcategoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 100 },
    descripcion: { type: String, trim: true, maxlength: 200 },
    activo: { type: Boolean, default: true },
  },
  { _id: true, timestamps: false },
);

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      unique: true,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    subcategorias: [subcategoriaSchema],
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

const Categoria = mongoose.model("Categoria", categoriaSchema);
export default Categoria;
