import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Manejo de la importación del archivo config.json
const configPath = pathToFileURL(path.join(__dirname, '../config/config.json')).href;
const { default: config } = await import(configPath, { assert: { type: 'json' } });

const db = {};

let sequelize;
if (config[env].use_env_variable && process.env[config[env].use_env_variable]) {
  sequelize = new Sequelize(process.env[config[env].use_env_variable], config[env]);
} else {
  sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, config[env]);
}

// Importar todos los modelos
const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  );
});

// Importar modelos de forma asíncrona y con URLs válidas
for (const file of files) {
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const model = (await import(modelPath)).default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Configurar las asociaciones entre modelos (si las hay)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
