const schemaImportarProductos = {
  summary: "Importar productos desde Excel o CSV",
  description:
    "Importación masiva de productos desde un archivo `.xlsx`, `.xls` o `.csv`. " +
    "El archivo debe tener encabezados en la primera fila. Columnas reconocidas (sin distinción de mayúsculas ni acentos):\n\n" +
    "- **nombre / descripcion** — nombre del producto *(obligatorio)*\n" +
    "- **grupo / categoria** — nombre de categoría (se crea si no existe)\n" +
    "- **descripcion grupo / subcategoria** — nombre de subcategoría dentro de la categoría\n" +
    "- **unidad medida / um / und** — código de unidad de medida *(obligatorio)*\n" +
    "- **codigo externo / referencia** — código externo / referencia\n" +
    "- **valor unidad / valor unitario** — precio unitario\n" +
    "- **cant exist. real / stock** — cantidad inicial en stock\n\n" +
    "El `codigoInterno` lo genera el sistema automáticamente. " +
    "Los campos `sedeId`, `pagina` y `limite` se envían como campos del form.",
  tags: ["Importación Productos"],
  security: [{ bearerAuth: [] }],
  consumes: ["multipart/form-data"],
  body: {
    type: "object",
    properties: {
      archivo: {
        type: "string",
        format: "binary",
        description:
          "Archivo Excel (.xlsx, .xls) o CSV con los productos a importar",
      },
      sedeId: {
        type: "string",
        description: "ID de la sede destino (obligatorio)",
      },
      pagina: {
        type: "integer",
        default: 1,
        description: "Número de página de resultados",
      },
      limite: {
        type: "integer",
        default: 50,
        description: "Resultados por página (máx. 200)",
      },
    },
  },
  response: {
    200: {
      description: "Importación procesada",
      type: "object",
      properties: {
        statusCode: { type: "integer" },
        status: { type: "string" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            totalArchivo: {
              type: "integer",
              description: "Total de filas en el archivo",
            },
            exitosos: {
              type: "integer",
              description: "Productos creados exitosamente",
            },
            errores: {
              type: "integer",
              description: "Filas que no pudieron procesarse",
            },
            resultados: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  fila: { type: "integer" },
                  estado: { type: "string", enum: ["exitoso", "error"] },
                  motivo: { type: "string", nullable: true },
                  datos: {
                    type: "object",
                    nullable: true,
                    additionalProperties: true,
                  },
                },
              },
            },
            paginacion: {
              type: "object",
              properties: {
                pagina: { type: "integer" },
                limite: { type: "integer" },
                total: { type: "integer" },
                totalPaginas: { type: "integer" },
                hayPaginaSiguiente: { type: "boolean" },
                hayPaginaAnterior: { type: "boolean" },
              },
            },
          },
        },
      },
    },
    400: { description: "Archivo no recibido o formato inválido" },
  },
};

export { schemaImportarProductos };
