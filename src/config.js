import mysql2 from "mysql2";

export const PORT = process.env.PORT || 9999;

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DATABASE = process.env.DB_DATABASE || "notiexpressDB";
const DB_PORT = process.env.DB_PORT || "3306";

export const createDatabasePool = () => {
  return mysql2.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    port: DB_PORT,
    connectionLimit: 10,
  });
};

export async function checkDatabaseConnection() {
  try {
    await db.execute("SELECT 1");
    console.log("Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1); // Salir con código de error si no hay conexión
  }
}
