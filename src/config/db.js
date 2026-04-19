import mongoose from "mongoose";
import { logger } from "./logger.js";

export const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI);
    logger.info(
      `MongoDB conectado: ${conexion.connection.host}/${conexion.connection.name}`,
    );
  } catch (error) {
    logger.error({ error: error.message }, "Error al conectar a MongoDB");
    process.exit(1);
  }
};
