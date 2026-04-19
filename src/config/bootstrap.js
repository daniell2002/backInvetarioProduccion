import bcrypt from "bcryptjs";
import Rol from "../models/Rol.js";
import Usuario from "../models/Usuario.js";
import { logger } from "./logger.js";
import { generarTodosLosPermisos } from "../utils/permisos.util.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sistema.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234*";
const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE || "Administrador";

/**
 * Crea el primer usuario administrador al iniciar el sistema,
 * únicamente cuando no existe ningún usuario en la base de datos.
 */
export const inicializarPrimerUsuario = async () => {
  const totalUsuarios = await Usuario.countDocuments({});

  if (totalUsuarios > 0) {
    return;
  }

  let rolAdministrador = await Rol.findOne({ nombre: "Administrador" });

  if (!rolAdministrador) {
    rolAdministrador = await Rol.create({
      nombre: "Administrador",
      descripcion: "Rol con todos los permisos del sistema",
      permisos: generarTodosLosPermisos(),
      esPredeterminado: true,
      activo: true,
    });

    logger.info("Bootstrap: rol Administrador creado");
  } else {
    rolAdministrador.permisos = generarTodosLosPermisos();
    await rolAdministrador.save();

    logger.info(
      "Bootstrap: rol Administrador actualizado con todos los permisos",
    );
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  await Usuario.create({
    nombre: ADMIN_NOMBRE,
    email: ADMIN_EMAIL,
    passwordHash,
    rolId: rolAdministrador._id,
    esAdmin: true,
    debeCambiarContrasena: false,
    activo: true,
  });

  logger.warn(
    { email: ADMIN_EMAIL },
    "Bootstrap: se creo el primer usuario administrador. Cambia la contrasena despues del primer ingreso.",
  );
};
