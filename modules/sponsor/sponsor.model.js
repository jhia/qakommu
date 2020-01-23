'use strict'

module.exports = (sequelize, DataTypes) => {
    const sponsor = sequelize.define('sponsor', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_partnership:
        {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_type_sponsor:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_event:{
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    sponsor.associate = function(models){
        //To create model associations

        //sponsor to partnership
        sponsor.belongsTo(models.partnership, {
            foreignKey: 'id_partnership',
            as: 'partnership'
        });

        //sponsor to type_sponsor
        sponsor.belongsTo(models.type_sponsor, {
            foreignKey: 'id_type_sponsor',
            as: 'type_sponsor'
        });

        sponsor.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });
    }

    return sponsor;
}