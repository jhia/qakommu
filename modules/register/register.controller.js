'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('register');
const { makeid , verify_and_upload_image_post } = require('../../helpers/utilities')

controller.postFunc = async function (req, res) {

  const {user_type,user,community,channel} = this.db
  const { name, last_name, username, country, city, address, country_code, phone, email, password, gender, id_repository, id_role, id_community, nameCommunity} = req.body;
  let {codeCommunity} = req.body;
  const { comunity_code,invitation_code } = req.params;
  const jwt = require('jsonwebtoken');
  const avatar = req.files ? req.files.avatar: null;

  try {
    const profile_photo = verify_and_upload_image_post(avatar,"profile_photo");

    let data = []
    let decoded
    if (invitation_code) {
      decoded = jwt.verify(invitation_code, 'secret');
      codeCommunity = comunity_code;

      let query_invitation_code = await user_type.findOne({
	where: { invitation_code: decoded.data.invitation_code }
      });

      if (query_invitation_code) {
	throw new Error("Invitation code used!")
      }
    }

    if (!nameCommunity && !codeCommunity) throw new Error("needs community")
    if (codeCommunity) {
      data = await community.findOne({
	where: { code: codeCommunity },
	attributes: ['id', 'name']
      });
    }

    let query_user = await user.findOne({
      where: { email }
    });

    if (query_user) {
      throw new Error("Email exist")
    }

    if(nameCommunity){
      data = await community.create({
	name: nameCommunity,
	code: makeid(6)
      }); 			

      await channel.create({
	name: nameCommunity,
	description: nameCommunity,
	id_community: invitation_code ? decoded.data.community_id : data['id']
      });


    }		

    if (!data) {
      throw new Error("the code does not belong to any community!");
    }

    let result = await user.create(
      {
	name,
	last_name,
	username,
	profile_photo,
	country,
	city,
	address,
	country_code,
	phone,
	email,
	password,
	gender,
	id_repository,
	id_role
      });

    await user_type.create(
      {
	id_user: result.id,
	id_role: id_role,
	id_community: invitation_code ? decoded.data.community_id : data['id'],
	invitation_code: invitation_code ? decoded.data.invitation_code : null
      });

    if(result)
    {
      return this.response({
	res,
	statusCode: 201,
	message: "Created Successfully",
	payload: {
	  result: true
	}
      });
    }

  } catch (err) {
    return this.response({
      res,
      success: false,
      statusCode: 500,
      message: err.message
    });
  }
}

module.exports = controller;
