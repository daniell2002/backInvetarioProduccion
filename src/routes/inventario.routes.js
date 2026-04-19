import InventarioController from "../controllers/InventarioController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaStockPorSede,
  schemaStockGlobal,
  schemaStockProducto,
} from "../docs/inventario.docs.js";

async function inventarioRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.get(
    "/sede/:sedeId",
    {
      schema: schemaStockPorSede,
      preHandler: verificarPermiso("inventario", "ver"),
    },
    (req, reply) => InventarioController.stockPorSede(req, reply),
  );

  fastify.get(
    "/global",
    {
      schema: schemaStockGlobal,
      preHandler: verificarPermiso("inventario", "ver"),
    },
    (req, reply) => InventarioController.stockGlobal(req, reply),
  );

  fastify.get(
    "/producto/:productoId",
    {
      schema: schemaStockProducto,
      preHandler: verificarPermiso("inventario", "ver"),
    },
    (req, reply) => InventarioController.stockProducto(req, reply),
  );
}

export default inventarioRoutes;
