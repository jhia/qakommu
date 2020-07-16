'use strict'

module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        id_community: DataTypes.INTEGER,
        id_user: DataTypes.INTEGER,        
        title: DataTypes.STRING,
        content: DataTypes.TEXT,
        image: DataTypes.TEXT,        
        video: DataTypes.TEXT,        
        file: DataTypes.TEXT,        
        active: DataTypes.BOOLEAN,
        value: DataTypes.INTEGER,
        fixed: DataTypes.BOOLEAN
    });

    post.associate = function(models){
        //To create model associations
        
        post.belongsTo(models.community,{
            foreignKey: 'id_community',
            as: 'communities'
        });

        post.belongsTo(models.user,{
            foreignKey: 'id_user',
            as: 'users'
        });

        post.hasMany(models.track_post, {
            foreignKey: 'id_post',
            as: 'track_posts'
          });
      

    }

    return post;
}