'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('register');
const { makeid , verify_and_upload_image_post, upload_images, dynamic_host } = require('../../helpers/utilities')

controller.postFunc = async function (req, res) {

    const {user_type,user,community,channel} = this.db
    const { name, last_name, username, type, organization, country, city, zip_code, address, country_code, phone, birthdate, email, password, gender, id_repository, id_role, id_community, nameCommunity, return_data} = req.body;
    let {codeCommunity} = req.body;
    const { comunity_code,invitation_code } = req.params;
    const jwt = require('jsonwebtoken');
    let profile_photo = null;

    try {

	const avatar = req.files ? req.files.avatar: null;
	profile_photo = verify_and_upload_image_post(avatar,"profile_photo");
	const archive = profile_photo ? profile_photo.split("_") : null;

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

	if (!data) {
	    throw new Error("the code does not belong to any community!");
	}


	const host = dynamic_host(req);




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


	    let result = await user.create(
		{
		    name,
		    last_name,
		    username,
		    type,
		    zip_code,
		    profile_photo,
		    host,
		    organization,
		    country,
		    city,
		    address,
		    country_code,    
		    phone,
		    birthdate,
		    email,
		    password,
		    gender,
		    id_repository,
		});


	await user_type.create(
	    {
		id_user: result.id,
		id_role: id_role,
		id_community: invitation_code ? decoded.data.community_id : data['id'],
		invitation_code: invitation_code ? decoded.data.invitation_code : null
	    });

	if(profile_photo) upload_images( avatar, archive[0]+"_"+archive[1], archive[2].split(".")[0]);

	return this.response({
	    res,
	    statusCode: 201,
	    message: "Created Successfully",
	    payload: {
		result: return_data ? { id_community: data.id } : true
	    }
	});

    } catch (err) {

	const msg = []; 

	if (err.errors) {
	    err.errors.forEach((error) => {
		console.log("---",error.path, error.validatorKey,"---")
		if (error.path === 'name' && error.validatorKey === 'is_null') msg.push( "the name field is empty" );
		if (error.path === 'last_name' && error.validatorKey === 'is_null') msg.push( "the last_name field is empty" );
		if (error.path === 'username' && error.validatorKey === 'is_null') msg.push( "the username field is empty" );
		if (error.path === 'address' && error.validatorKey === 'is_null') msg.push( "the address field is empty" );
		if (error.path === 'gender' && error.validatorKey === 'is_null') msg.push( "the gender field is empty" );
		if (error.path === 'email' && error.validatorKey === 'is_null') msg.push( "the email field is empty" );
		if (error.path === 'email' && error.validatorKey === 'isEmail') msg.push( "email has a format error" );
	    })
	}

	return this.response({
	    res,
	    success: false,
	    statusCode: 500,
	    message: msg 
	});
    }
}

module.exports = controller;
