const _ = require('lodash');
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

//Validate Email
const validateEmail = (email) => {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(email);
}

//calculate discount percentage
const calculateDiscountPercentage = (percentage, base_price) => {
  let decimalPercentage = percentage / 100;
  let rest = base_price * decimalPercentage;
  let result = base_price - rest;
  return result;
};

//calculate percentage increase
const calculatePercentageIncrease = (percentage, base_price) => {
  let decimalPercentage = percentage / 100;
  let rest = base_price * decimalPercentage;
  let result = base_price + rest;
  return result;
};

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

let get_image_name = (file, name_image, identify) => create_image_name(parse_image(file, name_image, identify))

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

const multi_verify_and_upload_image_post = (file, id_post, old_image = null) => {

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
	//send.push( { "id_post": id_post, "route": send_image_name(x, media_type, identify).profile_photo } );
	send.push( { "id_post": id_post, "route": get_image_name(x, media_type, identify).profile_photo } );
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
// host dinamic
const dynamic_host = (req) => (req.headers['x-forwarded-proto']) ? "https://" + req.headers.host : "http://" + req.headers.host;

// end host_str

function findRelation(relations, relation_model) {
	if (typeof relations[Symbol.iterator] === 'function') {
		for (const object of relations) {
			if (_.isObject(object) && object.model === relation_model) {
				return object;
			} else if (_.isObject(object) && object.include) {
				return findRelation(object.include, relation_model);
			}
		}
	}
	return false;
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


module.exports = {
    findRelation,
    cleanAttributes,
    makeid,
    verify_and_upload_image_post,
    multi_verify_and_upload_image_post,
    verify_and_upload_image_put,
    upload_images,
    delete_image,
    calculateDiscountPercentage,
    calculatePercentageIncrease,
    validateEmail,
    dynamic_host
};
