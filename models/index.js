// index.js (carpeta de modelos)

import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Configuración de la base de datos
const configPath = pathToFileURL(path.join(__dirname, '../config/config.json')).href;
const { default: config } = await import(configPath, { assert: { type: 'json' } });

const db = {};
let sequelize;

if (config[env].use_env_variable) {
  sequelize = new Sequelize(process.env[config[env].use_env_variable], config[env]);
} else {
  sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);
}

// Leer todos los archivos de modelos en la carpeta actual
const files = fs.readdirSync(__dirname).filter(file => {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
});

// Importar cada modelo y asignarlo al objeto `db`
for (const file of files) {
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const model = (await import(modelPath)).default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Configurar las asociaciones entre los modelos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
