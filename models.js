'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env =  process.env.NODE_ENV || 'development_local';
const { database } = require('./config/config');
const db = {};

let sequelize = null;

if (!sequelize) {
  const { DATABASE_URL } = process.env;
  if (!!DATABASE_URL) {
    sequelize = new Sequelize(DATABASE_URL);
  } else {
    sequelize = new Sequelize(
      database.NAME, 
      database.USER, 
      database.PASSWORD,{
        host: database.HOST,
        dialect:'postgresql' 
    });
  }
(function connectionVerify(){
  let retries = 5;
  let verify = function(){
    console.log(`try number ${retries} to connect to the database`);
    
    if(!retries) return;

    sequelize
      .authenticate()
      .then(()=>{
        console.log("Successfully connected to the database");
        retries = 0;
      })
      .catch( async err =>{
        console.log(err);
        setTimeout(verify,5000);
      });
      retries -= 1;
  };
  verify();

})();
}
 
fs
  .readdirSync(__dirname+'/modules')
  .forEach( moduleName => {
      const modelFile = path.join(__dirname,"modules",moduleName, moduleName+'.model.js')
      if(fs.existsSync(modelFile)){
        const model = sequelize['import'](modelFile);
        db[model.name] = model;
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
