import MaquinaController from "../controllers/MaquinaController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearMaquina,
  schemaListarMaquinas,
  schemaListarMaquinasPaginado,
  schemaObtenerMaquina,
  schemaActualizarMaquina,
  schemaEliminarMaquina,
} from "../docs/maquina.docs.js";

async function maquinaRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearMaquina,
      preHandler: verificarPermiso("maquinas", "crear"),
    },
    (req, reply) => MaquinaController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarMaquinas,
      preHandler: verificarPermiso("maquinas", "ver"),
    },
    (req, reply) => MaquinaController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarMaquinasPaginado,
      preHandler: verificarPermiso("maquinas", "ver"),
    },
    (req, reply) => MaquinaController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerMaquina,
      preHandler: verificarPermiso("maquinas", "ver"),
    },
    (req, reply) => MaquinaController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    {
      schema: schemaActualizarMaquina,
      preHandler: verificarPermiso("maquinas", "actualizar"),
    },
    (req, reply) => MaquinaController.actualizar(req, reply),
  );

  fastify.delete(
    "/:id",
    {
      schema: schemaEliminarMaquina,
      preHandler: verificarPermiso("maquinas", "eliminar"),
    },
    (req, reply) => MaquinaController.eliminar(req, reply),
  );
}

export default maquinaRoutes;
