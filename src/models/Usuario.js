import mongoose from "mongoose";
import { trazabilidadSchema } from "../utils/trazabilidad.util.js";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es requerido"],
      trim: true,
      maxlength: [150, "El nombre no puede exceder 150 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [200, "El email no puede exceder 200 caracteres"],
    },
    passwordHash: {
      type: String,
      required: [true, "La contraseña es requerida"],
    },
    rolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rol",
      default: null,
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      default: null,
    },
    esAdmin: {
      type: Boolean,
      default: false,
    },
    debeCambiarContrasena: {
      type: Boolean,
      default: true,
    },
    tokenRecuperacion: {
      type: String,
      default: null,
    },
    expiracionTokenRecuperacion: {
      type: Date,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

usuarioSchema.index({ email: 1 });
usuarioSchema.index({ rolId: 1 });
usuarioSchema.index({ sedeId: 1 });

export default mongoose.model("Usuario", usuarioSchema);
