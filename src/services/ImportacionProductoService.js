import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { Readable } from "stream";
import ProductoRepository from "../repositories/ProductoRepository.js";
import CategoriaRepository from "../repositories/CategoriaRepository.js";
import UnidadMedidaRepository from "../repositories/UnidadMedidaRepository.js";
import StockRepository from "../repositories/StockRepository.js";
import { generarCodigo } from "../utils/generadorCodigo.util.js";
import { logger } from "../config/logger.js";

// ─── Normalización de nombres de columna ────────────────────
const normalizarClave = (str) =>
  String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

// Mapa de columnas posibles → campo interno
const MAPA_COLUMNAS = {
  nombre: [
    "nombre",
    "descripcion",
    "nombre_descripcion",
    "nombre_o_descripcion",
    "nombre_o_desc",
    "desc",
    "producto",
    "articulo",
  ],
  descripcion: ["observaciones", "obs", "notas", "detalle"],
  codigoExterno: [
    "codigo_externo",
    "referencia",
    "ref",
    "cod_ext",
    "codigo_ref",
    "cod_referencia",
  ],
  // "Grupo" del Excel → categoría principal
  categoria: [
    "grupo",
    "grupo_numero",
    "grupo_no",
    "categoria",
    "categorias",
    "familia",
    "linea",
    "tipo",
  ],
  // "Descripcion Grupo" del Excel → subcategoría dentro de esa categoría
  subcategoria: [
    "descripcion_grupo",
    "desc_grupo",
    "subgrupo",
    "subcategoria",
    "sub_categoria",
    "sub_grupo",
  ],
  codigoUnidad: [
    "unidad_medida",
    "unidad_de_medida",
    "um",
    "und",
    "unidad",
    "u_medida",
    "und_medida",
    "cod_unidad",
    "codigo_unidad",
  ],
  valorUnitario: [
    "valor_unidad",
    "valor_unid",
    "valor_unitario",
    "precio_unitario",
    "precio",
    "valor",
    "costo",
    "costo_unitario",
  ],
  stockInicial: [
    "cant_exist_real",
    "cant_exist__real",
    "cant_exist_r",
    "cantidad",
    "stock",
    "existencias",
    "stock_actual",
    "cant_actual",
    "cantidad_actual",
    "inventario_inic",
    "inv_inic",
  ],
};

// Conjunto plano de todas las variantes conocidas para detección rápida
const TODAS_LAS_VARIANTES = new Set(Object.values(MAPA_COLUMNAS).flat());

/**
 * Cuenta cuántas celdas de una fila coinciden con variantes conocidas.
 * Sirve para detectar automáticamente cuál fila contiene los encabezados.
 */
const contarCoincidencias = (valores) => {
  let coincidencias = 0;
  for (const val of valores) {
    if (val !== null && val !== undefined && String(val).trim() !== "") {
      const clave = normalizarClave(String(val));
      if (TODAS_LAS_VARIANTES.has(clave)) coincidencias++;
    }
  }
  return coincidencias;
};

/**
 * Convierte todas las celdas de una fila ExcelJS a valores planos (string/number/null).
 */
const extraerValoresFila = (fila) =>
  fila.values.slice(1).map((v, idx) => {
    const celda = fila.getCell(idx + 1);
    const textoFormateado = String(celda?.text ?? "").trim();
    if (textoFormateado) return textoFormateado;

    if (v === null || v === undefined) return null;
    if (typeof v === "object" && v.text !== undefined)
      return String(v.text).trim(); // RichText
    if (typeof v === "object" && v.result !== undefined) return v.result; // formula
    return v;
  });

