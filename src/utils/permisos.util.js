/**
 * Acciones disponibles para permisos.
 * Cada permiso vincula un módulo con una acción.
 */
export const ACCIONES = Object.freeze({
  VER: "ver",
  CREAR: "crear",
  ACTUALIZAR: "actualizar",
  ELIMINAR: "eliminar",
});

/**
 * Módulos del sistema sobre los cuales se aplican permisos.
 */
export const MODULOS = Object.freeze({
  USUARIOS: "usuarios",
  ROLES: "roles",
  SEDES: "sedes",
  CATEGORIAS: "categorias",
  PRODUCTOS: "productos",
  TERCEROS: "terceros",
  ORDENES_COMPRA: "ordenes_compra",
  ENTRADAS: "entradas",
  SALIDAS: "salidas",
  TRASLADOS: "traslados",
  AJUSTES_INVENTARIO: "ajustes_inventario",
  ORDENES_DESPACHO: "ordenes_despacho",
  MAQUINAS: "maquinas",
  INVENTARIO: "inventario",
});

/**
 * Genera la lista completa de permisos posibles (todas las combinaciones módulo + acción).
 */
export const generarTodosLosPermisos = () => {
  const permisos = [];
  for (const modulo of Object.values(MODULOS)) {
    for (const accion of Object.values(ACCIONES)) {
      permisos.push({ modulo, accion });
    }
  }
  return permisos;
};
