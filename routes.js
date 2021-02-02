const fs = require('fs');
const path = require('path');
const router = require('express').Router();

fs
  .readdirSync(__dirname+'/modules')
  .forEach( moduleName => {
		if(!/^_/.test(moduleName)) {
			const routerDir = path.join(__dirname,"modules",moduleName, moduleName+'.router.js');
			if(fs.existsSync(routerDir)){
				const routerModule = require(routerDir);
				router.use(`/${moduleName}`,routerModule)
			}
		}
  });

module.exports = router;
