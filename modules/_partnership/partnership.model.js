'use strict'


module.exports = (sequelize, DataTypes) => {
    const partnership = sequelize.define('partnership', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        registry_number: {
            type: DataTypes.TEXT
        },
        logo: {
            type: DataTypes.STRING
        },
        host: {
            type: DataTypes.TEXT,
        },
        web: {
            type: DataTypes.TEXT
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN
        },
        id_community: {
            allowNull: false,
            type: DataTypes.INTEGER
        }

    });

    partnership.associate = function (models) {
        //To create model associations

        //partnership to community
        partnership.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });

        //partnership to partnership_position
        partnership.hasMany(models.partnership_position, {
            foreignKey: 'id_partnership',
            as: 'partnership_position'
        });

        //partnership to sponsor
        partnership.hasMany(models.sponsor, {
            foreignKey: 'id_partnership',
            as: 'partnership_sponsor'
        });

        //partnership to exhibitor
        partnership.hasMany(models.exhibitor, {
            foreignKey: 'id_partnership',
            as: 'partnership_exhibitor'
        });


    };

    return partnership;
}