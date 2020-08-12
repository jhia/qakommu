'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const jwt = require('jsonwebtoken');

const controller = new Base('like');

controller.getFunc = async function (req, res) {
  const { id } = req.params;
  const { limit, offset, order, attributes } = req.body;
  const { sequelize } = this.db

  try {
    const query = `SELECT
    id_post,
      id_user,
      reference_message,
      COUNT(reference_message) AS count_reference
    FROM LIKES
    WHERE id_post =:id
    GROUP BY id_post,reference_message,id_user
    HAVING COUNT(reference_message) > 0`;

    const query_total_like= `SELECT
    COUNT(id) as total_likes
    FROM LIKES WHERE id_post =:id`


    const query_like = await sequelize.query(`${query}`, { replacements:{id: id}, type: sequelize.QueryTypes.SELECT });
    const y = await sequelize.query(`${query_total_like}`, { replacements:{id: id}, type: sequelize.QueryTypes.SELECT });
    const total_likes = y[0].total_likes


    const data = query_like.map(x => {
      console.log(x)
      let rx = {};

      rx = {
	id_post: x.id_post,
	id_user: x.id_user,
	reference: x.reference_message,
	count_reference: x.count_reference
      }
      return rx;


    })

    return this.response({
      res,
      payload: {
	total_likes,
	data
      }

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
  const { user, user_type } = this.db;
  const email = decoded.email;

  let search_id_user = await user.findOne({
    where: { email }
  });

  const id_user = search_id_user['id'];

  let search_id_community = await user_type.findOne({
    where: { id_user }
  });

  const id_community = search_id_community['id_community'];

  const { id_post, reference_message } = req.body;
  try {
    let newdate = await this.insert({
      id_post,
      id_user,
      id_community,
      reference_message
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
