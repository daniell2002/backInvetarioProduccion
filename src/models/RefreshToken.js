import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El usuarioId es requerido"],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, "El tokenHash es requerido"],
    },
    expiraEn: {
      type: Date,
      required: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

refreshTokenSchema.index({ tokenHash: 1 });
refreshTokenSchema.index({ expiraEn: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
