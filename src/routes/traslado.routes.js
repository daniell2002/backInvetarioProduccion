import TrasladoController from "../controllers/TrasladoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearTraslado,
  schemaListarTraslados,
  schemaListarTrasladosPaginado,
  schemaObtenerTraslado,
  schemaAprobarTraslado,
  schemaDespacharTraslado,
  schemaRecibirTraslado,
} from "../docs/traslado.docs.js";

async function trasladoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearTraslado,
      preHandler: verificarPermiso("traslados", "crear"),
    },
    (req, reply) => TrasladoController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarTraslados,
      preHandler: verificarPermiso("traslados", "ver"),
    },
    (req, reply) => TrasladoController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarTrasladosPaginado,
      preHandler: verificarPermiso("traslados", "ver"),
    },
    (req, reply) => TrasladoController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerTraslado,
      preHandler: verificarPermiso("traslados", "ver"),
    },
    (req, reply) => TrasladoController.obtenerPorId(req, reply),
  );

  fastify.patch(
    "/:id/aprobar",
    {
      schema: schemaAprobarTraslado,
      preHandler: verificarPermiso("traslados", "actualizar"),
    },
    (req, reply) => TrasladoController.aprobar(req, reply),
  );

  fastify.patch(
    "/:id/despachar",
    {
      schema: schemaDespacharTraslado,
      preHandler: verificarPermiso("traslados", "actualizar"),
    },
    (req, reply) => TrasladoController.despachar(req, reply),
  );

  fastify.patch(
    "/:id/recibir",
    {
      schema: schemaRecibirTraslado,
      preHandler: verificarPermiso("traslados", "actualizar"),
    },
    (req, reply) => TrasladoController.recibir(req, reply),
  );
}

export default trasladoRoutes;
