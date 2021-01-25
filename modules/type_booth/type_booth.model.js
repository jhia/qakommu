'use strict'

module.exports = (sequelize, DataTypes) => {
    const type_booth = sequelize.define('type_booth', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        name:{
            allowNull: false,
            type: DataTypes.TEXT
        },
        description: {
            type: DataTypes.TEXT
        },
        cost:{
            type: DataTypes.FLOAT
        },
        size_width:{
            type: DataTypes.INTEGER
        },
        size_height:{
            type: DataTypes.INTEGER
        },
        active:{
            type: DataTypes.BOOLEAN
        },
        currency_symbol:{
            allowNull: false,
            type: DataTypes.ENUM('$', '€', '£'),
            defaultValue: '$'
        },
        id_community: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    });

    type_booth.associate = function(models){
        //To create model associations
        
        // type_booth to exhibitor
        type_booth.hasMany(models.exhibitor, {
            foreignKey: 'id_type_booth',
            as: 'type_booth_exhibitor'
        });

        //type_booth to community
        type_booth.belongsTo(models.community, {
            foreignKey: 'id_community',
            as: 'community'
        });
    }

    return type_booth;
}