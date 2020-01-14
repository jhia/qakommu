'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env =  process.env.NODE_ENV || 'development_local';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



/* 
let cosa = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });
 */

let cosa = fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) !== '.js');
  })
  
  console.log(cosa)
 
let ruta = []  
for (let i = 0; i < cosa.length; i++) {
  ruta[i] = '/app/modules/'+cosa[i]+"/"+cosa[i]+'.model.js'
}
for (let i = 0; i < ruta.length; i++) {
  try {
    sequelize.import(ruta[i])
    sequelize.sync;
    sequelize.sync({ force: true })        
  } catch (error) {
    console.log(error.message)
  }

}
console.log(ruta[17])

//let model = sequelize['import'](path.join(ruta[0],arc[0])); 

//model.sequelize = sequelize;
//sequelize.sync;



/*
// esta buenisimo
const model = sequelize['import'](path.join('/app/modules/repository', 'repository.model.js'));
 */



Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



//db.sequelize = sequelize;
//sequelize.sync;



module.exports = db;
