import SedeController from "../controllers/SedeController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { soloAdmin } from "../hooks/permisos.hook.js";
import {
  schemaCrearSede,
  schemaListarSedes,
  schemaListarSedesPaginado,
  schemaObtenerSede,
  schemaActualizarSede,
  schemaEliminarSede,
} from "../docs/sede.docs.js";

async function sedeRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);
  fastify.addHook("onRequest", soloAdmin);

  fastify.post("/", { schema: schemaCrearSede }, (req, reply) =>
    SedeController.crear(req, reply),
  );
  fastify.get("/", { schema: schemaListarSedes }, (req, reply) =>
    SedeController.listar(req, reply),
  );
  fastify.get(
    "/paginado",
    { schema: schemaListarSedesPaginado },
    (req, reply) => SedeController.listarPaginado(req, reply),
  );
  fastify.get("/:id", { schema: schemaObtenerSede }, (req, reply) =>
    SedeController.obtenerPorId(req, reply),
  );
  fastify.put("/:id", { schema: schemaActualizarSede }, (req, reply) =>
    SedeController.actualizar(req, reply),
  );
  fastify.delete("/:id", { schema: schemaEliminarSede }, (req, reply) =>
    SedeController.eliminar(req, reply),
  );
}

export default sedeRoutes;
