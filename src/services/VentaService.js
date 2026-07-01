import SalidaService from "./SalidaService.js";
import SalidaRepository from "../repositories/SalidaRepository.js";
import ErrorApi from "../utils/ErrorApi.js";

const formatearVenta = (salida) => {
  const obj = salida.toObject ? salida.toObject() : salida;
  return { ...obj, vendedorId: obj.creadoPor };
};

class VentaService {
  async crearVenta(datos, usuarioId) {
    const salida = await SalidaService.crearSalida(
      { ...datos, tipo: "venta" },
      usuarioId,
    );
    return formatearVenta(salida);
  }

  async obtenerVentasPaginado(pagina, limite, filtros = {}) {
    const consulta = SalidaRepository.construirFiltros({
      ...filtros,
      tipo: "venta",
    });
    const saltar = (pagina - 1) * limite;

    const [ventas, total] = await Promise.all([
      SalidaRepository.model
        .find(consulta)
        .populate("sedeId", "nombre codigo")
        .populate("creadoPor", "nombre")
        .populate("items.productoId", "nombre codigoInterno codigoExterno")
        .sort({ createdAt: -1 })
        .skip(saltar)
        .limit(limite),
      SalidaRepository.model.countDocuments(consulta),
    ]);

    return {
      ventas: ventas.map(formatearVenta),
      paginacion: {
        pagina: Number(pagina),
        limite: Number(limite),
        total,
        totalPaginas: Math.ceil(total / limite),
        hayPaginaSiguiente: pagina * limite < total,
        hayPaginaAnterior: pagina > 1,
      },
    };
  }

  async obtenerVentaPorId(id) {
    const venta = await SalidaRepository.model
      .findOne({ _id: id, tipo: "venta" })
      .populate("sedeId", "nombre codigo")
      .populate("creadoPor", "nombre")
      .populate("items.productoId", "nombre codigoInterno codigoExterno");
    if (!venta) throw new ErrorApi(404, "Venta no encontrada");
    return formatearVenta(venta);
  }

  async anularVenta(id, usuarioId) {
    const salida = await SalidaRepository.findById(id);
    if (!salida || salida.tipo !== "venta") {
      throw new ErrorApi(404, "Venta no encontrada");
    }
    const anulada = await SalidaService.anularSalida(id, usuarioId);
    return formatearVenta(anulada);
  }
}

export default new VentaService();
