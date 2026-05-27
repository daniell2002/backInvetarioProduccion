import UsuarioController from "../controllers/UsuarioController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import {
  schemaCrearUsuario,
  schemaListarUsuarios,
  schemaListarUsuariosPaginado,
  schemaObtenerUsuario,
  schemaActualizarUsuario,
  schemaEliminarUsuario,
  schemaActualizarEstadoUsuario,
  schemaEliminarUsuarioFisico,
} from "../docs/usuario.docs.js";

async function usuarioRoutes(fastify) {
  // Todas protegidas con auth + soloAdmin
  fastify.addHook("onRequest", autenticar);
  fastify.addHook("onRequest", soloAdmin);

  fastify.post("/", { schema: schemaCrearUsuario }, (req, reply) =>
    UsuarioController.crear(req, reply),
  );
  fastify.get("/", { schema: schemaListarUsuarios }, (req, reply) =>
    UsuarioController.listar(req, reply),
  );
  fastify.get(
    "/paginado",
    { schema: schemaListarUsuariosPaginado },
    (req, reply) => UsuarioController.listarPaginado(req, reply),
  );
  fastify.get("/:id", { schema: schemaObtenerUsuario }, (req, reply) =>
    UsuarioController.obtenerPorId(req, reply),
  );
  fastify.put("/:id", { schema: schemaActualizarUsuario }, (req, reply) =>
    UsuarioController.actualizar(req, reply),
  );
  fastify.delete("/:id", { schema: schemaEliminarUsuario }, (req, reply) =>
    UsuarioController.eliminar(req, reply),
  );
  fastify.patch(
    "/:id/estado",
    { schema: schemaActualizarEstadoUsuario },
    (req, reply) => UsuarioController.actualizarEstado(req, reply),
  );
  fastify.delete(
    "/:id/fisico",
    { schema: schemaEliminarUsuarioFisico },
    (req, reply) => UsuarioController.eliminarFisico(req, reply),
  );
}

export default usuarioRoutes;
