import mongoose from "mongoose";
import { logger } from "./logger.js";

const HOSTS_LOCALES = new Set(["localhost", "127.0.0.1", "::1"]);

// Hosts de la URI (puede traer varios: "h1:27017,h2:27017").
const hostsDeUri = (uri = "") => {
  const sinEsquema = uri.replace(/^mongodb(\+srv)?:\/\//, "");
  const sinCredenciales = sinEsquema.includes("@") ? sinEsquema.split("@").pop() : sinEsquema;
  return sinCredenciales.split("/")[0].split(",").map((h) => h.replace(/:\d+$/, "").replace(/^\[|\]$/g, ""));
};

export const conectarDB = async () => {
  // Protección: con ENTORNO=local (npm run dev:local / .env.local) solo se
  // permite una base en esta máquina. Evita que las pruebas escriban en
  // producción si falta o se cambia la línea MONGO_URI de .env.local.
  if (process.env.ENTORNO === "local") {
    const hosts = hostsDeUri(process.env.MONGO_URI);
    if (!hosts.length || hosts.some((h) => !HOSTS_LOCALES.has(h))) {
      logger.error(
        { hosts },
        "ENTORNO=local pero MONGO_URI no apunta a esta máquina. Conexión bloqueada.",
      );
      process.exit(1);
    }
  }

  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    logger.info(
      `MongoDB conectado: ${conexion.connection.host}/${conexion.connection.name}` +
        (process.env.ENTORNO ? ` [ENTORNO=${process.env.ENTORNO}]` : ""),
    );
  } catch (error) {
    logger.error({ error: error.message }, "Error al conectar a MongoDB");
    process.exit(1);
  }
};
