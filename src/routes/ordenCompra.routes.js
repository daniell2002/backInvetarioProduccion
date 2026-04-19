import OrdenCompraController from "../controllers/OrdenCompraController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearOrdenCompra,
  schemaListarOrdenesCompra,
  schemaListarOrdenesCompraPaginado,
  schemaObtenerOrdenCompra,
  schemaActualizarOrdenCompra,
  schemaEnviarOrdenCompra,
  schemaRecepcionOrdenCompra,
  schemaAnularOrdenCompra,
} from "../docs/ordenCompra.docs.js";

async function ordenCompraRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "crear"),
    },
    (req, reply) => OrdenCompraController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarOrdenesCompra,
      preHandler: verificarPermiso("ordenes_compra", "ver"),
    },
    (req, reply) => OrdenCompraController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarOrdenesCompraPaginado,
      preHandler: verificarPermiso("ordenes_compra", "ver"),
    },
    (req, reply) => OrdenCompraController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "ver"),
    },
    (req, reply) => OrdenCompraController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    {
      schema: schemaActualizarOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "actualizar"),
    },
    (req, reply) => OrdenCompraController.actualizar(req, reply),
  );

  fastify.patch(
    "/:id/enviar",
    {
      schema: schemaEnviarOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "actualizar"),
    },
    (req, reply) => OrdenCompraController.enviar(req, reply),
  );

  fastify.patch(
    "/:id/recepcion",
    {
      schema: schemaRecepcionOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "actualizar"),
    },
    (req, reply) => OrdenCompraController.registrarRecepcion(req, reply),
  );

  fastify.patch(
    "/:id/anular",
    {
      schema: schemaAnularOrdenCompra,
      preHandler: verificarPermiso("ordenes_compra", "eliminar"),
    },
    (req, reply) => OrdenCompraController.anular(req, reply),
  );
}

export default ordenCompraRoutes;
