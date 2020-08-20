'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');

const controller = new Base('image_post');
const { delete_image } = require('../../helpers/utilities')
/*
 *Extend or overwrite the base functions
 *All the controllers already have implicit the models by:
 *this.db -> All models
 *this.model -> Current module model
 */

controller.deleteFunc = async function (req, res) {

  const { image } = req.params;


  try {

    const deleterows = await this.db.image_post.destroy({
      where: {
	route: image
      }
    })
    delete_image(image)



    if (deleterows > 0) {
      return this.response({
	res,
	success: true,
	statusCode: 200
      });
    } else {
      this.response({
	res,
	success: false,
	statusCode: 202,
	message: 'it was not possible to delete the item because it does not exist'
      });
    }

  } catch (error) {
    this.response({
      res,
      success: false,
      statusCode: 500,
      message: 'something went wrong'
    });
  }




}






module.exports = controller;
