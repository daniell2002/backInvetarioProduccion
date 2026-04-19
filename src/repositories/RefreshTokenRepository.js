import BaseRepository from "./BaseRepository.js";
import RefreshToken from "../models/RefreshToken.js";

class RefreshTokenRepository extends BaseRepository {
  constructor() {
    super(RefreshToken);
  }

  async findByTokenHash(tokenHash) {
    return await this.model.findOne({ tokenHash, activo: true });
  }

  async revocarPorUsuario(usuarioId, opciones = {}) {
    return await this.model.updateMany(
      { usuarioId, activo: true },
      { $set: { activo: false } },
      opciones,
    );
  }

  async revocarPorTokenHash(tokenHash, opciones = {}) {
    return await this.model.updateOne(
      { tokenHash, activo: true },
      { $set: { activo: false } },
      opciones,
    );
  }
}

export default new RefreshTokenRepository();
