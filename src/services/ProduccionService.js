import mongoose from "mongoose";
import ProduccionRepository from "../repositories/ProduccionRepository.js";
import FichaProduccionRepository from "../repositories/FichaProduccionRepository.js";
import StockRepository from "../repositories/StockRepository.js";
import EntradaService from "./EntradaService.js";
import SalidaService from "./SalidaService.js";
import ErrorApi from "../utils/ErrorApi.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { logAccionUsuario } from "../config/logger.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";
import Entrada from "../models/Entrada.js";

class ProduccionService {
  /**
   * Crear orden de producción (borrador).
   * Calcula materiales necesarios según ficha × cantidad.
   */
  async crearProduccion(datos, usuarioId) {
    const ficha = await FichaProduccionRepository.findByIdConDetalles(
      datos.fichaProduccionId,
    );
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    if (ficha.estado !== "aprobada") {
      throw new ErrorApi(
        400,
        "Solo se pueden usar fichas aprobadas para producción",
      );
    }

    const cantidadPlanificada = datos.cantidadPlanificada;
    const factor = cantidadPlanificada / ficha.cantidadResultante;

    // Calcular materiales necesarios
    const materiales = ficha.materiales.map((mat) => ({
      productoId: mat.productoId._id || mat.productoId,
      cantidadRequerida: parseFloat((mat.cantidad * factor).toFixed(4)),
      cantidadUtilizada: 0,
      unidadMedida: mat.unidadMedida,
      unidadesStockConsumidas: 0,
      equivalenteRestante: 0,
      costoTotal: 0,
      lotes: [],
      observacion: mat.observacion || "",
    }));

    const codigo = await generarCodigo(
      "PROD",
      ProduccionRepository.model,
      "codigo",
    );

    const produccion = await ProduccionRepository.create({
      codigo,
      fichaProduccionId: datos.fichaProduccionId,
      sedeId: datos.sedeId,
      cantidadPlanificada,
      cantidadProducida: 0,
      materiales,
      estado: "borrador",
      creadoPor: usuarioId,
      observaciones: datos.observaciones || "",
      trazabilidad: [
        crearTrazabilidad(
          usuarioId,
          "creacion",
          `Producción ${codigo} creada — Ficha: ${ficha.codigo}`,
        ),
      ],
    });

    logAccionUsuario(usuarioId, "CREAR_PRODUCCION", {
      produccionCreada: produccion._id,
      codigo,
      fichaId: datos.fichaProduccionId,
    });

    return produccion;
  }

  async obtenerProducciones(filtros = {}) {
    return await ProduccionRepository.findAllActivas(filtros);
  }

  async obtenerProduccionesPaginado(pagina, limite, filtros = {}) {
    return await ProduccionRepository.findAllPaginado(pagina, limite, filtros);
  }

  async obtenerProduccionPorId(id) {
    const produccion = await ProduccionRepository.findByIdConDetalles(id);
    if (!produccion || !produccion.activo) {
      throw new ErrorApi(404, "Producción no encontrada");
    }
    return produccion;
  }

