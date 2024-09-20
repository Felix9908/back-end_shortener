import { db } from "./app.js";

export async function checkDatabaseConnection() {
  try {
    await db.execute("SELECT 1");
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Salir con código de error si no hay conexión
  }
}
