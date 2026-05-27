import UnidadMedidaController from "../controllers/UnidadMedidaController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaSincronizarUnidades,
  schemaListarUnidades,
  schemaObtenerUnidad,
} from "../docs/unidadMedida.docs.js";

async function unidadMedidaRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  // Solo admin puede sincronizar desde el archivo
  fastify.post(
    "/sincronizar",
    { schema: schemaSincronizarUnidades, preHandler: soloAdmin },
    (req, reply) => UnidadMedidaController.sincronizar(req, reply),
  );

  // Cualquier usuario autenticado puede listar
  fastify.get(
    "/",
    {
      schema: schemaListarUnidades,
      preHandler: verificarPermiso("productos", "ver"),
    },
    (req, reply) => UnidadMedidaController.listar(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerUnidad,
      preHandler: verificarPermiso("productos", "ver"),
    },
    (req, reply) => UnidadMedidaController.obtenerPorId(req, reply),
  );
}

export default unidadMedidaRoutes;
