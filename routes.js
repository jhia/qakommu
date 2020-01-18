const fs = require('fs');
const path = require('path');
const router = require('express').Router();

fs
  .readdirSync(__dirname+'/modules')
  .forEach( moduleName => {

  	const routerModule = require(path.join(__dirname,"modules",moduleName, moduleName+'.router.js'));
  	router.use(`/${moduleName}`,routerModule)
  
  });

module.exports = router;
