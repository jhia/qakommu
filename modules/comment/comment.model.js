'use strict'

module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define('comment', {
        id_user: DataTypes.INTEGER,
        id_post: DataTypes.INTEGER,        
        active: DataTypes.BOOLEAN,
        content: DataTypes.TEXT,
        multimedia: DataTypes.TEXT,        
        value: DataTypes.INTEGER,
        fixed: DataTypes.BOOLEAN,
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