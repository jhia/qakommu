'use strict'

module.exports = (sequelize, DataTypes) => {
    const exhibitor = sequelize.define('exhibitor', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        id_partnership:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_type_booth:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        id_event:{
            allowNull: false,
            type: DataTypes.INTEGER
        },
        active: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

    exhibitor.associate = function(models){
        //To create model associations

        //exhibitor to type_booth
        exhibitor.belongsTo(models.type_booth, {
            foreignKey: 'id_type_booth',
            as: 'type_booth'
        });

        //exhibitor to type_booth
        exhibitor.belongsTo(models.partnership, {
            foreignKey: 'id_partnership',
            as: 'partnership'
        });

        //exhibitor to event
        exhibitor.belongsTo(models.event, {
            foreignKey: 'id_event',
            as: 'event'
        });
    }

    return exhibitor;
}