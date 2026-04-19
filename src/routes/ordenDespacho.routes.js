import OrdenDespachoController from "../controllers/OrdenDespachoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearOrdenDespacho,
  schemaListarOrdenesDespacho,
  schemaListarOrdenesDespachoPaginado,
  schemaObtenerOrdenDespacho,
  schemaCambiarEstadoDespacho,
} from "../docs/ordenDespacho.docs.js";

async function ordenDespachoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearOrdenDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "crear"),
    },
    (req, reply) => OrdenDespachoController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarOrdenesDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "ver"),
    },
    (req, reply) => OrdenDespachoController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarOrdenesDespachoPaginado,
      preHandler: verificarPermiso("ordenes_despacho", "ver"),
    },
    (req, reply) => OrdenDespachoController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerOrdenDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "ver"),
    },
    (req, reply) => OrdenDespachoController.obtenerPorId(req, reply),
  );

  fastify.patch(
    "/:id/preparar",
    {
      schema: schemaCambiarEstadoDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "actualizar"),
    },
    (req, reply) => OrdenDespachoController.preparar(req, reply),
  );

  fastify.patch(
    "/:id/despachar",
    {
      schema: schemaCambiarEstadoDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "actualizar"),
    },
    (req, reply) => OrdenDespachoController.despachar(req, reply),
  );

  fastify.patch(
    "/:id/confirmar-entrega",
    {
      schema: schemaCambiarEstadoDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "actualizar"),
    },
    (req, reply) => OrdenDespachoController.confirmarEntrega(req, reply),
  );

  fastify.patch(
    "/:id/anular",
    {
      schema: schemaCambiarEstadoDespacho,
      preHandler: verificarPermiso("ordenes_despacho", "eliminar"),
    },
    (req, reply) => OrdenDespachoController.anular(req, reply),
  );
}

export default ordenDespachoRoutes;
