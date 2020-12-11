'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const jwt = require('jsonwebtoken');

const controller = new Base('like_topic');

controller.getFunc = async function (req, res) {

    const { id_topic } = req.params;
    const { limit, offset, order, attributes } = req.body;
    const { activity } = this.db;

    try {
	const data = await this.db.like_topic.count({
	    where: { id_topic }
	});

	this.response({
	    res,
	    payload: { data }

	});
    } catch (error) {
	this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: 'something went wrong',
	});
    }

}


controller.postFunc = async function (req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, 'secret');
    const { user, user_type } = this.db;
    const email = decoded.email;

    let search_id_user = await user.findOne({
	where: { email }
    });

    const id_user = search_id_user['id'];


    const { id_topic } = req.body;
    try {
	let newdate = await this.insert({
	    id_user,
	    id_topic
	});
	if (newdate) {
	    return this.response({
		res,
		statusCode: 201,
		payload: newdate
	    });
	}
    } catch (err) {
	return this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: err.message,
	});
    }

}











module.exports = controller;
