import mongoose from "mongoose";

const unidadMedidaSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

unidadMedidaSchema.index({ codigo: 1 }, { unique: true });
unidadMedidaSchema.index({ nombre: 1 });

const UnidadMedida = mongoose.model("UnidadMedida", unidadMedidaSchema);
export default UnidadMedida;
