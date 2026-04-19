import CategoriaController from "../controllers/CategoriaController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearCategoria,
  schemaListarCategorias,
  schemaListarCategoriasPaginado,
  schemaObtenerCategoria,
  schemaActualizarCategoria,
  schemaEliminarCategoria,
  schemaAgregarSubcategoria,
  schemaActualizarSubcategoria,
  schemaEliminarSubcategoria,
} from "../docs/categoria.docs.js";

async function categoriaRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  // Categorías
  fastify.post(
    "/",
    {
      schema: schemaCrearCategoria,
      preHandler: verificarPermiso("categorias", "crear"),
    },
    (req, reply) => CategoriaController.crear(req, reply),
  );

  fastify.get(
    "/",
    {
      schema: schemaListarCategorias,
      preHandler: verificarPermiso("categorias", "ver"),
    },
    (req, reply) => CategoriaController.listar(req, reply),
  );

  fastify.get(
    "/paginado",
    {
      schema: schemaListarCategoriasPaginado,
      preHandler: verificarPermiso("categorias", "ver"),
    },
    (req, reply) => CategoriaController.listarPaginado(req, reply),
  );

  fastify.get(
    "/:id",
    {
      schema: schemaObtenerCategoria,
      preHandler: verificarPermiso("categorias", "ver"),
    },
    (req, reply) => CategoriaController.obtenerPorId(req, reply),
  );

  fastify.put(
    "/:id",
    {
      schema: schemaActualizarCategoria,
      preHandler: verificarPermiso("categorias", "actualizar"),
    },
    (req, reply) => CategoriaController.actualizar(req, reply),
  );

  fastify.delete(
    "/:id",
    {
      schema: schemaEliminarCategoria,
      preHandler: verificarPermiso("categorias", "eliminar"),
    },
    (req, reply) => CategoriaController.eliminar(req, reply),
  );

  // Subcategorías
  fastify.post(
    "/:id/subcategorias",
    {
      schema: schemaAgregarSubcategoria,
      preHandler: verificarPermiso("categorias", "crear"),
    },
    (req, reply) => CategoriaController.agregarSubcategoria(req, reply),
  );

  fastify.put(
    "/:id/subcategorias/:subId",
    {
      schema: schemaActualizarSubcategoria,
      preHandler: verificarPermiso("categorias", "actualizar"),
    },
    (req, reply) => CategoriaController.actualizarSubcategoria(req, reply),
  );

  fastify.delete(
    "/:id/subcategorias/:subId",
    {
      schema: schemaEliminarSubcategoria,
      preHandler: verificarPermiso("categorias", "eliminar"),
    },
    (req, reply) => CategoriaController.eliminarSubcategoria(req, reply),
  );
}

export default categoriaRoutes;
