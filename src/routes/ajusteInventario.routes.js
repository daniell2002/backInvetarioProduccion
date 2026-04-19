import AjusteInventarioController from "../controllers/AjusteInventarioController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import {
  schemaCrearAjuste,
  schemaListarAjustes,
  schemaListarAjustesPaginado,
  schemaObtenerAjuste,
  schemaAprobarAjuste,
  schemaRechazarAjuste,
} from "../docs/ajusteInventario.docs.js";

async function ajusteInventarioRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearAjuste,
      preHandler: verificarPermiso("ajustes_inventario", "crear"),
    },
    (req, reply) => AjusteInventarioController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarAjustes,
      preHandler: verificarPermiso("ajustes_inventario", "ver"),
    },
    (req, reply) => AjusteInventarioController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarAjustesPaginado,
      preHandler: verificarPermiso("ajustes_inventario", "ver"),
    },
    (req, reply) => AjusteInventarioController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerAjuste,
      preHandler: verificarPermiso("ajustes_inventario", "ver"),
    },
    (req, reply) => AjusteInventarioController.obtenerPorId(req, reply),
  );

  // Aprobar/rechazar solo admin
  fastify.patch(
    "/:id/aprobar",
    {
      schema: schemaAprobarAjuste,
      preHandler: soloAdmin,
    },
    (req, reply) => AjusteInventarioController.aprobar(req, reply),
  );

  fastify.patch(
    "/:id/rechazar",
    {
      schema: schemaRechazarAjuste,
      preHandler: soloAdmin,
    },
    (req, reply) => AjusteInventarioController.rechazar(req, reply),
  );
}

export default ajusteInventarioRoutes;
