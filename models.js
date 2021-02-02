'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env =  process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const db = {};

let sequelize = null;

if(config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

sequelize.authenticate().catch(() => {
  if(env !== 'production') {
    throw err; // connection error, please reset connection
  }
})

fs
  .readdirSync(__dirname+'/modules')
  .forEach( moduleName => {
    if(!/^_/.test(moduleName)) {
      const modelFile = path.join(__dirname,"modules",moduleName, moduleName+'.model.js')
      if(fs.existsSync(modelFile)){
        const model = sequelize['import'](modelFile);
        db[model.name] = model;
      }
    }
  }) 

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
