import ImportacionProductoController from "../controllers/ImportacionProductoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import { schemaImportarProductos } from "../docs/importacionProducto.docs.js";

async function importacionProductoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/productos",
    {
      attachValidation: true,
      schema: schemaImportarProductos,
      preHandler: soloAdmin,
    },
    (req, reply) => ImportacionProductoController.importar(req, reply),
  );
}

export default importacionProductoRoutes;
