import express from "express";
import cors from "cors";
import { createDatabasePool } from "./config.js";
import { checkDatabaseConnection } from "./config.js";

const app = express();
app.use(express.json());
app.use(cors());

export const db = createDatabasePool();

checkDatabaseConnection();

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The server is listening to the port: ${PORT}`);
});
