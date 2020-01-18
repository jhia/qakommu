const db = require('../models')

db.sequelize.sync().then(function(){
    console.log('DB connection sucessful.');
  }, function(err){
    console.log(err);
  });  

