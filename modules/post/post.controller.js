'use strict'

const _ = require('lodash');
const Base = require('../../helpers/base.controller');
const controller = new Base('post');
const jwt = require('jsonwebtoken');
const { QueryTypes } = require('sequelize');
const { verify_and_upload_image_post, verify_and_upload_image_put, delete_image } = require('../../helpers/utilities')


controller.getFunc = async function (req, res) {
  const { id } = req.params;
  const { limit, offset, order, attributes } = req.body;
  const { sequelize } = this.db

  try {

    const post1= `SELECT posts.id, communities.name, 
      CONCAT(users.name,' ',users.last_name) AS fullname, 
      title, posts.content, posts.image, posts.video, posts.file, 
      COUNT(comments.content) AS count_messages,
      posts.active, posts.active, 
      COUNT(CASE WHEN comments.fixed = true THEN 1 END) AS count_likes, posts.active, posts.active, 
      JSON_AGG(tracks.name) as tracks,
      posts."createdAt", posts."updatedAt"
    FROM posts 
    LEFT JOIN users ON posts.id_user = users.id 
    LEFT JOIN communities ON posts.id_community = communities.id
    LEFT JOIN comments ON posts.id = comments.id_post
    LEFT JOIN track_posts ON posts.id = track_posts.id_post
    LEFT JOIN tracks ON tracks.id = track_posts.id_track
    WHERE posts.id =:id
    GROUP BY posts.id, communities.name,fullname`;

    const post2= `SELECT posts.id, communities.name, 
      CONCAT(users.name,' ',users.last_name) AS fullname, 
      title, posts.content, posts.image, posts.video, posts.file, 
      COUNT(comments.content) AS count_messages,
      posts.active, posts.active, 
      COUNT(CASE WHEN comments.fixed = true THEN 1 END) AS count_likes, posts.active, posts.active, 
      JSON_AGG(tracks.name) as tracks,
      posts."createdAt", posts."updatedAt"
    FROM posts 
    LEFT JOIN users ON posts.id_user = users.id 
    LEFT JOIN communities ON posts.id_community = communities.id
    LEFT JOIN comments ON posts.id = comments.id_post
    LEFT JOIN track_posts ON posts.id = track_posts.id_post
    LEFT JOIN tracks ON tracks.id = track_posts.id_track
    GROUP BY posts.id, communities.name,fullname`;

    const query = id ? post1 : post2        
    const query_post = await sequelize.query(`${query}`, { replacements:{id: id}, type: sequelize.QueryTypes.SELECT });
    //const total_like = await sequelize.query("SELECT COUNT(id) as total_likes FROM LIKES WHERE id_post =:id", { replacements:{id:id}, type: QueryTypes.SELECT });




    const data = query_post.map(x => { 
      const total_like = y => sequelize.query("SELECT COUNT(id) as total_likes FROM LIKES WHERE id_post =:id", { replacements:{id:y.id}, type: QueryTypes.SELECT });
      let rx = {};

      rx= {
	id: x.id,
	name: x.name,
	fullname: x.fullname,
	date: x.createdAt,
	title: x.title,
	content: x.content,
	image: x.image && "/uploads/"+x.image,
	video: x.video,
	files: x.file,
	coun_message: x.count_messages,
	count_fixed: total_like 
	//count_fixed: 'parseInt(total_like[0].total_likes)' 
      };
      return rx;
    });

    return this.response({
      res,
      payload: {data}

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

controller.getPostByComment = async function (req, res) {

  const { id_post } = req.params;
  const { limit, offset, order, attributes } = req.body;
  const { sequelize } = this.db

  try { 

    const query= `SELECT
    DISTINCT ON (comments.id) comments.id,
      comments.id_user,
      comments.id_post,
      users.username as alias,
      CONCAT(users.name,' ',users.last_name) AS author,
      users.profile_photo as img_user,
      comments."createdAt",
      comments.reference as reference_coment,
      COUNT( CASE WHEN comments.reference isnull THEN 1 END ) as count_reference_comment,
      likes.reference_message as reference_likes,
      COUNT(likes.reference_message) as count_refence_like,
      comments.image,
      comments.video,
      comments.file,
      comments.content,
      comments.active
    FROM 
    comments
    LEFT JOIN users ON comments.id_user = users.id
    LEFT JOIN likes ON comments.id_user = likes.id_user
    WHERE comments.id_post =:id
    GROUP BY content,author,alias,img_user,comments.id_user,comments.id_post,comments.active,comments.id,likes.reference_message
    ORDER BY comments.id`;
    const query_post = await sequelize.query(`${query}`, { replacements:{id: id_post}, type: sequelize.QueryTypes.SELECT });

    const total_like = await sequelize.query("SELECT COUNT(id) as total_likes FROM LIKES WHERE id_post =:id", { replacements:{id:id_post}, type: QueryTypes.SELECT });

    const data = query_post.map(x => {
      console.log(x)
      let rx = {}
      rx = {
	id: x.id,
	user: {
	  id_user: x.id_user,
	  alias: x.alias,
	  author: x.author,
	  img_user: x.img_user
	},
	date: x.createdAt,
	like: parseInt(total_like[0].total_likes),
	count_likes: x.count_refence_like,
	count_message: x.count_reference_comment,
	reference: x.reference_coment,
	comment: x.content,
	image: [x.image],
	video: [x.video],
	file: [x.file]
      }
      return rx;
    })

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
  const { user, user_type, track_post } = this.db;
  const email = decoded.email;

  let search_id_user = await user.findOne({
    where: { email }
  });

  const id_user = search_id_user['id'];
  let search_id_community = await user_type.findOne({
    where: { id_user }
  });


  const { title, content, active, value, fixed, track } = req.body;

  const img = req.files ? req.files.image: null;
  const vid = req.files ? req.files.video: null;
  const fil = req.files ? req.files.file: null;

  try {
    const image = verify_and_upload_image_post(img,"post_image");
    const video = verify_and_upload_image_post(vid,"post_video");
    const file = verify_and_upload_image_post(fil,"post_file");


    let newdate = await this.insert({
      id_community: search_id_community['id_community'],
      id_user: search_id_user['id'],
      title,
      content,
      image,
      video,
      file,
      active,
      value,
      fixed
    });
    const trk  = JSON.parse( track );
    let tracks = [];
    trk.forEach(element => {
      tracks.push({"id_track": element,"id_post": newdate['id']});
    });

    await track_post.bulkCreate(tracks, { returning: true });

    if (newdate) {
      return this.response({
	res,
	statusCode: 201,
	payload: newdate
      });
    };
  } catch (err) {
    return this.response({
      res,
      success: false,
      statusCode: 500,
      message: err.message,
    });
  }
}



controller.putFunc = async function (req, res) {
  const { id } = req.params;
  const { id_community, id_user, title, sub_title, content, active, value, fixed, return_data, remove_image, remove_video, remove_file } = req.body;

  let find_image = await this.db.post.findOne({
    where: { id }
  });

  const fnd_image = find_image ? find_image.image : null
  const fnd_video = find_image ? find_image.video : null
  const fnd_file = find_image ? find_image.file : null

  const img = req.files ? req.files.image: null;
  const vid = req.files ? req.files.video: null;
  const fil = req.files ? req.files.file: null;

  const rm_image = remove_image ? remove_image : '0';
  const rm_video = remove_video ? remove_video : '0';
  const rm_file = remove_file ? remove_file : '0';

  const image = verify_and_upload_image_put(img,"post_image", fnd_image, rm_image);
  const video = verify_and_upload_image_put(vid,"post_video", fnd_video, rm_video);
  const file = verify_and_upload_image_put(fil,"post_file", fnd_file, rm_file);

  await this.update(
    {
      id,
      data: {
	id_community,
	id_user,        
	title,
	sub_title,
	content,
	image,
	video,
	file, 
	active,
	value,
	fixed
      },
      return_data
    })
    .then(( result )=>{
      this.response({
	res,
	statusCode: 200,
	payload: return_data ? result : []
      })
    }).catch((err)=>{
      this.response({
	res,
	success: false,
	statusCode: 500,
	message: err.message
      })
    });
}

controller.deleteFunc = async function (req, res) {

  const { id } = req.params;


  let find_image = await this.db.post.findOne({
    where: { id }
  });
  if(find_image.image) delete_image( find_image.image.split("/")[2] );


  try {
    await this.db.comment.destroy({
      where: {
	id_post: id
      }
    })

    await this.db.like.destroy({
      where: {
	id_post: id
      }
    })





    let deleterows = await this.delete({ id });

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
