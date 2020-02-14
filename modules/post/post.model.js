'use strict'

module.exports = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
        id_community: DataTypes.INTEGER,
        id_user: DataTypes.INTEGER,        
        title: DataTypes.STRING,
        sub_title: DataTypes.INTEGER,
        content: DataTypes.TEXT,
        active: DataTypes.BOOLEAN,
        value: DataTypes.INTEGER,
        fixed: DataTypes.INTEGER
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



    }

    return post;
}