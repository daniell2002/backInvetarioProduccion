import ImportacionProductoService from "../services/ImportacionProductoService.js";
import RespuestaApi from "../utils/RespuestaApi.js";
import ErrorApi from "../utils/ErrorApi.js";

class ImportacionProductoController {
  async importar(request, reply) {
    const partes = request.parts();

    let buffer = null;
    let nombreArchivo = "archivo";
    let sedeId = null;
    let pagina = 1;
    let limite = 50;

    for await (const parte of partes) {
      if (parte.type === "file") {
        const trozos = [];
        for await (const trozo of parte.file) {
          trozos.push(trozo);
        }
        buffer = Buffer.concat(trozos);
        nombreArchivo = parte.filename || "archivo";
      } else {
        // campos de texto
        const valor = parte.value;
        if (parte.fieldname === "sedeId") sedeId = valor;
        if (parte.fieldname === "pagina")
          pagina = Math.max(1, parseInt(valor) || 1);
        if (parte.fieldname === "limite")
          limite = Math.min(200, Math.max(1, parseInt(valor) || 50));
      }
    }

    if (!buffer || buffer.length === 0) {
      throw new ErrorApi("No se recibió ningún archivo", 400);
    }

    const extensionValida = /\.(xlsx|xls|csv)$/i.test(nombreArchivo);
    if (!extensionValida) {
      throw new ErrorApi(
        "Formato de archivo no soportado. Use .xlsx, .xls o .csv",
        400,
      );
    }

    if (!sedeId) {
      throw new ErrorApi("El campo sedeId es obligatorio", 400);
    }

    const esAdminGeneral = Boolean(request.usuario?.esAdmin);
    const sedeUsuario =
      typeof request.usuario?.sedeId === "object"
        ? request.usuario?.sedeId?._id
        : request.usuario?.sedeId;

    if (!esAdminGeneral) {
      if (!sedeUsuario) {
        throw new ErrorApi(
          "Tu usuario no tiene sede asignada para importar inventario",
          403,
        );
      }

      if (sedeId && String(sedeId) !== String(sedeUsuario)) {
        throw new ErrorApi(
          "Solo puedes importar inventario en tu propia sede",
          403,
        );
      }

      sedeId = String(sedeUsuario);
    }

    const resultado = await ImportacionProductoService.importarDesdeArchivo({
      buffer,
      nombreArchivo,
      sedeId,
      pagina,
      limite,
    });

    return RespuestaApi.exito(reply, "Importación procesada", resultado);
  }
}

export default new ImportacionProductoController();
