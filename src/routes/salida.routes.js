import SalidaController from "../controllers/SalidaController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearSalida,
  schemaListarSalidas,
  schemaListarSalidasPaginado,
  schemaObtenerSalida,
  schemaAnularSalida,
} from "../docs/salida.docs.js";

async function salidaRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearSalida,
      preHandler: verificarPermiso("salidas", "crear"),
    },
    (req, reply) => SalidaController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarSalidas,
      preHandler: verificarPermiso("salidas", "ver"),
    },
    (req, reply) => SalidaController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarSalidasPaginado,
      preHandler: verificarPermiso("salidas", "ver"),
    },
    (req, reply) => SalidaController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerSalida,
      preHandler: verificarPermiso("salidas", "ver"),
    },
    (req, reply) => SalidaController.obtenerPorId(req, reply),
  );

  fastify.patch(
    "/:id/anular",
    {
      schema: schemaAnularSalida,
      preHandler: verificarPermiso("salidas", "actualizar"),
    },
    (req, reply) => SalidaController.anular(req, reply),
  );
}

export default salidaRoutes;