  /**
   * Iniciar producción — cambia a 'en_proceso'.
   * Valida que haya stock suficiente para todos los materiales.
   */
  async iniciarProduccion(id, usuarioId) {
    const produccion = await ProduccionRepository.findById(id);
    if (!produccion || !produccion.activo) {
      throw new ErrorApi(404, "Producción no encontrada");
    }
    if (produccion.estado !== "borrador") {
      throw new ErrorApi(
        400,
        "Solo se pueden iniciar producciones en borrador",
      );
    }

    // Validar stock disponible
    const erroresStock = [];
    for (const mat of produccion.materiales) {
      const stock = await StockRepository.findByProductoYSede(
        mat.productoId,
        produccion.sedeId,
      );
      const disponible = stock ? stock.cantidadDisponible : 0;

      // Calcular unidades de stock necesarias
      const unidadesNecesarias = await this.calcularUnidadesStock(
        mat.productoId,
        mat.cantidadRequerida,
        mat.unidadMedida,
      );

      if (disponible < unidadesNecesarias) {
        erroresStock.push(
          `Producto ${mat.productoId}: se necesitan ${unidadesNecesarias} unidades, disponible: ${disponible}`,
        );
      }
    }

    if (erroresStock.length > 0) {
      throw new ErrorApi(400, `Stock insuficiente: ${erroresStock.join("; ")}`);
    }

    const iniciada = await ProduccionRepository.updateById(id, {
      $set: { estado: "en_proceso" },
      $push: {
        trazabilidad: crearTrazabilidad(
          usuarioId,
          "cambio_estado",
          "Producción iniciada",
        ),
      },
    });

    logAccionUsuario(usuarioId, "INICIAR_PRODUCCION", {
      produccionIniciada: id,
    });

    return iniciada;
  }

  /**
   * Completar producción.
   * - Genera salida de materiales consumidos (descuenta stock).
   * - Genera entrada del producto fabricado (suma stock).
   * - Calcula costos de producción (promedio ponderado de entradas).
   */
  async completarProduccion(id, datos, usuarioId) {
    const produccion = await ProduccionRepository.findById(id);
    if (!produccion || !produccion.activo) {
      throw new ErrorApi(404, "Producción no encontrada");
    }
    if (produccion.estado !== "en_proceso") {
      throw new ErrorApi(
        400,
        "Solo se pueden completar producciones en proceso",
      );
    }

    const cantidadProducida =
      datos.cantidadProducida || produccion.cantidadPlanificada;

    const sesion = await mongoose.startSession();
    sesion.startTransaction();

    try {
      // ── 1. Calcular consumo real y costos por material ──
      const materialesActualizados = [];
      const itemsSalida = [];
      let costoTotalProduccion = 0;

      for (const mat of produccion.materiales) {
        const cantidadUtilizada =
          datos.materiales?.find(
            (m) => m.productoId.toString() === mat.productoId.toString(),
          )?.cantidadUtilizada || mat.cantidadRequerida;

        // Calcular unidades enteras de stock a consumir
        const infoConsumo = await this.calcularConsumoConEquivalencias(
          mat.productoId,
          cantidadUtilizada,
          mat.unidadMedida,
        );

        // Obtener lotes de costo (promedio ponderado de entradas recientes)
        const lotes = await this.obtenerLotesCosto(
          mat.productoId,
          produccion.sedeId,
          infoConsumo.unidadesStock,
          sesion,
        );

        const costoMaterial = lotes.reduce(
          (sum, l) => sum + l.costoUnitario * l.cantidad,
          0,
        );
        costoTotalProduccion += costoMaterial;

        materialesActualizados.push({
          ...mat.toObject(),
          cantidadUtilizada,
          unidadesStockConsumidas: infoConsumo.unidadesStock,
          equivalenteRestante: infoConsumo.equivalenteRestante,
          costoTotal: costoMaterial,
          lotes,
        });

        itemsSalida.push({
          productoId: mat.productoId,
          cantidad: infoConsumo.unidadesStock,
          observacion: `Producción ${produccion.codigo} — ${cantidadUtilizada} ${mat.unidadMedida}`,
        });
      }

      const costoUnitarioProduccion =
        cantidadProducida > 0 ? costoTotalProduccion / cantidadProducida : 0;

      // ── 2. Crear salida de materiales consumidos ──
      const salida = await SalidaService.crearSalida(
        {
          tipo: "produccion",
          sedeId: produccion.sedeId,
          items: itemsSalida,
          observaciones: `Materiales consumidos por producción ${produccion.codigo}`,
        },
        usuarioId,
        sesion,
      );

      // ── 3. Crear entrada del producto fabricado ──
      const ficha = await FichaProduccionRepository.findById(
        produccion.fichaProduccionId,
      );

      const entrada = await EntradaService.crearEntrada(
        {
          tipo: "produccion",
          sedeId: produccion.sedeId,
          items: [
            {
              productoId: ficha.productoFinalId,
              cantidad: cantidadProducida,
              costoUnitario: parseFloat(costoUnitarioProduccion.toFixed(2)),
              observacion: `Producido con ficha ${ficha.codigo}`,
            },
          ],
          observaciones: `Producto fabricado — Producción ${produccion.codigo}`,
        },
        usuarioId,
        sesion,
      );

      // ── 4. Actualizar producción ──
      const completada = await ProduccionRepository.updateById(
        id,
        {
          $set: {
            estado: "completada",
            cantidadProducida,
            materiales: materialesActualizados,
            costoTotalProduccion: parseFloat(costoTotalProduccion.toFixed(2)),
            costoUnitarioProduccion: parseFloat(
              costoUnitarioProduccion.toFixed(2),
            ),
            salidaId: salida._id,
            entradaId: entrada._id,
          },
          $push: {
            trazabilidad: crearTrazabilidad(
              usuarioId,
              "cambio_estado",
              `Producción completada — ${cantidadProducida} unidades producidas`,
            ),
          },
        },
        { session: sesion },
      );

      await sesion.commitTransaction();

      logAccionUsuario(usuarioId, "COMPLETAR_PRODUCCION", {
        produccionCompletada: id,
        cantidadProducida,
        costoTotal: costoTotalProduccion,
      });

      return completada;
    } catch (error) {
      await sesion.abortTransaction();
      throw error;
    } finally {
      sesion.endSession();
    }
  }

