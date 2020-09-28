const _ = require('lodash');
const db = require('../models');
const fs = require('fs');

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
	result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// UPLOAD IMAGE

const parse_image = (file,name_image,identify) => ({
    image: file,
    archive: file.name,
    name: name_image,
    identify: identify
})

const create_image_name = x => 
    ({ 
	"profile_photo": x.name+"_"+x.identify+"."+x.archive.split(".")[x.archive.split(".").length-1],
	"image": x.image
    })
const move_image = ({profile_photo,image}) =>  image.mv("./upload/"+profile_photo)

const upload_images = (file,name_image,identify) => {
    move_image(
	create_image_name(parse_image(file,name_image,identify)) 
    )
}

let get_image_name = (file,name_image,identify) => create_image_name(parse_image(file,name_image,identify)) 

const verify_and_upload_image_post = (file,name_image) => {
    let image_name = null;
    let identify = makeid(6);
    if(file) {
	let route = null;
	image_name = get_image_name(file,name_image,identify).profile_photo;
	route = "./upload/"+image_name;
	return image_name;
    }
}

const multi_verify_and_upload_image_post = ( file, id_post , old_image = null) => {

    let send = []
    if(!file) {
	return send;
    }

    if( old_image ) old_image.map( delete_image)

    file.map(x => {
	const media_type = x.name.search("\.(jpg|jpeg|png|bmp)" ) != -1 ?
	    "post_image":x.name.search("\.(mp4|avi|mpg|mpeg|wmv|m4v)") != -1  ?
	    "post_video":x.name.search("\.(mp3|ogg)") != -1  ?
	    "post_audio":"post_file";
	let identify = makeid(6);
	upload_images(x, media_type, identify);
	send.push( { "id_post": id_post, "route": send_image_name(x, media_type, identify).profile_photo } );
    })
    return send
}

const verify_and_upload_image_put = (file,name_image,old_image,archive=false) => {
    if(file){
	let image_name = null;
	let identify = makeid(6);
	image_name = get_image_name(file,name_image,identify).profile_photo;
	return image_name;
    }
}

const delete_image = (x) => {     
    fs.unlinkSync("./upload/"+x);
}

// ----------------------------------------------------------------------------------------

function findRelation(relations, relation_model) {
    if (typeof relations[Symbol.iterator] === 'function') {
	for (const object of relations) {
	    if (_.isObject(object) && object.model === relation_model) {
		return object;
	    } else if (_.isObject(object) && object.include){
		return findRelation(object.include, relation_model);
	    }
	}
    }
    return false;
}

async function setGlobalSQLMode() {
    return await db.sequelize.query("SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", {
	plain: false,
	raw: true,
    });
}

function cleanAttributes(relations) {
    return relations.filter((object) => {
	object.attributes = [];
	if (object.include) {
	    object.include = cleanAttributes(object.include);
	}
	return object;
    });
}

function response(obj,resp = null){

    const httpStatusCode = {
	"200": "Everything is OK",
	"201": "Created Successfully",
	"202": "Accepted",
	"204": "No Content",
	"301": "Moved Permanently",
	"400": "Bad Request",
	"401": "Unauthorized",
	"404": "Not Found",
	"500": "Internal Server Error",
    };

    const {
	res,
	statusCode,
	success,
	message,
	payload
    } = obj;

    if(res){
	res.
	    status(statusCode ? statusCode : typeof obj == 'string' ? obj : 200).
	    json({
		success: success != 'undefined' ? success : true,
		message: message ? 
		message : typeof obj == 'string' ?
		httpStatusCode[obj] : "Successfull request",
		payload: payload || []
	    })
	return;
    }

    resp.
	status(statusCode ? statusCode : typeof obj == 'string' ? obj : 200).
	json({
	    success: success != 'undefined' ? success : true,
	    message: message ? 
	    message : typeof obj == 'string' ?
	    httpStatusCode[obj] : "Successfull request",
	    payload: payload || []
	})


}

module.exports = {
    findRelation,
    cleanAttributes,
    setGlobalSQLMode,
    response,
    makeid,
    verify_and_upload_image_post,
    multi_verify_and_upload_image_post,
    verify_and_upload_image_put,
    upload_images,
    delete_image
};
