'use strict'

module.exports = (sequelize, DataTypes) => {
    const UserCommunity = sequelize.define('userCommunity', {
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
        membershipId: { //only for private communities
            field: 'id_membership',
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        owner: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        approved: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        approvedBy: { //only for private communities
            field: 'id_approved_by',
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
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

    UserCommunity.prototype.canCreateEvents = async function() {
		return this.owner;
	}

    return UserCommunity;
}