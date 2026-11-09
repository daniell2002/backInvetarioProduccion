/**
 * Marca a un usuario existente como superadministrador.
 *
 * Seguro por diseño:
 *  - Sin --aplicar solo MUESTRA lo que haría (no escribe nada).
 *  - Contra una base que no está en esta máquina exige además
 *    --confirmo-produccion.
 *  - Solo modifica el usuario indicado (colección "usuarios"); no toca roles
 *    ni ninguna otra colección. Ejecutarlo dos veces no cambia nada más.
 *  - No borra campos: esAdmin/rolId/sedeId quedan igual (permite volver atrás
 *    poniendo esSuperAdmin=false).
 *
 * Uso:
 *   node --env-file=.env.local scripts/migrar-superadmin.js --email admin@x.com
 *   node --env-file=.env.local scripts/migrar-superadmin.js --email admin@x.com --aplicar
 *   (producción) node scripts/migrar-superadmin.js --email admin@x.com --aplicar --confirmo-produccion
 */
import "dotenv/config";
import mongoose from "mongoose";
import { conectarDB } from "../src/config/db.js";

const args = process.argv.slice(2);
const valor = (nombre) => {
  const i = args.indexOf(nombre);
  return i >= 0 ? args[i + 1] : undefined;
};
const email = (valor("--email") || "").trim().toLowerCase();
const aplicar = args.includes("--aplicar");
const confirmoProduccion = args.includes("--confirmo-produccion");

if (!email) {
  console.error("Falta --email <correo del usuario que será superadmin>");
  process.exit(1);
}

const HOSTS_LOCALES = new Set(["localhost", "127.0.0.1", "::1"]);
const uri = process.env.MONGO_URI || "";
const hosts = uri
  .replace(/^mongodb(\+srv)?:\/\//, "")
  .split("@")
  .pop()
  .split("/")[0]
  .split(",")
  .map((h) => h.replace(/:\d+$/, ""));
const esRemota = hosts.some((h) => !HOSTS_LOCALES.has(h));

await conectarDB();
const db = mongoose.connection.db;
const usuarios = db.collection("usuarios");

console.log(`\nBase de datos: ${hosts.join(",")} / ${db.databaseName} ${esRemota ? "(REMOTA)" : "(local)"}`);

const superActuales = await usuarios
  .find({ esSuperAdmin: true }, { projection: { email: 1, activo: 1 } })
  .toArray();
console.log(`Superadmins actuales: ${superActuales.length ? superActuales.map((u) => u.email).join(", ") : "ninguno"}`);

const objetivo = await usuarios.findOne(
  { email },
  { projection: { email: 1, nombre: 1, activo: 1, esAdmin: 1, esSuperAdmin: 1 } },
);
if (!objetivo) {
  console.error(`No existe un usuario con email ${email}. No se hizo nada.`);
  await mongoose.disconnect();
  process.exit(1);
}
if (objetivo.activo === false) {
  console.error(`El usuario ${email} está inactivo. No se hizo nada.`);
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`Usuario: ${objetivo.nombre} <${objetivo.email}> | esAdmin=${!!objetivo.esAdmin} esSuperAdmin=${!!objetivo.esSuperAdmin}`);

if (objetivo.esSuperAdmin === true && objetivo.esAdmin === true) {
  console.log("Ya es superadmin. No hay nada que cambiar.");
  await mongoose.disconnect();
  process.exit(0);
}

console.log("Cambio: esSuperAdmin=true, esAdmin=true");

if (!aplicar) {
  console.log("\nSIMULACIÓN: no se escribió nada. Agrega --aplicar para hacer el cambio.");
  await mongoose.disconnect();
  process.exit(0);
}
if (esRemota && !confirmoProduccion) {
  console.error("\nLa base es REMOTA. Para aplicar agrega también --confirmo-produccion. No se hizo nada.");
  await mongoose.disconnect();
  process.exit(1);
}

const resultado = await usuarios.updateOne(
  { _id: objetivo._id },
  {
    $set: { esSuperAdmin: true, esAdmin: true },
    $push: {
      trazabilidad: {
        usuario: objetivo._id,
        accion: "actualizacion",
        descripcion: "Marcado como superadministrador (scripts/migrar-superadmin.js)",
        fecha: new Date(),
      },
    },
  },
);
console.log(`\nAPLICADO. Documentos modificados: ${resultado.modifiedCount}`);
await mongoose.disconnect();
