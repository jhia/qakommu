const fs = require('fs');
const path = require('path');

module.exports = {
	createModule(name){
		const modulePath = path.join('./modules',name);

		fs.mkdirSync(modulePath);
		this.createRouter(name,modulePath);
		this.createController(name,modulePath);
		this.createModel(name,modulePath);

	},
	createRouter(name,modulePath){
		const data = `'use strict'

const router = require('express').Router();
const ${name}Controller = require('./${name}.controller');

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  res.status('200').send(${name}Controller.getFunc());
});

router.post('/',(req, res) => {
  ///HTTP post route
  res.status('200').send(${name}Controller.postFunc());
});

router.put('/',(req, res) => {
  //HTTP put route
  res.status('200').send(${name}Controller.putFunc());
});

router.delete('/',(req, res) => {
  //HTTP delete route
  res.status('200').send(${name}Controller.deleteFunc());
});

module.exports = router;`

fs.writeFile(path.join(modulePath,`${name}.router.js`), data,()=>{
	console.log("Successfully created")
});
	},
	createController(name,modulePath){
		const data = `'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const { ${name} } = require('../../models.js');

const controller = new Base('${name}');

/*controller.postFunc = function () {
	//Overwrite the base post function
	return \`POST to \${this.moduleName} overwritten\`;
}*/

module.exports = controller;`

fs.writeFile(path.join(modulePath,`${name}.controller.js`), data,()=>{
	console.log("Successfully created")
});
	},
	createModel(name,modulePath){
		const data = `'use strict'

module.exports = (sequelize, DataTypes) => {
    const ${name} = sequelize.define('${name}', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		}
    });

    ${name}.associate = function(models){
    	//To create model associations
    }

    return ${name};
}`

		fs.writeFile(path.join(modulePath,`${name}.model.js`), data,()=>{
			console.log("Successfully created")
		});
	}
}