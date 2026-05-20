import GrupoController from "../controllers/GrupoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearGrupo,
  schemaListarGrupos,
  schemaListarGruposPaginado,
  schemaObtenerGrupo,
  schemaActualizarGrupo,
  schemaEliminarGrupo,
} from "../docs/grupo.docs.js";

async function grupoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    { schema: schemaCrearGrupo, preHandler: verificarPermiso("categorias", "crear") },
    (req, reply) => GrupoController.crear(req, reply),
  );

  fastify.get(
    "/",
    { schema: schemaListarGrupos, preHandler: verificarPermiso("categorias", "ver") },
    (req, reply) => GrupoController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    { schema: schemaListarGruposPaginado, preHandler: verificarPermiso("categorias", "ver") },
    (req, reply) => GrupoController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    { schema: schemaObtenerGrupo, preHandler: verificarPermiso("categorias", "ver") },
    (req, reply) => GrupoController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    { schema: schemaActualizarGrupo, preHandler: verificarPermiso("categorias", "actualizar") },
    (req, reply) => GrupoController.actualizar(req, reply),
  );

  fastify.delete(
    "/:id",
    { schema: schemaEliminarGrupo, preHandler: verificarPermiso("categorias", "eliminar") },
    (req, reply) => GrupoController.eliminar(req, reply),
  );
}

export default grupoRoutes;