  /**
   * Anular producción.
   * Si ya estaba completada, revierte entrada y salida.
   */
  async anularProduccion(id, usuarioId) {
    const produccion = await ProduccionRepository.findById(id);
    if (!produccion || !produccion.activo) {
      throw new ErrorApi(404, "Producción no encontrada");
    }
    if (produccion.estado === "anulada") {
      throw new ErrorApi(400, "La producción ya está anulada");
    }

    const sesion = await mongoose.startSession();
    sesion.startTransaction();

    try {
      // Si estaba completada, revertir movimientos de stock
      if (produccion.estado === "completada") {
        // Revertir salida (devolver materiales)
        if (produccion.salidaId) {
          const salida = await mongoose
            .model("Salida")
            .findById(produccion.salidaId);
          if (salida && salida.estado !== "anulada") {
            for (const item of salida.items) {
              await StockRepository.incrementarStock(
                item.productoId,
                produccion.sedeId,
                item.cantidad,
                { session: sesion },
              );
            }
            await mongoose.model("Salida").findByIdAndUpdate(
              produccion.salidaId,
              {
                $set: { estado: "anulada" },
                $push: {
                  trazabilidad: crearTrazabilidad(
                    usuarioId,
                    "anulacion",
                    `Anulada por anulación de producción ${produccion.codigo}`,
                  ),
                },
              },
              { session: sesion },
            );
          }
        }

        // Revertir entrada (descontar producto fabricado)
        if (produccion.entradaId) {
          const entrada = await mongoose
            .model("Entrada")
            .findById(produccion.entradaId);
          if (entrada && entrada.estado !== "anulada") {
            for (const item of entrada.items) {
              const resultado = await StockRepository.decrementarStock(
                item.productoId,
                produccion.sedeId,
                item.cantidad,
                { session: sesion },
              );
              if (!resultado) {
                throw new ErrorApi(
                  400,
                  `Stock insuficiente para revertir producto fabricado ${item.productoId}`,
                );
              }
            }
            await mongoose.model("Entrada").findByIdAndUpdate(
              produccion.entradaId,
              {
                $set: { estado: "anulada" },
                $push: {
                  trazabilidad: crearTrazabilidad(
                    usuarioId,
                    "anulacion",
                    `Anulada por anulación de producción ${produccion.codigo}`,
                  ),
                },
              },
              { session: sesion },
            );
          }
        }
      }

      const anulada = await ProduccionRepository.updateById(
        id,
        {
          $set: { estado: "anulada" },
          $push: {
            trazabilidad: crearTrazabilidad(
              usuarioId,
              "anulacion",
              "Producción anulada",
            ),
          },
        },
        { session: sesion },
      );

      await sesion.commitTransaction();

      logAccionUsuario(usuarioId, "ANULAR_PRODUCCION", {
        produccionAnulada: id,
      });

      return anulada;
    } catch (error) {
      await sesion.abortTransaction();
      throw error;
    } finally {
      sesion.endSession();
    }
  }

