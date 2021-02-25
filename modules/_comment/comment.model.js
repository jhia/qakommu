'use strict'

module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    id_user: DataTypes.INTEGER,
    id_post: DataTypes.INTEGER,        
    active: DataTypes.BOOLEAN,
    content: DataTypes.TEXT,
    image: DataTypes.TEXT,        
    video: DataTypes.TEXT,        
    file: DataTypes.TEXT,        
    fixed: DataTypes.BOOLEAN,
    reference: DataTypes.INTEGER,
    nivel: { 
      type: DataTypes.INTEGER, 
      defaultValue: 1 
    }

  });

  comment.associate = function(models){
    //To create model associations

    comment.belongsTo(models.post,{
      foreignKey: 'id_post',
      as: 'posts'
    });

    comment.belongsTo(models.user,{
      foreignKey: 'id_user',
      as: 'users'
    });

  }

  return comment;
}
