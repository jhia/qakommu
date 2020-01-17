'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env =  process.env.NODE_ENV || 'development_local';
const config = require('./config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

let modules = fs
  .readdirSync(__dirname+"/modules/")
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) !== '.js');
  }).forEach(file => {
    try {
      const model =  sequelize.import('/app/modules/'+file+"/"+file+'.model.js')
      db[model.name] = model;
    } catch (error) {
      console.log(error.message)
    }
  })
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
module.exports = db;
