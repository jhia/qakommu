const fs = require('fs');
const path = require('path');

module.exports = {
	createModule(name,param){
		const modulePath = path.join('./modules',name);

		fs.mkdirSync(modulePath);
		switch(param){
			case '--no-model':
				this.createRouter(name,modulePath);
				this.createController(name,modulePath);
			break;
			case '--only-model':
				this.createModel(name,modulePath);
			break;
			default:
				this.createRouter(name,modulePath);
				this.createController(name,modulePath);
				this.createModel(name,modulePath);
			break;
		}

	},
	createRouter(name,modulePath){
		const data = `'use strict'

const router = require('express').Router();
const ${name}Controller = require('./${name}.controller');
const Response = require('../../http/response')

router.use((req, res, next) => {
  //Use this to apply a middleware only to this module
  next();
});

router.get('/',function(req, res){
  //HTTP get route
  ${name}Controller.getFunc(req, new Response(res));
});

router.post('/',(req, res) => {
  ///HTTP post route
  ${name}Controller.postFunc(req, new Response(res));
});

router.put('/',(req, res) => {
  //HTTP put route
  ${name}Controller.putFunc(req, new Response(res));
});

router.delete('/',(req, res) => {
  //HTTP delete route
  ${name}Controller.deleteFunc(req, new Response(res));
});

module.exports = router;`

fs.writeFile(path.join(modulePath,`${name}.router.js`), data,()=>{
	console.log(`Successfully created ${name} router`);
});
	},
	createController(name,modulePath){
		const data = `'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('${name}');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

module.exports = controller;`

fs.writeFile(path.join(modulePath,`${name}.controller.js`), data,()=>{
	console.log(`Successfully created ${name} controller`);
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
			type: DataTypes.INTEGER
		}
    });

    ${name}.associate = function(models){
    	//To create model associations
    }

    return ${name};
}`

		fs.writeFile(path.join(modulePath,`${name}.model.js`), data,()=>{
			console.log(`Successfully created ${name} model`);
		});
	}
}