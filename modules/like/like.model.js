'use strict'

module.exports = (sequelize, DataTypes) => {
  const like = sequelize.define('like', {
    id_post: DataTypes.INTEGER,        
    id_user: DataTypes.INTEGER,        
    reference_message: DataTypes.INTEGER,        
  });

  like.associate = function(models){
    like.belongsTo(models.post,{
      foreignKey: 'id_post',
      as: 'posts'
    });
  }

  return like;
}
