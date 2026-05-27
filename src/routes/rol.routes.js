import RolController from "../controllers/RolController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import {
  schemaCrearRol,
  schemaListarRoles,
  schemaListarRolesPaginado,
  schemaObtenerRol,
  schemaActualizarRol,
  schemaEliminarRol,
  schemaReactivarRol,
} from "../docs/rol.docs.js";

async function rolRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);
  fastify.addHook("onRequest", soloAdmin);

  fastify.post("/", { schema: schemaCrearRol }, (req, reply) =>
    RolController.crear(req, reply),
  );
  fastify.get("/", { schema: schemaListarRoles }, (req, reply) =>
    RolController.listar(req, reply),
  );
  fastify.get(
    "/paginado",
    { schema: schemaListarRolesPaginado },
    (req, reply) => RolController.listarPaginado(req, reply),
  );
  fastify.get("/:id", { schema: schemaObtenerRol }, (req, reply) =>
    RolController.obtenerPorId(req, reply),
  );
  fastify.put("/:id", { schema: schemaActualizarRol }, (req, reply) =>
    RolController.actualizar(req, reply),
  );
  fastify.delete("/:id", { schema: schemaEliminarRol }, (req, reply) =>
    RolController.eliminar(req, reply),
  );
  fastify.put("/:id/reactivar", { schema: schemaReactivarRol }, (req, reply) =>
    RolController.reactivar(req, reply),
  );
}

export default rolRoutes;
