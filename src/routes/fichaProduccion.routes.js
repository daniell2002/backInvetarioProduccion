import FichaProduccionController from "../controllers/FichaProduccionController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearFichaProduccion,
  schemaListarFichasProduccion,
  schemaListarFichasProduccionPaginado,
  schemaObtenerFichaProduccion,
  schemaActualizarFichaProduccion,
  schemaAprobarFichaProduccion,
  schemaObsoletarFichaProduccion,
  schemaEliminarFichaProduccion,
  schemaListarFichasAprobadas,
} from "../docs/produccion.docs.js";

async function fichaProduccionRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  // Crear ficha de producción
  fastify.post(
    "/",
    {
      schema: schemaCrearFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "crear"),
    },
    (req, reply) => FichaProduccionController.crear(req, reply),
  );

  // Listar fichas
  fastify.get(
    "/",
    {
      schema: schemaListarFichasProduccion,
      preHandler: verificarPermiso("fichas_produccion", "ver"),
    },
    (req, reply) => FichaProduccionController.listar(req, reply),
  );

  // Listar fichas paginado
  fastify.get(
    "/paginado",
    {
      schema: schemaListarFichasProduccionPaginado,
      preHandler: verificarPermiso("fichas_produccion", "ver"),
    },
    (req, reply) => FichaProduccionController.listarPaginado(req, reply),
  );

  // Fichas aprobadas por producto final
  fastify.get(
    "/aprobadas/:productoFinalId",
    {
      schema: schemaListarFichasAprobadas,
      preHandler: verificarPermiso("fichas_produccion", "ver"),
    },
    (req, reply) => FichaProduccionController.listarAprobadas(req, reply),
  );

  // Obtener ficha por ID
  fastify.get(
    "/:id",
    {
      schema: schemaObtenerFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "ver"),
    },
    (req, reply) => FichaProduccionController.obtenerPorId(req, reply),
  );

  // Actualizar ficha (solo pendiente)
  fastify.put(
    "/:id",
    {
      schema: schemaActualizarFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "actualizar"),
    },
    (req, reply) => FichaProduccionController.actualizar(req, reply),
  );

  // Aprobar ficha
  fastify.patch(
    "/:id/aprobar",
    {
      schema: schemaAprobarFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "actualizar"),
    },
    (req, reply) => FichaProduccionController.aprobar(req, reply),
  );

  // Obsoletar ficha
  fastify.patch(
    "/:id/obsoletar",
    {
      schema: schemaObsoletarFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "actualizar"),
    },
    (req, reply) => FichaProduccionController.obsoletar(req, reply),
  );

  // Eliminar ficha (soft delete)
  fastify.delete(
    "/:id",
    {
      schema: schemaEliminarFichaProduccion,
      preHandler: verificarPermiso("fichas_produccion", "eliminar"),
    },
    (req, reply) => FichaProduccionController.eliminar(req, reply),
  );
}

export default fichaProduccionRoutes;