  /**
   * Proyectar cuántas unidades se pueden producir con el stock actual.
   * Considera equivalencias de presentaciones.
   */
  async proyectarProduccion(fichaId, sedeId) {
    const ficha = await FichaProduccionRepository.findByIdConDetalles(fichaId);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }
    if (ficha.estado !== "aprobada") {
      throw new ErrorApi(400, "Solo se pueden proyectar fichas aprobadas");
    }

    const detallesMateriales = [];
    let maxUnidadesProducibles = Infinity;

    for (const mat of ficha.materiales) {
      const stock = await StockRepository.findByProductoYSede(
        mat.productoId._id || mat.productoId,
        sedeId,
      );
      const disponible = stock ? stock.cantidadDisponible : 0;

      // Calcular equivalencia: cuánto "contenido" representan las unidades en stock
      const producto = mat.productoId;
      const equivalencia = this.obtenerEquivalenciaPresentacion(
        producto,
        mat.unidadMedida,
      );

      const contenidoDisponible = disponible * equivalencia.factorConversion;
      const cantidadPorBatch = mat.cantidad; // cantidad por ficha
      const batchesPosibles =
        cantidadPorBatch > 0
          ? Math.floor(contenidoDisponible / cantidadPorBatch)
          : 0;

      const unidadesProducibles = batchesPosibles * ficha.cantidadResultante;

      if (unidadesProducibles < maxUnidadesProducibles) {
        maxUnidadesProducibles = unidadesProducibles;
      }

      detallesMateriales.push({
        productoId: mat.productoId._id || mat.productoId,
        nombre: producto.nombre || "N/A",
        codigoInterno: producto.codigoInterno || "N/A",
        unidadMedida: mat.unidadMedida,
        cantidadPorUnidadProducto: cantidadPorBatch / ficha.cantidadResultante,
        stockDisponibleUnidades: disponible,
        contenidoDisponible,
        factorConversion: equivalencia.factorConversion,
        unidadStock: equivalencia.unidadStock,
        unidadesProducibles,
        esCuelloBotella: false, // se marca abajo
      });
    }

    if (maxUnidadesProducibles === Infinity) maxUnidadesProducibles = 0;

    // Marcar cuello de botella
    detallesMateriales.forEach((det) => {
      if (det.unidadesProducibles === maxUnidadesProducibles) {
        det.esCuelloBotella = true;
      }
    });

