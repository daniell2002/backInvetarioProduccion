import TerceroController from "../controllers/TerceroController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearTercero,
  schemaListarTerceros,
  schemaListarTercerosPaginado,
  schemaObtenerTercero,
  schemaActualizarTercero,
  schemaEliminarTercero,
  schemaActualizarEstadoTercero,
  schemaEliminarTerceroFisico,
} from "../docs/tercero.docs.js";

async function terceroRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearTercero,
      preHandler: verificarPermiso("terceros", "crear"),
    },
    (req, reply) => TerceroController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarTerceros,
      preHandler: verificarPermiso("terceros", "ver"),
    },
    (req, reply) => TerceroController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarTercerosPaginado,
      preHandler: verificarPermiso("terceros", "ver"),
    },
    (req, reply) => TerceroController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerTercero,
      preHandler: verificarPermiso("terceros", "ver"),
    },
    (req, reply) => TerceroController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    {
      schema: schemaActualizarTercero,
      preHandler: verificarPermiso("terceros", "actualizar"),
    },
    (req, reply) => TerceroController.actualizar(req, reply),
  );

  fastify.delete(
    "/:id",
    {
      schema: schemaEliminarTercero,
      preHandler: verificarPermiso("terceros", "estado"),
    },
    (req, reply) => TerceroController.eliminar(req, reply),
  );

  fastify.patch(
    "/:id/estado",
    {
      schema: schemaActualizarEstadoTercero,
      preHandler: verificarPermiso("terceros", "estado"),
    },
    (req, reply) => TerceroController.actualizarEstado(req, reply),
  );

  fastify.delete(
    "/:id/fisico",
    {
      schema: schemaEliminarTerceroFisico,
      preHandler: verificarPermiso("terceros", "eliminar"),
    },
    (req, reply) => TerceroController.eliminarFisico(req, reply),
  );
}

export default terceroRoutes;
