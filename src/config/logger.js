import pino from "pino";

export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        }
      : undefined,
});

export const logAccionUsuario = (usuarioId, accion, contexto = {}) => {
  logger.info({ usuarioId, accion, ...contexto }, `Acción: ${accion}`);
};

export const logError = (error, contexto = {}) => {
  logger.error(
    { error: error.message, stack: error.stack, ...contexto },
    "Error registrado",
  );
};
