import ErrorApi from "./ErrorApi.js";

/**
 * Reglas de sede, en un solo lugar:
 * - Un admin general opera y consulta todas las sedes.
 * - Un usuario normal solo opera y consulta su propia sede, aunque su rol
 *   tenga el permiso del módulo (ej. "entradas:ver"). En traslados y pedidos
 *   "su sede" es cualquiera de los dos lados (origen/destino,
 *   solicitante/proveedora), porque ambos tienen que verlos y operarlos.
 */

// sedeId puede llegar como id crudo, string u objeto poblado ({_id, nombre}).
export const idSede = (valor) => {
  if (!valor) return null;
  const id = typeof valor === "object" ? valor._id || null : valor;
  return id ? String(id) : null;
};

const sedeDeUsuario = (usuarioActual) => idSede(usuarioActual?.sedeId);

/** Acciones (crear, aprobar, anular…): solo en la propia sede. */
export const verificarAccesoSede = (usuarioActual, sedeRequerida, accion) => {
  if (!usuarioActual || usuarioActual.esAdmin) return;
  const miSede = sedeDeUsuario(usuarioActual);
  if (!miSede || miSede !== idSede(sedeRequerida)) {
    throw new ErrorApi(403, `Solo tu sede puede ${accion}`);
  }
};

/**
 * Listados: un admin consulta lo que pida. Un usuario normal queda limitado
 * a su sede (filtros.sedeId; en traslados/pedidos el repositorio lo
 * interpreta como "cualquiera de los dos lados"). Pedir otra sede → 403.
 */
export const limitarFiltrosASede = (usuarioActual, filtros = {}) => {
  if (!usuarioActual || usuarioActual.esAdmin) return filtros;
  const miSede = sedeDeUsuario(usuarioActual);
  if (!miSede) throw new ErrorApi(403, "Tu usuario no tiene sede asignada");
  if (filtros.sedeId && idSede(filtros.sedeId) !== miSede) {
    throw new ErrorApi(403, "Solo puedes consultar información de tu sede");
  }
  return { ...filtros, sedeId: miSede };
};

/**
 * Detalle de un documento: si no involucra la sede del usuario se responde
 * 404 (no se revela que existe). `campos` son los campos de sede del doc.
 */
export const verificarLecturaSede = (usuarioActual, documento, campos = ["sedeId"]) => {
  if (!documento || !usuarioActual || usuarioActual.esAdmin) return;
  const miSede = sedeDeUsuario(usuarioActual);
  const sedesDoc = campos.map((c) => idSede(documento[c]));
  if (!miSede || !sedesDoc.includes(miSede)) {
    throw new ErrorApi(404, "Registro no encontrado");
  }
};
