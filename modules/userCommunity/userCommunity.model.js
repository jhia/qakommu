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
            field: 'id_membership',
            type: DataTypes.INTEGER,
            defaultValue: 1
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
        modelName: 'userCommunity',
        tableName: 'user_communities'
    })

    UserCommunity.associate = function(models){
        UserCommunity.belongsTo(models.membership, {
            foreignKey: 'id_membership',
            as: 'membership'
        })
        //To create model associations
        UserCommunity.belongsTo(models.user, {
            foreignKey: 'id_user',
            as: 'user'
        });

        UserCommunity.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });
    }

    return UserCommunity;
}