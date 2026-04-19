import ProductoController from "../controllers/ProductoController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearProducto,
  schemaListarProductos,
  schemaListarProductosPaginado,
  schemaObtenerProducto,
  schemaActualizarProducto,
  schemaEliminarProducto,
} from "../docs/producto.docs.js";

async function productoRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  fastify.post(
    "/",
    {
      schema: schemaCrearProducto,
      preHandler: verificarPermiso("productos", "crear"),
    },
    (req, reply) => ProductoController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarProductos,
      preHandler: verificarPermiso("productos", "ver"),
    },
    (req, reply) => ProductoController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarProductosPaginado,
      preHandler: verificarPermiso("productos", "ver"),
    },
    (req, reply) => ProductoController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerProducto,
      preHandler: verificarPermiso("productos", "ver"),
    },
    (req, reply) => ProductoController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    {
      schema: schemaActualizarProducto,
      preHandler: verificarPermiso("productos", "actualizar"),
    },
    (req, reply) => ProductoController.actualizar(req, reply),
  );

  fastify.delete(
    "/:id",
    {
      schema: schemaEliminarProducto,
      preHandler: verificarPermiso("productos", "eliminar"),
    },
    (req, reply) => ProductoController.eliminar(req, reply),
  );
}

export default productoRoutes;
