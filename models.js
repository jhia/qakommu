'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env =  process.env.NODE_ENV || 'development_local';
const { database } = require('./config/config');
const db = {};

let sequelize = new Sequelize(
                      database.NAME, 
                      database.USER, 
                      database.PASSWORD,{
                         host: database.HOST,
                         dialect:'postgresql' 
                    });

let retries = 5;
while(retries){
  console.log(`try number ${retries}`);
  try{
    sequelize.authenticate();
    break;
  }catch(err){
    console.log(err);
    retries -= 1;
    setTimeout(res, 5000);
  }

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
  .readdirSync(__dirname+'/modules')
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
