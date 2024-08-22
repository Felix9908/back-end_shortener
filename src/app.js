import express from "express";
import cors from "cors";
import { createDatabasePool } from "./config.js";
import { checkDatabaseConnection } from "./config.js";
import { PORT } from "./config.js";

const app = express();
app.use(express.json());
app.use(cors());

export const db = createDatabasePool();

checkDatabaseConnection();

app.listen(PORT, () => {
  console.log(`The server is listening to the port: ${PORT}`);
});
