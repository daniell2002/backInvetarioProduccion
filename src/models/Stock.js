import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    sedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sede",
      required: true,
    },
    cantidadDisponible: {
      type: Number,
      default: 0,
      min: 0,
    },
    cantidadReservada: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockMinimo: {
      type: Number,
      default: 0,
      min: 0,
    },
    ultimaActualizacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

stockSchema.index({ productoId: 1, sedeId: 1 }, { unique: true });

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
