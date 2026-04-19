import EntradaController from "../controllers/EntradaController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearEntrada,
  schemaListarEntradas,
  schemaListarEntradasPaginado,
  schemaObtenerEntrada,
  schemaAnularEntrada,
} from "../docs/entrada.docs.js";

async function entradaRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearEntrada,
      preHandler: verificarPermiso("entradas", "crear"),
    },
    (req, reply) => EntradaController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarEntradas,
      preHandler: verificarPermiso("entradas", "ver"),
    },
    (req, reply) => EntradaController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarEntradasPaginado,
      preHandler: verificarPermiso("entradas", "ver"),
    },
    (req, reply) => EntradaController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerEntrada,
      preHandler: verificarPermiso("entradas", "ver"),
    },
    (req, reply) => EntradaController.obtenerPorId(req, reply),
  );

  fastify.patch(
    "/:id/anular",
    {
      schema: schemaAnularEntrada,
      preHandler: verificarPermiso("entradas", "actualizar"),
    },
    (req, reply) => EntradaController.anular(req, reply),
  );
}

export default entradaRoutes;