// ─── Lectura de buffer (xlsx o csv) ─────────────────────────
const leerFilasDesdeBuffer = async (buffer, nombreArchivo) => {
  const workbook = new ExcelJS.Workbook();
  const esCSV = nombreArchivo && nombreArchivo.toLowerCase().endsWith(".csv");

  if (esCSV) {
    const stream = Readable.from(buffer);
    await workbook.csv.read(stream, { dateFormats: [] });
  } else {
    await workbook.xlsx.load(buffer);
  }

  const hoja = workbook.worksheets[0];
  if (!hoja) throw new Error("El archivo no contiene hojas de datos");

  // ── Recopilar todas las filas con sus valores ──────────────
  const todasLasFilas = [];
  hoja.eachRow({ includeEmpty: false }, (fila, numeroFila) => {
    todasLasFilas.push({
      numero: numeroFila,
      valores: extraerValoresFila(fila),
    });
  });

  if (todasLasFilas.length === 0) {
    return { filas: [], encabezados: [] };
  }

  // ── Detectar fila de encabezados (máx. primeras 15 filas) ──
  const filasACandidatas = todasLasFilas.slice(0, 15);
  let filaEncabezadoIdx = 0; // índice dentro de todasLasFilas
  let maxCoincidencias = 0;

  for (let i = 0; i < filasACandidatas.length; i++) {
    const coincidencias = contarCoincidencias(filasACandidatas[i].valores);
    if (coincidencias > maxCoincidencias) {
      maxCoincidencias = coincidencias;
      filaEncabezadoIdx = i;
    }
  }

  if (maxCoincidencias === 0) {
    throw new Error(
      "No se encontró ninguna fila de encabezados reconocible. " +
        "Verifique que el archivo tenga columnas como: nombre, grupo, descripcion grupo, unidad medida, valor unidad, cant exist. real, etc.",
    );
  }

  const encabezados = todasLasFilas[filaEncabezadoIdx].valores.map((v) =>
    String(v ?? "").trim(),
  );

  logger.info(
    {
      filaEncabezado: todasLasFilas[filaEncabezadoIdx].numero,
      coincidencias: maxCoincidencias,
    },
    "Importación: fila de encabezados detectada",
  );

  // ── Filas de datos = todo lo que viene después del encabezado ─
  const filas = [];
  for (let i = filaEncabezadoIdx + 1; i < todasLasFilas.length; i++) {
    const valores = todasLasFilas[i].valores;
    // Ignorar filas completamente vacías
    const tieneContenido = valores.some(
      (v) => v !== null && v !== undefined && String(v).trim() !== "",
    );
    if (!tieneContenido) continue;

    const obj = {};
    encabezados.forEach((col, idx) => {
      if (col) obj[col] = valores[idx] ?? null;
    });
    filas.push(obj);
  }

  return { filas, encabezados };
};

/**
 * Construye un mapa { campo interno → nombre de columna original }.
 * Ignora cualquier columna del archivo que no esté en MAPA_COLUMNAS.
 */
const mapearEncabezados = (encabezados) => {
  const mapa = {};
  for (const encabezado of encabezados) {
    if (!encabezado) continue;
    const clave = normalizarClave(encabezado);
    for (const [campo, variantes] of Object.entries(MAPA_COLUMNAS)) {
      if (variantes.includes(clave) && !mapa[campo]) {
        mapa[campo] = encabezado;
      }
    }
  }
  return mapa;
};

// ─── Caché de categorías por nombre (dentro del procesamiento) ─
const cacheCategorias = new Map();

const buscarOCrearCategoria = async (nombre) => {
  if (!nombre) return null;
  const nombreLimpio = String(nombre).trim();
  if (!nombreLimpio) return null;

  if (cacheCategorias.has(nombreLimpio)) {
    return cacheCategorias.get(nombreLimpio);
  }

  // Buscar sin filtro de activo para evitar error de duplicado en nombre único
  let categoria = await CategoriaRepository.findOne({ nombre: nombreLimpio });
  if (!categoria) {
    categoria = await CategoriaRepository.create({
      nombre: nombreLimpio,
      activo: true,
    });
    logger.info({ categoria: categoria._id }, "Importación: categoría creada");
  } else if (!categoria.activo) {
    // Reactivar si estaba inactiva
    categoria = await CategoriaRepository.updateById(categoria._id, {
      activo: true,
    });
  }

  cacheCategorias.set(nombreLimpio, categoria);
  return categoria;
};

// ─── Caché de subcategorías por "catId::nombre" ──────────────
const cacheSubcategorias = new Map();

const buscarOCrearSubcategoria = async (categoria, nombreSubcat) => {
  if (!categoria || !nombreSubcat) return null;
  const nombreLimpio = String(nombreSubcat).trim();
  if (!nombreLimpio) return null;

  const cacheKey = `${categoria._id}::${nombreLimpio}`;
  if (cacheSubcategorias.has(cacheKey)) {
    return cacheSubcategorias.get(cacheKey);
  }

  const subcat = await CategoriaRepository.agregarSubcategoriaObtener(
    categoria._id,
    nombreLimpio,
  );
  if (subcat) cacheSubcategorias.set(cacheKey, subcat);
  return subcat;
};

// ─── Caché de unidades de medida por código ─────────────────
const cacheUnidades = new Map();

const buscarUnidadPorCodigo = async (codigo) => {
  if (!codigo) return null;
  const codigoLimpio = String(codigo).trim();
  if (!codigoLimpio) return null;

  if (cacheUnidades.has(codigoLimpio)) {
    return cacheUnidades.get(codigoLimpio);
  }

  const unidad = await UnidadMedidaRepository.findByCodigo(codigoLimpio);
  if (unidad) cacheUnidades.set(codigoLimpio, unidad);
  return unidad;
};

