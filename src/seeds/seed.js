import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Rol from "../models/Rol.js";
import Usuario from "../models/Usuario.js";
import { generarTodosLosPermisos } from "../utils/permisos.util.js";
import { crearTrazabilidad } from "../utils/trazabilidad.util.js";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sistema.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234*";
const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE || "Administrador";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✔ Conectado a MongoDB");

    // ─── Rol Administrador ───────────────────────────────────
    let rolAdmin = await Rol.findOne({ nombre: "Administrador" });

    if (!rolAdmin) {
      rolAdmin = await Rol.create({
        nombre: "Administrador",
        descripcion: "Rol con todos los permisos del sistema",
        permisos: generarTodosLosPermisos(),
        esPredeterminado: true,
        activo: true,
      });
      console.log("✔ Rol Administrador creado");
    } else {
      rolAdmin.permisos = generarTodosLosPermisos();
      await rolAdmin.save();
      console.log("⚡ Rol Administrador ya existía — permisos actualizados");
    }

    // ─── Usuario Admin ───────────────────────────────────────
    let admin = await Usuario.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

      admin = await Usuario.create({
        nombre: ADMIN_NOMBRE,
        email: ADMIN_EMAIL,
        passwordHash,
        rolId: rolAdmin._id,
        esAdmin: true,
        debeCambiarContrasena: false,
        activo: true,
      });

      // Agregar trazabilidad con el ID del admin recién creado
      await Usuario.findByIdAndUpdate(admin._id, {
        $push: {
          trazabilidad: crearTrazabilidad(
            admin._id,
            "creacion",
            "Usuario admin creado por seed inicial",
          ),
        },
      });
      await Rol.findByIdAndUpdate(rolAdmin._id, {
        $push: {
          trazabilidad: crearTrazabilidad(
            admin._id,
            "creacion",
            "Rol creado por seed inicial",
          ),
        },
      });

      console.log(`✔ Usuario admin creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    } else {
      console.log("⚡ Usuario admin ya existe — sin cambios");
    }

    console.log("\n✔ Seed completado exitosamente");
  } catch (error) {
    console.error("✖ Error en seed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
