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

let send_image_name = (file,name_image,identify) => create_image_name(parse_image(file,name_image,identify)) 


const verify_and_upload_image_post = (file,name_image) => {
  let send = null
  let identify = makeid(6);
  if(file) {
    upload_images(file,name_image,identify);
    send = send_image_name(file,name_image,identify).profile_photo;
  }
  return send
}

const multi_verify_and_upload_image_post = ( file, name_image, id_post ) => {
  console.log(file)

  let send = []
  if(!file) return send;
  if(!Array.isArray(file)) file = [file]
    file.map(x => {
      let identify = makeid(6);
      upload_images(x, name_image, identify);
      send.push( { "id_post": id_post, "route": send_image_name(x, name_image, identify).profile_photo } );
    })
  return send
}






const verify_and_upload_image_put = (file,name_image,old_image) => {
  console.log(file,name_image,old_image)
  let send = null;
  let identify = makeid(6);

  if(old_image) delete_image(old_image)

  upload_images(file,name_image,identify);
  send = send_image_name(file,name_image,identify).profile_photo;
  return send
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
  delete_image
};
