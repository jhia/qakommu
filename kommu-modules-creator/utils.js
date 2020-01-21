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
  ${name}Controller.getFunc(req,res);
});

router.post('/',(req, res) => {
  ///HTTP post route
  ${name}Controller.postFunc(req,res);
});

router.put('/',(req, res) => {
  //HTTP put route
  ${name}Controller.putFunc(req,res);
});

router.delete('/',(req, res) => {
  //HTTP delete route
  ${name}Controller.deleteFunc(req,res);
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

const controller = new Base('${name}');

/*
*Extend or overwrite the base functions
*All the controllers already have implicit the models by:
*this.db -> All models
*this.model -> Current module model
*/

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