const Base = require('../../helpers/base.controller');

const controller = new Base('attendee');

controller.postFunc = () => {
	//Overwrite the base post function
	return `POST to ${this.moduleName} overwritten`;
}

module.exports = controller;
