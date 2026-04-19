import ProduccionController from "../controllers/ProduccionController.js";
import { autenticar } from "../hooks/auth.hook.js";
import { verificarPermiso } from "../hooks/permisos.hook.js";
import {
  schemaCrearProduccion,
  schemaListarProducciones,
  schemaListarProduccionesPaginado,
  schemaObtenerProduccion,
  schemaIniciarProduccion,
  schemaCompletarProduccion,
  schemaAnularProduccion,
  schemaProyectarProduccion,
  schemaEstimarCostoProduccion,
} from "../docs/produccion.docs.js";

async function produccionRoutes(fastify) {
  fastify.addHook("onRequest", autenticar);

  // Crear orden de producción
  fastify.post(
    "/",
    {
      schema: schemaCrearProduccion,
      preHandler: verificarPermiso("produccion", "crear"),
    },
    (req, reply) => ProduccionController.crear(req, reply),
  );

  // Listar producciones
  fastify.get(
    "/",
    {
      schema: schemaListarProducciones,
      preHandler: verificarPermiso("produccion", "ver"),
    },
    (req, reply) => ProduccionController.listar(req, reply),
  );

  // Listar paginado
  fastify.get(
    "/paginado",
    {
      schema: schemaListarProduccionesPaginado,
      preHandler: verificarPermiso("produccion", "ver"),
    },
    (req, reply) => ProduccionController.listarPaginado(req, reply),
  );

  // Proyectar producción (cuánto puedo fabricar)
  fastify.get(
    "/proyectar",
    {
      schema: schemaProyectarProduccion,
      preHandler: verificarPermiso("produccion", "ver"),
    },
    (req, reply) => ProduccionController.proyectar(req, reply),
  );

  // Estimar costo de producción
  fastify.get(
    "/estimar-costo",
    {
      schema: schemaEstimarCostoProduccion,
      preHandler: verificarPermiso("produccion", "ver"),
    },
    (req, reply) => ProduccionController.estimarCosto(req, reply),
  );

  // Obtener producción por ID
  fastify.get(
    "/:id",
    {
      schema: schemaObtenerProduccion,
      preHandler: verificarPermiso("produccion", "ver"),
    },
    (req, reply) => ProduccionController.obtenerPorId(req, reply),
  );

  // Iniciar producción
  fastify.patch(
    "/:id/iniciar",
    {
      schema: schemaIniciarProduccion,
      preHandler: verificarPermiso("produccion", "actualizar"),
    },
    (req, reply) => ProduccionController.iniciar(req, reply),
  );

  // Completar producción
  fastify.patch(
    "/:id/completar",
    {
      schema: schemaCompletarProduccion,
      preHandler: verificarPermiso("produccion", "actualizar"),
    },
    (req, reply) => ProduccionController.completar(req, reply),
  );

  // Anular producción
  fastify.patch(
    "/:id/anular",
    {
      schema: schemaAnularProduccion,
      preHandler: verificarPermiso("produccion", "actualizar"),
    },
    (req, reply) => ProduccionController.anular(req, reply),
  );
}

export default produccionRoutes;
