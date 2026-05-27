import ImportacionProductoController from "../controllers/ImportacionProductoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import { schemaImportarProductos } from "../docs/importacionProducto.docs.js";
import { ACCIONES, MODULOS } from "../utils/permisos.util.js";

async function importacionProductoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/productos",
    {
      attachValidation: true,
      schema: schemaImportarProductos,
      preHandler: verificarPermiso(MODULOS.PRODUCTOS, ACCIONES.CREAR),
    },
    (req, reply) => ImportacionProductoController.importar(req, reply),
  );
}

export default importacionProductoRoutes;
