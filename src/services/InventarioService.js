import StockRepository from "../repositories/StockRepository.js";

class InventarioService {
  async obtenerStockPorSede(sedeId, filtros = {}) {
    return await StockRepository.obtenerStockPorSede(sedeId, filtros);
  }

  async obtenerStockGlobal(filtros = {}) {
    return await StockRepository.obtenerStockGlobal(filtros);
  }

  async obtenerStockProducto(productoId) {
    return await StockRepository.findAll({ productoId });
  }
}

export default new InventarioService();
