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


// UPLOAD IMAGE POST

//let identify = makeid(6);

const parse_image = (x,y,identify) => ({
    image: x,
    archive: x.name,
    name: y,
    identify: identify
})

const create_image_name = x => 
({ 
    "profile_photo": x.name+"_"+x.identify+"."+x.archive.split(".")[x.archive.split(".").length-1],
    "image": x.image
})
const move_image = ({profile_photo,image}) =>  image.mv("./upload/"+profile_photo)

const upload_images = (x,y,identify) => {
    move_image(
        create_image_name(parse_image(x,y,identify)) 
    )
}

let send_image_name = (x,y,identify) => create_image_name(parse_image(x,y,identify)) 


const verify_and_upload_image_post = (x,y) => {
    let send = null
    let identify = makeid(6);
    if(x) {
        upload_images(x,y,identify);
        send = send_image_name(x,y,identify).profile_photo;
    }
    return send
}

const verify_and_upload_image_put = (x,y,z,remove_image) => {
	let send = null;
    let identify = makeid(6);

    if (remove_image) {
        console.log('-------------------')
        console.log('elimino mensaje')
        console.log('-------------------')            
    }


	if (z) {
		fs.unlinkSync("./upload/"+z);
	}	
	if(x) {
		upload_images(x,y,identify);
		send = send_image_name(x,y,identify).profile_photo;
	}
	return send
}





/* 
let identify = makeid(6);

const parse_image = (x,y) => ({
    image: x,
    archive: x.name,
    name: y
})

const create_image_name = x => 
({ 
    "profile_photo": x.name+"_"+identify+"."+x.archive.split(".")[x.archive.split(".").length-1],
    "image": x.image
})
const move_image = ({profile_photo,image}) =>  image.mv("./upload/"+profile_photo)

const upload_images = (x,y) => {
    move_image(
        create_image_name(parse_image(x,y)) 
    )
}

let send_image_name = (x,y) => create_image_name(parse_image(x,y)) 


const verify_and_upload_image_post = (x,y) => {
    let send = null
    if(x) {
        upload_images(x,y);
        send = send_image_name(x,y).profile_photo;
    }
    return send
}

const verify_and_upload_image_put = (x,y,z) => {
	let send = null;

	if (z) {
		fs.unlinkSync("./upload/"+z);
	}	
	if(x) {
		upload_images(x,y);
		send = send_image_name(x,y).profile_photo;
	}
	return send
}
 */
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
    verify_and_upload_image_put
};