// ─── Procesamiento de una fila ───────────────────────────────
const procesarFila = async (fila, mapaColumnas, sedeId, numeroFila, sesion) => {
  const leer = (campo) => {
    const col = mapaColumnas[campo];
    if (!col) return null;
    const val = fila[col];
    return val !== null && val !== undefined ? String(val).trim() : null;
  };

  const nombre = leer("nombre");
  if (!nombre) {
    return {
      fila: numeroFila,
      estado: "error",
      motivo: "El campo nombre/descripción es obligatorio",
      datos: null,
    };
  }

  // Unidad de medida (obligatoria)
  const codigoUnidad = leer("codigoUnidad");
  const unidad = await buscarUnidadPorCodigo(codigoUnidad);
  if (!unidad) {
    return {
      fila: numeroFila,
      estado: "error",
      motivo: `Unidad de medida no encontrada para código: "${codigoUnidad}"`,
      datos: null,
    };
  }

  // Categoría (de "Grupo") y subcategoría (de "Descripcion Grupo")
  const nombreCategoria = leer("categoria");
  const nombreSubcategoria = leer("subcategoria");
  const categoria = await buscarOCrearCategoria(nombreCategoria);
  const subcategoria = await buscarOCrearSubcategoria(
    categoria,
    nombreSubcategoria,
  );

  // Código externo
  const codigoExterno = leer("codigoExterno") || "";

  // Valores numéricos
  const colValor = mapaColumnas.valorUnitario;
  const colStock = mapaColumnas.stockInicial;
  const valorUnitario = colValor
    ? Math.max(0, parseFloat(fila[colValor]) || 0)
    : 0;
  const stockInicial = colStock
    ? Math.max(0, parseFloat(fila[colStock]) || 0)
    : 0;

  const descripcion = leer("descripcion") || "";

  // Código interno automático (lectura simple, fuera de la transacción)
  const codigoInterno = await generarCodigo(
    "PRD",
    ProductoRepository.model,
    "codigoInterno",
  );

  // ── Transacción por fila: producto + stock son atómicos ──────
  sesion.startTransaction();
  try {
    const producto = await ProductoRepository.create(
      {
        codigoInterno,
        referencia: codigoExterno || codigoInterno,
        codigoExterno,
        nombre,
        descripcion,
        categoriaId: categoria ? categoria._id : null,
        subcategoriaId: subcategoria ? subcategoria._id : null,
        unidadMedidaId: unidad._id,
        valorUnitario,
        stockMinimo: 10,
        stockMaximo: 9999,
        activo: true,
      },
      { session: sesion },
    );

    if (sedeId) {
      await StockRepository.incrementarStock(
        producto._id,
        sedeId,
        stockInicial,
        { session: sesion },
      );
    }

    await sesion.commitTransaction();

    return {
      fila: numeroFila,
      estado: "exitoso",
      motivo: null,
      datos: {
        productoId: producto._id,
        codigoInterno: producto.codigoInterno,
        nombre: producto.nombre,
        categoria: categoria ? categoria.nombre : null,
        subcategoria: subcategoria ? subcategoria.nombre : null,
        unidadMedida: unidad.nombre,
        valorUnitario: producto.valorUnitario,
        stockInicial,
      },
    };
  } catch (errTx) {
    await sesion.abortTransaction();
    logger.error(
      { fila: numeroFila, err: errTx.message },
      "Importación: rollback de fila",
    );
    return {
      fila: numeroFila,
      estado: "error",
      motivo: errTx.message,
      datos: null,
    };
  }
};

// ─── Servicio principal ──────────────────────────────────────
class ImportacionProductoService {
  async importarDesdeArchivo({
    buffer,
    nombreArchivo,
    sedeId,
    pagina = 1,
    limite = 50,
  }) {
    cacheCategorias.clear();
    cacheSubcategorias.clear();
    cacheUnidades.clear();

    const { filas, encabezados } = await leerFilasDesdeBuffer(
      buffer,
      nombreArchivo,
    );

    if (filas.length === 0) {
      return {
        totalArchivo: 0,
        exitosos: 0,
        errores: 0,
        resultados: [],
        paginacion: {
          pagina: 1,
          limite,
          total: 0,
          totalPaginas: 0,
          hayPaginaSiguiente: false,
          hayPaginaAnterior: false,
        },
      };
    }

    const mapaColumnas = mapearEncabezados(encabezados);

    const sesion = await mongoose.startSession();
    const resultados = [];
    try {
      for (let i = 0; i < filas.length; i++) {
        const resultado = await procesarFila(
          filas[i],
          mapaColumnas,
          sedeId,
          i + 2, // +2 porque fila 1 = encabezados
          sesion,
        );
        resultados.push(resultado);
      }
    } finally {
      sesion.endSession();
    }

    const exitosos = resultados.filter((r) => r.estado === "exitoso").length;
    const erroresCount = resultados.filter((r) => r.estado === "error").length;

    // Paginación sobre los resultados
    const total = resultados.length;
    const totalPaginas = Math.ceil(total / limite);
    const inicio = (pagina - 1) * limite;
    const resultadosPaginados = resultados.slice(inicio, inicio + limite);

    return {
      totalArchivo: filas.length,
      exitosos,
      errores: erroresCount,
      resultados: resultadosPaginados,
      paginacion: {
        pagina,
        limite,
        total,
        totalPaginas,
        hayPaginaSiguiente: pagina < totalPaginas,
        hayPaginaAnterior: pagina > 1,
      },
    };
  }
}

export default new ImportacionProductoService();
