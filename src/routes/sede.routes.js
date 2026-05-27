import SedeController from "../controllers/SedeController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearSede,
  schemaListarSedes,
  schemaListarSedesPaginado,
  schemaObtenerSede,
  schemaActualizarSede,
  schemaEliminarSede,
  schemaActualizarEstadoSede,
  schemaEliminarSedeFisica,
} from "../docs/sede.docs.js";

async function sedeRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  // Lectura: cualquier usuario autenticado puede listar sedes
  fastify.get(
    "/",
    { schema: schemaListarSedes, preHandler: verificarPermiso("sedes", "ver") },
    (req, reply) =>
    SedeController.listar(req, reply),
  );
  fastify.get(
    "/paginado",
    {
      schema: schemaListarSedesPaginado,
      preHandler: verificarPermiso("sedes", "ver"),
    },
    (req, reply) => SedeController.listarPaginado(req, reply),
  );
  fastify.get(
    "/:id",
    { schema: schemaObtenerSede, preHandler: verificarPermiso("sedes", "ver") },
    (req, reply) =>
    SedeController.obtenerPorId(req, reply),
  );

  fastify.post(
    "/",
    { schema: schemaCrearSede, preHandler: verificarPermiso("sedes", "crear") },
    (req, reply) =>
    SedeController.crear(req, reply),
  );
  fastify.put(
    "/:id",
    {
      schema: schemaActualizarSede,
      preHandler: verificarPermiso("sedes", "actualizar"),
    },
    (req, reply) =>
    SedeController.actualizar(req, reply),
  );
  fastify.patch(
    "/:id/estado",
    {
      schema: schemaActualizarEstadoSede,
      preHandler: verificarPermiso("sedes", "estado"),
    },
    (req, reply) => SedeController.actualizarEstado(req, reply),
  );
  fastify.delete(
    "/:id",
    { schema: schemaEliminarSede, preHandler: verificarPermiso("sedes", "estado") },
    (req, reply) =>
    SedeController.eliminar(req, reply),
  );
  fastify.delete(
    "/:id/fisico",
    {
      schema: schemaEliminarSedeFisica,
      preHandler: verificarPermiso("sedes", "eliminar"),
    },
    (req, reply) => SedeController.eliminarFisica(req, reply),
  );
}

export default sedeRoutes;
