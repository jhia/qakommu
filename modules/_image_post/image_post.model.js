'use strict'

module.exports = (sequelize, DataTypes) => {
  const image_post = sequelize.define('image_post', {
    id_post: DataTypes.INTEGER,
    route: DataTypes.STRING
  });

  image_post.associate = function(models){
    //To create model associations
  }

  return image_post;
}