    return {
      fichaId: ficha._id,
      codigo: ficha.codigo,
      nombre: ficha.nombre,
      productoFinal: {
        _id: ficha.productoFinalId._id || ficha.productoFinalId,
        nombre: ficha.productoFinalId.nombre || "N/A",
        codigoInterno: ficha.productoFinalId.codigoInterno || "N/A",
      },
      cantidadResultantePorBatch: ficha.cantidadResultante,
      maxUnidadesProducibles,
      materiales: detallesMateriales,
    };
  }

  /**
   * Calcula el costo estimado para producir N unidades (sin ejecutar).
   */
  async estimarCosto(fichaId, sedeId, cantidadAProd) {
    const ficha = await FichaProduccionRepository.findByIdConDetalles(fichaId);
    if (!ficha || !ficha.activo) {
      throw new ErrorApi(404, "Ficha de producción no encontrada");
    }

    const factor = cantidadAProd / ficha.cantidadResultante;
    const detallesCosto = [];
    let costoTotal = 0;

    for (const mat of ficha.materiales) {
      const cantidadRequerida = parseFloat((mat.cantidad * factor).toFixed(4));
      const unidadesStock = await this.calcularUnidadesStock(
        mat.productoId._id || mat.productoId,
        cantidadRequerida,
        mat.unidadMedida,
      );

      const costoPromedio = await this.obtenerCostoPromedio(
        mat.productoId._id || mat.productoId,
        sedeId,
      );

      const costoMaterial = unidadesStock * costoPromedio;
      costoTotal += costoMaterial;

      detallesCosto.push({
        productoId: mat.productoId._id || mat.productoId,
        nombre: mat.productoId.nombre || "N/A",
        cantidadRequerida,
        unidadMedida: mat.unidadMedida,
        unidadesStock,
        costoPromedio,
        costoMaterial: parseFloat(costoMaterial.toFixed(2)),
      });
    }

    return {
      fichaId: ficha._id,
      cantidadAProd,
      costoTotal: parseFloat(costoTotal.toFixed(2)),
      costoUnitario: parseFloat((costoTotal / cantidadAProd).toFixed(2)),
      materiales: detallesCosto,
    };
  }

  // ─── Métodos auxiliares ──────────────────────────────────

  /**
   * Calcula cuántas unidades enteras de stock se necesitan
   * para cubrir una cantidad en una unidad de medida específica.
   */
  async calcularUnidadesStock(productoId, cantidadRequerida, unidadMedida) {
    const ProductoModel = mongoose.model("Producto");
    const producto = await ProductoModel.findById(productoId);
    if (!producto) return Math.ceil(cantidadRequerida);

    const equivalencia = this.obtenerEquivalenciaPresentacion(
      producto,
      unidadMedida,
    );

    if (equivalencia.factorConversion <= 0) return Math.ceil(cantidadRequerida);

    return Math.ceil(cantidadRequerida / equivalencia.factorConversion);
  }

  /**
   * Calcula consumo con equivalencias.
   * Retorna unidades de stock a consumir y el equivalente sobrante.
   */
  async calcularConsumoConEquivalencias(
    productoId,
    cantidadRequerida,
    unidadMedida,
  ) {
    const ProductoModel = mongoose.model("Producto");
    const producto = await ProductoModel.findById(productoId);
    if (!producto) {
      return {
        unidadesStock: Math.ceil(cantidadRequerida),
        equivalenteRestante: 0,
      };
    }

    const equivalencia = this.obtenerEquivalenciaPresentacion(
      producto,
      unidadMedida,
    );

    if (equivalencia.factorConversion <= 0) {
      return {
        unidadesStock: Math.ceil(cantidadRequerida),
        equivalenteRestante: 0,
      };
    }

    const unidadesExactas = cantidadRequerida / equivalencia.factorConversion;
    const unidadesEnteras = Math.ceil(unidadesExactas);
    const contenidoConsumido = unidadesEnteras * equivalencia.factorConversion;
    const equivalenteRestante = parseFloat(
      (contenidoConsumido - cantidadRequerida).toFixed(4),
    );

    return {
      unidadesStock: unidadesEnteras,
      equivalenteRestante,
    };
  }

  /**
   * Obtiene el factor de conversión de la presentación del producto
   * que corresponda a la unidad de medida solicitada.
   *
   * Ejemplo: si el producto es un rollo con metrosLineales=100
   * y la unidad es "metros", el factor es 100.
   * Si la unidad es "unidades", el factor es cantidadPorUnidad.
   */
  obtenerEquivalenciaPresentacion(producto, unidadMedida) {
    const unidadNorm = unidadMedida.toLowerCase().trim();
    let factorConversion = 1;
    let unidadStock = "unidad";

    if (!producto.presentaciones || producto.presentaciones.length === 0) {
      return { factorConversion, unidadStock };
    }

    // Buscar presentación que coincida con la unidad de medida
    const presentacion = producto.presentaciones[0]; // usar la primera por defecto

    // Intentar matchear por unidad de medida
    const presentacionMatch = producto.presentaciones.find(
      (p) => p.unidadMedida.toLowerCase().trim() === unidadNorm,
    );

    const pres = presentacionMatch || presentacion;
    unidadStock = pres.tipo || "unidad";

    // Determinar factor según la unidad solicitada
    if (
      unidadNorm.includes("metro") ||
      unidadNorm === "m" ||
      unidadNorm === "ml"
    ) {
      factorConversion = pres.metrosLineales || pres.cantidadPorUnidad || 1;
    } else if (
      unidadNorm.includes("cm") ||
      unidadNorm.includes("centímetro") ||
      unidadNorm.includes("centimetro")
    ) {
      factorConversion = pres.largoCm || pres.cantidadPorUnidad || 1;
    } else if (unidadNorm.includes("kg") || unidadNorm.includes("kilo")) {
      factorConversion = pres.pesoKg || pres.cantidadPorUnidad || 1;
    } else if (unidadNorm.includes("unidad")) {
      factorConversion = pres.cantidadPorUnidad || pres.cantidadInterna || 1;
    } else {
      // Fallback: usar cantidadPorUnidad
      factorConversion = pres.cantidadPorUnidad || 1;
    }

    return { factorConversion, unidadStock };
  }

  /**
   * Obtiene lotes de costo para un material consumido.
   * Usa las entradas más recientes para calcular el costo real
   * (manejo de precios mixtos de diferentes proveedores).
   */
  async obtenerLotesCosto(productoId, sedeId, cantidadNecesaria, sesion) {
    const entradas = await Entrada.find({
      sedeId,
      estado: "aplicada",
      "items.productoId": productoId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .session(sesion)
      .lean();

    const lotes = [];
    let cantidadCubierta = 0;

    for (const entrada of entradas) {
      if (cantidadCubierta >= cantidadNecesaria) break;

      const item = entrada.items.find(
        (i) => i.productoId.toString() === productoId.toString(),
      );
      if (!item) continue;

      const cantidadDisponibleLote = item.cantidad;
      const cantidadFaltante = cantidadNecesaria - cantidadCubierta;
      const cantidadDeEsteLote = Math.min(
        cantidadDisponibleLote,
        cantidadFaltante,
      );

      lotes.push({
        entradaId: entrada._id,
        proveedorId: entrada.proveedorId || null,
        costoUnitario: item.costoUnitario || 0,
        cantidad: cantidadDeEsteLote,
      });

      cantidadCubierta += cantidadDeEsteLote;
    }

    // Si no se cubrió todo con entradas, agregar el resto con costo 0
    if (cantidadCubierta < cantidadNecesaria) {
      lotes.push({
        entradaId: null,
        proveedorId: null,
        costoUnitario: 0,
        cantidad: cantidadNecesaria - cantidadCubierta,
      });
    }

    return lotes;
  }

  /**
   * Obtiene el costo promedio de un producto a partir de entradas recientes.
   */
  async obtenerCostoPromedio(productoId, sedeId) {
    const entradas = await Entrada.find({
      sedeId,
      estado: "aplicada",
      "items.productoId": productoId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    let totalCosto = 0;
    let totalCantidad = 0;

    for (const entrada of entradas) {
      const item = entrada.items.find(
        (i) => i.productoId.toString() === productoId.toString(),
      );
      if (!item) continue;

      totalCosto += (item.costoUnitario || 0) * item.cantidad;
      totalCantidad += item.cantidad;
    }

    return totalCantidad > 0 ? totalCosto / totalCantidad : 0;
  }
}

export default new ProduccionService();
