'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const User = require('../user/user.model')(sequelize, DataTypes);
    class UserCommunity extends Model {}
    UserCommunity.init({
        userId: {
            field: 'id_user',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        communityId: {
            field: 'id_community',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        approvedBy: { //only for private communities
            field: 'id_approved_by',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'UserCommunity',
        tableName: 'user_communities'
    })

    UserCommunity.associate = function(models){
        //To create model associations
        UserCommunity.belongsTo(models.User, {
            foreignKey: 'id_user',
            as: 'user'
        });

        UserCommunity.belongsTo(models.Community, {
            foreignKey: 'id_community',
            as: 'community'
        });
    }

    return UserCommunity;
}