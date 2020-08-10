'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const jwt = require('jsonwebtoken');

const controller = new Base('like');



controller.getFunc = async function (req, res) {

    const { id } = req.params;
    const { limit, offset, order, attributes } = req.body;
    try {
        const data = await this.getData({
            id,
            limit,
            offset,
            attributes: [ 'id_post','id_user', 'reference' ],
            order
        });

        return this.response({
            res,
            payload: [data]
        });
    } catch (error) {
        return this.response({
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
  const { user } = this.db;
  const email = decoded.email;

  let search_id_user = await user.findOne({
    where: { email }
  });

  const id_user = search_id_user['id'];

  const { id_post, reference } = req.body;
  try {
    let newdate = await this.insert({
      id_post,
      id_user,
      reference
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
